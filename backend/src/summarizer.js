const cheerio = require("cheerio");

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const SUMMARY_FETCH_TIMEOUT_MS = 12000;
const SUMMARY_MAX_SOURCE_CHARS = 14000;
const SUMMARY_MIN_GROUNDED_CHARS = 280;
const SUMMARY_CACHE_TTL_MS = 1000 * 60 * 30;

const cleanText = (value) => (value || "").toString().replace(/\s+/g, " ").trim();

const clipText = (value, maxChars = 500) => {
  const text = cleanText(value);
  if (!text) {
    return "";
  }
  if (text.length <= maxChars) {
    return text;
  }
  return `${text.slice(0, maxChars - 1).trim()}...`;
};

const toSentenceChunks = (value) =>
  cleanText(value)
    .split(/(?<=[.!?])\s+/)
    .map((item) => cleanText(item))
    .filter(Boolean);

const uniqueItems = (items) => {
  const seen = new Set();
  const output = [];

  items.forEach((entry) => {
    const text = cleanText(entry);
    const key = text.toLowerCase();
    if (!text || seen.has(key)) {
      return;
    }
    seen.add(key);
    output.push(text);
  });

  return output;
};

const safeParseUrl = (urlValue) => {
  if (!urlValue) {
    return null;
  }

  try {
    return new URL(urlValue);
  } catch {
    return null;
  }
};

const normalizeYoutubeLink = (urlValue) => {
  const fallback = {
    link: cleanText(urlValue),
    youtubeId: ""
  };

  if (!urlValue) {
    return fallback;
  }

  const parsed = safeParseUrl(urlValue);
  if (!parsed) {
    return fallback;
  }

  const host = cleanText(parsed.hostname).toLowerCase().replace(/^www\./, "");
  let youtubeId = "";

  if (host === "youtu.be") {
    youtubeId = parsed.pathname.split("/").filter(Boolean)[0] || "";
  } else if (host.endsWith("youtube.com")) {
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

const parseJsonObject = (text) => {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    // Continue with loose parsing below.
  }

  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (!objectMatch) {
    return null;
  }

  try {
    return JSON.parse(objectMatch[0]);
  } catch {
    return null;
  }
};

const normalizeList = (value, maxItems = 5) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return uniqueItems(
    value
      .map((entry) => cleanText(entry))
      .filter((entry) => entry.length > 6)
      .map((entry) => clipText(entry, 220))
  ).slice(0, maxItems);
};

const normalizeConfidence = (value, fallback = "medium") => {
  const normalized = cleanText(value).toLowerCase();
  if (["high", "medium", "low"].includes(normalized)) {
    return normalized;
  }
  return fallback;
};

const TECHNICAL_KEYWORD_PATTERN =
  /\b(oci|oracle integration|oic|stream|streaming|adapter|api|rest|payload|auth|oauth|iam|connection|instance|kubernetes|devops|database|fusion|hcm|erp|event|queue|topic|policy|endpoint|postman|curl|deploy|terraform|integration)\b/i;
const STEP_ACTION_PATTERN =
  /\b(create|configure|set|enable|add|deploy|test|verify|use|connect|map|import|define|select|run|build|trigger|invoke|assign|publish|subscribe|provision|upload|download)\b/i;

const pickTechnicalCoverage = (sourceContent, maxItems = 5) => {
  const sentences = toSentenceChunks(sourceContent.sourceText)
    .filter((sentence) => sentence.length >= 28)
    .filter((sentence) => TECHNICAL_KEYWORD_PATTERN.test(sentence))
    .map((sentence) => clipText(sentence, 220));

  const snippets = (sourceContent.groundingSnippets || [])
    .filter((snippet) => TECHNICAL_KEYWORD_PATTERN.test(snippet))
    .map((snippet) => clipText(snippet, 220));

  return uniqueItems([...sentences, ...snippets]).slice(0, maxItems);
};

