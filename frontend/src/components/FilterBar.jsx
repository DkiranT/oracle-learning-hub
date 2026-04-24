const FilterBar = ({
  level,
  type,
  sort,
  onLevelChange,
  onTypeChange,
  onSortChange
}) => {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-3">
      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
        Filter by level
        <select
          value={level}
          onChange={(event) => onLevelChange(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
        >
          <option value="all">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
        Filter by content type
        <select
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
        >
          <option value="all">All types</option>
          <option value="docs">Docs</option>
          <option value="videos">Videos</option>
          <option value="blogs">Blogs</option>
          <option value="labs">Labs</option>
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
        Sort results
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
        >
          <option value="relevance">Relevance</option>
          <option value="title_asc">Title (A-Z)</option>
          <option value="title_desc">Title (Z-A)</option>
          <option value="difficulty_asc">Difficulty (Easy to Hard)</option>
          <option value="difficulty_desc">Difficulty (Hard to Easy)</option>
          <option value="source_asc">Source (A-Z)</option>
          <option value="source_desc">Source (Z-A)</option>
        </select>
      </label>
    </div>
  );
};

export default FilterBar;
