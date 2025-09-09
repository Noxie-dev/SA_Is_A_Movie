/**
 * Google OAuth and API Configuration
 * This file handles Google environment variables and provides safe access to them
 */

// Google OAuth Client ID
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Google API Key for accessing Google APIs (AdSense, Analytics, etc.)
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Google OAuth Client Secret (should only be used server-side)
export const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

// Development logging (remove in production)
if (import.meta.env.DEV) {
  console.log("Google Configuration:");
  console.log("Client ID:", GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing");
  console.log("API Key:", GOOGLE_API_KEY ? "✅ Set" : "❌ Missing");
  console.log("Client Secret:", GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ Missing");
}

// Validation function to check if required Google variables are set
export const validateGoogleConfig = () => {
  const missing = [];
  
  if (!GOOGLE_CLIENT_ID) missing.push('VITE_GOOGLE_CLIENT_ID');
  if (!GOOGLE_API_KEY) missing.push('VITE_GOOGLE_API_KEY');
  
  if (missing.length > 0) {
    console.warn('Missing Google environment variables:', missing);
    console.warn('Please add these to your .env file and Netlify environment settings');
    return false;
  }
  
  return true;
};

// Google OAuth configuration object
export const googleOAuthConfig = {
  clientId: GOOGLE_CLIENT_ID,
  // Add other OAuth configuration options here
  scope: 'openid email profile',
  redirectUri: window.location.origin,
};

// Google API endpoints
export const GOOGLE_API_ENDPOINTS = {
  // AdSense API
  adsense: 'https://www.googleapis.com/adsense/v2',
  // Analytics API
  analytics: 'https://www.googleapis.com/analytics/v3',
  // YouTube API
  youtube: 'https://www.googleapis.com/youtube/v3',
  // Google Drive API
  drive: 'https://www.googleapis.com/drive/v3',
};

// Helper function to make authenticated Google API requests
export const makeGoogleApiRequest = async (endpoint, options = {}) => {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google API Key is not configured');
  }
  
  const url = `${endpoint}?key=${GOOGLE_API_KEY}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Google API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};





