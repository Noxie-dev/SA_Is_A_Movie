const https = require('https');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form data
    const formData = JSON.parse(event.body);
    const { name, email, comment, postId, postTitle, reactions } = formData;

    // Validate required fields
    if (!name || !comment || !postId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;

    if (!token || !owner || !repo) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'GitHub configuration not complete' })
      };
    }

    // Generate unique filename for the comment
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `src/content/comments/${postId}-${timestamp}.md`;

    // Create comment content in markdown format
    const commentContent = `---
name: "${name.replace(/"/g, '\\"')}"
email: "${email || ''}"
postId: "${postId}"
postTitle: "${postTitle || ''}"
date: ${new Date().toISOString()}
reactions:
  like: ${reactions?.like || 0}
  love: ${reactions?.love || 0}
  laugh: ${reactions?.laugh || 0}
  angry: ${reactions?.angry || 0}
  fire: ${reactions?.fire || 0}
approved: false
---

${comment.replace(/\n/g, '\n\n')}
`;

    // Create a new branch for the comment
    const branchName = `comment-${postId}-${Date.now()}`;
    
    // Get the latest commit SHA
    const latestCommit = await makeGitHubRequest(`/repos/${owner}/${repo}/git/ref/heads/main`);
    
    // Create new branch
    await makeGitHubRequest(`/repos/${owner}/${repo}/git/refs`, 'POST', {
      ref: `refs/heads/${branchName}`,
      sha: latestCommit.object.sha
    });

    // Create the comment file
    const fileResponse = await makeGitHubRequest(`/repos/${owner}/${repo}/contents/${filename}`, 'PUT', {
      message: `Add comment for post: ${postTitle || postId}`,
      content: Buffer.from(commentContent).toString('base64'),
      branch: branchName
    });

    // Create pull request
    const prResponse = await makeGitHubRequest(`/repos/${owner}/${repo}/pulls`, 'POST', {
      title: `New comment on "${postTitle || postId}" by ${name}`,
      head: branchName,
      base: 'main',
      body: `## New Comment Submission

**Post:** ${postTitle || postId}
**Author:** ${name}
**Email:** ${email || 'Not provided'}
**Date:** ${new Date().toLocaleString()}

### Comment:
${comment}

### Reactions:
- 👍 Like: ${reactions?.like || 0}
- ❤️ Love: ${reactions?.love || 0}
- 😂 Laugh: ${reactions?.laugh || 0}
- 😡 Angry: ${reactions?.angry || 0}
- 🔥 Fire: ${reactions?.fire || 0}

---
*This comment was submitted via the SA IS A MOVIE website. Please review and approve if appropriate.*`
    });

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
        message: 'Comment submitted successfully! It will be reviewed before being published.',
        pullRequestUrl: prResponse.html_url,
        pullRequestNumber: prResponse.number
      })
    };

  } catch (error) {
    console.error('Error submitting comment:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to submit comment. Please try again later.'
      })
    };
  }
};

// Helper function to make GitHub API requests
function makeGitHubRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'SA-IS-A-MOVIE-Comment-System',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(new Error(`GitHub API error: ${res.statusCode} - ${parsedData.message || responseData}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse GitHub API response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}