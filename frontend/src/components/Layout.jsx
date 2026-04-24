import { Link, NavLink } from "react-router-dom";
import { Bookmark, GraduationCap } from "lucide-react";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-slate-900 text-white shadow-soft"
      : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
  }`;

const Layout = ({ children, bookmarkedCount }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-cyan-100/70 blur-3xl" />
        <div className="absolute right-0 top-48 h-64 w-64 rounded-full bg-orange-100/80 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/60 glass-surface">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900"
          >
            <GraduationCap size={22} />
            Oracle Learning Hub
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/search" className={navClass}>
              Search
            </NavLink>
            <NavLink to="/learning-paths" className={navClass}>
              Learning Paths
            </NavLink>
            <NavLink to="/knowledge-hub" className={navClass}>
              Knowledge Hub
            </NavLink>
          </nav>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-soft">
            <Bookmark size={16} />
            {bookmarkedCount} saved
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12">
        {children}
      </main>
    </div>
  );
};

export default Layout;
