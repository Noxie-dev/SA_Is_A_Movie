# 🎬 Complete Sanity + Vite Folder Structure

Here's your ready-to-use folder structure for the SA IS A MOVIE blog with Sanity.io integration.

## 📁 Project Structure

```
saisa-movie-landing/
├── src/
│   ├── components/
│   │   ├── PostsList.jsx          # ✅ Blog posts listing component
│   │   ├── PostPage.jsx           # ✅ Individual post page component
│   │   ├── BlogPostCard.jsx       # ✅ Post preview cards
│   │   ├── BlogPost.jsx           # ✅ Full post display
│   │   ├── BlogList.jsx           # ✅ Blog listing with search/filters
│   │   ├── RecentPosts.jsx        # ✅ Recent posts for homepage
│   │   └── BlogLayout.jsx         # ✅ Blog-specific layout
│   ├── pages/
│   │   └── BlogPage.jsx           # ✅ Blog routing page
│   ├── hooks/
│   │   ├── useSanity.js           # ✅ React hooks for data fetching
│   │   └── useContentful.js       # ✅ Contentful hooks (existing)
│   ├── services/
│   │   ├── sanity.js              # ✅ Sanity API services
│   │   ├── contentful.js          # ✅ Contentful services (existing)
│   │   └── client.js              # ✅ Simple Sanity client (NEW)
│   ├── App.jsx                    # ✅ Main app with routing
│   └── main.jsx                   # ✅ App entry point
├── saisa-movie/                   # ✅ Sanity Studio
│   ├── schemaTypes/
│   │   ├── post.ts                # ✅ Blog post schema
│   │   ├── author.ts              # ✅ Author schema
│   │   ├── category.ts            # ✅ Category schema
│   │   ├── blockContent.ts        # ✅ Rich text schema
│   │   └── index.ts               # ✅ Schema exports
│   ├── sanity.config.ts           # ✅ Sanity configuration
│   ├── sanity.cli.ts              # ✅ Sanity CLI config
│   └── package.json               # ✅ Sanity dependencies
├── .env.example                   # ✅ Environment variables template
├── package.json                   # ✅ Main project dependencies
└── SANITY_SETUP.md               # ✅ Setup documentation
```

## 🚀 Quick Start Guide

### 1. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
VITE_SANITY_PROJECT_ID=fxocdfoz
VITE_SANITY_DATASET=production
```

### 2. **Install Dependencies**
```bash
# Main project
pnpm install

# Sanity Studio
cd saisa-movie
pnpm install
```

### 3. **Start Development**
```bash
# Terminal 1: Main app
pnpm run dev

# Terminal 2: Sanity Studio
cd saisa-movie
pnpm run dev
```

### 4. **Create Content**
1. Go to Sanity Studio (usually `http://localhost:3333`)
2. Create authors, categories, and posts
3. See them appear instantly on your site!

## 📝 Component Usage Examples

### **Simple Posts List (as per your examples)**
```jsx
// src/components/PostsList.jsx
import React, { useEffect, useState } from 'react';
import { sanityClient, urlFor } from '../client';

export default function PostsList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    sanityClient.fetch(`
      *[_type == "post"]{
        title,
        slug,
        mainImage{ asset->{url} },
        "authorName": author->name
      }
    `).then((data) => setPosts(data))
      .catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map(post => (
        <div key={post.slug.current} className="border rounded-lg overflow-hidden shadow-md">
          <img src={urlFor(post.mainImage).width(600).url()} alt={post.title} className="w-full h-64 object-cover"/>
          <div className="p-4">
            <h2 className="font-bold text-xl">{post.title}</h2>
            <p className="text-gray-500 mt-2">By {post.authorName}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### **Single Post Page**
```jsx
// src/components/PostPage.jsx
import React, { useEffect, useState } from 'react';
import { sanityClient, urlFor } from '../client';
import { PortableText } from '@portabletext/react';

export default function PostPage({ slug }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    sanityClient.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        title,
        mainImage{ asset->{url} },
        "authorName": author->name,
        body
      }`,
      { slug }
    ).then(setPost).catch(console.error);
  }, [slug]);

  if (!post) return <p>Loading...</p>;

  return (
    <article className="prose lg:prose-xl mx-auto my-8">
      <h1>{post.title}</h1>
      <p>By {post.authorName}</p>
      <img src={urlFor(post.mainImage).width(800).url()} alt={post.title}/>
      <PortableText value={post.body}/>
    </article>
  );
}
```

## 🎯 Key Features

### **✅ What's Included:**
- **Complete Sanity Studio** setup with schemas
- **React components** for blog listing and individual posts
- **Rich text rendering** with PortableText
- **Image optimization** with Sanity CDN
- **Search and filtering** capabilities
- **Responsive design** with Tailwind CSS
- **SEO-friendly URLs** with slug-based routing
- **Loading states** and error handling
- **Author profiles** and category management

### **✅ Schemas Ready:**
- **Post**: title, slug, author, categories, mainImage, body, publishedAt
- **Author**: name, slug, image, bio
- **Category**: title, description
- **BlockContent**: Rich text with images, links, and formatting

### **✅ Routing Setup:**
- `/blog` - Blog listing page
- `/blog/[slug]` - Individual post pages
- Homepage integration with recent posts

## 🔧 Customization

### **Add New Fields to Schemas**
```typescript
// saisa-movie/schemaTypes/post.ts
export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    // ... existing fields
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
    }),
  ],
});
```

### **Update GROQ Queries**
```javascript
// src/services/sanity.js
export const QUERIES = {
  FEATURED_POSTS: `*[_type == "post" && featured == true] | order(publishedAt desc) {
    _id, title, slug, excerpt, mainImage, author->{name}
  }`,
};
```

### **Customize Styling**
All components use Tailwind CSS classes that match your SA IS A MOVIE brand:
- Red accents (`saisa-text-red`)
- Yellow highlights (`saisa-text-yellow`)
- Responsive grid layouts
- Hover effects and transitions

## 🚀 Deployment

### **Netlify Setup**
1. **Environment Variables**:
   ```
   VITE_SANITY_PROJECT_ID=fxocdfoz
   VITE_SANITY_DATASET=production
   ```

2. **CORS Configuration**:
   - Add your production URL to Sanity Studio CORS settings
   - Add `https://your-site.netlify.app` to allowed origins

3. **Build Command**: `pnpm run build`
4. **Publish Directory**: `dist`

### **Webhook for Auto-rebuilds**
Set up a webhook in Sanity Studio to trigger Netlify rebuilds when content changes:
- **Webhook URL**: `https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID`
- **Trigger**: On content changes

## 🎉 You're Ready to Blog!

Your SA IS A MOVIE site now has:
- ✅ **Professional blog system** with Sanity.io
- ✅ **Rich content management** with Sanity Studio
- ✅ **Fast, optimized delivery** with CDN
- ✅ **Search and filtering** capabilities
- ✅ **Mobile-responsive design**
- ✅ **SEO-friendly structure**

**Next Steps:**
1. Start Sanity Studio and create your first posts
2. Customize the styling to match your brand
3. Set up CORS for production
4. Deploy and start publishing! 🎬✨

---

**Files Created/Updated:**
- ✅ `src/client.js` - Simple Sanity client
- ✅ `src/components/PostsList.jsx` - Blog listing component
- ✅ `src/components/PostPage.jsx` - Individual post component
- ✅ Complete folder structure documentation
- ✅ Ready-to-use examples matching your specifications








