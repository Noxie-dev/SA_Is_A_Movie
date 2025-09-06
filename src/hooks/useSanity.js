import { useState, useEffect } from 'react';
import { sanityApi } from '../services/sanity';

// Hook for fetching a single post by slug
export const usePost = (slug) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const postData = await sanityApi.getPostBySlug(slug);
        setPost(postData);
      } catch (err) {
        setError(err.message || 'Failed to fetch post');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
};

// Hook for fetching recent posts
export const useRecentPosts = (limit = 6) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const postsData = await sanityApi.getRecentPosts(limit);
        setPosts(postsData);
      } catch (err) {
        setError(err.message || 'Failed to fetch recent posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, [limit]);

  return { posts, loading, error };
};

// Hook for fetching all posts
export const useAllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const postsData = await sanityApi.getAllPosts();
        setPosts(postsData);
      } catch (err) {
        setError(err.message || 'Failed to fetch posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  return { posts, loading, error };
};

// Hook for fetching categories
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesData = await sanityApi.getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Failed to fetch categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// Hook for searching posts
export const useSearchPosts = (query) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.trim() === '') {
      setPosts([]);
      setLoading(false);
      setError(null);
      return;
    }

    const searchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const searchResults = await sanityApi.searchPosts(query);
        setPosts(searchResults);
      } catch (err) {
        setError(err.message || 'Failed to search posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(searchPosts, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { posts, loading, error };
};
