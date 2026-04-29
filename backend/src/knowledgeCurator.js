const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const CURATOR_FETCH_TIMEOUT_MS = 12000;
const CURATOR_MAX_SOURCE_CHARS = 16000;
const MIN_USEFUL_SOURCE_CHARS = 260;
const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

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

const slugify = (value) =>
  cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

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

const normalizeList = (value, maxItems = 6) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return uniqueItems(
    value
      .map((entry) => cleanText(entry))
      .filter((entry) => entry.length >= 2)
      .map((entry) => clipText(entry, 240))
  ).slice(0, maxItems);
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

const safeParseUrl = (value) => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const normalizeYoutubeLink = (urlValue) => {
  const parsed = safeParseUrl(urlValue);
  if (!parsed) {
    return { link: cleanText(urlValue), youtubeId: "" };
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
    return { link: cleanText(urlValue), youtubeId: "" };
  }

  return {
    link: `https://www.youtube.com/watch?v=${youtubeId}`,
    youtubeId
  };
};

const toSentenceChunks = (value) =>
  cleanText(value)
    .split(/(?<=[.!?])\s+/)
    .map((item) => cleanText(item))
    .filter(Boolean);

const fetchTextWithTimeout = async (url, timeoutMs = CURATOR_FETCH_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OracleLearningHubCurator/1.0; +https://github.com)",
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
      error: cleanText(error.message) || "Unable to fetch URL content."
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
    .filter((line) => line.length >= 5 && line.length <= 180)
    .slice(0, 24);

  const bodyLines = $("article p, main p, p, li")
    .toArray()
    .map((element) => cleanText($(element).text()))
    .filter((line) => line.length >= 35 && line.length <= 520)
    .slice(0, 160);

  const mergedLines = uniqueItems([...headings, ...bodyLines]);

  return {
    title,
    description,
    headings: uniqueItems(headings).slice(0, 12),
    sourceText: clipText(mergedLines.join("\n"), CURATOR_MAX_SOURCE_CHARS),
    groundingSnippets: mergedLines.slice(0, 8).map((line) => clipText(line, 260))
  };
};

