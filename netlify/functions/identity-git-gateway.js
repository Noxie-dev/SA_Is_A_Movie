/**
 * Netlify Identity Git Gateway Handler
 * Controls access to Git Gateway based on user roles
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
    
    // Check if user has required roles for Git Gateway access
    const userRoles = user.app_metadata?.roles || [];
    const hasAccess = userRoles.includes('admin') || userRoles.includes('editor');
    
    if (!hasAccess) {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          error: 'Access denied',
          message: 'You need admin or editor role to access Git Gateway',
          required_roles: ['admin', 'editor'],
          user_roles: userRoles
        })
      };
    }
    
    // Grant access to Git Gateway
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: 'Git Gateway access granted',
        user_roles: userRoles,
        permissions: {
          read: true,
          write: userRoles.includes('admin'),
          publish: userRoles.includes('admin')
        }
      })
    };

  } catch (error) {
    console.error('Error in identity-git-gateway:', error);
    
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




