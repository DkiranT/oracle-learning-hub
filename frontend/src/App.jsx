import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import LearningPathsPage from "./pages/LearningPathsPage";
import NotFoundPage from "./pages/NotFoundPage";
import useBookmarks from "./hooks/useBookmarks";

const App = () => {
  const bookmarkState = useBookmarks();

  return (
    <Layout bookmarkedCount={bookmarkState.bookmarks.length}>
      <Routes>
        <Route
          path="/"
          element={<HomePage bookmarkState={bookmarkState} />}
        />
        <Route
          path="/search"
          element={<SearchResultsPage bookmarkState={bookmarkState} />}
        />
        <Route
          path="/resource/:id"
          element={<ResourceDetailPage bookmarkState={bookmarkState} />}
        />
        <Route path="/learning-paths" element={<LearningPathsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
