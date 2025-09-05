# 🚀 Netlify CLI Guide for SA IS A MOVIE

## ✅ Netlify CLI Installed Successfully!

**Version:** netlify-cli/23.5.0  
**Status:** Ready to use! 🎉

## 🎯 **Essential Commands for Your Project**

### **1. Login to Netlify**
```bash
netlify login
```
- Opens browser to authenticate with your Netlify account
- Required before deploying or managing sites

### **2. Initialize Your Project**
```bash
netlify init
```
- Links your local project to a Netlify site
- Sets up continuous deployment
- Creates `netlify.toml` configuration file

### **3. Deploy Your Site**
```bash
# Deploy to production
netlify deploy

# Deploy a draft (for testing)
netlify deploy --draft

# Deploy with build command
netlify deploy --build
```

### **4. Local Development with Netlify**
```bash
# Start local dev server with Netlify functions
netlify dev

# Build and serve locally
netlify serve
```

### **5. Check Status**
```bash
# See current project status
netlify status

# View site information
netlify open
```

## 🎬 **Quick Start for SA IS A MOVIE**

### **Step 1: Login**
```bash
netlify login
```

### **Step 2: Initialize Project**
```bash
netlify init
```
Choose:
- **Create & configure a new site** (recommended)
- **Link this directory to an existing site** (if you already have one)

### **Step 3: Configure Build Settings**
When prompted, enter:
- **Build command:** `pnpm build`
- **Directory to deploy:** `dist`
- **Netlify functions folder:** (leave empty)

### **Step 4: Deploy**
```bash
netlify deploy --build
```

## 🔧 **Advanced Commands**

### **Environment Variables**
```bash
# List environment variables
netlify env:list

# Set environment variable
netlify env:set VARIABLE_NAME "value"

# Get environment variable
netlify env:get VARIABLE_NAME
```

### **Functions Management**
```bash
# List functions
netlify functions:list

# Create new function
netlify functions:create function-name
```

### **Site Management**
```bash
# List all your sites
netlify sites:list

# Get site information
netlify sites:info

# Open site in browser
netlify open:site
```

### **Logs and Monitoring**
```bash
# View deployment logs
netlify logs

# Watch for new deployments
netlify watch
```

## 📁 **Project Configuration**

### **netlify.toml** (Auto-created by `netlify init`)
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200

[[headers]]
  for = "/admin/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

## 🎯 **SA IS A MOVIE Specific Setup**

### **1. Deploy with CMS**
```bash
# Build and deploy
netlify deploy --build

# Your CMS will be available at:
# https://your-site-name.netlify.app/admin/
```

### **2. Set Up Identity (After Deployment)**
1. Go to your Netlify dashboard
2. Navigate to **Site settings** → **Identity**
3. Enable **Identity** and **Git Gateway**
4. Set registration to **Invite only**

### **3. Test CMS Access**
```bash
# Open your site
netlify open:site

# Or open admin directly
netlify open:site --admin
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **"Not logged in"**
```bash
netlify login
```

#### **"No site linked"**
```bash
netlify init
```

#### **Build fails**
```bash
# Check build locally first
pnpm build

# Then deploy
netlify deploy --build
```

#### **CMS not working**
- Ensure Identity is enabled in Netlify dashboard
- Check that Git Gateway is activated
- Verify admin files are in `public/admin/`

## 🎉 **Benefits of Using Netlify CLI**

### **For Development**
- ✅ **Local testing** with `netlify dev`
- ✅ **Draft deployments** for testing
- ✅ **Environment variables** management
- ✅ **Function development** locally

### **For Deployment**
- ✅ **One-command deployment** with `netlify deploy`
- ✅ **Automatic builds** and optimization
- ✅ **Preview URLs** for each deployment
- ✅ **Rollback capabilities**

### **For Management**
- ✅ **Site monitoring** and logs
- ✅ **Environment configuration**
- ✅ **Function management**
- ✅ **Domain and SSL** handling

## 🎬 **Next Steps for SA IS A MOVIE**

1. **Login to Netlify:**
   ```bash
   netlify login
   ```

2. **Initialize your project:**
   ```bash
   netlify init
   ```

3. **Deploy your site:**
   ```bash
   netlify deploy --build
   ```

4. **Set up Identity in dashboard** for CMS access

5. **Start creating content** at `/admin/`

**Your SA IS A MOVIE site is now ready for professional deployment and content management!** 🎬✨

---

**Need Help?**
- Netlify CLI Docs: https://developers.netlify.com/cli
- Netlify Docs: https://docs.netlify.com
- SA IS A MOVIE CMS Setup: See `NETLIFY_CMS_SETUP.md`

