import { useState, useEffect } from 'react';
import { 
  getTrendingStories, 
  getBlogPosts, 
  getHeroContent, 
  getSettings,
  getEntryById,
  searchEntries 
} from '../services/contentful';

// Hook for trending stories
export const useTrendingStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const data = await getTrendingStories();
        setStories(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return { stories, loading, error };
};

// Hook for blog posts
export const useBlogPosts = (limit = 10) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getBlogPosts(limit);
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit]);

  return { posts, loading, error };
};

// Hook for hero content
export const useHeroContent = () => {
  const [heroContent, setHeroContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true);
        const data = await getHeroContent();
        setHeroContent(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  return { heroContent, loading, error };
};

// Hook for settings
export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await getSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};

// Hook for single entry
export const useEntry = (entryId) => {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!entryId) return;

    const fetchEntry = async () => {
      try {
        setLoading(true);
        const data = await getEntryById(entryId);
        setEntry(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [entryId]);

  return { entry, loading, error };
};

// Hook for search
export const useSearch = (query, contentType = null) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      try {
        setLoading(true);
        const data = await searchEntries(query, contentType);
        setResults(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, contentType]);

  return { results, loading, error };
};




