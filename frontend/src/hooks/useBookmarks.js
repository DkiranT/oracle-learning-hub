import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "oracle-learning-hub-bookmarks";

const parseBookmarks = () => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(parseBookmarks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = useCallback((resourceId) => {
    setBookmarks((current) => {
      if (current.includes(resourceId)) {
        return current.filter((id) => id !== resourceId);
      }

      return [...current, resourceId];
    });
  }, []);

  const isBookmarked = useCallback(
    (resourceId) => bookmarks.includes(resourceId),
    [bookmarks]
  );

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark
  };
};

export default useBookmarks;
