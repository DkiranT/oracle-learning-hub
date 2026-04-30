const PROD_FALLBACK_API_BASE_URL = "https://oracle-learning-hub.onrender.com";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? PROD_FALLBACK_API_BASE_URL : "http://localhost:5000");

const buildQueryString = (params = {}) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    search.set(key, value);
  });

  const query = search.toString();
  return query ? `?${query}` : "";
};

const fetchJson = async (path, params) => {
  const query = buildQueryString(params);
  const response = await fetch(`${API_BASE_URL}${path}${query}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

const postJson = async (path, payload = {}, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

export const getResources = async (params = {}) => {
  const data = await fetchJson("/resources", params);
  return data.resources || [];
};

export const getResourceById = (id) => fetchJson(`/resources/${id}`);

export const searchResources = (params = {}) => fetchJson("/search", params);

export const searchWebResources = (params = {}) => fetchJson("/search/web", params);

export const getLearningPaths = async () => {
  const data = await fetchJson("/learning-paths");
  return data.learningPaths || [];
};

export const getRecommendations = async (params = {}) => {
  const data = await fetchJson("/recommendations", params);
  return data.recommendations || [];
};

export const getKnowledgeTopics = (params = {}) =>
  fetchJson("/knowledge/topics", params);

export const getKnowledgeBaseItems = (params = {}) =>
  fetchJson("/knowledge/base", params);

export const getFusionApiPlaybooks = (params = {}) =>
  fetchJson("/knowledge/apis", params);

export const analyzeKnowledgeUrl = (payload = {}, adminKey = "") =>
  postJson("/knowledge/curate/analyze", payload, {
    headers: adminKey ? { "X-Admin-Key": adminKey } : {}
  });

export const approveKnowledgeDraft = (payload = {}, adminKey = "") =>
  postJson("/knowledge/curate/approve", payload, {
    headers: adminKey ? { "X-Admin-Key": adminKey } : {}
  });

export const summarizeResourceById = (id, payload = {}) =>
  postJson(`/resources/${id}/summary`, payload);

export const buildResourceResolverUrl = (resource = {}) => {
  const params = new URLSearchParams();
  params.set("url", resource.link || "");
  params.set("title", resource.title || "Oracle learning resource");
  params.set("type", resource.type || "");
  params.set("source", resource.source || "");
  return `${API_BASE_URL}/resolve/resource?${params.toString()}`;
};
