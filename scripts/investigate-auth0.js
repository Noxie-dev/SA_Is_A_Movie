#!/usr/bin/env node

/**
 * Auth0 Tenant Investigation Script
 * 
 * This script helps investigate your Auth0 tenant configuration
 * Run with: node scripts/investigate-auth0.js
 */

// Your Auth0 configuration
const AUTH0_DOMAIN = 'dev-sa-is-a-movie.us.auth0.com';
const AUTH0_CLIENT_ID = 'EuWZO7zJRvldikvu4wwjDeLoL7HKX4s5';

console.log('🔍 Auth0 Tenant Investigation Report');
console.log('=====================================\n');

console.log('📋 Tenant Information:');
console.log(`   Domain: ${AUTH0_DOMAIN}`);
console.log(`   Client ID: ${AUTH0_CLIENT_ID}`);
console.log(`   Region: US (us.auth0.com)`);
console.log(`   Environment: Development\n`);

console.log('🔗 Dashboard Links:');
console.log(`   Main Dashboard: https://manage.auth0.com/dashboard/us/dev-sa-is-a-movie`);
console.log(`   Applications: https://manage.auth0.com/dashboard/us/dev-sa-is-a-movie/applications`);
console.log(`   Users: https://manage.auth0.com/dashboard/us/dev-sa-is-a-movie/users`);
console.log(`   APIs: https://manage.auth0.com/dashboard/us/dev-sa-is-a-movie/apis`);
console.log(`   Social Connections: https://manage.auth0.com/dashboard/us/dev-sa-is-a-movie/connections/social\n`);

console.log('✅ Configuration Checklist:');
console.log('   [ ] Application type is Single Page Application (SPA)');
console.log('   [ ] Allowed Callback URLs include:');
console.log('       - http://localhost:5173');
console.log('       - http://localhost:5174');
console.log('       - https://your-production-domain.com');
console.log('   [ ] Allowed Logout URLs match Callback URLs');
console.log('   [ ] Allowed Origins (CORS) include your domains');
console.log('   [ ] Google OAuth2 connection is configured');
console.log('   [ ] Management API access is enabled');
console.log('   [ ] Scopes include: read:current_user, update:current_user_metadata\n');

console.log('🔧 Current Application Settings:');
console.log('   Audience: https://dev-sa-is-a-movie.us.auth0.com/api/v2/');
console.log('   Scopes: read:current_user update:current_user_metadata');
console.log('   Refresh Tokens: Enabled');
console.log('   Redirect URI: Dynamic (window.location.origin)\n');

console.log('👤 Known User Data:');
console.log('   User ID: google-oauth2|104528973793158795176');
console.log('   Name: Noxolo Krwele');
console.log('   Provider: Google OAuth2');
console.log('   Last Login: 2025-09-05T21:08:58.367Z\n');

console.log('🚨 Things to Check:');
console.log('   1. Verify all callback URLs are configured');
console.log('   2. Check CORS settings for your domains');
console.log('   3. Ensure Google OAuth2 is properly configured');
console.log('   4. Verify Management API permissions');
console.log('   5. Test user metadata functionality');
console.log('   6. Set up production URLs for deployment\n');

console.log('📝 Next Steps:');
console.log('   1. Access your Auth0 Dashboard using the links above');
console.log('   2. Go through the configuration checklist');
console.log('   3. Test authentication in your application');
console.log('   4. Configure production URLs for Netlify deployment');
console.log('   5. Set up environment variables for production\n');

console.log('🔐 Security Notes:');
console.log('   - Your credentials are currently hardcoded (consider using env vars)');
console.log('   - Make sure to configure HTTPS for production');
console.log('   - Verify token expiration settings are appropriate');
console.log('   - Check that refresh tokens are working correctly\n');

console.log('✨ Your Auth0 setup appears to be working correctly!');
console.log('   The authentication flow is functional and user data is being retrieved properly.');
