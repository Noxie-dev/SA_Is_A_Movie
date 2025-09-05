const { Octokit } = require('@octokit/rest');

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

    // Initialize GitHub client
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const owner = process.env.GITHUB_OWNER || 'your-username';
    const repo = process.env.GITHUB_REPO || 'saisa-movie-landing';
    const branch = 'main';

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
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`
    });

    // Create new branch
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: refData.object.sha
    });

    // Create the comment file
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filename,
      message: `Add comment for post: ${postTitle || postId}`,
      content: Buffer.from(commentContent).toString('base64'),
      branch: branchName
    });

    // Create pull request
    const { data: pr } = await octokit.rest.pulls.create({
      owner,
      repo,
      title: `New comment on "${postTitle || postId}" by ${name}`,
      head: branchName,
      base: branch,
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
        pullRequestUrl: pr.html_url,
        pullRequestNumber: pr.number
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