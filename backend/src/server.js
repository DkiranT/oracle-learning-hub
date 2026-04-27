const express = require("express");
const cors = require("cors");
const cheerio = require("cheerio");
const resources = require("./data/resources");
const learningPaths = require("./data/learningPaths");
const {
  manualTopicCollections,
  fusionApiPlaybooks
} = require("./data/knowledgeHub");
const { createResourceSummaryService } = require("./summarizer");

const app = express();
const PORT = process.env.PORT || 5000;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const WEB_SEARCH_ENGINE_URL =
  process.env.WEB_SEARCH_ENGINE_URL || "https://duckduckgo.com/html/";
const resourceSummaryService = createResourceSummaryService({
  resources,
  manualTopicCollections,
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiBaseUrl: OPENAI_BASE_URL,
  openaiModel: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL
});

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

const WEB_SEARCH_PER_SOURCE = Math.min(
  parsePositiveInt(process.env.WEB_SEARCH_PER_SOURCE, 5),
  10
);

const WEB_SOURCE_PROFILES = [
  {
    site: "docs.oracle.com",
    searchSite: "docs.oracle.com",
    source: "Oracle Docs",
    type: "docs",
    category: "Oracle Documentation",
    queryHint: "guide tutorial reference"
  },
  {
    site: "blogs.oracle.com",
    searchSite: "blogs.oracle.com",
    source: "Oracle Blogs",
    type: "blogs",
    category: "Oracle Blogs",
    queryHint: "blog post"
  },
  {
    site: "youtube.com",
    searchSite: "youtube.com/watch",
    source: "YouTube",
    type: "videos",
    category: "Oracle Video",
    queryHint: "official tutorial"
  },
  {
    site: "github.com/oracle",
    searchSite: "github.com/oracle",
    source: "GitHub",
    type: "labs",
    category: "Oracle Code Labs",
    queryHint: "example workshop lab"
  }
];

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const YOUTUBE_AVAILABILITY_TTL_MS = 1000 * 60 * 60 * 6;
const youtubeAvailabilityCache = new Map();
const SEARCH_STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "to",
  "for",
  "of",
  "in",
  "on",
  "with",
  "how",
  "what",
  "is",
  "are",
  "from",
  "by"
]);

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
    filtered = filtered.filter((item) => {
      const itemDifficulty = normalize(item.difficulty);
      if (!itemDifficulty) {
        return true;
      }

      return levels.includes(itemDifficulty);
    });
  }

  if (types.length > 0) {
    filtered = filtered.filter((item) => types.includes(normalize(item.type)));
  }

  if (categories.length > 0) {
    filtered = filtered.filter((item) =>
      categories.includes(normalize(item.category))
    );
  }

  if (tags.length > 0) {
    filtered = filtered.filter((item) => {
      const itemTags = Array.isArray(item.tags) ? item.tags : [];
      return itemTags.some((tag) => tags.includes(normalize(tag)));
    });
  }

  if (featured === "trending") {
    filtered = filtered.filter((item) => item.featured?.trending);
  }

  if (featured === "beginner") {
    filtered = filtered.filter((item) => item.featured?.beginnerPath);
  }

  if (featured === "labs") {
    filtered = filtered.filter((item) => item.featured?.handsOnLab);
  }

  return filtered;
};