const fetchYoutubeMetadata = async (youtubeWatchUrl) => {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    youtubeWatchUrl
  )}&format=json`;
  const payload = await fetchTextWithTimeout(endpoint);

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
  const description = [title, author ? `Channel: ${author}` : "", provider]
    .filter(Boolean)
    .join(". ");

  return {
    title,
    description,
    headings: [title].filter(Boolean),
    sourceText: clipText(description, CURATOR_MAX_SOURCE_CHARS),
    groundingSnippets: uniqueItems([title, author, provider]).slice(0, 5)
  };
};

const inferSourceType = (url, title = "") => {
  const parsed = safeParseUrl(url);
  const host = cleanText(parsed?.hostname).toLowerCase();
  const text = `${host} ${title}`.toLowerCase();

  if (text.includes("youtube.com") || text.includes("youtu.be")) {
    return "videos";
  }
  if (text.includes("blog") || host.includes("blogs.oracle.com")) {
    return "blogs";
  }
  if (text.includes("github") || text.includes("livelabs") || text.includes("lab")) {
    return "labs";
  }
  return "docs";
};

const inferSource = (url) => {
  const parsed = safeParseUrl(url);
  const host = cleanText(parsed?.hostname).toLowerCase();

  if (host.includes("youtube")) {
    return "YouTube";
  }
  if (host.includes("blogs.oracle.com")) {
    return "Oracle Blogs";
  }
  if (host.includes("docs.oracle.com")) {
    return "Oracle Docs";
  }
  if (host.includes("github.com")) {
    return "GitHub";
  }
  if (host.includes("oracle.com")) {
    return "Oracle";
  }
  return parsed?.hostname || "External Source";
};

const inferProduct = (sourceText) => {
  const text = cleanText(sourceText).toLowerCase();
  const candidates = [
    ["Oracle Integration", ["oracle integration", "oic", "integration cloud"]],
    ["Oracle EPM", ["enterprise performance management", "epm", "planning", "account reconciliation"]],
    ["Fusion ERP", ["erp", "financials", "payables", "receivables", "general ledger"]],
    ["Fusion HCM", ["hcm", "workers", "person", "benefits", "payroll"]],
    ["Oracle OCI", ["oci", "oracle cloud infrastructure", "object storage", "compute"]],
    ["Oracle Database", ["autonomous database", "database", "sql"]]
  ];

  const match = candidates.find(([, terms]) => terms.some((term) => text.includes(term)));
  return match?.[0] || "Oracle Cloud";
};

const inferTopic = (sourceText, product) => {
  const text = cleanText(sourceText).toLowerCase();
  const topicCandidates = [
    ["OIC Gen3", ["oracle integration 3", "oic gen3", "integration 3"]],
    ["REST Adapter", ["rest adapter"]],
    ["Agentic AI", ["agentic", "ai agent", "generative ai"]],
    ["EPM Planning", ["planning", "freeform"]],
    ["Account Reconciliation", ["account reconciliation", "transaction matching"]],
    ["Fusion REST", ["fusion rest", "fscmrestapi", "crmrestapi", "hcmrestapi"]],
    ["API Payloads", ["payload", "endpoint", "rest api"]],
    ["Security", ["oauth", "authentication", "authorization", "role", "policy"]]
  ];

  const match = topicCandidates.find(([, terms]) => terms.some((term) => text.includes(term)));
  return match?.[0] || product;
};

const inferDifficulty = (sourceText) => {
  const text = cleanText(sourceText).toLowerCase();

  if (/(advanced|architect|production|migration|security|oauth|policy|performance)/.test(text)) {
    return "Advanced";
  }
  if (/(configure|integration|adapter|api|payload|deploy|automation|workflow)/.test(text)) {
    return "Intermediate";
  }
  return "Beginner";
};

const inferTags = (sourceText, product, topic) => {
  const text = cleanText(sourceText).toLowerCase();
  const tags = [product, topic];
  const tagMap = [
    ["OIC", ["oic", "oracle integration"]],
    ["Gen3", ["integration 3", "gen3"]],
    ["REST Adapter", ["rest adapter"]],
    ["Fusion REST", ["fusion rest", "fscmrestapi", "hcmrestapi", "crmrestapi"]],
    ["EPM", ["epm", "enterprise performance management"]],
    ["Planning", ["planning", "freeform"]],
    ["Account Reconciliation", ["account reconciliation", "transaction matching"]],
    ["Payload", ["payload", "json"]],
    ["Security", ["oauth", "security", "authentication", "authorization"]],
    ["YouTube", ["youtube"]],
    ["Docs", ["docs.oracle.com"]]
  ];

  tagMap.forEach(([tag, terms]) => {
    if (terms.some((term) => text.includes(term))) {
      tags.push(tag);
    }
  });

  return normalizeList(tags, 8);
};

const pickTechnicalSignals = (sourceText, maxItems = 5) => {
  const technicalPattern =
    /\b(rest|adapter|api|endpoint|payload|oauth|security|connection|configure|job|module|application|integration|import|export|mapping|role|policy|json|postman|curl)\b/i;

  return uniqueItems(
    toSentenceChunks(sourceText)
      .filter((sentence) => sentence.length >= 35 && sentence.length <= 260)
      .filter((sentence) => technicalPattern.test(sentence))
      .map((sentence) => clipText(sentence, 220))
  ).slice(0, maxItems);
};

const pickQuickSteps = (sourceText, maxItems = 6) => {
  const actionPattern =
    /\b(create|configure|select|add|enable|test|verify|deploy|run|import|export|connect|map|assign|open|click|use|call|send)\b/i;

  return uniqueItems(
    toSentenceChunks(sourceText)
      .filter((sentence) => sentence.length >= 28 && sentence.length <= 240)
      .filter((sentence) => actionPattern.test(sentence))
      .map((sentence) => clipText(sentence, 210))
  ).slice(0, maxItems);
};

const buildSourceContent = async (url) => {
  const normalizedYoutube = normalizeYoutubeLink(url);
  if (normalizedYoutube.youtubeId) {
    const youtubeMetadata = await fetchYoutubeMetadata(normalizedYoutube.link);
    if (youtubeMetadata) {
      return {
        url: normalizedYoutube.link,
        fetchedFrom: "youtube-oembed",
        contentType: "application/json",
        fetchStatus: "ok",
        insufficientContent: youtubeMetadata.sourceText.length < MIN_USEFUL_SOURCE_CHARS,
        ...youtubeMetadata
      };
    }
  }

  const fetched = await fetchTextWithTimeout(url);
  if (!fetched.ok || !fetched.body) {
    return {
      url,
      fetchedFrom: "url-metadata",
      contentType: fetched.contentType || "text/plain",
      fetchStatus: fetched.error ? `fetch-error: ${fetched.error}` : `status-${fetched.status}`,
      insufficientContent: true,
      title: "",
      description: "",
      headings: [],
      sourceText: "",
      groundingSnippets: []
    };
  }

  const extracted = extractReadableContent(fetched.body);
  const mergedText = cleanText(
    [extracted.title, extracted.description, extracted.sourceText].join("\n")
  );

  return {
    url,
    fetchedFrom: "html-content",
    contentType: fetched.contentType || "text/html",
    fetchStatus: "ok",
    insufficientContent: mergedText.length < MIN_USEFUL_SOURCE_CHARS,
    title: extracted.title,
    description: extracted.description,
    headings: extracted.headings,
    sourceText: clipText(mergedText, CURATOR_MAX_SOURCE_CHARS),
    groundingSnippets: extracted.groundingSnippets
  };
};

const normalizeDraft = (draft, sourceContent, requestedUrl) => {
  const title = clipText(
    draft?.title || sourceContent.title || sourceContent.description || "Oracle learning resource",
    140
  );
  const product = clipText(draft?.product || inferProduct(sourceContent.sourceText), 80);
  const topic = clipText(
    draft?.topic || inferTopic(sourceContent.sourceText, product),
    80
  );
  const sourceType = cleanText(draft?.sourceType || inferSourceType(requestedUrl, title));
  const source = clipText(draft?.source || inferSource(requestedUrl), 80);
  const difficulty = cleanText(draft?.difficulty || inferDifficulty(sourceContent.sourceText));
  const tags = normalizeList(
    draft?.tags?.length ? draft.tags : inferTags(sourceContent.sourceText, product, topic),
    8
  );
  const summary = clipText(
    draft?.summary ||
      sourceContent.description ||
      toSentenceChunks(sourceContent.sourceText).slice(0, 3).join(" ") ||
      "AI curator could only extract limited metadata. Review the original source before publishing.",
    520
  );
  const technicalSignals = normalizeList(
    draft?.technicalSignals?.length
      ? draft.technicalSignals
      : pickTechnicalSignals(sourceContent.sourceText),
    6
  );
  const quickSteps = normalizeList(
    draft?.quickSteps?.length ? draft.quickSteps : pickQuickSteps(sourceContent.sourceText),
    6
  );
  const version = clipText(draft?.version || (product.includes("Integration") ? "Gen3" : "Current"), 60);
  const idSeed = `${title}-${requestedUrl}`;

  return {
    id: `kb-ai-${slugify(idSeed) || Date.now()}`,
    sourceType,
    product,
    topic,
    title,
    source,
    url: sourceContent.url || requestedUrl,
    version,
    difficulty,
    tags,
    summary,
    technicalSignals:
      technicalSignals.length > 0
        ? technicalSignals
        : ["Review source content and confirm implementation details before production use."],
    quickSteps,
    chunkText: clipText(
      draft?.chunkText ||
        [summary, technicalSignals.join(" "), quickSteps.join(" "), sourceContent.sourceText].join(
          " "
        ),
      1800
    ),
    createdBy: "ai-curator",
    createdAt: new Date().toISOString(),
    reviewStatus: "draft"
  };
};

const buildFallbackDraft = (sourceContent, requestedUrl) =>
  normalizeDraft({}, sourceContent, requestedUrl);

const analyzeWithOpenAI = async ({
  openaiApiKey,
  openaiBaseUrl,
  openaiModel,
  sourceContent,
  requestedUrl
}) => {
  if (!openaiApiKey || typeof fetch !== "function" || !sourceContent.sourceText) {
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
              "You curate Oracle technical learning resources. Use only the provided source text. Return strict JSON only with keys: title, sourceType, product, topic, source, version, difficulty, tags, summary, technicalSignals, quickSteps, chunkText. sourceType must be one of docs|videos|blogs|labs. difficulty must be Beginner|Intermediate|Advanced. Do not invent steps, payloads, endpoints, or facts."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `URL: ${requestedUrl}
