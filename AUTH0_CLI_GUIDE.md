# Auth0 CLI Investigation Guide

## 🚀 Auth0 CLI Setup Complete

The Auth0 CLI (auth0-deploy-cli) has been successfully installed and is ready to use.

**Version**: 8.15.0  
**Command**: `a0deploy`

## 🔧 Getting Your Client Secret

To use the Auth0 CLI, you need your application's client secret:

### **Step 1: Access Auth0 Dashboard**
Go to: https://manage.auth0.com/dashboard/us/dev-sa-is-a-movie/applications

### **Step 2: Find Your Application**
Look for an application with Client ID: `EuWZO7zJRvldikvu4wwjDeLoL7HKX4s5`

### **Step 3: Get Client Secret**
1. Click on your application
2. Go to **Settings** tab
3. Copy the **Client Secret**
4. Update `auth0-cli-config.json` with your actual client secret

## 📋 Available CLI Commands

### **Export Tenant Configuration**
```bash
# Export all tenant configuration
a0deploy export --config_file auth0-cli-config.json --format yaml --output_folder auth0-export

# Export specific resources
a0deploy export --config_file auth0-cli-config.json --format yaml --output_folder auth0-export --resource_servers
a0deploy export --config_file auth0-cli-config.json --format yaml --output_folder auth0-export --clients
a0deploy export --config_file auth0-cli-config.json --format yaml --output_folder auth0-export --connections
```

### **Import Configuration**
```bash
# Import configuration from files
a0deploy import --config_file auth0-cli-config.json --input_file auth0-export
```

### **Deploy Configuration**
```bash
# Deploy configuration to tenant
a0deploy deploy --config_file auth0-cli-config.json --input_file auth0-export
```

## 🔍 Investigation Commands

### **1. Export Applications**
```bash
a0deploy export --config_file auth0-cli-config.json --format yaml --output_folder auth0-export --clients
```
This will show you all applications in your tenant.

### **2. Export APIs**
```bash
a0deploy export --config_file auth0-cli-config.json --format yaml --output_folder auth0-export --resource_servers
```
This will show you all APIs and their configurations.

### **3. Export Connections**
```bash
a0deploy export --config_file auth0-cli-config.json --format yaml --output_folder auth0-export --connections
```
This will show you all social connections (Google OAuth2, etc.).

### **4. Export Rules/Actions**
```bash
a0deploy export --config_file auth0-cli-config.json --format yaml --output_folder auth0-export --actions
```
This will show you any custom authentication flows.

### **5. Export Users**
```bash
a0deploy export --config_file auth0-cli-config.json --format yaml --output_folder auth0-export --users
```
This will export user data (be careful with this in production).

## 📊 What to Look For

### **Application Configuration**
- **Application Type**: Should be "Single Page Application"
- **Allowed Callback URLs**: Should include your development and production URLs
- **Allowed Logout URLs**: Should match callback URLs
- **Allowed Origins (CORS)**: Should include your domains
- **Token Endpoint Authentication Method**: Should be "None" for SPA

### **API Configuration**
- **Management API**: Should be accessible
- **Scopes**: Should include `read:current_user` and `update:current_user_metadata`
- **Machine to Machine**: Should be enabled for your application

### **Social Connections**
- **Google OAuth2**: Should be configured with proper scopes
- **Client ID and Secret**: Should be set
- **Scopes**: Should include `openid profile email`

## 🚨 Common Issues to Check

### **1. Callback URL Issues**
**Problem**: Authentication fails with "Invalid callback URL"
**Solution**: Ensure all your URLs are in the Allowed Callback URLs list

### **2. CORS Issues**
**Problem**: API calls fail with CORS errors
**Solution**: Add your domains to Allowed Origins (CORS)

### **3. Scope Issues**
**Problem**: User metadata not accessible
**Solution**: Verify scopes include `read:current_user` and `update:current_user_metadata`

### **4. Token Issues**
**Problem**: Tokens expire too quickly
**Solution**: Check token expiration settings in your application

## 🔐 Security Considerations

### **Client Secret**
- **Never commit** your client secret to version control
- **Use environment variables** for production
- **Rotate secrets** regularly

### **URLs**
- **Use HTTPS** for production URLs
- **Limit callback URLs** to only necessary domains
- **Regularly review** allowed origins

### **Scopes**
- **Use minimal scopes** - only what you need
- **Review scope usage** regularly
- **Remove unused scopes**

## 📝 Investigation Checklist

Use this checklist to verify your Auth0 setup:

### **Application Settings**
- [ ] Application type is Single Page Application
- [ ] Allowed Callback URLs include development and production URLs
- [ ] Allowed Logout URLs match Callback URLs
- [ ] Allowed Origins (CORS) include your domains
- [ ] Token Endpoint Authentication Method is "None"

### **API Configuration**
- [ ] Management API is accessible
- [ ] Required scopes are configured
- [ ] Machine to Machine application exists
- [ ] API permissions are correct

### **Social Connections**
- [ ] Google OAuth2 is configured
- [ ] Client ID and Secret are set
- [ ] Scopes include profile and email
- [ ] Connection is enabled

### **User Management**
- [ ] Users can register and login
- [ ] User metadata is accessible
- [ ] Profile information is retrieved
- [ ] Refresh tokens work correctly

## 🎯 Next Steps

1. **Get your client secret** from the Auth0 Dashboard
2. **Update the config file** with your actual client secret
3. **Run export commands** to investigate your tenant
4. **Review the exported files** for any configuration issues
5. **Fix any issues** found during investigation
6. **Test authentication** in your application

## 🔗 Useful Resources

- **Auth0 Dashboard**: https://manage.auth0.com/dashboard/us/dev-sa-is-a-movie
- **Auth0 CLI Documentation**: https://github.com/auth0/auth0-deploy-cli
- **Auth0 Management API**: https://auth0.com/docs/api/management/v2
- **Auth0 Best Practices**: https://auth0.com/docs/secure/tokens

## 📞 Support

If you encounter issues:
1. Check the Auth0 Dashboard for error logs
2. Review the exported configuration files
3. Consult the Auth0 documentation
4. Check the browser console for client-side errors







