import { createClient } from 'contentful';

// Contentful client configuration
const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
  environment: 'master', // or your environment name
});

// Content types
export const CONTENT_TYPES = {
  TRENDING_STORY: 'trendingStory',
  BLOG_POST: 'blogPost',
  HERO_CONTENT: 'heroContent',
  SETTINGS: 'settings',
};

// Fetch trending stories
export const getTrendingStories = async () => {
  try {
    // Check if Contentful is configured
    if (!import.meta.env.VITE_CONTENTFUL_SPACE_ID || !import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN) {
      console.warn('Contentful not configured - returning empty array');
      return [];
    }
    
    const response = await client.getEntries({
      content_type: CONTENT_TYPES.TRENDING_STORY,
      order: '-sys.createdAt',
      limit: 6,
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching trending stories:', error);
    return [];
  }
};

// Fetch blog posts
export const getBlogPosts = async (limit = 10) => {
  try {
    // Check if Contentful is configured
    if (!import.meta.env.VITE_CONTENTFUL_SPACE_ID || !import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN) {
      console.warn('Contentful not configured - returning empty array');
      return [];
    }
    
    const response = await client.getEntries({
      content_type: CONTENT_TYPES.BLOG_POST,
      order: '-sys.createdAt',
      limit,
    });
    return response.items;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

// Fetch hero content
export const getHeroContent = async () => {
  try {
    // Check if Contentful is configured
    if (!import.meta.env.VITE_CONTENTFUL_SPACE_ID || !import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN) {
      console.warn('Contentful not configured - returning null');
      return null;
    }
    
    const response = await client.getEntries({
      content_type: CONTENT_TYPES.HERO_CONTENT,
      limit: 1,
    });
    return response.items[0] || null;
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return null;
  }
};

// Fetch settings
export const getSettings = async () => {
  try {
    // Check if Contentful is configured
    if (!import.meta.env.VITE_CONTENTFUL_SPACE_ID || !import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN) {
      console.warn('Contentful not configured - returning null');
      return null;
    }
    
    const response = await client.getEntries({
      content_type: CONTENT_TYPES.SETTINGS,
      limit: 1,
    });
    return response.items[0] || null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
};

// Fetch single entry by ID
export const getEntryById = async (entryId) => {
  try {
    const response = await client.getEntry(entryId);
    return response;
  } catch (error) {
    console.error('Error fetching entry:', error);
    return null;
  }
};

// Search entries
export const searchEntries = async (query, contentType = null) => {
  try {
    const params = {
      query,
      limit: 20,
    };
    
    if (contentType) {
      params.content_type = contentType;
    }
    
    const response = await client.getEntries(params);
    return response.items;
  } catch (error) {
    console.error('Error searching entries:', error);
    return [];
  }
};

export default client;