const querySearch = (dataset, searchText) => {
  const normalizedQuery = normalize(searchText);

  if (!normalizedQuery) {
    return dataset;
  }

  return dataset.filter((item) => {
    const itemTags = Array.isArray(item.tags) ? item.tags : [];
    const haystack = [
      item.title,
      item.description,
      item.source,
      item.category,
      item.difficulty,
      ...itemTags
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
};

const groupByType = (dataset) => {
  const grouped = {
    docs: [],
    videos: [],
    labs: [],
    blogs: []
  };

  dataset.forEach((item) => {
    const key = normalize(item.type) || "docs";
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  return grouped;
};

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
  const byRelevance = (a, b) => {
    const aScore = Number.isFinite(a.relevanceScore) ? a.relevanceScore : -1;
    const bScore = Number.isFinite(b.relevanceScore) ? b.relevanceScore : -1;
    return bScore - aScore || byTitle(a, b);
  };

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
      if (items.some((item) => Number.isFinite(item.relevanceScore))) {
        return items.sort(byRelevance);
      }
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

const createStableWebId = (link, index = 0) => {
  const base = Buffer.from((link || `item-${index}`).toString()).toString("base64");
  return `web-${base.replace(/[^a-zA-Z0-9]/g, "").slice(0, 18)}-${index}`;
};

const decodeSearchResultUrl = (href) => {
  if (!href) {
    return "";
  }

  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  try {
    const parsed = new URL(href, "https://duckduckgo.com");
    const redirectedUrl = parsed.searchParams.get("uddg");
    if (redirectedUrl) {
      return decodeURIComponent(redirectedUrl);
    }

    return parsed.toString();
  } catch {
    return "";
  }
};

const splitSearchTokens = (searchText) =>
  normalize(searchText)
    .split(/[^a-z0-9+-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !SEARCH_STOP_WORDS.has(token))
    .slice(0, 10);

const safeParseUrl = (link) => {
  if (!link) {
    return null;
  }

  try {
    return new URL(link);
  } catch {
    return null;
  }
};

const normalizeYoutubeLink = (urlValue) => {
  const fallback = {
    link: urlValue || "",
    youtubeId: ""
  };

  if (!urlValue) {
    return fallback;
  }

  const parsed = safeParseUrl(urlValue);
  if (!parsed) {
    return fallback;
  }

  const hostname = normalize(parsed.hostname).replace(/^www\./, "");
  let youtubeId = "";

  if (hostname === "youtu.be") {
    youtubeId = parsed.pathname.split("/").filter(Boolean)[0] || "";
  } else if (hostname.endsWith("youtube.com")) {
    if (parsed.pathname === "/watch") {
      youtubeId = parsed.searchParams.get("v") || "";
    } else {
      const pathMatch = parsed.pathname.match(
        /^\/(?:shorts|embed|live)\/([a-zA-Z0-9_-]{11})/
      );
      youtubeId = pathMatch?.[1] || "";
    }
  }

  if (!YOUTUBE_ID_PATTERN.test(youtubeId)) {
    return fallback;
  }

  return {
    link: `https://www.youtube.com/watch?v=${youtubeId}`,
    youtubeId
  };
};

const isGenericDocsPath = (pathName = "") => {
  const path = normalize(pathName);
  if (!path || path === "/") {
    return true;
  }

  if (/^\/(en|en-us)\/?$/.test(path)) {
    return true;
  }

  if (/\/(home|index)\.(htm|html)$/.test(path)) {
    return true;
  }

  const segments = path.split("/").filter(Boolean);
  return segments.length < 3;
};

const isBlogIndexPath = (pathName = "") => {
  const path = normalize(pathName);
  if (!path || path === "/") {
    return true;
  }

  return /\/(search|tag|tags|topic|topics|archive|archives|author|category|index(\.html?)?)\/?$/.test(
    path
  );
};

const isUsefulLabPath = (pathName = "") => {
  const path = normalize(pathName);
  const segments = path.split("/").filter(Boolean);
  return segments.length >= 3 && /(tree|blob|workshop|lab|tutorial|example|samples?)/.test(path);
};

const countTokenMatches = (text, tokens) => {
  if (!text || tokens.length === 0) {
    return 0;
  }

  const haystack = normalize(text);
  return tokens.reduce(
    (count, token) => count + (haystack.includes(token) ? 1 : 0),
    0
  );
};

const getTokenCoverage = (text, tokens) => {
  if (!tokens.length) {
    return 0;
  }

  const matches = countTokenMatches(text, tokens);
  return matches / tokens.length;
};

const shouldKeepResultForProfile = (result, profile, searchText = "") => {
  const parsed = safeParseUrl(result.link);
  if (!parsed) {
    return false;
  }

  const hostname = normalize(parsed.hostname).replace(/^www\./, "");
  const pathName = parsed.pathname || "/";
  const tokens = splitSearchTokens(searchText);
  const textBlock = `${result.title} ${result.description} ${result.link}`;
  const coverage = getTokenCoverage(textBlock, tokens);

  if (profile.type === "docs") {
    if (!(hostname.endsWith("docs.oracle.com") && !isGenericDocsPath(pathName))) {
      return false;
    }

    if (tokens.length >= 4 && coverage < 0.25) {
      return false;
    }

    return true;
  }

  if (profile.type === "blogs") {
    if (!(hostname.endsWith("blogs.oracle.com") && !isBlogIndexPath(pathName))) {
      return false;
    }

    if (tokens.length >= 4 && coverage < 0.2) {
      return false;
    }

    return true;
  }

  if (profile.type === "videos") {
    const hasValidYoutube =
      (hostname === "youtu.be" || hostname.endsWith("youtube.com")) &&
      YOUTUBE_ID_PATTERN.test(result.youtubeId);

    if (!hasValidYoutube) {
      return false;
    }

    if (tokens.length >= 3 && coverage < 0.35) {
      return false;
    }

    return true;
  }

  if (profile.type === "labs") {
    if (
      !(hostname.endsWith("github.com") && /\/oracle/i.test(pathName) && isUsefulLabPath(pathName))
    ) {
      return false;
    }

    if (tokens.length >= 4 && coverage < 0.15) {
      return false;
    }

    return true;
  }

  return true;
};

const calculateRelevanceScore = (result, searchText, profile) => {
  const tokens = splitSearchTokens(searchText);
  const normalizedSearchText = normalize(searchText);
  const parsed = safeParseUrl(result.link);
  const pathName = parsed?.pathname || "/";
  const textBlock = `${result.title} ${result.description} ${result.link}`;
  const titleText = normalize(result.title);
  const descriptionText = normalize(result.description);
  const textCoverage = getTokenCoverage(textBlock, tokens);
  const titleCoverage = getTokenCoverage(titleText, tokens);

  let score = 0;
  score += countTokenMatches(result.title, tokens) * 8;
  score += countTokenMatches(result.description, tokens) * 4;
  score += countTokenMatches(result.link, tokens) * 3;
  score += countTokenMatches(textBlock, ["oracle"]) * 3;
  score += Math.round(textCoverage * 16);
  score += Math.round(titleCoverage * 18);

  if (normalizedSearchText.length > 4) {
    if (titleText.includes(normalizedSearchText)) {
      score += 24;
    } else if (descriptionText.includes(normalizedSearchText)) {
      score += 12;
    }
  }

  if (profile.type === "docs") {
    score += 12;
    if (isGenericDocsPath(pathName)) {
      score -= 30;
    }
    if (/\/content\/|\/database\/|\/integration\/|\/iaas\//.test(normalize(pathName))) {
      score += 4;
    }
  }

  if (profile.type === "blogs") {
    score += 9;
    if (isBlogIndexPath(pathName)) {
      score -= 20;
    }
    if (/\/post\//.test(normalize(pathName)) || /\/\d{4}\//.test(pathName)) {
      score += 5;
    }
  }

  if (profile.type === "videos") {
    score += 8;
    if (YOUTUBE_ID_PATTERN.test(result.youtubeId)) {
      score += 6;
    } else {
      score -= 20;
    }

    if (tokens.length >= 2 && titleCoverage < 0.3) {
      score -= 18;
    }
  }

  if (profile.type === "labs") {
    score += 7;
    if (isUsefulLabPath(pathName)) {
      score += 5;
    }
  }

  return score;
};

const getCollectionHaystack = (collection) => {
  const keywordText = Array.isArray(collection.keywords)
    ? collection.keywords.join(" ")
    : "";
  const resourceText = Array.isArray(collection.resources)
    ? collection.resources
        .map((resource) =>
          [resource.title, resource.description, resource.category, ...(resource.tags || [])]
            .filter(Boolean)
            .join(" ")
        )
        .join(" ")
    : "";

  return normalize([collection.title, collection.summary, keywordText, resourceText].join(" "));
};

const scoreTopicCollectionMatch = (collection, searchText) => {
  const normalizedQuery = normalize(searchText);
  const tokens = splitSearchTokens(searchText);

  if (!normalizedQuery) {
    return 0;
  }

  const haystack = getCollectionHaystack(collection);
  if (!haystack) {
    return 0;
  }

  let score = 0;
  if (haystack.includes(normalizedQuery)) {
    score += 28;
  }

  const keywordHits = countTokenMatches(
    Array.isArray(collection.keywords) ? collection.keywords.join(" ") : "",
    tokens
  );
  const textCoverage = getTokenCoverage(haystack, tokens);

  score += keywordHits * 9;
  score += Math.round(textCoverage * 20);
  return score;
};

const collectManualTopicResults = (searchText) => {
  const normalizedQuery = normalize(searchText);
  const tokens = splitSearchTokens(searchText);

  if (!normalizedQuery) {
    return [];
  }

  const collected = [];

  manualTopicCollections.forEach((collection) => {
    const collectionScore = scoreTopicCollectionMatch(collection, searchText);
    if (collectionScore <= 0) {
      return;
    }

    const resources = Array.isArray(collection.resources) ? collection.resources : [];
    resources.forEach((resource, index) => {
      const resourceText = normalize(
        [
          resource.title,
          resource.description,
          resource.category,
          ...(Array.isArray(resource.tags) ? resource.tags : [])
        ].join(" ")
      );
      const resourceCoverage = getTokenCoverage(resourceText, tokens);
      const exactTitleMatch = normalize(resource.title).includes(normalizedQuery);

      if (tokens.length >= 3 && resourceCoverage < 0.18 && !exactTitleMatch) {
        return;
      }

      const resourceScore =
        110 +
        collectionScore +
        Math.round(resourceCoverage * 18) +
        (exactTitleMatch ? 20 : 0);

      collected.push({
        ...resource,
        id: resource.id || `manual-${collection.id}-${index + 1}`,
        isExternal: true,
        pathSuggestions: [],
        relevanceScore: resourceScore,
        sourceCollectionId: collection.id,
        sourceCollectionTitle: collection.title
      });
    });
  });

  return collected.sort(
    (a, b) =>
      (Number.isFinite(b.relevanceScore) ? b.relevanceScore : -1) -
        (Number.isFinite(a.relevanceScore) ? a.relevanceScore : -1) ||
      a.title.localeCompare(b.title)
  );
};

const filterKnowledgeTopics = (query = {}) => {
  const topicId = normalize(query.topic);
  const type = normalize(query.type);
  const phrase = normalize(query.q);
  const tokens = splitSearchTokens(query.q);

  const matchesTopic = (topic) => {
    if (!topicId) {
      return true;
    }

    return normalize(topic.id) === topicId;
  };

  const matchesPhrase = (topic) => {
    if (!phrase) {
      return true;
    }

    const haystack = getCollectionHaystack(topic);
    return haystack.includes(phrase) || getTokenCoverage(haystack, tokens) >= 0.2;
  };

  const filteredTopics = manualTopicCollections
    .filter((topic) => matchesTopic(topic) && matchesPhrase(topic))
    .map((topic) => {
      const scopedResources = (topic.resources || []).filter((resource) => {
        if (!type) {
          return true;
        }
        return normalize(resource.type) === type;
      });

      return {
        ...topic,
        resources: scopedResources
      };
    })
    .filter((topic) => topic.resources.length > 0 || !type);

  return filteredTopics;
};

const filterFusionApiPlaybooks = (query = {}) => {
  const suite = normalize(query.suite);
  const module = normalize(query.module);
  const operation = normalize(query.operation);
  const phrase = normalize(query.q);
  const tokens = splitSearchTokens(query.q);

  return fusionApiPlaybooks.filter((playbook) => {
    if (suite && normalize(playbook.suite) !== suite) {
      return false;
    }

    if (module && normalize(playbook.module) !== module) {
      return false;
    }

    if (operation && normalize(playbook.operation) !== operation) {
      return false;
    }

    if (!phrase) {
      return true;
    }

    const haystack = normalize(
      [
        playbook.suite,
        playbook.module,
        playbook.operation,
        playbook.description,
        ...(Array.isArray(playbook.tags) ? playbook.tags : [])
      ].join(" ")
    );

    return haystack.includes(phrase) || getTokenCoverage(haystack, tokens) >= 0.25;
  });
};

const buildYoutubeSearchUrl = (title) => {
  const seed = (title || "").toString().trim();
  const query = seed ? `${seed} Oracle` : "Oracle tutorial";
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
};

const isYoutubeVideoAvailable = async (youtubeId) => {
  if (!YOUTUBE_ID_PATTERN.test(youtubeId || "")) {
    return false;
  }

  const cached = youtubeAvailabilityCache.get(youtubeId);
  const now = Date.now();

  if (cached && now - cached.checkedAt < YOUTUBE_AVAILABILITY_TTL_MS) {
    return cached.available;
  }

  const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    watchUrl
  )}&format=json`;

  try {
    const response = await fetch(oembedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OracleLearningHubBot/1.0; +https://github.com)"
      }
    });

    const available = response.ok;
    youtubeAvailabilityCache.set(youtubeId, {
      available,
      checkedAt: now
    });
    return available;
  } catch {
    youtubeAvailabilityCache.set(youtubeId, {
      available: false,
      checkedAt: now
    });
    return false;
  }
};

const resolveYoutubeDestinationUrl = async ({ videoUrl, title }) => {
  const normalized = normalizeYoutubeLink(videoUrl);
  const fallbackSearchUrl = buildYoutubeSearchUrl(title);

  if (!YOUTUBE_ID_PATTERN.test(normalized.youtubeId)) {
    return fallbackSearchUrl;
  }

  const available = await isYoutubeVideoAvailable(normalized.youtubeId);
  return available ? normalized.link : fallbackSearchUrl;
};

const inferDifficultyFromText = (text) => {
  const content = normalize(text);

  if (!content) {
    return "Intermediate";
  }

  if (
    /\bbeginner\b|\bintro\b|\bintroduction\b|\bgetting started\b|\bquickstart\b/.test(
      content
    )
  ) {
    return "Beginner";
  }

  if (
    /\badvanced\b|\bdeep dive\b|\bexpert\b|\barchitecture\b|\bperformance\b/.test(
      content
    )
  ) {
    return "Advanced";
  }

  return "Intermediate";
};

const buildWebResult = ({
  title,
  link,
  snippet,
  searchText,
  profile,
  index
}) => {
  const cleanTitle = (title || "").replace(/\s+/g, " ").trim();
  const cleanSnippet = (snippet || "").replace(/\s+/g, " ").trim();
  const normalizedYoutube = normalizeYoutubeLink(link);
  const resolvedLink =
    profile.type === "videos" && normalizedYoutube.link ? normalizedYoutube.link : link;
  const youtubeId = normalizedYoutube.youtubeId;

  const keywordTags = (searchText || "")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2)
    .slice(0, 4);

  return {
    id: createStableWebId(resolvedLink, index),
    title: cleanTitle || "Oracle Learning Result",
    type: profile.type,
    source: profile.source,
    difficulty: inferDifficultyFromText(`${cleanTitle} ${cleanSnippet}`),
    description: cleanSnippet || `Live result from ${profile.source}.`,
    link: resolvedLink,
    youtubeId,
    category: profile.category,
    tags: [...new Set([...keywordTags, profile.source])],
    duration: "Web Result",
    featured: {
      trending: false,
      beginnerPath: false,
      handsOnLab: false
    },
    isExternal: true,
    pathSuggestions: [],
    relevanceScore: 0
  };
};

const fetchWebResultsForSource = async (searchText, profile) => {
  const trimmedSearch = (searchText || "").toString().trim();
  const quotedSearch = trimmedSearch ? `"${trimmedSearch}"` : "";
  const query = [
    `site:${profile.searchSite || profile.site}`,
    "oracle",
    quotedSearch,
    trimmedSearch,
    profile.queryHint
  ]
    .filter(Boolean)
    .join(" ");
  const requestUrl = `${WEB_SEARCH_ENGINE_URL}?q=${encodeURIComponent(query)}&kl=us-en`;
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 12000);

  try {
    const response = await fetch(requestUrl, {
      signal: abortController.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OracleLearningHubBot/1.0; +https://github.com)"
      }
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const collected = [];
    const seenLinks = new Set();

    $(".result__a, a.result-link, h2 a").each((index, element) => {
      if (collected.length >= WEB_SEARCH_PER_SOURCE) {
        return false;
      }

      const rawHref = $(element).attr("href");
      const resolvedLink = decodeSearchResultUrl(rawHref);
      const normalizedLink = normalize(resolvedLink);

      if (!normalizedLink || !normalizedLink.startsWith("http")) {
        return;
      }

      if (seenLinks.has(normalizedLink)) {
        return;
      }
      seenLinks.add(normalizedLink);

      const title = $(element).text();
      const container = $(element).closest(".result, .result__body, tr");
      const snippet =
        container.find(".result__snippet, .result-snippet").first().text() ||
        container.find("p").first().text();

      const built = buildWebResult({
        title,
        link: resolvedLink,
        snippet,
        searchText,
        profile,
        index
      });

      if (!shouldKeepResultForProfile(built, profile, searchText)) {
        return;
      }

      collected.push({
        ...built,
        relevanceScore: calculateRelevanceScore(built, searchText, profile)
      });
    });

    return collected
      .sort(
        (a, b) =>
          (Number.isFinite(b.relevanceScore) ? b.relevanceScore : -1) -
            (Number.isFinite(a.relevanceScore) ? a.relevanceScore : -1) ||
          a.title.localeCompare(b.title)
      )
      .slice(0, WEB_SEARCH_PER_SOURCE);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
};

const fetchLiveOracleWebResults = async (searchText) => {
  const settled = await Promise.allSettled(
    WEB_SOURCE_PROFILES.map((profile) => fetchWebResultsForSource(searchText, profile))
  );

  const failedSources = [];
  const merged = [];

  settled.forEach((entry, index) => {
    if (entry.status !== "fulfilled") {
      failedSources.push(WEB_SOURCE_PROFILES[index].source);
      return;
    }

    if (!Array.isArray(entry.value) || entry.value.length === 0) {
      failedSources.push(WEB_SOURCE_PROFILES[index].source);
      return;
    }

    merged.push(...entry.value);
  });

  const deduped = [];
  const seen = new Set();

  merged.forEach((item) => {
    const key = normalize(item.link);
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    deduped.push(item);
  });

  return {
    results: deduped.sort(
      (a, b) =>
        (Number.isFinite(b.relevanceScore) ? b.relevanceScore : -1) -
          (Number.isFinite(a.relevanceScore) ? a.relevanceScore : -1) ||
        a.title.localeCompare(b.title)
    ),
    failedSources
  };
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

app.post("/resources/:id/summary", (req, res) => {
  const run = async () => {
    try {
      const payload = await resourceSummaryService.getSummaryForResource({
        resourceId: req.params.id,
        ...(req.body || {})
      });

      return res.json(payload);
    } catch (error) {
      const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
      return res.status(statusCode).json({
        message:
          statusCode >= 500
            ? "Summary generation failed for this resource."
            : error.message || "Invalid summary request."
      });
    }
  };

  return run();
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

app.get("/search/web", async (req, res) => {
  const searchText = (req.query.q || "").toString().trim();

  if (!searchText) {
    return res.json({
      query: searchText,
      total: 0,
      page: 1,
      limit: parsePositiveInt(req.query.limit, 12),
      totalPages: 1,
      sort: normalize(req.query.sort) || "relevance",
      provider: "duckduckgo",
      grouped: groupByType([]),
      results: []
    });
  }

  const manualResults = collectManualTopicResults(searchText);
  const { results: liveResults, failedSources } =
    await fetchLiveOracleWebResults(searchText);
  const combinedResults = [...manualResults, ...liveResults];
  const dedupedCombined = [];
  const seenCombined = new Set();

  combinedResults.forEach((item) => {
    const key = normalize(item.link) || normalize(item.title);
    if (!key || seenCombined.has(key)) {
      return;
    }
    seenCombined.add(key);
    dedupedCombined.push(item);
  });

  if (dedupedCombined.length === 0) {
    const fallbackDataset = querySearch(resources, searchText).map(withPathSuggestions);
    const fallbackFiltered = applyFilters(fallbackDataset, req.query);
    const fallbackSorted = sortDataset(fallbackFiltered, req.query.sort);
    const fallbackPaginated = paginateDataset(fallbackSorted, req.query, 9);

    return res.json({
      query: searchText,
      total: fallbackPaginated.total,
      page: fallbackPaginated.page,
      limit: fallbackPaginated.limit,
      totalPages: fallbackPaginated.totalPages,
      sort: normalize(req.query.sort) || "relevance",
      provider: "fallback-curated",
      message:
        "Live web sources were unavailable for this request. Showing curated Oracle Learning Hub resources.",
      grouped: groupByType(fallbackPaginated.items),
      results: fallbackPaginated.items,
      failedSources
    });
  }

  const filtered = applyFilters(dedupedCombined, req.query);
  const sorted = sortDataset(filtered, req.query.sort);
  const paginated = paginateDataset(sorted, req.query, 12);
  const providerLabel =
    manualResults.length > 0 ? "manual-curated+duckduckgo" : "duckduckgo";
  const messageParts = [];

  if (manualResults.length > 0) {
    messageParts.push(
      "Showing curated Oracle topic references first for this query."
    );
  }

  if (failedSources.length > 0) {
    messageParts.push("Some live sources were unavailable; results were supplemented.");
  }

  return res.json({
    query: searchText,
    total: paginated.total,
    page: paginated.page,
    limit: paginated.limit,
    totalPages: paginated.totalPages,
    sort: normalize(req.query.sort) || "relevance",
    provider: providerLabel,
    message: messageParts.join(" "),
    grouped: groupByType(paginated.items),
    results: paginated.items,
    failedSources
  });
});

app.get("/resolve/youtube", async (req, res) => {
  const videoUrl = (req.query.videoUrl || req.query.url || "").toString();
  const title = (req.query.title || "").toString();
  const fallbackSearchUrl = buildYoutubeSearchUrl(title);

  try {
    const destination = await resolveYoutubeDestinationUrl({ videoUrl, title });
    return res.redirect(302, destination || fallbackSearchUrl);
  } catch {
    return res.redirect(302, fallbackSearchUrl);
  }
});

app.get("/knowledge/topics", (req, res) => {
  const topics = filterKnowledgeTopics(req.query);
  const allResources = topics.flatMap((topic) =>
    (topic.resources || []).map((resource) => ({
      ...resource,
      topicId: topic.id,
      topicTitle: topic.title
    }))
  );
  const grouped = groupByType(allResources);

  res.json({
    totalTopics: topics.length,
    totalResources: allResources.length,
    topics,
    grouped,
    resources: allResources
  });
});

app.get("/knowledge/apis", (req, res) => {
  const playbooks = filterFusionApiPlaybooks(req.query);
  const suites = [...new Set(fusionApiPlaybooks.map((item) => item.suite))];
  const modules = [...new Set(fusionApiPlaybooks.map((item) => item.module))];
  const operations = [...new Set(fusionApiPlaybooks.map((item) => item.operation))];
  const suiteModules = fusionApiPlaybooks.reduce((acc, item) => {
    if (!acc[item.suite]) {
      acc[item.suite] = new Set();
    }
    acc[item.suite].add(item.module);
    return acc;
  }, {});

  const sortedSuiteModules = Object.fromEntries(
    Object.entries(suiteModules)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([suite, moduleSet]) => [suite, [...moduleSet].sort()])
  );

  res.json({
    total: playbooks.length,
    playbooks,
    facets: {
      suites: suites.sort(),
      modules: modules.sort(),
      operations: operations.sort(),
      suiteModules: sortedSuiteModules
    }
  });
});

app.get("/resolve/topic", (req, res) => {
  const query = (req.query.q || "").toString().trim();
  const type = (req.query.type || "").toString().trim();

  if (!query) {
    return res.status(400).json({
      message: "Missing required query parameter 'q'."
    });
  }

  const topics = filterKnowledgeTopics({
    q: query,
    type
  });
  const resources = topics.flatMap((topic) => topic.resources || []);

  if (resources.length === 0) {
    return res.status(404).json({
      message: `No manual topic URL found for '${query}'.`
    });
  }

  const tokens = splitSearchTokens(query);
  const normalizedQuery = normalize(query);
  const ranked = [...resources].sort((a, b) => {
    const score = (item) => {
      const text = normalize(
        [item.title, item.description, item.category, ...(item.tags || [])].join(" ")
      );
      let value = Math.round(getTokenCoverage(text, tokens) * 20);
      if (normalize(item.title).includes(normalizedQuery)) {
        value += 15;
      }
      return value;
    };

    return score(b) - score(a) || a.title.localeCompare(b.title);
  });

  return res.redirect(302, ranked[0].link);
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
