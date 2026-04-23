const express = require("express");
const cors = require("cors");
const resources = require("./data/resources");
const learningPaths = require("./data/learningPaths");

const app = express();
const PORT = process.env.PORT || 5000;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

app.use(cors());
app.use(express.json());

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const parseMultiValueParam = (value) =>
  normalize(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const withPathSuggestions = (resource) => {
  const pathSuggestions = learningPaths
    .filter((path) => path.steps.some((step) => step.resourceId === resource.id))
    .map((path) => ({
      id: path.id,
      title: path.title,
      level: path.level
    }));

  return {
    ...resource,
    pathSuggestions
  };
};

const applyFilters = (dataset, query) => {
  let filtered = [...dataset];
  const levels = parseMultiValueParam(query.level);
  const types = parseMultiValueParam(query.type);
  const categories = parseMultiValueParam(query.category);
  const tags = parseMultiValueParam(query.tag);
  const featured = normalize(query.featured);

  if (levels.length > 0) {
    filtered = filtered.filter((item) =>
      levels.includes(item.difficulty.toLowerCase())
    );
  }

  if (types.length > 0) {
    filtered = filtered.filter((item) => types.includes(item.type.toLowerCase()));
  }

  if (categories.length > 0) {
    filtered = filtered.filter((item) =>
      categories.includes(item.category.toLowerCase())
    );
  }

  if (tags.length > 0) {
    filtered = filtered.filter((item) =>
      item.tags.some((tag) => tags.includes(tag.toLowerCase()))
    );
  }

  if (featured === "trending") {
    filtered = filtered.filter((item) => item.featured.trending);
  }

  if (featured === "beginner") {
    filtered = filtered.filter((item) => item.featured.beginnerPath);
  }

  if (featured === "labs") {
    filtered = filtered.filter((item) => item.featured.handsOnLab);
  }

  return filtered;
};

const querySearch = (dataset, searchText) => {
  const normalizedQuery = normalize(searchText);

  if (!normalizedQuery) {
    return dataset;
  }

  return dataset.filter((item) => {
    const haystack = [
      item.title,
      item.description,
      item.source,
      item.category,
      item.difficulty,
      ...item.tags
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
};

const groupByType = (dataset) => ({
  docs: dataset.filter((item) => item.type === "docs"),
  videos: dataset.filter((item) => item.type === "videos"),
  labs: dataset.filter((item) => item.type === "labs")
});

const getDifficultyRank = (difficulty) => {
  const rank = {
    beginner: 1,
    intermediate: 2,
    advanced: 3
  };

  return rank[normalize(difficulty)] || 99;
};

const sortDataset = (dataset, sortKey = "relevance") => {
  const mode = normalize(sortKey) || "relevance";
  const items = [...dataset];

  const byTitle = (a, b) => a.title.localeCompare(b.title);

  switch (mode) {
    case "title_asc":
      return items.sort((a, b) => a.title.localeCompare(b.title));
    case "title_desc":
      return items.sort((a, b) => b.title.localeCompare(a.title));
    case "difficulty_asc":
      return items.sort(
        (a, b) => getDifficultyRank(a.difficulty) - getDifficultyRank(b.difficulty) || byTitle(a, b)
      );
    case "difficulty_desc":
      return items.sort(
        (a, b) => getDifficultyRank(b.difficulty) - getDifficultyRank(a.difficulty) || byTitle(a, b)
      );
    case "source_asc":
      return items.sort((a, b) => a.source.localeCompare(b.source) || byTitle(a, b));
    case "source_desc":
      return items.sort((a, b) => b.source.localeCompare(a.source) || byTitle(a, b));
    case "relevance":
    default:
      return items;
  }
};

const paginateDataset = (dataset, query, defaultLimit = 12) => {
  const total = dataset.length;
  const hasPagination = query.page !== undefined || query.limit !== undefined;

  if (!hasPagination) {
    return {
      items: [...dataset],
      page: 1,
      limit: total > 0 ? total : defaultLimit,
      total,
      totalPages: 1
    };
  }

  const page = parsePositiveInt(query.page, 1);
  const limit = Math.min(parsePositiveInt(query.limit, defaultLimit), 50);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    items: dataset.slice(startIndex, endIndex),
    page: safePage,
    limit,
    total,
    totalPages
  };
};

const pickRecommended = (dataset, limit = 6) => {
  const featuredFirst = [...dataset].sort((a, b) => {
    const aScore = Number(a.featured.trending) + Number(a.featured.handsOnLab);
    const bScore = Number(b.featured.trending) + Number(b.featured.handsOnLab);
    return bScore - aScore;
  });

  return featuredFirst.slice(0, limit);
};

const extractOpenAIText = (payload) => {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const output = Array.isArray(payload?.output) ? payload.output : [];
  const chunks = [];

  output.forEach((block) => {
    const content = Array.isArray(block?.content) ? block.content : [];
    content.forEach((item) => {
      if (typeof item?.text === "string") {
        chunks.push(item.text);
      }

      if (typeof item?.value === "string") {
        chunks.push(item.value);
      }
    });
  });

  return chunks.join("\n").trim();
};

const parseRecommendedIds = (text) => {
  if (!text) {
    return [];
  }

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed?.recommendedIds)) {
      return parsed.recommendedIds.map((id) => id.toString());
    }
    if (Array.isArray(parsed?.ids)) {
      return parsed.ids.map((id) => id.toString());
    }
    if (Array.isArray(parsed)) {
      return parsed.map((id) => id.toString());
    }
  } catch {
    // Continue with loose parsing below.
  }

  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (!arrayMatch) {
    return [];
  }

  try {
    const parsedArray = JSON.parse(arrayMatch[0]);
    return Array.isArray(parsedArray) ? parsedArray.map((id) => id.toString()) : [];
  } catch {
    return [];
  }
};

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    service: "Oracle Learning Hub API"
  });
});

