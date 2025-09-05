# 🔐 Netlify Identity Setup with Role-Based Access Control

## ✅ What's Been Configured

Your SA IS A MOVIE site now has a complete role-based access control system:

### 📁 **Files Created/Updated**
- `netlify/functions/identity-signup.js` - Automatic role assignment
- `netlify/functions/identity-git-gateway.js` - Git Gateway access control
- `netlify.toml` - Role-based redirects and access control
- `public/admin/config.yml` - Updated for Git Gateway with role restrictions

### 🎯 **Role System**

| Role | Permissions | Assignment Logic |
|------|-------------|------------------|
| **Admin** | Full CMS access, publish content | `@saisamovie.com`, `@noxie-dev.com`, `noxolokrwele64@gmail.com` |
| **Editor** | Create/edit content, manage comments | Gmail addresses with "saisa" or "movie" |
| **Visitor** | View content, submit comments | All other users |

## 🚀 **Manual Setup Steps**

Since the Netlify CLI doesn't have direct Identity commands, follow these steps:

### **Step 1: Enable Netlify Identity**

1. **Go to your Netlify dashboard**: https://app.netlify.com/projects/saisamovie
2. **Navigate to**: Site settings → Identity
3. **Click "Enable Identity"**
4. **Configure settings**:
   - **Registration**: "Invite only" (recommended)
   - **External providers**: Optional (Google, GitHub, etc.)
   - **Click "Save"**

### **Step 2: Enable Git Gateway**

1. **In the same Identity section**
2. **Scroll down to "Services"**
3. **Click "Enable Git Gateway"**
4. **This allows the CMS to save changes to your repository**

### **Step 3: Configure Environment Variables**

1. **Go to**: Site settings → Environment variables
2. **Add these variables**:

```
GITHUB_OWNER = [Your GitHub Username]
GITHUB_REPO = [Your Repository Name]
GITHUB_TOKEN = [Your GitHub Personal Access Token]
SITE_URL = [Your Site URL]
```

### **Step 4: Deploy the Functions**

```bash
# Commit and push the new functions
git add .
git commit -m "feat: Add role-based Identity system with serverless functions"
git push origin main
```

## 🎬 **How the Role System Works**

### **Automatic Role Assignment**

When users sign up, the `identity-signup.js` function automatically assigns roles:

```javascript
// Admin role for trusted domains
if (user.email.endsWith('@saisamovie.com') || 
    user.email === 'noxolokrwele64@gmail.com') {
  roles = ['admin', 'editor'];
}

// Editor role for contributors
else if (user.email.endsWith('@gmail.com') && 
         (user.email.includes('saisa') || user.email.includes('movie'))) {
  roles = ['editor'];
}

// Default visitor role
else {
  roles = ['visitor'];
}
```

### **Access Control**

- **CMS Access**: Only `admin` and `editor` roles can access `/admin/`
- **Git Gateway**: Controlled by `identity-git-gateway.js` function
- **Content Creation**: Editors can create, admins can publish
- **Comments**: All users can submit, admins can moderate

## 🔧 **Testing the Setup**

### **1. Test User Registration**
1. Go to `[Your Site URL]/admin/`
2. Click "Sign up"
3. Use different email addresses to test role assignment:
   - `test@saisamovie.com` → Should get admin role
   - `saisa.movie@gmail.com` → Should get editor role
   - `regular.user@gmail.com` → Should get visitor role

### **2. Test CMS Access**
1. **Admin/Editor users**: Should access CMS dashboard
2. **Visitor users**: Should be redirected to login with 401 error

### **3. Test Comments System**
1. All users should be able to submit comments
2. Comments create GitHub pull requests for review
3. Admins can approve through CMS or GitHub

## 🎯 **Customization Options**

### **Modify Role Assignment Logic**

Edit `netlify/functions/identity-signup.js`:

```javascript
// Add your custom logic
if (user.email.endsWith('@yourdomain.com')) {
  roles = ['admin'];
}

// Add role based on user metadata
if (user.user_metadata?.department === 'content') {
  roles = ['editor'];
}
```

### **Add New Roles**

1. **Update the function** with new role logic
2. **Update netlify.toml** redirects for new roles
3. **Update CMS config** access control

### **Modify Access Permissions**

Edit `netlify.toml`:

```toml
# Allow specific roles to access admin
[[redirects]]
  from = "/admin/*"
  to = "/admin/"
  status = 200
  conditions = {Role = ["admin", "editor", "moderator"]}
```

## 🚨 **Troubleshooting**

### **Identity Not Working?**
- Check that Identity is enabled in Netlify dashboard
- Verify Git Gateway is activated
- Ensure environment variables are set

### **Roles Not Assigning?**
- Check function logs in Netlify dashboard
- Verify the `identity-signup.js` function is deployed
- Test with different email addresses

### **CMS Access Issues?**
- Verify user has correct role
- Check netlify.toml redirect conditions
- Ensure Git Gateway is properly configured

## 🎉 **You're All Set!**

Your SA IS A MOVIE site now has:

✅ **Role-based access control**  
✅ **Automatic user role assignment**  
✅ **Secure CMS access**  
✅ **Git Gateway integration**  
✅ **Comments moderation system**  
✅ **Flexible permission system**  

**Next Steps:**
1. Enable Identity in Netlify dashboard
2. Enable Git Gateway
3. Deploy the functions
4. Test with different user roles
5. Start creating amazing content! 🎬✨

---

**Need Help?** Check the Netlify Identity documentation: [netlify.com/docs/identity](https://docs.netlify.com/identity/)
