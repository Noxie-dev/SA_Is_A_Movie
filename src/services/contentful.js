import { createClient } from 'contentful';

// Create Contentful client only when environment variables are available
const createContentfulClient = () => {
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
  
  if (!spaceId || !accessToken) {
    console.warn('Contentful environment variables not configured');
    return null;
  }
  
  return createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: 'master', // or your environment name
  });
};

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
    const client = createContentfulClient();
    if (!client) {
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
    const client = createContentfulClient();
    if (!client) {
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
    const client = createContentfulClient();
    if (!client) {
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
    const client = createContentfulClient();
    if (!client) {
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
    const client = createContentfulClient();
    if (!client) {
      console.warn('Contentful not configured - returning null');
      return null;
    }
    
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
    const client = createContentfulClient();
    if (!client) {
      console.warn('Contentful not configured - returning empty array');
      return [];
    }
    
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

// Export the client creation function instead of a static client
export default createContentfulClient;


