# 🎬 Sanity Studio Deployment Guide

Deploy your SA IS A MOVIE Studio to Netlify and connect it to your Sanity project.

## 🚀 Quick Deployment Steps

### **Step 1: Deploy Studio to Netlify**

#### **Option A: Deploy from GitHub (Recommended)**

1. **Push your Studio to GitHub:**
   ```bash
   cd saisa-movie
   git add .
   git commit -m "feat: Add Sanity Studio for SA IS A MOVIE"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the `saisa-movie` folder as the base directory
   - Build settings:
     - **Build command**: `pnpm run build`
     - **Publish directory**: `dist`
     - **Node version**: `18`

3. **Deploy:**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Your Studio will be available at: `https://your-site-name.netlify.app`

#### **Option B: Manual Deploy**

1. **Build the Studio:**
   ```bash
   cd saisa-movie
   pnpm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Your Studio will be deployed instantly

### **Step 2: Add Studio to Sanity Project**

1. **Go to Sanity Dashboard:**
   - Visit [sanity.io/manage](https://sanity.io/manage)
   - Select your project: `fxocdfoz`

2. **Add Studio:**
   - Go to "Studios" section
   - Click "Add Studio"
   - Fill in the details:
     - **Studio Name**: `SA IS A MOVIE Studio`
     - **Custom Studio URL**: `https://your-site-name.netlify.app`
   - Click "Add"

3. **Configure CORS:**
   - Go to "API" → "CORS origins"
   - Add your Studio URL: `https://your-site-name.netlify.app`
   - Add your main site URL: `https://saisamovie.netlify.app`
   - Add local development: `http://localhost:5173`

## 🔧 Configuration Files

### **netlify.toml** (Already created)
```toml
[build]
  command = "pnpm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### **sanity.config.ts** (Updated)
```typescript
export default defineConfig({
  name: 'default',
  title: 'SA IS A MOVIE Studio',
  projectId: 'fxocdfoz',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
```

## 📝 Environment Variables

### **For Netlify Deployment:**
No environment variables needed for the Studio - it uses the project ID and dataset from the config.

### **For Your Main Site:**
Make sure these are set in your main site's Netlify environment:
```
VITE_SANITY_PROJECT_ID=fxocdfoz
VITE_SANITY_DATASET=production
```

## 🎯 Studio Features

### **What You'll Have:**
- ✅ **Content Management**: Create and edit blog posts
- ✅ **Author Management**: Add and manage authors
- ✅ **Category Management**: Organize posts by categories
- ✅ **Rich Text Editor**: Full-featured content editor
- ✅ **Image Management**: Upload and manage images
- ✅ **Preview Mode**: Preview posts before publishing
- ✅ **Vision Tool**: Query your data with GROQ

### **Content Types Available:**
1. **Posts**: Blog posts with rich content
2. **Authors**: Author profiles with bios
3. **Categories**: Post categorization
4. **Block Content**: Rich text with images and links

## 🔄 Workflow

### **Content Creation Process:**
1. **Access Studio**: Go to your deployed Studio URL
2. **Create Content**: Add authors, categories, and posts
3. **Publish**: Content is immediately available via API
4. **Auto-rebuild**: Set up webhooks to trigger site rebuilds

### **Webhook Setup (Optional):**
1. **Get Netlify Build Hook:**
   - Go to your main site's Netlify dashboard
   - Settings → Build & deploy → Build hooks
   - Create new build hook

2. **Add to Sanity:**
   - Go to Sanity Studio → API → Webhooks
   - Add webhook URL: `https://api.netlify.com/build_hooks/YOUR_HOOK_ID`
   - Trigger on: Content changes

## 🎨 Customization

### **Studio Branding:**
You can customize the Studio appearance by updating `sanity.config.ts`:

```typescript
export default defineConfig({
  // ... existing config
  studio: {
    components: {
      // Add custom components here
    }
  },
  // Add custom theme
  theme: {
    // Customize colors, fonts, etc.
  }
})
```

### **Content Structure:**
Modify schemas in `schemaTypes/` to add new fields or content types.

## 🚨 Troubleshooting

### **Common Issues:**

1. **Studio won't load:**
   - Check CORS settings in Sanity dashboard
   - Verify project ID and dataset are correct

2. **Build fails:**
   - Ensure Node.js version is 18+
   - Check that all dependencies are installed

3. **Content not appearing:**
   - Verify API queries in your main site
   - Check that content is published (not draft)

### **Local Development:**
```bash
cd saisa-movie
pnpm run dev
# Studio available at http://localhost:3333
```

## 🎉 You're All Set!

Once deployed, you'll have:
- ✅ **Hosted Studio** accessible from anywhere
- ✅ **Content Management** for your blog
- ✅ **API Integration** with your main site
- ✅ **Professional Workflow** for content creation

### **Next Steps:**
1. Deploy your Studio to Netlify
2. Add it to your Sanity project
3. Configure CORS settings
4. Start creating content!
5. Set up webhooks for auto-rebuilds (optional)

Your SA IS A MOVIE Studio is now ready for professional content management! 🎬✨

---

**Studio URL**: `https://your-site-name.netlify.app`  
**Main Site**: `https://saisamovie.netlify.app`  
**Local Development**: `http://localhost:3333`