const pickQuickSteps = (sourceContent, maxItems = 6) => {
  const sentences = toSentenceChunks(sourceContent.sourceText)
    .filter((sentence) => sentence.length >= 24 && sentence.length <= 240)
    .filter(
      (sentence) =>
        STEP_ACTION_PATTERN.test(sentence) ||
        /\b(step|first|then|next|finally|before|after)\b/i.test(sentence)
    )
    .map((sentence) => clipText(sentence, 210));

  return uniqueItems(sentences).slice(0, maxItems);
};

const pickShortcuts = (sourceContent, maxItems = 4) => {
  const candidates = toSentenceChunks(sourceContent.sourceText)
    .filter((sentence) => sentence.length >= 20 && sentence.length <= 220)
    .filter((sentence) =>
      /\b(best practice|tip|shortcut|faster|quick|recommended|avoid|important|note)\b/i.test(
        sentence
      )
    )
    .map((sentence) => clipText(sentence, 190));

  return uniqueItems(candidates).slice(0, maxItems);
};

const buildManualResourceCatalog = (manualTopicCollections = []) =>
  manualTopicCollections.flatMap((topic) =>
    (topic.resources || []).map((resource, index) => ({
      ...resource,
      id: resource.id || `manual-${topic.id}-${index + 1}`,
      topicId: topic.id,
      topicTitle: topic.title
    }))
  );

const fetchTextWithTimeout = async (url, timeoutMs = SUMMARY_FETCH_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OracleLearningHubSummarizer/1.0; +https://github.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });

    const body = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      body,
      contentType: cleanText(response.headers.get("content-type"))
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      body: "",
      contentType: "",
      error: cleanText(error.message) || "Unable to fetch resource content."
    };
  } finally {
    clearTimeout(timeout);
  }
};

const extractReadableContent = (html) => {
  const $ = cheerio.load(html || "");
  $("script,style,noscript,svg,iframe,nav,footer,header,form,aside").remove();

  const title = cleanText(
    $("meta[property='og:title']").attr("content") ||
      $("meta[name='twitter:title']").attr("content") ||
      $("title").first().text() ||
      $("h1").first().text()
  );

  const description = cleanText(
    $("meta[name='description']").attr("content") ||
      $("meta[property='og:description']").attr("content") ||
      $("main p").first().text() ||
      $("article p").first().text() ||
      $("p").first().text()
  );

  const headings = $("h1, h2, h3")
    .toArray()
    .map((element) => cleanText($(element).text()))
    .filter((line) => line.length >= 6 && line.length <= 180)
    .slice(0, 16);

  const paragraphLines = $("article p, main p, p, li")
    .toArray()
    .map((element) => cleanText($(element).text()))
    .filter((line) => line.length >= 40 && line.length <= 420)
    .slice(0, 120);

  const mergedLines = uniqueItems([...headings, ...paragraphLines]);
  const sourceText = clipText(mergedLines.join("\n"), SUMMARY_MAX_SOURCE_CHARS);
  const groundingSnippets = mergedLines.slice(0, 8).map((line) => clipText(line, 260));

  return {
    title,
    description,
    sourceText,
    groundingSnippets,
    charCount: sourceText.length
  };
};

