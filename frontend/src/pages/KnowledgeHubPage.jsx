import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Copy,
  Database,
  Download,
  FlaskConical,
  Link2,
  Newspaper,
  PlayCircle,
  Search,
  Sparkles,
  Terminal
} from "lucide-react";
import ResourceCard from "../components/ResourceCard";
import {
  analyzeKnowledgeUrl,
  approveKnowledgeDraft,
  getFusionApiPlaybooks,
  getKnowledgeBaseItems,
  getKnowledgeTopics
} from "../api/client";

const sectionMeta = {
  docs: { title: "Docs", icon: BookOpen },
  videos: { title: "Videos", icon: PlayCircle },
  blogs: { title: "Blogs", icon: Newspaper },
  labs: { title: "Labs", icon: FlaskConical }
};

const emptyGrouped = {
  docs: [],
  videos: [],
  blogs: [],
  labs: []
};

const prettyJson = (value) => JSON.stringify(value || {}, null, 2);
const isBodyMethod = (method) =>
  ["POST", "PUT", "PATCH"].includes((method || "").toUpperCase());
const linesToArray = (value) =>
  (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const parseHeaderLine = (headerLine) => {
  const text = (headerLine || "").toString().trim();
  if (!text.includes(":")) {
    return { key: text, value: "" };
  }

  const separator = text.indexOf(":");
  return {
    key: text.slice(0, separator).trim(),
    value: text.slice(separator + 1).trim()
  };
};

const sanitizeFileName = (value) =>
  (value || "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

const copyToClipboard = async (text) => {
  const normalizedText = (text || "").toString();
  if (!normalizedText) {
    return false;
  }

  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(normalizedText);
      return true;
    } catch {
      // Continue with fallback below.
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = normalizedText;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
};

const downloadJsonFile = (filename, payload) => {
  const blob = new Blob([prettyJson(payload)], {
    type: "application/json;charset=utf-8"
  });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(href);
};

const buildCurlSnippet = (playbook) => {
  const method = (playbook?.method || "GET").toUpperCase();
  const endpoint = playbook?.endpoint || "/";
  const url = `https://<your-oracle-saas-host>${endpoint}`;
  const headerLines = (playbook?.requiredHeaders || []).map(
    (header) => `  -H "${header.replace(/"/g, '\\"')}"`
  );
  const bodyPayload = JSON.stringify(playbook?.sampleRequest || {}).replace(
    /"/g,
    '\\"'
  );

  const lines = [`curl --request ${method} "${url}"`, ...headerLines];
  if (isBodyMethod(method)) {
    lines.push(`  --data-raw "${bodyPayload}"`);
  }

  return lines.join(" \\\n");
};

const buildPostmanItem = (playbook) => {
  const method = (playbook?.method || "GET").toUpperCase();
  const endpoint = (playbook?.endpoint || "/").replace(/^\/+/, "");
  const pathSegments = endpoint.split("/").filter(Boolean);

  const postmanItem = {
    name: playbook?.operation || "Oracle SaaS API Request",
    request: {
      method,
      header: (playbook?.requiredHeaders || []).map((line) => {
        const parsed = parseHeaderLine(line);
        return {
          key: parsed.key,
          value: parsed.value,
          type: "text"
        };
      }),
      url: {
        raw: `{{oracle_saas_host}}/${endpoint}`,
        host: ["{{oracle_saas_host}}"],
        path: pathSegments
      },
      description: playbook?.description || ""
    }
  };

  if (isBodyMethod(method)) {
    postmanItem.request.body = {
      mode: "raw",
      raw: prettyJson(playbook?.sampleRequest || {}),
      options: {
        raw: {
          language: "json"
        }
      }
    };
  }

  return postmanItem;
};

const buildPostmanSnippet = (playbook) =>
  JSON.stringify(buildPostmanItem(playbook), null, 2);

const buildPostmanCollection = (name, playbooks, meta = {}) => {
  const totalItems = Array.isArray(playbooks) ? playbooks.length : 0;
  const filters = [
    meta.suiteFilter && meta.suiteFilter !== "all" ? `suite=${meta.suiteFilter}` : "",
    meta.moduleFilter && meta.moduleFilter !== "all"
      ? `module=${meta.moduleFilter}`
      : "",
    meta.operationFilter && meta.operationFilter !== "all"
      ? `operation=${meta.operationFilter}`
      : "",
    meta.apiQuery ? `query=${meta.apiQuery}` : ""
  ].filter(Boolean);

  return {
    info: {
      name,
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      description: `Generated from Oracle Learning Hub Oracle SaaS REST API Payload Explorer. Includes ${totalItems} operation${
        totalItems === 1 ? "" : "s"
      }${filters.length > 0 ? ` with filters: ${filters.join(", ")}` : ""}.`
    },
    item: (playbooks || []).map((playbook) => buildPostmanItem(playbook)),
    variable: [
      {
        key: "oracle_saas_host",
        value: "your-oracle-saas-host",
        type: "string"
      }
    ]
  };
};

const KnowledgeHubPage = ({ bookmarkState }) => {
  const { isBookmarked, toggleBookmark } = bookmarkState;
  const [topicQuery, setTopicQuery] = useState("");
  const [topicType, setTopicType] = useState("all");
  const [topicLoading, setTopicLoading] = useState(true);
  const [topicError, setTopicError] = useState("");
  const [topicData, setTopicData] = useState({
    totalTopics: 0,
    totalResources: 0,
    grouped: emptyGrouped,
    topics: []
  });
  const [knowledgeQuery, setKnowledgeQuery] = useState("");
  const [knowledgeType, setKnowledgeType] = useState("all");
  const [knowledgeTopic, setKnowledgeTopic] = useState("all");
  const [knowledgeLoading, setKnowledgeLoading] = useState(true);
  const [knowledgeError, setKnowledgeError] = useState("");
  const [knowledgePayload, setKnowledgePayload] = useState({
    items: [],
    facets: { products: [], topics: [], sourceTypes: [], versions: [] }
  });
  const [knowledgeRefreshKey, setKnowledgeRefreshKey] = useState(0);
  const [curatorUrl, setCuratorUrl] = useState("");
  const [curatorLoading, setCuratorLoading] = useState(false);
  const [curatorApproving, setCuratorApproving] = useState(false);
  const [curatorError, setCuratorError] = useState("");
  const [curatorDraft, setCuratorDraft] = useState(null);
  const [curatorSource, setCuratorSource] = useState(null);
  const [curatorMode, setCuratorMode] = useState("");

  const [suiteFilter, setSuiteFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [operationFilter, setOperationFilter] = useState("all");
  const [apiQuery, setApiQuery] = useState("");
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [apiPayload, setApiPayload] = useState({
    playbooks: [],
    facets: {
      suites: [],
      modules: [],
      operations: [],
      suiteModules: {},
      suiteModuleOperations: {}
    }
  });
  const [copiedToken, setCopiedToken] = useState("");
  const [cardModes, setCardModes] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const topicSectionRef = useRef(null);
  const fusionSectionRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadTopics = async () => {
      setTopicLoading(true);
      setTopicError("");

      try {
        const params = {};
        if (topicQuery.trim()) {
          params.q = topicQuery.trim();
        }
        if (topicType !== "all") {
          params.type = topicType;
        }

        const data = await getKnowledgeTopics(params);
        if (!active) {
          return;
        }

        setTopicData({
          totalTopics: data.totalTopics || 0,
          totalResources: data.totalResources || 0,
          grouped: { ...emptyGrouped, ...(data.grouped || {}) },
          topics: data.topics || []
        });
      } catch {
        if (active) {
          setTopicError("Could not load curated topic resources right now.");
        }
      } finally {
        if (active) {
          setTopicLoading(false);
        }
      }
    };

    loadTopics();

    return () => {
      active = false;
    };
  }, [topicQuery, topicType]);

  useEffect(() => {
    let active = true;

    const loadKnowledgeBase = async () => {
      setKnowledgeLoading(true);
      setKnowledgeError("");

      try {
        const params = { limit: 12 };
        if (knowledgeQuery.trim()) {
          params.q = knowledgeQuery.trim();
        }
        if (knowledgeType !== "all") {
          params.sourceType = knowledgeType;
        }
        if (knowledgeTopic !== "all") {
          params.topic = knowledgeTopic;
        }

        const data = await getKnowledgeBaseItems(params);
        if (!active) {
          return;
        }

        setKnowledgePayload({
          items: data.items || [],
          facets:
            data.facets || {
              products: [],
              topics: [],
              sourceTypes: [],
              versions: []
            }
        });
      } catch {
        if (active) {
          setKnowledgeError("Could not load RAG-ready knowledge items right now.");
        }
      } finally {
        if (active) {
          setKnowledgeLoading(false);
        }
      }
    };

    loadKnowledgeBase();

    return () => {
      active = false;
    };
  }, [knowledgeQuery, knowledgeType, knowledgeTopic, knowledgeRefreshKey]);

  useEffect(() => {
    let active = true;

    const loadApis = async () => {
      setApiLoading(true);
      setApiError("");

      try {
        const params = {};
        if (suiteFilter !== "all") {
          params.suite = suiteFilter;
        }
        if (moduleFilter !== "all") {
          params.module = moduleFilter;
        }
        if (operationFilter !== "all") {
          params.operation = operationFilter;
        }
        if (apiQuery.trim()) {
          params.q = apiQuery.trim();
        }

        const data = await getFusionApiPlaybooks(params);
        if (!active) {
          return;
        }

        setApiPayload({
          playbooks: data.playbooks || [],
          facets:
            data.facets || {
              suites: [],
              modules: [],
              operations: [],
              suiteModules: {},
              suiteModuleOperations: {}
            }
        });
      } catch {
        if (active) {
          setApiError("Could not load Oracle SaaS API playbooks right now.");
        }
      } finally {
        if (active) {
          setApiLoading(false);
        }
      }
    };

    loadApis();

    return () => {
      active = false;
    };
  }, [suiteFilter, moduleFilter, operationFilter, apiQuery]);

  const suiteOptions = useMemo(
    () => apiPayload.facets?.suites || [],
    [apiPayload.facets]
  );

  const moduleOptions = useMemo(() => {
    const suiteModules = apiPayload.facets?.suiteModules || {};
    if (suiteFilter !== "all") {
      return suiteModules[suiteFilter] || [];
    }
    return apiPayload.facets?.modules || [];
  }, [apiPayload.facets, suiteFilter]);

  const getModuleOperationCount = (moduleName) => {
    const operationMap = apiPayload.facets?.suiteModuleOperations || {};

    if (suiteFilter !== "all") {
      return operationMap[suiteFilter]?.[moduleName]?.length || 0;
    }

    return Object.values(operationMap).reduce(
      (total, moduleMap) => total + (moduleMap[moduleName]?.length || 0),
      0
    );
  };

  const operationOptions = useMemo(() => {
    const operationMap = apiPayload.facets?.suiteModuleOperations || {};

    if (suiteFilter !== "all" && moduleFilter !== "all") {
      return operationMap[suiteFilter]?.[moduleFilter] || [];
    }

    if (suiteFilter !== "all") {
      const suiteOperations = Object.values(operationMap[suiteFilter] || {}).flat();
      return [...new Set(suiteOperations)].sort();
    }

    if (moduleFilter !== "all") {
      const moduleOperations = Object.values(operationMap).flatMap(
        (moduleMap) => moduleMap[moduleFilter] || []
      );
      return [...new Set(moduleOperations)].sort();
    }

    return apiPayload.facets?.operations || [];
  }, [apiPayload.facets, moduleFilter, suiteFilter]);

  const knowledgeTopicOptions = useMemo(
    () => knowledgePayload.facets?.topics || [],
    [knowledgePayload.facets]
  );

  const knowledgeTypeOptions = useMemo(
    () => knowledgePayload.facets?.sourceTypes || [],
    [knowledgePayload.facets]
  );

  const suiteModuleCoverage = useMemo(() => {
    const suiteModules = apiPayload.facets?.suiteModules || {};
    return Object.entries(suiteModules).sort(([left], [right]) =>
      left.localeCompare(right)
    );
  }, [apiPayload.facets]);

  const postmanCollectionName = useMemo(() => {
    const parts = ["Oracle Learning Hub - Oracle SaaS APIs"];
    if (suiteFilter !== "all") {
      parts.push(`Suite ${suiteFilter}`);
    }
    if (moduleFilter !== "all") {
      parts.push(`Module ${moduleFilter}`);
    }
    if (operationFilter !== "all") {
      parts.push(`Operation ${operationFilter}`);
    }
    if (apiQuery.trim()) {
      parts.push(`Search ${apiQuery.trim()}`);
    }
    return parts.join(" | ");
  }, [suiteFilter, moduleFilter, operationFilter, apiQuery]);

  const markCopied = (token) => {
    setCopiedToken(token);
    window.setTimeout(() => {
      setCopiedToken((current) => (current === token ? "" : current));
    }, 1400);
  };

  const copyTextWithToken = async (token, text) => {
    const success = await copyToClipboard(text);
    if (success) {
      markCopied(token);
    }
  };

  const copyLabel = (token, label) => (copiedToken === token ? "Copied" : label);

  const setCardMode = (playbookId, mode) => {
    setCardModes((current) => ({
      ...current,
      [playbookId]: mode
    }));
  };

  const getCardMode = (playbookId) => cardModes[playbookId] || "payloads";

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((current) => (current === message ? "" : current));
    }, 1800);
  };

  const jumpToSection = (sectionRef) => {
    sectionRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const updateCuratorDraft = (field, value) => {
    setCuratorDraft((current) => ({
      ...(current || {}),
      [field]: value
    }));
  };

  const handleAnalyzeKnowledgeUrl = async (event) => {
    event.preventDefault();
    const url = curatorUrl.trim();
    if (!url) {
      setCuratorError("Paste an Oracle doc, blog, YouTube, GitHub, or lab URL first.");
      return;
    }

    setCuratorLoading(true);
    setCuratorError("");

    try {
      const data = await analyzeKnowledgeUrl({ url });
      setCuratorDraft(data.draft || null);
      setCuratorSource(data.sourceContent || null);
      setCuratorMode(data.mode || "");
      showToast(
        data.mode === "openai"
          ? "AI draft generated from source."
          : "Draft generated with fallback extraction."
      );
    } catch {
      setCuratorError("Could not analyze this URL. Try another source URL or check backend logs.");
    } finally {
      setCuratorLoading(false);
    }
  };

  const handleApproveKnowledgeDraft = async () => {
    if (!curatorDraft) {
      return;
    }

    setCuratorApproving(true);
    setCuratorError("");

    try {
      const data = await approveKnowledgeDraft({ draft: curatorDraft });
      const approvedItem = data.item || curatorDraft;
      setCuratorDraft(null);
      setCuratorSource(null);
      setCuratorUrl("");
      setCuratorMode("");
      setKnowledgeQuery(approvedItem.title || approvedItem.topic || "");
      setKnowledgeRefreshKey((current) => current + 1);
      showToast("Approved and published to Knowledge Base.");
    } catch {
      setCuratorError("Could not approve this draft. Please review required fields.");
    } finally {
      setCuratorApproving(false);
    }
  };

  const downloadFilteredCollection = () => {
    const playbookCount = apiPayload.playbooks.length;
    const collection = buildPostmanCollection(
      postmanCollectionName,
      apiPayload.playbooks,
      {
        suiteFilter,
        moduleFilter,
        operationFilter,
        apiQuery: apiQuery.trim()
      }
    );
    const fileName = sanitizeFileName(`${postmanCollectionName}-collection.json`);
    downloadJsonFile(fileName || "postman-collection.json", collection);
    showToast(
      `Downloaded Postman collection with ${playbookCount} API operation${
        playbookCount === 1 ? "" : "s"
      }.`
    );
  };

  return (
    <div className="space-y-10">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-soft">
          {toastMessage}
        </div>
      )}

      <section className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur md:p-8">
        <h1 className="mb-3 font-display text-3xl font-semibold text-slate-900 md:text-4xl">
          Oracle Knowledge Hub
        </h1>
        <p className="max-w-4xl text-sm text-slate-600 md:text-base">
          Backend-curated Oracle links for OIC Gen3, REST Adapter, agentic AI,
          and Fusion/EPM REST. Use dropdown filters to quickly get the exact docs,
          videos, blogs, and payload-ready API references.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => jumpToSection(topicSectionRef)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Browse Topic Suggestions
            <p className="mt-1 text-xs font-medium text-slate-500">
              Explore docs, videos, blogs, and labs quickly.
            </p>
          </button>
          <button
            onClick={() => jumpToSection(fusionSectionRef)}
            className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-left text-sm font-semibold text-indigo-900 transition hover:border-indigo-300 hover:bg-indigo-100"
          >
            Jump to API Payloads
            <p className="mt-1 text-xs font-medium text-indigo-700">
              {apiLoading
                ? "Loading API coverage..."
                : `${apiPayload.facets?.modules?.length || 0} modules and ${
                    apiPayload.facets?.operations?.length || 0
                  } operations ready`}
            </p>
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-slate-50 p-6 shadow-soft md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-3 py-1 text-xs font-semibold text-cyan-700">
              <Sparkles size={14} />
              AI-assisted curator
            </p>
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              Import a URL, let AI draft the KB item
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Paste an Oracle doc, blog, YouTube, GitHub, or lab URL. The backend extracts
              source text, drafts searchable metadata, and lets you approve it into the
              Knowledge Base.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            {curatorMode === "openai"
              ? "OpenAI draft"
              : curatorMode
                ? "Fallback draft"
                : "Review before publish"}
          </span>
        </div>

        <form
          onSubmit={handleAnalyzeKnowledgeUrl}
          className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]"
        >
          <input
            value={curatorUrl}
            onChange={(event) => setCuratorUrl(event.target.value)}
            placeholder="Paste URL, e.g. Oracle EPM REST docs, OIC blog, YouTube tutorial..."
            className="rounded-xl border border-cyan-100 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={curatorLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <Sparkles size={16} />
            {curatorLoading ? "Analyzing..." : "Analyze with AI"}
          </button>
        </form>

        {curatorError && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {curatorError}
          </div>
        )}

        {curatorDraft && (
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    Review AI Draft
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Edit anything if needed, then approve it into the Knowledge Base.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleApproveKnowledgeDraft}
                  disabled={curatorApproving}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  <CheckCircle2 size={16} />
                  {curatorApproving ? "Publishing..." : "Approve & Publish"}
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-slate-500 md:col-span-2">
                  Title
                  <input
                    value={curatorDraft.title || ""}
                    onChange={(event) => updateCuratorDraft("title", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm normal-case tracking-normal text-slate-800 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Product
                  <input
                    value={curatorDraft.product || ""}
                    onChange={(event) => updateCuratorDraft("product", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm normal-case tracking-normal text-slate-800 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Topic
                  <input
                    value={curatorDraft.topic || ""}
                    onChange={(event) => updateCuratorDraft("topic", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm normal-case tracking-normal text-slate-800 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Source Type
                  <select
                    value={curatorDraft.sourceType || "docs"}
                    onChange={(event) => updateCuratorDraft("sourceType", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm normal-case tracking-normal text-slate-800 outline-none focus:border-slate-400"
                  >
                    <option value="docs">docs</option>
                    <option value="videos">videos</option>
                    <option value="blogs">blogs</option>
                    <option value="labs">labs</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Difficulty
                  <select
                    value={curatorDraft.difficulty || "Intermediate"}
                    onChange={(event) => updateCuratorDraft("difficulty", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm normal-case tracking-normal text-slate-800 outline-none focus:border-slate-400"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </label>
                <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-slate-500 md:col-span-2">
                  Summary
                  <textarea
                    value={curatorDraft.summary || ""}
                    onChange={(event) => updateCuratorDraft("summary", event.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm normal-case tracking-normal text-slate-800 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-slate-500 md:col-span-2">
                  Tags (comma separated)
                  <input
                    value={(curatorDraft.tags || []).join(", ")}
                    onChange={(event) =>
                      updateCuratorDraft(
                        "tags",
                        event.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm normal-case tracking-normal text-slate-800 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Technical Signals
                  <textarea
                    value={(curatorDraft.technicalSignals || []).join("\n")}
                    onChange={(event) =>
                      updateCuratorDraft("technicalSignals", linesToArray(event.target.value))
                    }
                    rows={5}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm normal-case tracking-normal text-slate-800 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Quick Steps
                  <textarea
                    value={(curatorDraft.quickSteps || []).join("\n")}
                    onChange={(event) =>
                      updateCuratorDraft("quickSteps", linesToArray(event.target.value))
                    }
                    rows={5}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm normal-case tracking-normal text-slate-800 outline-none focus:border-slate-400"
                  />
                </label>
              </div>
            </div>

            <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Source Evidence
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  The draft is grounded in the text the backend could fetch from the URL.
                </p>
              </div>
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">Mode:</span>{" "}
                  {curatorMode === "openai" ? "OpenAI extraction" : "Fallback extraction"}
                </p>
                <p>
                  <span className="font-semibold">Fetch:</span>{" "}
                  {curatorSource?.fetchStatus || "unknown"} via{" "}
                  {curatorSource?.fetchedFrom || "source"}
                </p>
                {curatorSource?.insufficientContent && (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">
                    Source text was limited. Please verify important details before approving.
                  </p>
                )}
              </div>
              {(curatorSource?.groundingSnippets || []).length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-800">Fetched snippets</p>
                  {(curatorSource?.groundingSnippets || []).slice(0, 5).map((snippet) => (
                    <p key={snippet} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                      {snippet}
                    </p>
                  ))}
                </div>
              )}
              <a
                href={curatorDraft.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-slate-950"
              >
                <Link2 size={14} />
                Open original source
              </a>
            </aside>
          </div>
        )}
      </section>

      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
              <Database size={21} />
              RAG-ready OIC Knowledge Base
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Search indexed OIC docs, videos, blogs, and labs with source metadata.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            {knowledgeLoading
              ? "Index loading"
              : `${knowledgePayload.items.length} matched item${
                  knowledgePayload.items.length === 1 ? "" : "s"
                }`}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_180px_220px]">
          <label className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={knowledgeQuery}
              onChange={(event) => setKnowledgeQuery(event.target.value)}
              placeholder="Ask OIC technical question, REST Adapter, agentic AI, connectivity..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
            />
          </label>

          <select
            value={knowledgeType}
            onChange={(event) => setKnowledgeType(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
          >
            <option value="all">All sources</option>
            {knowledgeTypeOptions.map((sourceType) => (
              <option key={sourceType} value={sourceType}>
                {sourceType}
              </option>
            ))}
          </select>

          <select
            value={knowledgeTopic}
            onChange={(event) => setKnowledgeTopic(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
          >
            <option value="all">All OIC topics</option>
            {knowledgeTopicOptions.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {knowledgeError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {knowledgeError}
          </div>
        )}

        {knowledgeLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Loading knowledge index...
          </div>
        ) : knowledgePayload.items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            No indexed source matched this query. Try broader OIC keywords.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {knowledgePayload.items.map((item) => (
              <article
                key={item.id}
                className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase text-white">
                    {item.sourceType}
                  </span>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                    {item.topic}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    Score {item.matchScore}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
                </div>

                {item.technicalSignals?.length > 0 && (
                  <ul className="space-y-1 text-sm text-slate-700">
                    {item.technicalSignals.slice(0, 2).map((signal) => (
                      <li key={signal} className="rounded-lg bg-white px-3 py-2">
                        {signal}
                      </li>
                    ))}
                  </ul>
                )}

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-slate-950"
                >
                  <Link2 size={14} />
                  Open source
                </a>
              </article>
            ))}
          </div>
        )}
      </section>

      <section
        ref={topicSectionRef}
        className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8"
      >
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            Topic Explorer (Manual Backend URLs)
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            These links are manually curated in backend by topic so results stay focused.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={topicQuery}
            onChange={(event) => setTopicQuery(event.target.value)}
            placeholder="Search topic like OIC Gen3, REST Adapter, Fusion/EPM REST..."
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
          />
          <select
            value={topicType}
            onChange={(event) => setTopicType(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
          >
            <option value="all">All resource types</option>
            <option value="docs">Docs</option>
            <option value="videos">Videos</option>
            <option value="blogs">Blogs</option>
            <option value="labs">Labs</option>
          </select>
        </div>

        {topicError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {topicError}
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          {topicLoading
            ? "Loading curated topic resources..."
            : `${topicData.totalResources} resource${
                topicData.totalResources === 1 ? "" : "s"
              } across ${topicData.totalTopics} topic bundle${
                topicData.totalTopics === 1 ? "" : "s"
              }`}
        </div>

        {Object.entries(sectionMeta).map(([key, meta]) => {
          const Icon = meta.icon;
          const items = topicData.grouped[key] || [];
          if (!topicLoading && items.length === 0) {
            return null;
          }

          return (
            <section key={key} className="space-y-4">
              <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-slate-900">
                <Icon size={18} />
                {meta.title}
              </h3>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {items.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    isBookmarked={isBookmarked(resource.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </section>

      <section
        ref={fusionSectionRef}
        className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8"
      >
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            Oracle SaaS REST API Payload Explorer
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Select app suite and module (for example ERP + AP or EPM + Planning) to get endpoint,
            Oracle doc link, and ready sample request/response payloads.
          </p>
        </div>

        {!apiLoading && suiteModuleCoverage.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <p className="mb-2 font-semibold text-slate-800">Suite Module Coverage</p>
            <div className="flex flex-wrap gap-2">
              {suiteModuleCoverage.map(([suite, modules]) => (
                <span
                  key={suite}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {suite}: {modules.join(", ")}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <select
            value={suiteFilter}
            onChange={(event) => {
              setSuiteFilter(event.target.value);
              setModuleFilter("all");
              setOperationFilter("all");
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
          >
            <option value="all">All suites</option>
            {suiteOptions.map((suite) => (
              <option key={suite} value={suite}>
                {suite}
              </option>
            ))}
          </select>

          <select
            value={moduleFilter}
            onChange={(event) => {
              setModuleFilter(event.target.value);
              setOperationFilter("all");
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
          >
            <option value="all">All modules</option>
            {moduleOptions.map((module) => (
              <option key={module} value={module}>
                {module} ({getModuleOperationCount(module)} ops)
              </option>
            ))}
          </select>

          <select
            value={operationFilter}
            onChange={(event) => setOperationFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
          >
            <option value="all">All operations</option>
            {operationOptions.map((operation) => (
              <option key={operation} value={operation}>
                {operation}
              </option>
            ))}
          </select>

          <input
            value={apiQuery}
            onChange={(event) => setApiQuery(event.target.value)}
            placeholder="Search payloads..."
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
          />
        </div>

        {apiError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {apiError}
          </div>
        )}

        {!apiLoading && apiPayload.playbooks.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm text-slate-700">
              {apiPayload.playbooks.length} API playbook
              {apiPayload.playbooks.length === 1 ? "" : "s"} in this filtered view.
            </p>
            <button
              onClick={downloadFilteredCollection}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
            >
              <Download size={13} />
              Download Postman Collection ({apiPayload.playbooks.length})
            </button>
          </div>
        )}

        {apiLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Loading Oracle SaaS API playbooks...
          </div>
        ) : apiPayload.playbooks.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            No playbooks matched this filter. Try broader filters.
          </div>
        ) : (
          <div className="space-y-5">
            {apiPayload.playbooks.map((playbook) => {
              const requestJsonText = prettyJson(playbook.sampleRequest);
              const responseJsonText = prettyJson(playbook.sampleResponse);
              const curlSnippet = buildCurlSnippet(playbook);
              const postmanSnippet = buildPostmanSnippet(playbook);
              const tokenBase = playbook.id;
              const mode = getCardMode(playbook.id);

              return (
                <article
                  key={playbook.id}
                  className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        {playbook.suite}
                      </span>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {playbook.module}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {playbook.method}
                      </span>
                    </div>

                    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
                      <button
                        onClick={() => setCardMode(playbook.id, "payloads")}
                        className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                          mode === "payloads"
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Payloads
                      </button>
                      <button
                        onClick={() => setCardMode(playbook.id, "snippets")}
                        className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                          mode === "snippets"
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Dev Snippets
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-semibold text-slate-900">
                      {playbook.operation}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{playbook.description}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Endpoint
                    </p>
                    <code className="break-all">{playbook.endpoint}</code>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <a
                      href={playbook.docLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-slate-800 hover:text-slate-950"
                    >
                      <Link2 size={14} />
                      Open Oracle Doc
                    </a>
                  </div>

                  {mode === "payloads" ? (
                    <div className="grid gap-4 xl:grid-cols-2">
                      <div className="space-y-2">
                        <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
                          <Terminal size={14} />
                          Sample Request Payload
                        </p>
                        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-slate-100">
                          <code>{requestJsonText}</code>
                        </pre>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              copyTextWithToken(`${tokenBase}-req-copy`, requestJsonText)
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                          >
                            <Copy size={13} />
                            {copyLabel(`${tokenBase}-req-copy`, "Copy Payload")}
                          </button>
                          <button
                            onClick={() => {
                              downloadJsonFile(
                                `${sanitizeFileName(playbook.id)}-request.json`,
                                playbook.sampleRequest || {}
                              );
                              showToast("Request payload downloaded.");
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                          >
                            <Download size={13} />
                            Download JSON
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
                          <Terminal size={14} />
                          Sample Response
                        </p>
                        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-slate-100">
                          <code>{responseJsonText}</code>
                        </pre>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              copyTextWithToken(`${tokenBase}-res-copy`, responseJsonText)
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                          >
                            <Copy size={13} />
                            {copyLabel(`${tokenBase}-res-copy`, "Copy Payload")}
                          </button>
                          <button
                            onClick={() => {
                              downloadJsonFile(
                                `${sanitizeFileName(playbook.id)}-response.json`,
                                playbook.sampleResponse || {}
                              );
                              showToast("Response payload downloaded.");
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                          >
                            <Download size={13} />
                            Download JSON
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 xl:grid-cols-2">
                      <div className="space-y-2">
                        <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
                          <Terminal size={14} />
                          cURL Snippet
                        </p>
                        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-slate-100">
                          <code>{curlSnippet}</code>
                        </pre>
                        <button
                          onClick={() =>
                            copyTextWithToken(`${tokenBase}-curl-copy`, curlSnippet)
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                        >
                          <Copy size={13} />
                          {copyLabel(`${tokenBase}-curl-copy`, "Copy cURL Snippet")}
                        </button>
                      </div>

                      <div className="space-y-2">
                        <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
                          <Terminal size={14} />
                          Postman Item JSON
                        </p>
                        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-slate-100">
                          <code>{postmanSnippet}</code>
                        </pre>
                        <button
                          onClick={() =>
                            copyTextWithToken(`${tokenBase}-postman-copy`, postmanSnippet)
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300"
                        >
                          <Copy size={13} />
                          {copyLabel(`${tokenBase}-postman-copy`, "Copy Postman Item")}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-800">Required Headers</p>
                    <ul className="space-y-1 text-sm text-slate-600">
                      {(playbook.requiredHeaders || []).map((header) => (
                        <li key={header} className="rounded-lg bg-white px-3 py-2">
                          {header}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <details className="rounded-xl border border-slate-200 bg-white p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                      Implementation Tips
                    </summary>
                    <ul className="mt-3 space-y-1 text-sm text-slate-600">
                      {(playbook.tips || []).map((tip) => (
                        <li key={tip} className="rounded-lg bg-slate-50 px-3 py-2">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </details>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <button
        onClick={() => jumpToSection(fusionSectionRef)}
        className="fixed bottom-20 right-5 z-40 rounded-full border border-indigo-200 bg-white/95 px-4 py-2 text-xs font-semibold text-indigo-700 shadow-soft backdrop-blur transition hover:border-indigo-300 hover:bg-indigo-50"
      >
        API Payloads
      </button>
    </div>
  );
};

export default KnowledgeHubPage;
