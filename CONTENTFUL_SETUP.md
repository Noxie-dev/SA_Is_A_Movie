# Contentful CMS Setup Guide

This guide will help you set up Contentful CMS for your SA IS A MOVIE project.

## 🚀 Quick Setup

### 1. Create Contentful Account & Space

1. Go to [Contentful](https://www.contentful.com/) and sign up
2. Create a new space named "SA IS A MOVIE CMS"
3. Choose "Create an empty space"

### 2. Get Your API Keys

1. Go to **Settings** → **API keys**
2. Copy your **Space ID** and **Content Delivery API - access token**
3. Add them to your `.env` file:

```bash
VITE_CONTENTFUL_SPACE_ID=your-space-id-here
VITE_CONTENTFUL_ACCESS_TOKEN=your-access-token-here
```

### 3. Create Content Models

You need to create these content types in your Contentful space:

#### A. Trending Story
- **Content Type ID**: `trendingStory`
- **Fields**:
  - `title` (Short text, required)
  - `description` (Long text, required)
  - `category` (Short text, required) - Options: music, scandal, celebrity, culture, politics, sports
  - `color` (Short text, required) - Options: saisa-text-blue, saisa-text-pink, saisa-text-yellow, saisa-text-red
  - `featuredImage` (Media, optional)
  - `isActive` (Boolean, required)
  - `publishedDate` (Date & time, required)

#### B. Blog Post
- **Content Type ID**: `blogPost`
- **Fields**:
  - `title` (Short text, required)
  - `slug` (Short text, required)
  - `excerpt` (Long text, required)
  - `content` (Rich text, required)
  - `featuredImage` (Media, required)
  - `category` (Short text, required)
  - `tags` (Short text, list)
  - `author` (Short text, required)
  - `isPublished` (Boolean, required)
  - `publishedDate` (Date & time, required)

#### C. Hero Content
- **Content Type ID**: `heroContent`
- **Fields**:
  - `title` (Short text, required)
  - `subtitle` (Long text, required)
  - `backgroundImage` (Media, optional)
  - `ctaText` (Short text, required)
  - `ctaLink` (Short text, required)

#### D. Site Settings
- **Content Type ID**: `settings`
- **Fields**:
  - `siteName` (Short text, required)
  - `siteDescription` (Long text, required)
  - `socialLinks` (JSON object, optional)
  - `contactEmail` (Short text, optional)
  - `analyticsId` (Short text, optional)

### 4. Create Sample Content

Create some sample entries for each content type to test your integration.

### 5. Test the Integration

1. Start your development server: `pnpm dev`
2. Check the browser console for any Contentful connection errors
3. Verify that content is loading in your components

## 🔧 Using Contentful in Your Components

### Basic Usage

```jsx
import { useTrendingStories } from '../hooks/useContentful';

function TrendingSection() {
  const { stories, loading, error } = useTrendingStories();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {stories.map(story => (
        <div key={story.sys.id}>
          <h3>{story.fields.title}</h3>
          <p>{story.fields.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Available Hooks

- `useTrendingStories()` - Get trending stories
- `useBlogPosts(limit)` - Get blog posts
- `useHeroContent()` - Get hero content
- `useSettings()` - Get site settings
- `useEntry(entryId)` - Get single entry
- `useSearch(query, contentType)` - Search content

## 🌐 Netlify Integration

### 1. Install Netlify Contentful Extension

1. Go to your Netlify dashboard
2. Navigate to your site
3. Go to **Integrations** → **Browse all**
4. Find and install **Contentful**

### 2. Connect Your Contentful Space

1. In the Contentful extension, click **Connect to Contentful**
2. Authorize Netlify to access your Contentful space
3. Select your space and environment

### 3. Configure Auto-Deployments

1. In the Contentful extension settings
2. Enable **Auto-deploy on content changes**
3. Choose which content types trigger deployments

## 📝 Content Management

### Creating Content

1. Go to your Contentful space
2. Click **Content** → **Add entry**
3. Select the appropriate content type
4. Fill in the required fields
5. Click **Publish**

### Rich Text Content

For blog posts, use Contentful's rich text editor to create formatted content with:
- Headings
- Paragraphs
- Links
- Images
- Lists
- Bold/italic text

### Media Management

Upload images and other media through Contentful's media library:
1. Go to **Media** → **Add asset**
2. Upload your files
3. Add alt text and descriptions
4. Use in your content entries

## 🚀 Deployment

### Environment Variables

Make sure to set these in your Netlify site settings:

```
VITE_CONTENTFUL_SPACE_ID=your-space-id
VITE_CONTENTFUL_ACCESS_TOKEN=your-access-token
```

### Build Process

Your site will automatically rebuild when:
- Content is published in Contentful
- You push changes to your repository
- You manually trigger a build

## 🔍 Troubleshooting

### Common Issues

1. **"Space not found" error**
   - Check your Space ID in environment variables
   - Ensure the space exists and is accessible

2. **"Access token invalid" error**
   - Verify your access token is correct
   - Check if the token has the right permissions

3. **Content not loading**
   - Check browser console for errors
   - Verify content is published (not just saved as draft)
   - Ensure content types match the expected IDs

### Debug Mode

Add this to your Contentful service to see detailed logs:

```javascript
const client = createClient({
  space: process.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: process.env.VITE_CONTENTFUL_ACCESS_TOKEN,
  environment: 'master',
  logHandler: (level, data) => {
    console.log(`[${level}]`, data);
  }
});
```

## 📚 Additional Resources

- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Contentful JavaScript SDK](https://github.com/contentful/contentful.js)
- [Netlify Contentful Extension](https://docs.netlify.com/integrations/contentful/)
- [Contentful Rich Text Rendering](https://www.contentful.com/developers/docs/javascript/tutorials/rendering-contentful-rich-text-with-javascript/)

## 🎯 Next Steps

1. Set up your Contentful space
2. Create the content models
3. Add sample content
4. Test the integration
5. Configure Netlify auto-deployments
6. Start managing your content through Contentful!









