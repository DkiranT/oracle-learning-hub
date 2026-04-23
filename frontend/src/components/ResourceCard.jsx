import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  FlaskConical,
  PlayCircle
} from "lucide-react";

const difficultyStyles = {
  Beginner: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-rose-50 text-rose-700"
};

const typeIcon = {
  docs: BookOpen,
  videos: PlayCircle,
  labs: FlaskConical
};

const typeLabel = {
  docs: "Docs",
  videos: "Videos",
  labs: "Labs"
};

const ResourceCard = ({ resource, isBookmarked, onToggleBookmark }) => {
  const Icon = typeIcon[resource.type] || BookOpen;
  const isYoutubeResource =
    resource.type === "videos" &&
    (resource.source === "YouTube" || resource.link?.includes("youtube.com"));
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${resource.title} Oracle`
  )}`;
  const secondaryActionHref = isYoutubeResource ? youtubeSearchUrl : resource.link;
  const secondaryActionLabel = isYoutubeResource
    ? "Find on YouTube"
    : "Open Source";

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
        <Link
          to={`/resource/${resource.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 transition group-hover:text-slate-950"
        >
          View Details
          <ArrowUpRight size={15} />
        </Link>
        <a
          href={secondaryActionHref}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
        >
          {secondaryActionLabel}
        </a>
      </div>
    </article>
  );
};

export default ResourceCard;
