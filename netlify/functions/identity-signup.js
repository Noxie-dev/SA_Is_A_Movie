/**
 * Netlify Identity Signup Handler
 * Automatically assigns roles to new users based on custom logic
 */

exports.handler = async (event) => {
  // Only handle POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { user } = JSON.parse(event.body);
    
    // Default role for all users
    let roles = ['visitor'];
    
    // Custom logic for role assignment
    if (user.email) {
      // Admin role for specific email domains or addresses
      if (user.email.endsWith('@saisamovie.com') || 
          user.email === 'noxolokrwele64@gmail.com' ||
          user.email.endsWith('@noxie-dev.com')) {
        roles = ['admin', 'editor'];
      }
      // Editor role for trusted contributors
      else if (user.email.endsWith('@gmail.com') && 
               (user.email.includes('saisa') || user.email.includes('movie'))) {
        roles = ['editor'];
      }
    }
    
    // Return the user with assigned roles
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        ...user,
        app_metadata: { 
          roles: roles,
          provider: 'netlify-identity'
        },
        user_metadata: { 
          ...user.user_metadata,
          signup_date: new Date().toISOString(),
          assigned_roles: roles
        }
      })
    };

  } catch (error) {
    console.error('Error in identity-signup:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