Fetched title: ${sourceContent.title || "N/A"}
Fetched description: ${sourceContent.description || "N/A"}
Fetched headings: ${(sourceContent.headings || []).join(" | ") || "N/A"}

SOURCE_TEXT
${clipText(sourceContent.sourceText, CURATOR_MAX_SOURCE_CHARS)}

Return JSON only.
Rules:
- summary: <= 90 words, technical and precise.
- technicalSignals: 3-6 concrete things this resource covers.
- quickSteps: 3-6 steps only if the source supports them.
- chunkText: compact searchable text <= 350 words.
- If content is thin, say that in summary and technicalSignals.`
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

    return parseJsonObject(outputText);
  } catch {
    return null;
  }
};

const loadApprovedItems = (storePath) => {
  try {
    if (!fs.existsSync(storePath)) {
      return [];
    }

    const parsed = JSON.parse(fs.readFileSync(storePath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveApprovedItems = (storePath, items) => {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, `${JSON.stringify(items, null, 2)}\n`, "utf8");
};

const createKnowledgeCuratorService = ({
  storePath = path.join(__dirname, "data", "approvedKnowledgeItems.json"),
  openaiApiKey = "",
  openaiBaseUrl = "https://api.openai.com/v1",
  openaiModel = "gpt-4.1-mini"
} = {}) => {
  let approvedItems = loadApprovedItems(storePath);

  const analyzeUrl = async ({ url }) => {
    const requestedUrl = cleanText(url);
    const parsedUrl = safeParseUrl(requestedUrl);

    if (!parsedUrl || !/^https?:$/.test(parsedUrl.protocol)) {
      const error = new Error("Please provide a valid http or https URL.");
      error.statusCode = 400;
      throw error;
    }

    const sourceContent = await buildSourceContent(requestedUrl);
    const aiDraft = await analyzeWithOpenAI({
      openaiApiKey,
      openaiBaseUrl,
      openaiModel,
      sourceContent,
      requestedUrl
    });
    const draft = normalizeDraft(aiDraft || {}, sourceContent, requestedUrl);

    return {
      draft,
      mode: aiDraft ? "openai" : "extractive-fallback",
      aiEnabled: Boolean(openaiApiKey),
      sourceContent: {
        url: sourceContent.url || requestedUrl,
        fetchedFrom: sourceContent.fetchedFrom,
        contentType: sourceContent.contentType,
        fetchStatus: sourceContent.fetchStatus,
        insufficientContent: Boolean(sourceContent.insufficientContent),
        groundingSnippets: sourceContent.groundingSnippets || []
      }
    };
  };

  const approveDraft = ({ draft }) => {
    const normalized = normalizeDraft(draft || {}, { sourceText: draft?.chunkText || "" }, draft?.url);
    const item = {
      ...normalized,
      id: cleanText(draft?.id) || normalized.id,
      reviewStatus: "approved",
      approvedAt: new Date().toISOString()
    };

    if (!item.url || !item.title) {
      const error = new Error("Draft must include a title and URL.");
      error.statusCode = 400;
      throw error;
    }

    const existingIndex = approvedItems.findIndex(
      (entry) =>
        cleanText(entry.url).toLowerCase() === cleanText(item.url).toLowerCase() ||
        cleanText(entry.id).toLowerCase() === cleanText(item.id).toLowerCase()
    );

    if (existingIndex >= 0) {
      approvedItems[existingIndex] = {
        ...approvedItems[existingIndex],
        ...item,
        updatedAt: new Date().toISOString()
      };
    } else {
      approvedItems.push(item);
    }

    saveApprovedItems(storePath, approvedItems);
    return item;
  };

  return {
    analyzeUrl,
    approveDraft,
    getApprovedItems: () => [...approvedItems]
  };
};

module.exports = {
  createKnowledgeCuratorService
};
