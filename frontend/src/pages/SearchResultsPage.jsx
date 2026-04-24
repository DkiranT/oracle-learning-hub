import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookOpen,
  FlaskConical,
  Globe,
  Library,
  Newspaper,
  PlayCircle
} from "lucide-react";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import ResourceCard from "../components/ResourceCard";
import { searchResources, searchWebResources } from "../api/client";

const sectionMeta = {
  docs: {
    title: "Docs",
    icon: BookOpen
  },
  videos: {
    title: "Videos",
    icon: PlayCircle
  },
  blogs: {
    title: "Blogs",
    icon: Newspaper
  },
  labs: {
    title: "Labs",
    icon: FlaskConical
  }
};

const emptyGrouped = {
  docs: [],
  videos: [],
  blogs: [],
  labs: []
};

const SearchResultsPage = ({ bookmarkState }) => {
  const { isBookmarked, toggleBookmark } = bookmarkState;
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [grouped, setGrouped] = useState(emptyGrouped);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
    provider: "curated",
    message: "",
    failedSources: []
  });

  const query = searchParams.get("q") || "";
  const level = searchParams.get("level") || "all";
  const type = searchParams.get("type") || "all";
  const sort = searchParams.get("sort") || "relevance";
  const scope = searchParams.get("scope") || "web";
  const page = Number.parseInt(searchParams.get("page") || "1", 10) || 1;
  const limit = Number.parseInt(searchParams.get("limit") || "9", 10) || 9;
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? limit : 9;
  const isWebScope = scope === "web";

  useEffect(() => {
    let active = true;

    const runSearch = async () => {
      setLoading(true);
      setError("");

      try {
        const payload = {
          q: query,
          sort,
          page: safePage,
          limit: safeLimit
        };

        if (level !== "all") {
          payload.level = level;
        }

        if (type !== "all") {
          payload.type = type;
        }

        const response =
          scope === "web"
            ? await searchWebResources(payload)
            : await searchResources(payload);

        if (!active) {
          return;
        }

        setMeta({
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || safeLimit,
          totalPages: response.totalPages || 1,
          provider: response.provider || (scope === "web" ? "duckduckgo" : "curated"),
          message: response.message || "",
          failedSources: Array.isArray(response.failedSources)
            ? response.failedSources
            : []
        });

        setGrouped({
          ...emptyGrouped,
          ...(response.grouped || {})
        });
      } catch {
        if (active) {
          setError("Search failed. Please check backend server and try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    runSearch();

    return () => {
      active = false;
    };
  }, [query, level, type, sort, scope, safePage, safeLimit]);

  const totalCount = useMemo(() => meta.total || 0, [meta.total]);

  const updateParams = (updates, options = {}) => {
    const { resetPage = false } = options;
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        !value ||
        value === "all" ||
        (key === "sort" && value === "relevance") ||
        (key === "scope" && value === "web") ||
        (key === "page" && Number(value) <= 1) ||
        (key === "limit" && Number(value) === 9)
      ) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    if (resetPage) {
      next.delete("page");
    }

    setSearchParams(next);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur md:p-8">
        <h1 className="mb-2 font-display text-3xl font-semibold text-slate-900">
          Search Oracle resources
        </h1>
        <p className="mb-5 text-sm text-slate-600 md:text-base">
          Search Oracle docs, blogs, videos, and labs across curated and live web
          sources.
        </p>
        <SearchBar
          initialValue={query}
          placeholder="Search OCI, OIC, REST adapter, Agentic AI, Oracle blogs..."
          onSearch={(value) => updateParams({ q: value }, { resetPage: true })}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => updateParams({ scope: "web" }, { resetPage: true })}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isWebScope
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <Globe size={15} />
            Web Search (Oracle Ecosystem)
          </button>
          <button
            onClick={() => updateParams({ scope: "curated" }, { resetPage: true })}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              !isWebScope
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <Library size={15} />
            Curated Library
          </button>
        </div>
      </section>

      <FilterBar
        level={level}
        type={type}
        sort={sort}
        onLevelChange={(value) => updateParams({ level: value }, { resetPage: true })}
        onTypeChange={(value) => updateParams({ type: value }, { resetPage: true })}
        onSortChange={(value) => updateParams({ sort: value }, { resetPage: true })}
      />

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {meta.message && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-700">
          {meta.message}
        </div>
      )}

      {!loading && meta.failedSources.length > 0 && isWebScope && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-soft">
          Some live sources were unavailable in this request:{" "}
          <span className="font-semibold">{meta.failedSources.join(", ")}</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-soft">
        {loading
          ? "Searching Oracle resources..."
          : `${totalCount} result${totalCount === 1 ? "" : "s"} found ${
              query ? `for "${query}"` : ""
            } | Page ${meta.page} of ${meta.totalPages} | Mode: ${
              isWebScope ? "Web Search" : "Curated Library"
            }`}
      </div>

      {!loading && totalCount === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft">
          <h2 className="mb-2 font-display text-2xl font-semibold text-slate-900">
            No results yet
          </h2>
          <p className="text-slate-600">
            Try broader keywords like OIC, REST adapter, Agentic AI, Oracle
            blogs, OCI DevOps, or Kubernetes.
          </p>
        </div>
      )}

      {Object.entries(sectionMeta).map(([key, section]) => {
        const Icon = section.icon;
        const items = grouped[key] || [];

        if (type !== "all" && type !== key) {
          return null;
        }

        if (!loading && items.length === 0) {
          return null;
        }

        return (
          <section key={key} className="space-y-4">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
              <Icon size={20} />
              {section.title}
            </h2>
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

      {!loading && totalCount > 0 && meta.totalPages > 1 && (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm font-medium text-slate-700">
            Showing page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateParams({ page: Math.max(1, meta.page - 1).toString() })}
              disabled={meta.page <= 1}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition enabled:hover:border-slate-300 enabled:hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Previous
            </button>
            <button
              onClick={() =>
                updateParams({
                  page: Math.min(meta.totalPages, meta.page + 1).toString()
                })
              }
              disabled={meta.page >= meta.totalPages}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition enabled:hover:border-slate-300 enabled:hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResultsPage;
