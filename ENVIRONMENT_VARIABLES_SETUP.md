# Environment Variables Setup Guide

This guide will help you set up the required environment variables in Netlify to fix the Clerk development keys warning and Contentful access token errors.

## 🚨 Current Issues

1. **Clerk Development Keys Warning**: The app is using development keys in production
2. **Contentful Access Token Error**: Missing or invalid Contentful access token

## 🔧 Required Environment Variables

### 1. Clerk Authentication

You need to set up **production** Clerk keys in Netlify:

#### Get Your Production Clerk Keys:
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your project
3. Go to **API Keys** section
4. Copy the **Publishable Key** (starts with `pk_live_...` for production)
5. Copy the **Secret Key** (starts with `sk_live_...` for production)

#### Set in Netlify:
- `VITE_CLERK_PUBLISHABLE_KEY` = `pk_live_your_production_key_here`
- `CLERK_SECRET_KEY` = `sk_live_your_secret_key_here`

### 2. Contentful CMS

You need to set up Contentful space and access token:

#### Get Your Contentful Credentials:
1. Go to [Contentful Dashboard](https://app.contentful.com/)
2. Select your space
3. Go to **Settings** → **API keys**
4. Copy the **Space ID**
5. Copy the **Content Delivery API - access token**

#### Set in Netlify:
- `VITE_CONTENTFUL_SPACE_ID` = `your_space_id_here`
- `VITE_CONTENTFUL_ACCESS_TOKEN` = `your_access_token_here`

### 3. Sanity CMS (Optional)

If you're using Sanity for blog posts:

#### Get Your Sanity Credentials:
1. Go to [Sanity Dashboard](https://sanity.io/manage)
2. Select your project
3. Copy the **Project ID**
4. Note your **Dataset** (usually "production")

#### Set in Netlify:
- `VITE_SANITY_PROJECT_ID` = `your_project_id_here`
- `VITE_SANITY_DATASET` = `production`

## 📋 How to Set Environment Variables in Netlify

### Method 1: Netlify Dashboard (Recommended)

1. Go to your [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add variable**
5. Add each variable with its value
6. Click **Save**

### Method 2: Netlify CLI

```bash
# Install Netlify CLI if you haven't
npm install -g netlify-cli

# Login to Netlify
netlify login

# Set environment variables
netlify env:set VITE_CLERK_PUBLISHABLE_KEY "pk_live_your_key_here"
netlify env:set CLERK_SECRET_KEY "sk_live_your_secret_here"
netlify env:set VITE_CONTENTFUL_SPACE_ID "your_space_id_here"
netlify env:set VITE_CONTENTFUL_ACCESS_TOKEN "your_access_token_here"
netlify env:set VITE_SANITY_PROJECT_ID "your_project_id_here"
netlify env:set VITE_SANITY_DATASET "production"
```

## 🔄 After Setting Variables

1. **Redeploy your site** in Netlify:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

2. **Verify the fixes**:
   - Check browser console for Clerk warnings (should be gone)
   - Check for Contentful errors (should be resolved)
   - Test your site functionality

## 🛡️ Security Notes

- **Never commit** environment variables to your repository
- **Use production keys** for production deployments
- **Keep secret keys secure** and don't share them
- The `.env.local` files are already in `.gitignore`

## 🧪 Testing Locally

To test with environment variables locally:

1. Create a `.env.local` file in your project root
2. Add your variables:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_key_here
   CLERK_SECRET_KEY=sk_live_your_secret_here
   VITE_CONTENTFUL_SPACE_ID=your_space_id_here
   VITE_CONTENTFUL_ACCESS_TOKEN=your_access_token_here
   VITE_SANITY_PROJECT_ID=your_project_id_here
   VITE_SANITY_DATASET=production
   ```
3. Run `pnpm run dev` to test locally

## ✅ Verification Checklist

- [ ] Clerk production keys set in Netlify
- [ ] Contentful credentials set in Netlify
- [ ] Sanity credentials set in Netlify (if using)
- [ ] Site redeployed after setting variables
- [ ] No Clerk development warnings in console
- [ ] No Contentful access token errors
- [ ] Site functionality working properly

## 🆘 Troubleshooting

### Still seeing Clerk development warnings?
- Verify you're using `pk_live_...` keys (not `pk_test_...`)
- Make sure the variable name is exactly `VITE_CLERK_PUBLISHABLE_KEY`
- Redeploy the site after setting the variable

### Still seeing Contentful errors?
- Verify your Space ID and Access Token are correct
- Check that the Contentful space has the required content types
- Make sure the access token has read permissions

### Variables not working?
- Check variable names are exactly as specified (case-sensitive)
- Ensure variables are set in the correct Netlify site
- Redeploy after making changes
- Check Netlify build logs for any errors

## 📞 Support

If you continue to have issues:
1. Check the Netlify build logs
2. Verify your service credentials are correct
3. Test with a simple deployment first
4. Contact support with specific error messages
