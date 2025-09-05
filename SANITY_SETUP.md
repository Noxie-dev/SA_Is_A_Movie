# 🎬 Sanity.io Blog Integration Setup

Your SA IS A MOVIE site now has a complete Sanity.io blog integration! Here's how to set it up and use it.

## ✅ What's Been Implemented

### **Components Created:**
- `src/services/sanity.js` - Sanity client and API functions
- `src/hooks/useSanity.js` - React hooks for data fetching
- `src/components/BlogPostCard.jsx` - Blog post preview cards
- `src/components/BlogPost.jsx` - Full blog post display with rich text
- `src/components/BlogList.jsx` - Blog listing with search and filters
- `src/components/RecentPosts.jsx` - Recent posts for homepage
- `src/components/BlogLayout.jsx` - Blog-specific layout
- `src/pages/BlogPage.jsx` - Blog page routing

### **Features:**
- ✅ **Rich text rendering** with PortableText
- ✅ **Image optimization** with Sanity's image CDN
- ✅ **Search functionality** across post titles and content
- ✅ **Category filtering** 
- ✅ **Responsive design** with Tailwind CSS
- ✅ **SEO-friendly URLs** with slug-based routing
- ✅ **Loading states** and error handling
- ✅ **Author information** and bio display

## 🚀 Setup Instructions

### **Step 1: Configure Environment Variables**

Add these to your `.env` file:

```bash
# Sanity Configuration
VITE_SANITY_PROJECT_ID=fxocdfoz
VITE_SANITY_DATASET=production
```

### **Step 2: Set Up CORS in Sanity Studio**

1. **Go to your Sanity Studio**: https://sanity.io/manage
2. **Select your project**: `fxocdfoz`
3. **Go to API settings**
4. **Add CORS origins**:
   - `http://localhost:5173` (for local development)
   - `https://your-site.netlify.app` (for production)
   - `[YOUR_SITE_URL]` (your actual site)

### **Step 3: Create Content in Sanity Studio**

1. **Access your Sanity Studio**: 
   ```bash
   cd saisa-movie
   pnpm run dev
   ```
2. **Create content**:
   - **Authors**: Add author profiles with name, image, and bio
   - **Categories**: Create categories for your posts
   - **Posts**: Write blog posts with rich content

### **Step 4: Test the Integration**

1. **Start your development server**:
   ```bash
   pnpm run dev
   ```
2. **Visit**: `http://localhost:5173/blog`
3. **Test features**:
   - View blog posts
   - Search functionality
   - Category filtering
   - Individual post pages

## 📝 Content Structure

### **Post Schema** (already configured):
```javascript
{
  title: "Post Title",
  slug: "post-slug",
  author: "Reference to Author",
  mainImage: "Featured Image",
  categories: ["Array of Category References"],
  publishedAt: "2024-01-01T00:00:00Z",
  body: "Rich Text Content",
  excerpt: "Short description"
}
```

### **Author Schema**:
```javascript
{
  name: "Author Name",
  image: "Profile Image",
  bio: "Author Biography"
}
```

### **Category Schema**:
```javascript
{
  title: "Category Name",
  description: "Category Description"
}
```

## 🎨 Customization Options

### **Styling**
- All components use Tailwind CSS classes
- Colors match your SA IS A MOVIE brand
- Responsive design for all screen sizes

### **Content Types**
- Add new fields to schemas in `saisa-movie/schemaTypes/`
- Update GROQ queries in `src/services/sanity.js`
- Modify components to display new fields

### **Layout**
- Blog pages use a clean, readable layout
- Homepage integration with recent posts
- Navigation between blog and main site

## 🔧 Advanced Features

### **Search Implementation**
```javascript
// Search posts by title or content
const { posts, loading, error } = useSearchPosts("search term");
```

### **Category Filtering**
```javascript
// Get posts by category
const { posts, loading, error } = usePostsByCategory("category-name");
```

### **Image Optimization**
```javascript
// Get optimized image URLs
import { urlFor } from '../services/sanity';
const imageUrl = urlFor(image).width(800).height(400).url();
```

## 🚀 Deployment

### **Netlify Deployment**
1. **Set environment variables** in Netlify dashboard:
   - `VITE_SANITY_PROJECT_ID=fxocdfoz`
   - `VITE_SANITY_DATASET=production`

2. **Update CORS settings** in Sanity Studio with your production URL

3. **Deploy**: Your blog will be available at `/blog`

### **Webhook Setup** (Optional)
Set up a webhook in Sanity Studio to trigger Netlify rebuilds when content changes:

1. **Sanity Studio** → **API** → **Webhooks**
2. **Add webhook**: `https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID`
3. **Trigger on**: Content changes

## 🎯 Usage Examples

### **Fetch All Posts**
```javascript
import { useAllPosts } from '../hooks/useSanity';

function MyComponent() {
  const { posts, loading, error } = useAllPosts();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {posts.map(post => (
        <div key={post._id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### **Fetch Single Post**
```javascript
import { usePost } from '../hooks/useSanity';

function PostPage({ slug }) {
  const { post, loading, error } = usePost(slug);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;
  
  return <div>{post.title}</div>;
}
```

## 🎉 You're All Set!

Your SA IS A MOVIE site now has:
- ✅ **Professional blog system** with Sanity.io
- ✅ **Rich content management** with Sanity Studio
- ✅ **Fast, optimized delivery** with CDN
- ✅ **Search and filtering** capabilities
- ✅ **Mobile-responsive design**
- ✅ **SEO-friendly structure**

**Next Steps:**
1. Set up CORS in Sanity Studio
2. Create your first blog posts
3. Customize the styling to match your brand
4. Set up webhooks for automatic rebuilds
5. Start publishing amazing content! 🎬✨

---

**Need Help?** Check the [Sanity.io documentation](https://www.sanity.io/docs) or the [PortableText documentation](https://portabletext.org/).
