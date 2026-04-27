import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  LoaderCircle,
  MessageSquareText,
  Milestone,
  Sparkles,
  X
} from "lucide-react";
import LearningPathCard from "../components/LearningPathCard";
import { getLearningPaths, summarizeResourceById } from "../api/client";

const LearningPathsPage = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stepSummaries, setStepSummaries] = useState({});

  const getStepKey = (pathId, stepNumber) => `${pathId}-${stepNumber}`;

  const patchStepSummary = (stepKey, patch) => {
    setStepSummaries((current) => ({
      ...current,
      [stepKey]: {
        open: false,
        loading: false,
        error: "",
        data: null,
        ...(current[stepKey] || {}),
        ...patch
      }
    }));
  };

  const generateStepSummary = async (pathId, step) => {
    const stepKey = getStepKey(pathId, step.step);

    if (!step?.resource?.id) {
      patchStepSummary(stepKey, {
        open: true,
        error: "Summary is unavailable because this step does not have a linked resource.",
        loading: false
      });
      return;
    }

    patchStepSummary(stepKey, {
      open: true,
      loading: true,
      error: ""
    });

    try {
      const summary = await summarizeResourceById(step.resource.id, {
        title: step.resource.title,
        source: step.resource.source,
        type: step.resource.type,
        difficulty: step.resource.difficulty,
        url: step.resource.link,
        description: step.resource.description,
        tags: step.resource.tags
      });

      patchStepSummary(stepKey, {
        loading: false,
        data: summary,
        error: ""
      });
    } catch {
      patchStepSummary(stepKey, {
        loading: false,
        error: "Could not generate summary right now. Please try again."
      });
    }
  };

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
                (() => {
                  const stepKey = getStepKey(path.id, step.step);
                  const summaryState = stepSummaries[stepKey] || {
                    open: false,
                    loading: false,
                    error: "",
                    data: null
                  };

                  return (
                    <div
                      key={stepKey}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Step {step.step}
                      </p>
                      <h3 className="mb-1 text-base font-semibold text-slate-900">
                        {step.title}
                      </h3>
                      {step.resource ? (
                        <>
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
                            <button
                              onClick={() => {
                                if (summaryState.open) {
                                  patchStepSummary(stepKey, { open: false });
                                } else {
                                  patchStepSummary(stepKey, { open: true, error: "" });
                                }
                              }}
                              className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800 transition hover:bg-violet-100"
                            >
                              <MessageSquareText size={12} />
                              Ask Assistant
                            </button>
                          </div>

                          {summaryState.open && (
                            <div className="mt-3 space-y-3 rounded-xl border border-violet-200 bg-violet-50/60 p-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="inline-flex items-center gap-1 text-sm font-semibold text-violet-900">
                                  <Sparkles size={14} />
                                  Oracle Assistant
                                </p>
                                <button
                                  onClick={() => patchStepSummary(stepKey, { open: false })}
                                  className="rounded-full border border-violet-200 bg-white p-1 text-violet-700 transition hover:bg-violet-100"
                                  aria-label="Close assistant summary panel"
                                >
                                  <X size={13} />
                                </button>
                              </div>

                              {!summaryState.loading && !summaryState.data && !summaryState.error && (
                                <div className="space-y-2 rounded-lg bg-white p-3 text-sm text-slate-700">
                                  <p>
                                    Can I give you a quick technical summary with implementation steps
                                    before you open this resource?
                                  </p>
                                  <button
                                    onClick={() => generateStepSummary(path.id, step)}
                                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                                  >
                                    <Sparkles size={12} />
                                    Generate Technical Summary
                                  </button>
                                </div>
                              )}

                              {summaryState.loading && (
                                <div className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700">
                                  <LoaderCircle size={14} className="animate-spin" />
                                  Generating grounded summary...
                                </div>
                              )}

                              {summaryState.error && (
                                <div className="space-y-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                                  <p>{summaryState.error}</p>
                                  <button
                                    onClick={() => generateStepSummary(path.id, step)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                                  >
                                    Retry Summary
                                  </button>
                                </div>
                              )}

                              {summaryState.data && (
                                <div className="space-y-3 rounded-lg bg-white p-3 text-sm text-slate-700">
                                  <p>{summaryState.data.summary?.text}</p>
                                  {summaryState.data.summary?.quickSteps?.length > 0 && (
                                    <div className="space-y-1">
                                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Quick Steps
                                      </p>
                                      {summaryState.data.summary.quickSteps
                                        .slice(0, 4)
                                        .map((item, index) => (
                                          <p
                                            key={`${item}-${index}`}
                                            className="rounded-lg bg-slate-50 px-2 py-1"
                                          >
                                            {index + 1}. {item}
                                          </p>
                                        ))}
                                    </div>
                                  )}
                                  {summaryState.data.summary?.technicalCoverage?.length > 0 && (
                                    <div className="space-y-1">
                                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Technical Coverage
                                      </p>
                                      {summaryState.data.summary.technicalCoverage
                                        .slice(0, 2)
                                        .map((item) => (
                                          <p key={item} className="rounded-lg bg-slate-50 px-2 py-1">
                                            {item}
                                          </p>
                                        ))}
                                    </div>
                                  )}
                                  {summaryState.data.summary?.keyTakeaways?.length > 0 && (
                                    <div className="space-y-1">
                                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Key Takeaways
                                      </p>
                                      {summaryState.data.summary.keyTakeaways
                                        .slice(0, 3)
                                        .map((item) => (
                                          <p key={item} className="rounded-lg bg-slate-50 px-2 py-1">
                                            {item}
                                          </p>
                                        ))}
                                    </div>
                                  )}
                                  {summaryState.data.summary?.notCovered?.length > 0 && (
                                    <p className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-800">
                                      Not covered: {summaryState.data.summary.notCovered[0]}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                                      Confidence: {summaryState.data.summary?.confidence || "medium"}
                                    </span>
                                    <button
                                      onClick={() => generateStepSummary(path.id, step)}
                                      className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                      Regenerate
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-slate-600">
                          Resource details unavailable.
                        </p>
                      )}
                    </div>
                  );
                })()
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default LearningPathsPage;
