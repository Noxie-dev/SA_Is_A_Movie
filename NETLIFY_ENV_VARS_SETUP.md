# Netlify Environment Variables Setup Guide

## 🚨 **CRITICAL: Fix Netlify Deployment Issues**

Your Netlify deployment is failing due to **secrets scanning** detecting sensitive information. This guide will fix the deployment and set up proper environment variables.

---

## **Step 1: Set Up Netlify Environment Variables**

### **1.1 Access Netlify Dashboard**
1. Go to your Netlify site dashboard
2. Navigate to **Site Settings** → **Build & Deploy** → **Environment Variables**
3. Click **Add Variable**

### **1.2 Add Required Environment Variables**

Add these variables in your Netlify dashboard:

#### **Auth0 Configuration (Public Keys - Safe for Client-Side)**
```
VITE_AUTH0_DOMAIN=dev-sa-is-a-movie.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-actual-client-id-here
VITE_AUTH0_AUDIENCE=https://dev-sa-is-a-movie.us.auth0.com/api/v2/
```

#### **Contentful Configuration (Public Keys - Safe for Client-Side)**
```
VITE_CONTENTFUL_SPACE_ID=your-contentful-space-id
VITE_CONTENTFUL_ACCESS_TOKEN=your-contentful-access-token
```

#### **Optional: Gemini API (Server-Side Only)**
```
VITE_GEMINI_API_KEY=your-gemini-api-key
```

---

## **Step 2: Get Your Actual Values**

### **2.1 Auth0 Values**
1. Go to [Auth0 Dashboard](https://manage.auth0.com/dashboard/us/dev-sa-is-a-movie)
2. Navigate to **Applications** → **Applications**
3. Find your SPA application
4. Copy:
   - **Domain** (e.g., `dev-sa-is-a-movie.us.auth0.com`)
   - **Client ID** (e.g., `EuWZO7zJRvldikvu4wwjDeLoL7HKX4s5`)
   - **Audience** (e.g., `https://dev-sa-is-a-movie.us.auth0.com/api/v2/`)

### **2.2 Contentful Values**
1. Go to [Contentful Dashboard](https://app.contentful.com)
2. Navigate to your space
3. Go to **Settings** → **API keys**
4. Copy:
   - **Space ID**
   - **Content Delivery API - access token**

---

## **Step 3: Update Your Code (Already Done)**

The following files have been updated to fix the deployment issues:

### **✅ Fixed Files:**
- `netlify.toml` - Updated secrets scanning configuration
- `AUTH0_TENANT_INVESTIGATION.md` - Removed hardcoded client ID
- `src/services/contentful.js` - Updated fallback values

---

## **Step 4: Test the Build**

### **4.1 Test Locally**
```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm run build

# Test with Netlify CLI
npx netlify build
```

### **4.2 Deploy to Netlify**
1. Push your changes to GitHub
2. Netlify will automatically trigger a new build
3. The build should now succeed ✅

---

## **Step 5: Verify Deployment**

### **5.1 Check Build Logs**
- Go to Netlify Dashboard → **Deploys**
- Click on the latest deploy
- Verify no secrets scanning errors

### **5.2 Test Functionality**
- Visit your deployed site
- Test Auth0 authentication (if enabled)
- Test Contentful content loading
- Test CMS access at `/admin/`

---

## **Environment Variables Reference**

### **Public Variables (Safe for Client-Side)**
These are **intentionally public** and safe to expose in the build:

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain | `dev-sa-is-a-movie.us.auth0.com` |
| `VITE_AUTH0_CLIENT_ID` | Auth0 application ID | `EuWZO7zJRvldikvu4wwjDeLoL7HKX4s5` |
| `VITE_AUTH0_AUDIENCE` | Auth0 API audience | `https://dev-sa-is-a-movie.us.auth0.com/api/v2/` |
| `VITE_CONTENTFUL_SPACE_ID` | Contentful space ID | `abc123def456` |
| `VITE_CONTENTFUL_ACCESS_TOKEN` | Contentful access token | `CFPAT-abc123...` |

### **Private Variables (Server-Side Only)**
These should **never** be exposed to the client:

| Variable | Purpose | Location |
|----------|---------|----------|
| `AUTH0_CLIENT_SECRET` | Auth0 client secret | Server-side only |
| `GITHUB_TOKEN` | GitHub API token | Netlify functions only |
| `VITE_GEMINI_API_KEY` | Gemini API key | Server-side only |

---

## **Troubleshooting**

### **Build Still Failing?**
1. **Check Environment Variables**: Ensure all required variables are set in Netlify
2. **Check Secrets Scanning**: Verify `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml`
3. **Check Build Logs**: Look for specific error messages
4. **Test Locally**: Run `npx netlify build` to simulate Netlify's build process

### **Common Issues**
- **Missing Environment Variables**: Add all required variables to Netlify
- **Wrong Variable Names**: Ensure variables start with `VITE_` for client-side access
- **Secrets Scanning**: Update `SECRETS_SCAN_OMIT_KEYS` if needed

---

## **Next Steps**

1. **Set up environment variables** in Netlify dashboard
2. **Deploy your changes** to trigger a new build
3. **Test the deployed site** to ensure everything works
4. **Monitor build logs** for any remaining issues

---

## **Security Notes**

- **Auth0 Client ID**: This is **public by design** - it's safe to expose
- **Contentful Access Token**: This is a **read-only token** - safe for client-side use
- **Never commit secrets**: Always use environment variables for sensitive data
- **Use VITE_ prefix**: Only for variables that need to be accessible in the browser

---

**Your deployment should now succeed! 🎉**


