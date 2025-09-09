# Google OAuth and API Setup Guide

This guide explains how to properly configure Google OAuth and API integration for the SA IS A MOVIE project.

## 🚀 Quick Setup

### 1. Create Environment Variables

Create a `.env` file in your project root:

```bash
# Google OAuth and API Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

### 2. Usage in React Components

```javascript
// Import the configuration
import { GOOGLE_CLIENT_ID, GOOGLE_API_KEY } from '@/lib/googleConfig';

// Use in your components
const clientId = GOOGLE_CLIENT_ID;
const apiKey = GOOGLE_API_KEY;

console.log("Using Google Client ID:", clientId);
console.log("Using Google API Key:", apiKey);
```

### 3. Direct Import Usage

```javascript
// Direct access to environment variables
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
```

## ⚠️ Important Notes

### VITE_ Prefix Requirement
- **Without the VITE_ prefix, Vite won't expose the variables to the frontend**
- All environment variables for frontend use must start with `VITE_`
- Server-side variables (like `GOOGLE_CLIENT_SECRET`) should not be exposed to frontend

### Security Considerations
- Never commit `.env` files to version control
- The `.env` file is already in `.gitignore`
- Client secrets should only be used server-side

## 🔧 Configuration Files

### vite.config.js
The configuration has been updated to include environment variable fallbacks:

```javascript
define: {
  global: 'globalThis',
  // Environment variable fallbacks for development
  'process.env': process.env,
},
```

### googleConfig.js
A utility file has been created at `src/lib/googleConfig.js` that provides:
- Safe access to Google environment variables
- Configuration validation
- Helper functions for Google API requests
- Development logging

## 🌐 Netlify Deployment

### Environment Variables in Netlify
Since SA IS A MOVIE is hosted on Netlify:

1. Go to **Netlify Dashboard** → **Site Settings** → **Build & Deploy** → **Environment Variables**
2. Add the same keys from your `.env` file:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_CLIENT_SECRET`
   - `VITE_GOOGLE_API_KEY`
3. **Redeploy** the site so the variables are injected

## 📋 Environment Variables Reference

| Variable | Purpose | Frontend Access | Usage |
|----------|---------|----------------|-------|
| `VITE_GOOGLE_CLIENT_ID` | OAuth authentication | ✅ Yes | Google OAuth login |
| `VITE_GOOGLE_CLIENT_SECRET` | Token exchange | ❌ No | Server-side only |
| `VITE_GOOGLE_API_KEY` | Google APIs access | ✅ Yes | AdSense, Analytics, etc. |

## 🔌 Example Integrations

### Google OAuth Provider Setup

```javascript
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from '@/lib/googleConfig';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* Your app content */}
    </GoogleOAuthProvider>
  );
}
```

### Google API Request Example

```javascript
import { makeGoogleApiRequest, GOOGLE_API_ENDPOINTS } from '@/lib/googleConfig';

// Example YouTube API request
const searchVideos = async (query) => {
  try {
    const response = await makeGoogleApiRequest(
      `${GOOGLE_API_ENDPOINTS.youtube}/search`,
      {
        method: 'GET',
        // Additional options
      }
    );
    return response;
  } catch (error) {
    console.error('Google API request failed:', error);
  }
};
```

## 🧪 Testing Configuration

### Google OAuth Example Component
A test component has been created at `src/components/GoogleOAuthExample.jsx` that:
- Validates Google configuration
- Shows environment variable status
- Provides example OAuth and API integration
- Includes setup instructions

### Validation Function
```javascript
import { validateGoogleConfig } from '@/lib/googleConfig';

// Check if all required variables are set
const isConfigValid = validateGoogleConfig();
if (!isConfigValid) {
  console.warn('Google configuration is incomplete');
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Variables not accessible in frontend**
   - Ensure variables start with `VITE_` prefix
   - Restart development server after adding variables

2. **Variables not available in production**
   - Add variables to Netlify environment settings
   - Redeploy the site

3. **Client secret exposed to frontend**
   - Client secrets should only be used server-side
   - Never use `VITE_GOOGLE_CLIENT_SECRET` in frontend code

### Development Logging
The configuration includes development logging that shows:
- Which variables are set/missing
- Configuration validation status
- API request status

## 📚 Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google APIs Documentation](https://developers.google.com/apis)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)

## 🔄 Next Steps

1. **Replace placeholder values** in `.env` with actual Google credentials
2. **Add variables to Netlify** environment settings
3. **Test the configuration** using the example component
4. **Implement OAuth flow** in your authentication system
5. **Integrate Google APIs** for AdSense, Analytics, etc.

---

**Remember**: Keep your credentials secure and never commit them to version control!