const fetchYoutubeOEmbed = async (youtubeWatchUrl, timeoutMs = SUMMARY_FETCH_TIMEOUT_MS) => {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    youtubeWatchUrl
  )}&format=json`;
  const payload = await fetchTextWithTimeout(endpoint, timeoutMs);

  if (!payload.ok) {
    return null;
  }

  const parsed = parseJsonObject(payload.body);
  if (!parsed) {
    return null;
  }

  const title = cleanText(parsed.title);
  const author = cleanText(parsed.author_name);
  const provider = cleanText(parsed.provider_name) || "YouTube";
  const description = [title, author ? `Channel: ${author}` : "", `Provider: ${provider}`]
    .filter(Boolean)
    .join(". ");

  const sourceText = clipText(description, SUMMARY_MAX_SOURCE_CHARS);

  return {
    title,
    description,
    sourceText,
    groundingSnippets: uniqueItems([title, author, provider])
      .map((line) => clipText(line, 220))
      .slice(0, 5),
    charCount: sourceText.length
  };
};

const buildFallbackSummary = (resource, sourceContent) => {
  const sentences = toSentenceChunks(sourceContent.sourceText)
    .filter((sentence) => sentence.length >= 35)
    .slice(0, 8);

  const summaryText = clipText(
    sentences.slice(0, 3).join(" ") ||
      sourceContent.description ||
      resource.description ||
      `${resource.title} resource summary is currently limited because the source content was partially accessible.`,
    520
  );

  const keyTakeaways = normalizeList(
    [
      ...sentences.slice(1, 5),
      ...sourceContent.groundingSnippets.slice(0, 3)
    ],
    5
  );

  const prerequisites = normalizeList(
    [
      `Recommended level: ${resource.difficulty || "Intermediate"}`,
      ...(Array.isArray(resource.tags) ? resource.tags.map((tag) => `Know ${tag}`) : [])
    ],
    4
  );

  const technicalCoverage = pickTechnicalCoverage(sourceContent, 5);
  const quickSteps = pickQuickSteps(sourceContent, 6);
  const shortcuts = pickShortcuts(sourceContent, 4);
  const notCovered = normalizeList(
    [
      sourceContent.insufficientContent
        ? "Detailed source content was partially accessible, so exact implementation details may be missing."
        : "",
      quickSteps.length < 3
        ? "Step-by-step procedure is not fully explicit in the fetched content."
        : "",
      "Exact environment-specific values (tenant IDs, credentials, endpoint URLs) are not fully listed in this summary."
    ],
    4
  );

  const confidence = sourceContent.insufficientContent ? "low" : "medium";

  return {
    text: summaryText,
    keyTakeaways:
      keyTakeaways.length > 0 ? keyTakeaways : ["Open the original source for complete details."],
    technicalCoverage,
    quickSteps:
      quickSteps.length > 0
        ? quickSteps
        : [
            "Source text does not clearly expose an end-to-end procedure. Open the original resource for exact steps."
          ],
    shortcuts,
    prerequisites,
    notCovered,
    confidence,
    modelSource: "extractive-fallback"
  };
};

const createResourceSummaryService = ({
  resources = [],
  manualTopicCollections = [],
  openaiApiKey = "",
  openaiBaseUrl = "https://api.openai.com/v1",
  openaiModel = "gpt-4.1-mini"
}) => {
  const manualResources = buildManualResourceCatalog(manualTopicCollections);
  const catalog = [...resources, ...manualResources];
  const catalogById = new Map(catalog.map((resource) => [resource.id, resource]));
  const summaryCache = new Map();

  const resolveResource = (resourceId, overrides = {}) => {
    const catalogMatch = resourceId ? catalogById.get(resourceId) : null;
    const fallback = {
      id: resourceId || cleanText(overrides.id),
      title: cleanText(overrides.title) || "Oracle Resource",
      type: cleanText(overrides.type) || "docs",
      source: cleanText(overrides.source) || "External Source",
      difficulty: cleanText(overrides.difficulty) || "Intermediate",
      link: cleanText(overrides.url || overrides.link),
      description: cleanText(overrides.description),
      tags: Array.isArray(overrides.tags) ? overrides.tags : []
    };

    if (!catalogMatch) {
      return fallback;
    }

    return {
      ...catalogMatch,
      link: cleanText(overrides.url || overrides.link || catalogMatch.link),
      title: cleanText(overrides.title || catalogMatch.title),
      source: cleanText(overrides.source || catalogMatch.source),
      description: cleanText(overrides.description || catalogMatch.description),
      difficulty: cleanText(overrides.difficulty || catalogMatch.difficulty),
      tags: Array.isArray(catalogMatch.tags) ? catalogMatch.tags : []
    };
  };

  const buildSourceContent = async (resource) => {
    const link = cleanText(resource.link);
    const defaultSnippets = uniqueItems([
      resource.title,
      resource.description,
      ...(Array.isArray(resource.tags) ? resource.tags : [])
    ])
      .map((line) => clipText(line, 220))
      .slice(0, 6);

    if (!link) {
      const fallbackText = cleanText([resource.title, resource.description].join(". "));
      return {
        url: "",
        fetchedFrom: "resource-metadata",
        contentType: "application/json",
        title: resource.title,
        description: resource.description,
        sourceText: clipText(fallbackText, SUMMARY_MAX_SOURCE_CHARS),
        groundingSnippets: defaultSnippets,
        fetchStatus: "no-link",
        insufficientContent: true
      };
    }

    const normalizedYoutube = normalizeYoutubeLink(link);
    if (normalizedYoutube.youtubeId) {
      const oembedData = await fetchYoutubeOEmbed(normalizedYoutube.link);
      if (oembedData) {
        const mergedText = cleanText(
          [oembedData.sourceText, resource.description, defaultSnippets.join(". ")].join(". ")
        );
        return {
          url: normalizedYoutube.link,
          fetchedFrom: "youtube-oembed",
          contentType: "application/json",
          title: oembedData.title || resource.title,
          description: oembedData.description || resource.description,
          sourceText: clipText(mergedText, SUMMARY_MAX_SOURCE_CHARS),
          groundingSnippets: uniqueItems([
            ...oembedData.groundingSnippets,
            ...defaultSnippets
          ]).slice(0, 8),
          fetchStatus: "ok",
          insufficientContent: mergedText.length < SUMMARY_MIN_GROUNDED_CHARS
        };
      }
    }

    const fetched = await fetchTextWithTimeout(link);
    if (!fetched.ok || !fetched.body) {
      const fallbackText = cleanText(
        [resource.title, resource.description, defaultSnippets.join(". ")].join(". ")
      );

      return {
        url: link,
        fetchedFrom: "resource-metadata",
        contentType: fetched.contentType || "text/plain",
        title: resource.title,
        description: resource.description,
        sourceText: clipText(fallbackText, SUMMARY_MAX_SOURCE_CHARS),
        groundingSnippets: defaultSnippets,
        fetchStatus: fetched.error ? `fetch-error: ${fetched.error}` : `status-${fetched.status}`,
        insufficientContent: true
      };
    }

    const extracted = extractReadableContent(fetched.body);
    const mergedText = cleanText(
      [
        extracted.title,
        extracted.description,
        extracted.sourceText,
        resource.description
      ].join("\n")
    );

    return {
      url: link,
      fetchedFrom: "html-content",
      contentType: fetched.contentType || "text/html",
      title: extracted.title || resource.title,
      description: extracted.description || resource.description,
      sourceText: clipText(mergedText, SUMMARY_MAX_SOURCE_CHARS),
      groundingSnippets: uniqueItems([
        ...extracted.groundingSnippets,
        ...defaultSnippets
      ]).slice(0, 8),
      fetchStatus: "ok",
      insufficientContent: mergedText.length < SUMMARY_MIN_GROUNDED_CHARS
    };
  };

  const summarizeWithOpenAI = async (resource, sourceContent) => {
    if (!openaiApiKey || typeof fetch !== "function") {
      return null;
    }

    const requestBody = {
      model: openaiModel,
      temperature: 0.1,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are a strict grounding summarizer for technical Oracle learning content. Use only SOURCE_TEXT facts. If info is missing, explicitly say it is not clearly stated in source. Return strict JSON with keys: summary, technicalCoverage, quickSteps, shortcuts, keyTakeaways, prerequisites, notCovered, confidence, usedSnippets. confidence must be one of high|medium|low."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `RESOURCE
