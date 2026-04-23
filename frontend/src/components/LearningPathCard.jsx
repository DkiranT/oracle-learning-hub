import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const LearningPathCard = ({ path }) => {
  return (
    <article
      id={path.id}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-hover"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <Sparkles size={13} />
          Learning Path
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {path.level}
        </span>
      </div>

      <h3 className="mb-2 font-display text-lg font-semibold text-slate-900">
        {path.title}
      </h3>
      <p className="mb-4 text-sm text-slate-600">{path.description}</p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {path.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-700">
          {path.steps?.length || 0} steps
        </span>
        <Link
          to={`/learning-paths#${path.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900"
        >
          Explore
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
};

export default LearningPathCard;
