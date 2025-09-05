# Netlify Contentful Extension Setup

This guide will help you connect your Netlify site with Contentful for automatic deployments when content changes.

## 🚀 Quick Setup

### 1. Install Netlify Contentful Extension

1. Go to your [Netlify Dashboard](https://app.netlify.com/)
2. Navigate to your site
3. Go to **Integrations** → **Browse all**
4. Search for **"Contentful"**
5. Click **Install** on the Contentful extension

### 2. Connect Your Contentful Space

1. In the Contentful extension, click **Connect to Contentful**
2. You'll be redirected to Contentful to authorize Netlify
3. Log in to your Contentful account
4. Select your **"SA IS A MOVIE CMS"** space
5. Choose the environment (usually **"master"**)
6. Click **Authorize**

### 3. Configure Auto-Deployments

1. In the Contentful extension settings:
   - **Enable auto-deploy**: Toggle ON
   - **Deploy on content changes**: Select which content types trigger deployments
   - **Deploy on asset changes**: Toggle ON (for images/media updates)

2. Recommended content types to trigger deployments:
   - ✅ `trendingStory`
   - ✅ `blogPost`
   - ✅ `heroContent`
   - ✅ `settings`

### 4. Set Environment Variables

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add these variables:

```
VITE_CONTENTFUL_SPACE_ID=your-actual-space-id
VITE_CONTENTFUL_ACCESS_TOKEN=your-actual-access-token
```

**To get these values:**
1. Go to your Contentful space
2. **Settings** → **API keys**
3. Copy the **Space ID** and **Content Delivery API - access token**

## 🔧 Advanced Configuration

### Custom Build Hooks

If you need more control over deployments, you can set up custom build hooks:

1. In Netlify: **Site settings** → **Build & deploy** → **Build hooks**
2. Create a new build hook named "Contentful"
3. Copy the webhook URL
4. In Contentful: **Settings** → **Webhooks**
5. Create a new webhook with the Netlify build hook URL

### Content Preview

For content preview functionality:

1. In Contentful: **Settings** → **Content preview**
2. Add a new preview configuration:
   - **Name**: "Netlify Preview"
   - **URL**: `https://your-site-name.netlify.app/preview?slug={entry.fields.slug}`
   - **Content types**: Select your content types

### Staging Environment

For a staging environment:

1. Create a separate Netlify site for staging
2. Connect it to the same Contentful space
3. Use a different environment (e.g., "staging")
4. Set up separate environment variables

## 📝 Content Workflow

### Publishing Content

1. **Create/Edit content** in Contentful
2. **Save as draft** to preview changes
3. **Publish** to trigger automatic deployment
4. **Monitor deployment** in Netlify dashboard

### Content Types That Trigger Deployments

- **trendingStory**: When trending stories are updated
- **blogPost**: When new blog posts are published
- **heroContent**: When hero section content changes
- **settings**: When site settings are updated

## 🚨 Troubleshooting

### Common Issues

1. **Deployments not triggering**
   - Check if the Contentful extension is properly connected
   - Verify environment variables are set correctly
   - Ensure content is published (not just saved as draft)

2. **Build failures**
   - Check Netlify build logs for errors
   - Verify all environment variables are set
   - Ensure Contentful API keys have correct permissions

3. **Content not updating**
   - Check if content is published in Contentful
   - Verify the content type matches your code
   - Check browser console for API errors

### Debug Mode

Add this to your Contentful service for debugging:

```javascript
const client = createClient({
  space: process.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: process.env.VITE_CONTENTFUL_ACCESS_TOKEN,
  environment: 'master',
  logHandler: (level, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Contentful ${level}]`, data);
    }
  }
});
```

## 🔍 Monitoring

### Netlify Dashboard

Monitor your deployments in:
- **Deploys** tab: See deployment history
- **Functions** tab: Monitor serverless functions
- **Analytics** tab: Track site performance

### Contentful Dashboard

Monitor your content in:
- **Content** tab: See all content entries
- **Media** tab: Manage uploaded assets
- **Settings** → **Usage**: Monitor API usage

## 🎯 Best Practices

### Content Management

1. **Use drafts** for content preview before publishing
2. **Set up content workflows** with multiple editors
3. **Use content validation** to ensure quality
4. **Regular backups** of your content

### Performance

1. **Optimize images** before uploading to Contentful
2. **Use CDN** for faster content delivery
3. **Cache content** appropriately
4. **Monitor API usage** to avoid limits

### Security

1. **Use environment variables** for sensitive data
2. **Limit API token permissions** to what's needed
3. **Regular security updates** for dependencies
4. **Monitor access logs** for unusual activity

## 📚 Additional Resources

- [Netlify Contentful Extension Docs](https://docs.netlify.com/integrations/contentful/)
- [Contentful Webhooks Guide](https://www.contentful.com/developers/docs/concepts/webhooks/)
- [Netlify Build Hooks](https://docs.netlify.com/configure-builds/build-hooks/)
- [Contentful Content Preview](https://www.contentful.com/developers/docs/tutorials/general/setting-up-content-preview-api/)

## 🎉 You're All Set!

Your Netlify site is now connected to Contentful! Here's what happens next:

1. **Create content** in Contentful
2. **Publish content** to trigger deployment
3. **Netlify automatically builds** and deploys your site
4. **Your site updates** with new content

Happy content managing! 🚀

