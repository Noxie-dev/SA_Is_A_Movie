import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client configuration
const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'fxocdfoz',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true, // Use CDN for faster responses
  apiVersion: '2024-01-01', // Use current date for API version
});

// Image URL builder
const builder = imageUrlBuilder(client);

// Helper function to get image URL
export const urlFor = (source) => builder.image(source);

// GROQ queries for fetching content
export const QUERIES = {
  // Fetch all posts with basic info
  ALL_POSTS: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    mainImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    author-> {
      name,
      image
    },
    categories[]-> {
      title
    },
    excerpt
  }`,

  // Fetch single post by slug
  POST_BY_SLUG: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    mainImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    author-> {
      name,
      image,
      bio
    },
    categories[]-> {
      title,
      description
    },
    body,
    excerpt
  }`,

  // Fetch recent posts (for homepage)
  RECENT_POSTS: `*[_type == "post"] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    publishedAt,
    mainImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    author-> {
      name
    },
    categories[]-> {
      title
    },
    excerpt
  }`,

  // Fetch posts by category
  POSTS_BY_CATEGORY: `*[_type == "post" && $category in categories[]->title] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    mainImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    author-> {
      name
    },
    categories[]-> {
      title
    },
    excerpt
  }`,

  // Fetch all categories
  ALL_CATEGORIES: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    description,
    "postCount": count(*[_type == "post" && references(^._id)])
  }`,

  // Search posts
  SEARCH_POSTS: `*[_type == "post" && (title match $query || body[].children[].text match $query)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    mainImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    author-> {
      name
    },
    categories[]-> {
      title
    },
    excerpt
  }`
};

// API functions
export const sanityApi = {
  // Fetch all posts
  getAllPosts: async () => {
    try {
      const posts = await client.fetch(QUERIES.ALL_POSTS);
      return posts;
    } catch (error) {
      console.error('Error fetching all posts:', error);
      return [];
    }
  },

  // Fetch single post by slug
  getPostBySlug: async (slug) => {
    try {
      const post = await client.fetch(QUERIES.POST_BY_SLUG, { slug });
      return post;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
  },

  // Fetch recent posts
  getRecentPosts: async (limit = 6) => {
    try {
      const posts = await client.fetch(QUERIES.RECENT_POSTS);
      return posts.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      return [];
    }
  },

  // Fetch posts by category
  getPostsByCategory: async (category) => {
    try {
      const posts = await client.fetch(QUERIES.POSTS_BY_CATEGORY, { category });
      return posts;
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      return [];
    }
  },

  // Fetch all categories
  getAllCategories: async () => {
    try {
      const categories = await client.fetch(QUERIES.ALL_CATEGORIES);
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Search posts
  searchPosts: async (query) => {
    try {
      const posts = await client.fetch(QUERIES.SEARCH_POSTS, { query: `*${query}*` });
      return posts;
    } catch (error) {
      console.error('Error searching posts:', error);
      return [];
    }
  }
};

export default client;
