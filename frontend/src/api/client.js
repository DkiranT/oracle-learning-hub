export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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

export const getFusionApiPlaybooks = (params = {}) =>
  fetchJson("/knowledge/apis", params);
