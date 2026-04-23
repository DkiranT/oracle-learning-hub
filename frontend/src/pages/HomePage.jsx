import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Flame, FlaskConical, Rocket } from "lucide-react";
import SearchBar from "../components/SearchBar";
import ResourceCard from "../components/ResourceCard";
import LearningPathCard from "../components/LearningPathCard";
import {
  getLearningPaths,
  getRecommendations,
  getResources
} from "../api/client";

const categories = [
  "OCI",
  "Autonomous DB",
  "DevOps",
  "Streaming",
  "Kubernetes",
  "Security",
  "AI/ML",
  "Integration"
];

const LAST_CATEGORY_KEY = "oracle-learning-hub-last-category";

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-5 flex items-center justify-between">
    <div>
      <h2 className="mb-1 flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
        <Icon size={20} />
        {title}
      </h2>
      <p className="text-sm text-slate-600">{subtitle}</p>
    </div>
  </div>
);

const HomePage = ({ bookmarkState }) => {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = bookmarkState;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sections, setSections] = useState({
    trending: [],
    beginner: [],
    labs: [],
    paths: [],
    recommendations: []
  });
  const [recommendedContext, setRecommendedContext] = useState("you");

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const preferredCategory = localStorage.getItem(LAST_CATEGORY_KEY) || "";
        const recommendationParams = preferredCategory
          ? { category: preferredCategory }
          : {};

        const [trending, beginner, labs, paths, recommendations] = await Promise.all([
          getResources({ featured: "trending" }),
          getResources({ featured: "beginner" }),
          getResources({ featured: "labs" }),
          getLearningPaths(),
          getRecommendations(recommendationParams)
        ]);

        if (!active) {
          return;
        }

        setSections({
          trending: trending.slice(0, 6),
          beginner: beginner.slice(0, 6),
          labs: labs.slice(0, 6),
          paths,
          recommendations
        });

        setRecommendedContext(
          preferredCategory ? `you in ${preferredCategory}` : "you"
        );
      } catch (loadError) {
        if (active) {
          setError("Failed to load learning resources. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleCategorySelect = (category) => {
    localStorage.setItem(LAST_CATEGORY_KEY, category);
    navigate(`/search?q=${encodeURIComponent(category)}`);
  };

  const renderResourceGrid = (items, loadingLabel) => {
    if (loading) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-soft">
          {loadingLabel}
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-soft">
          No resources found for this section yet.
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <div className="space-y-14">
      <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-soft backdrop-blur md:p-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full gradient-chip px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
          Personalized cloud learning assistant
        </div>
        <h1 className="mb-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-slate-900 md:text-5xl">
          Learn Oracle cloud skills with curated docs, labs, and videos.
        </h1>
        <p className="mb-6 max-w-2xl text-base text-slate-600 md:text-lg">
          Search, explore, and follow guided paths from OCI fundamentals to
          advanced architecture topics.
        </p>

        <SearchBar
          onSearch={handleSearch}
          placeholder="What do you want to learn?"
          buttonLabel="Discover"
        />

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      <section>
        <SectionTitle
          icon={Flame}
          title="Trending Topics"
          subtitle="What Oracle learners are actively exploring this week."
        />
        {renderResourceGrid(sections.trending, "Loading trending topics...")}
      </section>

      <section>
        <SectionTitle
          icon={Rocket}
          title="Beginner Paths"
          subtitle="Start here if you are building cloud fundamentals."
        />
        {renderResourceGrid(sections.beginner, "Loading beginner resources...")}
      </section>

      <section>
        <SectionTitle
          icon={FlaskConical}
          title="Hands-on Labs"
          subtitle="Practical workshops you can run today."
        />
        {renderResourceGrid(sections.labs, "Loading hands-on labs...")}
      </section>

      <section>
        <SectionTitle
          icon={Compass}
          title="Learning Paths"
          subtitle="Structured tracks for guided progress."
        />
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-soft">
            Loading learning paths...
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sections.paths.map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle
          icon={Compass}
          title="Recommended for You"
          subtitle={`Tailored picks based on recent interests for ${recommendedContext}.`}
        />
        {renderResourceGrid(sections.recommendations, "Loading recommendations...")}
      </section>
    </div>
  );
};

export default HomePage;
