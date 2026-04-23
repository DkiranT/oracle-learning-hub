import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookOpen, FlaskConical, PlayCircle } from "lucide-react";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import ResourceCard from "../components/ResourceCard";
import { searchResources } from "../api/client";

const sectionMeta = {
  docs: {
    title: "Docs",
    icon: BookOpen
  },
  videos: {
    title: "Videos",
    icon: PlayCircle
  },
  labs: {
    title: "Labs",
    icon: FlaskConical
  }
};

const SearchResultsPage = ({ bookmarkState }) => {
  const { isBookmarked, toggleBookmark } = bookmarkState;
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [grouped, setGrouped] = useState({
    docs: [],
    videos: [],
    labs: []
  });
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1
  });

  const query = searchParams.get("q") || "";
  const level = searchParams.get("level") || "all";
  const type = searchParams.get("type") || "all";
  const sort = searchParams.get("sort") || "relevance";
  const page = Number.parseInt(searchParams.get("page") || "1", 10) || 1;
  const limit = Number.parseInt(searchParams.get("limit") || "9", 10) || 9;
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? limit : 9;

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

        const response = await searchResources(payload);

        if (!active) {
          return;
        }

        setMeta({
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || safeLimit,
          totalPages: response.totalPages || 1
        });

        setGrouped(
          response.grouped || {
            docs: [],
            videos: [],
            labs: []
          }
        );
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
  }, [query, level, type, sort, safePage, safeLimit]);

  const totalCount = useMemo(() => meta.total || 0, [meta.total]);

  const updateParams = (updates, options = {}) => {
    const { resetPage = false } = options;
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        !value ||
        value === "all" ||
        (key === "sort" && value === "relevance") ||
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
          Explore curated docs, videos, and labs with smart filters.
        </p>
        <SearchBar
          initialValue={query}
          placeholder="What do you want to learn?"
          onSearch={(value) => updateParams({ q: value }, { resetPage: true })}
        />
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

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-soft">
        {loading
          ? "Searching curated Oracle resources..."
          : `${totalCount} result${totalCount === 1 ? "" : "s"} found ${
              query ? `for "${query}"` : ""
            } | Page ${meta.page} of ${meta.totalPages}`}
      </div>

      {!loading && totalCount === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft">
          <h2 className="mb-2 font-display text-2xl font-semibold text-slate-900">
            No results yet
          </h2>
          <p className="text-slate-600">
            Try a broader keyword like OCI, DevOps, Streaming, or Autonomous DB.
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
