import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  FlaskConical,
  Newspaper,
  PlayCircle
} from "lucide-react";
import { API_BASE_URL } from "../api/client";

const difficultyStyles = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700",
  "All Levels": "bg-slate-100 text-slate-700"
};

const typeIcon = {
  docs: BookOpen,
  videos: PlayCircle,
  blogs: Newspaper,
  labs: FlaskConical
};

const typeLabel = {
  docs: "Docs",
  videos: "Videos",
  blogs: "Blogs",
  labs: "Labs"
};

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

const resolveYoutubeWatchLink = (link, youtubeId) => {
  if (YOUTUBE_ID_PATTERN.test(youtubeId || "")) {
    return `https://www.youtube.com/watch?v=${youtubeId}`;
  }

  if (!link) {
    return "";
  }

  try {
    const parsed = new URL(link);
    const host = parsed.hostname.toLowerCase();

    let id = "";
    if (host.includes("youtu.be")) {
      id = parsed.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        id = parsed.searchParams.get("v") || "";
      } else {
        const pathMatch = parsed.pathname.match(
          /^\/(?:shorts|embed|live)\/([a-zA-Z0-9_-]{11})/
        );
        id = pathMatch?.[1] || "";
      }
    }

    return YOUTUBE_ID_PATTERN.test(id)
      ? `https://www.youtube.com/watch?v=${id}`
      : "";
  } catch {
    return "";
  }
};

const getExternalActionLabel = (resourceType, hasPlayableVideo) => {
  if (resourceType === "videos") {
    return hasPlayableVideo ? "Watch Video" : "Find Video";
  }

  if (resourceType === "docs") {
    return "Read Doc";
  }

  if (resourceType === "blogs") {
    return "Read Blog";
  }

  if (resourceType === "labs") {
    return "Open Lab";
  }

  return "Open Result";
};

const buildYoutubeResolverUrl = (videoUrl, title) => {
  const params = new URLSearchParams();
  params.set("videoUrl", videoUrl || "");
  params.set("title", title || "Oracle tutorial");
  return `${API_BASE_URL}/resolve/youtube?${params.toString()}`;
};

const ResourceCard = ({ resource, isBookmarked, onToggleBookmark }) => {
  const Icon = typeIcon[resource.type] || BookOpen;
  const isInternalResource =
    typeof resource.id === "string" && resource.id.startsWith("res-");
  const isYoutubeResource =
    resource.type === "videos" &&
    (resource.source === "YouTube" ||
      resource.link?.includes("youtube.com") ||
      resource.link?.includes("youtu.be"));
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${resource.title} Oracle`
  )}`;
  const youtubeResolverUrl = buildYoutubeResolverUrl(resource.link, resource.title);
  const watchVideoHref = isYoutubeResource
    ? resolveYoutubeWatchLink(resource.link, resource.youtubeId)
    : "";
  const openResultHref = isYoutubeResource
    ? youtubeResolverUrl || watchVideoHref || youtubeSearchUrl
    : resource.link;
  const openResultLabel = getExternalActionLabel(resource.type, Boolean(watchVideoHref));
  const internalSecondaryHref = isYoutubeResource ? openResultHref : resource.link;
  const internalSecondaryLabel = isYoutubeResource
    ? watchVideoHref
      ? "Watch on YouTube"
      : "Find on YouTube"
    : "Open Source";
  const showExternalYoutubeFallback = !isInternalResource && isYoutubeResource;

  return (
    <article className="group animate-rise rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-hover">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          <Icon size={13} />
          {typeLabel[resource.type] || "Resource"}
        </span>

        <button
          onClick={() => onToggleBookmark(resource.id)}
          className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
          aria-label={`${
            isBookmarked ? "Remove bookmark for" : "Bookmark"
          } ${resource.title}`}
        >
          {isBookmarked ? (
            <BookmarkCheck size={16} className="text-emerald-600" />
          ) : (
            <Bookmark size={16} />
          )}
        </button>
      </div>

      <h3 className="mb-2 font-display text-lg font-semibold text-slate-900">
        {resource.title}
      </h3>
      <p className="mb-4 text-sm text-slate-600">{resource.description}</p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {resource.source}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            difficultyStyles[resource.difficulty] || "bg-slate-100 text-slate-700"
          }`}
        >
          {resource.difficulty}
        </span>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
          {resource.category}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        {isInternalResource ? (
          <Link
            to={`/resource/${resource.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 transition group-hover:text-slate-950"
          >
            View Details
            <ArrowUpRight size={15} />
          </Link>
        ) : (
          <a
            href={openResultHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 transition group-hover:text-slate-950"
          >
            {openResultLabel}
            <ArrowUpRight size={15} />
          </a>
        )}

        {isInternalResource && internalSecondaryHref && (
          <a
            href={internalSecondaryHref}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
          >
            {internalSecondaryLabel}
          </a>
        )}

        {showExternalYoutubeFallback && (
          <a
            href={youtubeSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
          >
            Find on YouTube
          </a>
        )}
      </div>
    </article>
  );
};

export default ResourceCard;