app.get("/resources", (req, res) => {
  const filtered = applyFilters(resources, req.query);
  const sorted = sortDataset(filtered, req.query.sort);
  const paginated = paginateDataset(sorted, req.query, 12);
  const hydrated = paginated.items.map(withPathSuggestions);

  res.json({
    total: paginated.total,
    page: paginated.page,
    limit: paginated.limit,
    totalPages: paginated.totalPages,
    sort: normalize(req.query.sort) || "relevance",
    resources: hydrated
  });
});

app.get("/resources/:id", (req, res) => {
  const resource = resources.find((item) => item.id === req.params.id);

  if (!resource) {
    return res.status(404).json({
      message: `Resource with id '${req.params.id}' not found.`
    });
  }

  const relatedResources = resources
    .filter(
      (item) =>
        item.id !== resource.id &&
        (item.category === resource.category ||
          item.tags.some((tag) => resource.tags.includes(tag)))
    )
    .slice(0, 4);

  return res.json({
    ...withPathSuggestions(resource),
    relatedResources
  });
});

app.get("/search", (req, res) => {
  const searchText = req.query.q || "";
  const searched = querySearch(resources, searchText);
  const filtered = applyFilters(searched, req.query);
  const sorted = sortDataset(filtered, req.query.sort);
  const paginated = paginateDataset(sorted, req.query, 9);
  const hydrated = paginated.items.map(withPathSuggestions);

  res.json({
    query: searchText,
    total: paginated.total,
    page: paginated.page,
    limit: paginated.limit,
    totalPages: paginated.totalPages,
    sort: normalize(req.query.sort) || "relevance",
    grouped: groupByType(hydrated),
    results: hydrated
  });
});

app.get("/learning-paths", (_, res) => {
  const enrichedPaths = learningPaths.map((path) => ({
    ...path,
    steps: path.steps.map((step) => ({
      ...step,
      resource: resources.find((resource) => resource.id === step.resourceId) || null
    }))
  }));

  res.json({
    total: enrichedPaths.length,
    learningPaths: enrichedPaths
  });
});

app.get("/recommendations", (req, res) => {
  const category = normalize(req.query.category);
  const scopedDataset = category
    ? resources.filter((resource) => resource.category.toLowerCase() === category)
    : resources;

  const recommendations = pickRecommended(scopedDataset).map(withPathSuggestions);

  res.json({
    total: recommendations.length,
    recommendations
  });
});

app.post("/ai/recommend", (req, res) => {
  const userPrompt = (req.body?.prompt || "").toString().trim();
  const level = req.body?.level || "";
  const type = req.body?.type || "";
  const category = req.body?.category || "";

  const filteredPool = applyFilters(resources, {
    level,
    type,
    category
  });
  const candidatePool = filteredPool.length > 0 ? filteredPool : resources;
  const fallbackRecommendations = pickRecommended(candidatePool, 4).map(withPathSuggestions);

  if (!process.env.OPENAI_API_KEY || typeof fetch !== "function") {
    return res.json({
      source: "fallback",
      message:
        "OpenAI integration not configured. Set OPENAI_API_KEY (and optionally OPENAI_MODEL) to enable AI recommendations.",
      promptReceived: userPrompt,
      recommendations: fallbackRecommendations
    });
  }

  const catalog = candidatePool
    .map(
      (item) =>
        `${item.id} | ${item.title} | ${item.type} | ${item.difficulty} | ${item.category} | ${item.tags.join(
          ", "
        )} | ${item.description}`
    )
    .join("\n");

  const recommendationPrompt =
    userPrompt || "Recommend Oracle resources for someone getting started with OCI.";

  const requestBody = {
    model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
    temperature: 0.2,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are an Oracle learning advisor. Return strict JSON only in this shape: {\"recommendedIds\":[\"res-001\",\"res-002\"],\"reason\":\"short reason\"}. Choose up to 4 IDs from the provided catalog."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Learner request: ${recommendationPrompt}
Preferred level: ${level || "any"}
Preferred type: ${type || "any"}
Preferred category: ${category || "any"}
Catalog:
${catalog}`
          }
        ]
      }
    ]
  };

  const run = async () => {
    try {
      const response = await fetch(`${OPENAI_BASE_URL}/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const details = await response.text();
        return res.status(502).json({
          source: "openai_error",
          message: "OpenAI request failed. Returning fallback recommendations.",
          details: details.slice(0, 400),
          promptReceived: recommendationPrompt,
          recommendations: fallbackRecommendations
        });
      }

      const completion = await response.json();
      const aiText = extractOpenAIText(completion);
      const recommendedIds = parseRecommendedIds(aiText);

      const aiMatches = recommendedIds
        .map((id) => candidatePool.find((item) => item.id === id))
        .filter(Boolean)
        .slice(0, 4);

      const recommendations =
        aiMatches.length > 0
          ? aiMatches.map(withPathSuggestions)
          : fallbackRecommendations;

      return res.json({
        source: aiMatches.length > 0 ? "openai" : "fallback",
        promptReceived: recommendationPrompt,
        reasoning: aiText || "OpenAI response parsed successfully.",
        recommendations
      });
    } catch (error) {
      return res.status(200).json({
        source: "fallback",
        message:
          "OpenAI request was unavailable at runtime. Returning fallback recommendations.",
        promptReceived: recommendationPrompt,
        error: error.message,
        recommendations: fallbackRecommendations
      });
    }
  };

  return run();
});

app.listen(PORT, () => {
  console.log(`Oracle Learning Hub API listening on http://localhost:${PORT}`);
});
