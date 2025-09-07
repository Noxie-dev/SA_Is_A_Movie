import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client configuration
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'fxocdfoz',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true, // Use CDN for faster responses
  apiVersion: '2024-01-01', // Use current date for API version
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

// Helper function to get image URL
export const urlFor = (source) => builder.image(source);

export default sanityClient;