Title: ${resource.title}
Type: ${resource.type}
Source: ${resource.source}
Difficulty: ${resource.difficulty}
Link: ${sourceContent.url || resource.link || "N/A"}

SOURCE_TEXT
${clipText(sourceContent.sourceText, SUMMARY_MAX_SOURCE_CHARS)}

Return JSON only.
Rules:
- summary: <= 120 words, technical and precise.
- quickSteps: 3-6 concise implementation steps when available.
- technicalCoverage: what this resource actually explains (tool/config/API/features).
- notCovered: what is not explicit in source.
- Do not invent commands, endpoints, or values.`
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(`${openaiBaseUrl}/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        return null;
      }

      const payload = await response.json();
      const outputText =
        cleanText(payload?.output_text) ||
        cleanText(
          (Array.isArray(payload?.output) ? payload.output : [])
            .flatMap((block) => (Array.isArray(block?.content) ? block.content : []))
            .map((entry) => entry?.text || entry?.value || "")
            .join("\n")
        );
      const parsed = parseJsonObject(outputText);

      if (!parsed || typeof parsed !== "object") {
        return null;
      }

      const summaryText = clipText(parsed.summary, 620);
      if (!summaryText) {
        return null;
      }

      return {
        text: summaryText,
        keyTakeaways: normalizeList(parsed.keyTakeaways, 5),
        technicalCoverage: normalizeList(parsed.technicalCoverage, 5),
        quickSteps: normalizeList(parsed.quickSteps, 6),
        shortcuts: normalizeList(parsed.shortcuts, 4),
        prerequisites: normalizeList(parsed.prerequisites, 4),
        notCovered: normalizeList(parsed.notCovered, 4),
        confidence: normalizeConfidence(parsed.confidence, "medium"),
        usedSnippets: normalizeList(parsed.usedSnippets, 5),
        modelSource: "openai"
      };
    } catch {
      return null;
    }
  };

  const getSummaryForResource = async (request = {}) => {
    const resource = resolveResource(request.resourceId, request);
    if (!resource.id && !resource.link) {
      const error = new Error("A valid resource id or link is required.");
      error.statusCode = 400;
      throw error;
    }

    const cacheKey = `${resource.id || resource.title}|${resource.link || ""}`.toLowerCase();
    const now = Date.now();
    const cached = summaryCache.get(cacheKey);
    if (cached && now - cached.createdAt < SUMMARY_CACHE_TTL_MS) {
      return cached.payload;
    }

    const sourceContent = await buildSourceContent(resource);
    const aiSummary = await summarizeWithOpenAI(resource, sourceContent);
    const fallbackSummary = buildFallbackSummary(resource, sourceContent);
    const summary = aiSummary
      ? {
          text: aiSummary.text,
          technicalCoverage:
            aiSummary.technicalCoverage.length > 0
              ? aiSummary.technicalCoverage
              : fallbackSummary.technicalCoverage,
          quickSteps:
            aiSummary.quickSteps.length > 0
              ? aiSummary.quickSteps
              : fallbackSummary.quickSteps,
          shortcuts:
            aiSummary.shortcuts.length > 0
              ? aiSummary.shortcuts
              : fallbackSummary.shortcuts,
          keyTakeaways:
            aiSummary.keyTakeaways.length > 0
              ? aiSummary.keyTakeaways
              : fallbackSummary.keyTakeaways,
          prerequisites:
            aiSummary.prerequisites.length > 0
              ? aiSummary.prerequisites
              : fallbackSummary.prerequisites,
          notCovered:
            aiSummary.notCovered.length > 0
              ? aiSummary.notCovered
              : fallbackSummary.notCovered,
          confidence: aiSummary.confidence,
          modelSource: aiSummary.modelSource
        }
      : fallbackSummary;

    const groundingSnippets = uniqueItems([
      ...(aiSummary?.usedSnippets || []),
      ...sourceContent.groundingSnippets
    ]).slice(0, 6);

    const payload = {
      resource: {
        id: resource.id || "",
        title: resource.title || "",
        type: resource.type || "",
        source: resource.source || "",
        difficulty: resource.difficulty || "",
        link: sourceContent.url || resource.link || ""
      },
      sourceContent: {
        fetchedFrom: sourceContent.fetchedFrom,
        contentType: sourceContent.contentType,
        fetchedAt: new Date().toISOString(),
        fetchStatus: sourceContent.fetchStatus,
        insufficientContent: Boolean(sourceContent.insufficientContent),
        notes: [
          "Summary is grounded only in text we could fetch from the source.",
          sourceContent.insufficientContent
            ? "Source content access was limited. Verify important details in the original resource."
            : "Use original source for full context and implementation details."
        ],
        groundingSnippets
      },
      summary
    };

    summaryCache.set(cacheKey, {
      createdAt: now,
      payload
    });

    return payload;
  };

  return {
    getSummaryForResource
  };
};

module.exports = {
  createResourceSummaryService
};
