import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-soft">
      <h1 className="mb-3 font-display text-3xl font-semibold text-slate-900">
        Page not found
      </h1>
      <p className="mb-5 text-sm text-slate-600">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        Back to home
      </Link>
    </div>
  );
};

export default NotFoundPage;
