import { useEffect, useState } from "react";
import { ArrowUpRight, Clock3, Milestone } from "lucide-react";
import LearningPathCard from "../components/LearningPathCard";
import { getLearningPaths } from "../api/client";

const LearningPathsPage = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadPaths = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getLearningPaths();
        if (active) {
          setPaths(result);
        }
      } catch {
        if (active) {
          setError("Could not load learning paths. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPaths();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600 shadow-soft">
        Loading learning paths...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-soft">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur md:p-8">
        <h1 className="mb-3 font-display text-3xl font-semibold text-slate-900 md:text-4xl">
          Learning Paths
        </h1>
        <p className="max-w-3xl text-base text-slate-600">
          Follow step-by-step tracks to build Oracle expertise with clear
          progression from fundamentals to implementation.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {paths.map((path) => (
          <LearningPathCard key={path.id} path={path} />
        ))}
      </section>

      <section className="space-y-6">
        {paths.map((path) => (
          <article
            key={path.id}
            id={path.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="mb-2 font-display text-2xl font-semibold text-slate-900">
                  {path.title}
                </h2>
                <p className="text-sm text-slate-600">{path.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">
                  <Clock3 size={13} />
                  {path.estimatedDuration}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                  <Milestone size={13} />
                  {path.steps.length} steps
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {path.steps.map((step) => (
                <div
                  key={`${path.id}-${step.step}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Step {step.step}
                  </p>
                  <h3 className="mb-1 text-base font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  {step.resource ? (
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <span>{step.resource.title}</span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {step.resource.difficulty}
                      </span>
                      <a
                        href={step.resource.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-slate-800"
                      >
                        Open resource
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">
                      Resource details unavailable.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default LearningPathsPage;
