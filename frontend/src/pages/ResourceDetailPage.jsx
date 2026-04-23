import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Bookmark, BookmarkCheck, LinkIcon } from "lucide-react";
import ResourceCard from "../components/ResourceCard";
import { getResourceById } from "../api/client";

const getYoutubeIdFromLink = (link) => {
  if (!link) {
    return "";
  }

  try {
    const parsed = new URL(link);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }

    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v") || "";
    }
  } catch {
    return "";
  }

  return "";
};

const ResourceDetailPage = ({ bookmarkState }) => {
  const { id } = useParams();
  const { isBookmarked, toggleBookmark } = bookmarkState;
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    let active = true;

    const loadResource = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getResourceById(id);
        if (active) {
          setResource(result);
        }
      } catch {
        if (active) {
          setError("Resource not found or backend is unavailable.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadResource();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    setShowEmbed(false);
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600 shadow-soft">
        Loading resource details...
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="space-y-4 rounded-2xl border border-rose-200 bg-white p-8 shadow-soft">
        <h1 className="font-display text-2xl font-semibold text-rose-700">
          Unable to load resource
        </h1>
        <p className="text-sm text-slate-600">
          {error || "This resource could not be found."}
        </p>
        <Link
          to="/search"
          className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to Search
        </Link>
      </div>
    );
  }

  const isYoutubeResource =
    resource.type === "videos" &&
    (resource.source === "YouTube" || resource.link?.includes("youtube.com"));
  const youtubeId = resource.youtubeId || getYoutubeIdFromLink(resource.link);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${resource.title} Oracle`
  )}`;
  const primaryCtaHref = isYoutubeResource ? youtubeSearchUrl : resource.link;
  const primaryCtaLabel = isYoutubeResource
    ? "Find on YouTube"
    : "Open Original Content";

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur md:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {resource.type}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {resource.difficulty}
          </span>
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
            {resource.category}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {resource.duration}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="mb-3 font-display text-3xl font-semibold text-slate-900 md:text-4xl">
              {resource.title}
            </h1>
            <p className="text-base text-slate-600">{resource.description}</p>
          </div>

          <button
            onClick={() => toggleBookmark(resource.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-soft transition hover:-translate-y-0.5 hover:text-slate-950"
          >
            {isBookmarked(resource.id) ? (
              <>
                <BookmarkCheck size={16} className="text-emerald-600" />
                Bookmarked
              </>
            ) : (
              <>
                <Bookmark size={16} />
                Save Resource
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={primaryCtaHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            <LinkIcon size={14} />
            {primaryCtaLabel}
          </a>
          {isYoutubeResource && (
            <a
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Open Curated Video Link
            </a>
          )}
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Source: {resource.source}
          </span>
        </div>
      </section>

      {isYoutubeResource && (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-soft md:p-6">
          <h2 className="mb-4 font-display text-2xl font-semibold text-slate-900">
            Video Preview
          </h2>
          <p className="mb-4 text-sm text-slate-600">
            Some YouTube videos block embedded playback. If preview does not work,
            use "Find on YouTube" above.
          </p>
          {!showEmbed && (
            <button
              onClick={() => setShowEmbed(true)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Try Embedded Preview
            </button>
          )}
          {showEmbed && youtubeId && (
            <div className="mt-4 aspect-video overflow-hidden rounded-2xl">
              <iframe
                title={resource.title}
                src={`https://www.youtube.com/embed/${youtubeId}`}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          {showEmbed && !youtubeId && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              Embedded preview is unavailable for this link. Use "Find on YouTube" instead.
            </div>
          )}
        </section>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="mb-3 font-display text-2xl font-semibold text-slate-900">
          Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="mb-3 font-display text-2xl font-semibold text-slate-900">
          Suggested Learning Paths
        </h2>
        {resource.pathSuggestions.length === 0 ? (
          <p className="text-sm text-slate-600">
            No linked learning path yet for this resource.
          </p>
        ) : (
          <div className="space-y-3">
            {resource.pathSuggestions.map((path) => (
              <Link
                key={path.id}
                to={`/learning-paths#${path.id}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 text-sm transition hover:bg-slate-50"
              >
                <div>
                  <p className="font-semibold text-slate-900">{path.title}</p>
                  <p className="text-xs text-slate-600">{path.level}</p>
                </div>
                <ArrowUpRight size={15} className="text-slate-500" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          Related Resources
        </h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(resource.relatedResources || []).map((item) => (
            <ResourceCard
              key={item.id}
              resource={item}
              isBookmarked={isBookmarked(item.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResourceDetailPage;
