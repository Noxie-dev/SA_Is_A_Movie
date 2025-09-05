# Comments & Reactions Setup Guide

## Overview
Your SA IS A MOVIE site now has a complete comments and reactions system that integrates with Netlify CMS and GitHub. Here's how it works:

### How It Works
1. **User submits comment** → Netlify Forms captures the data
2. **Netlify Function processes** → Creates a GitHub pull request
3. **You review & approve** → Merge the PR to publish the comment
4. **Site rebuilds** → Comment appears live on your site

## Setup Instructions

### 1. Environment Variables
Add these to your Netlify site settings (Site Settings → Environment Variables):

```
GITHUB_OWNER=your-github-username
GITHUB_REPO=saisa-movie-landing
GITHUB_TOKEN=ghp_your_github_token_here
```

### 2. GitHub Token Setup
1. Go to [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "SA IS A MOVIE Comments"
4. Select scopes: `repo` (full control of private repositories)
5. Copy the token and add it to Netlify environment variables

### 3. Netlify Functions
The system includes:
- `netlify/functions/submit-comment.js` - Handles comment submissions
- Creates GitHub pull requests automatically
- Manages comment files in `src/content/comments/`

### 4. Netlify CMS Integration
Comments are managed through Netlify CMS:
- Go to `/admin` on your site
- Navigate to "Comments" collection
- Review and approve submitted comments
- Comments are stored as markdown files

## Features

### Comment Form
- **Reactions**: Like, Love, Laugh, Angry, Fire emojis
- **User Info**: Name (required), Email (optional)
- **Comment Text**: Markdown support
- **Validation**: Required fields and spam protection

### Comment Display
- **Approved Comments**: Only approved comments show publicly
- **Reactions Display**: Shows user's selected reactions
- **User Info**: Name, date, and email (if provided)
- **Responsive Design**: Works on all devices

### Moderation
- **Pull Request Review**: All comments go through PR review
- **CMS Approval**: Additional approval step in Netlify CMS
- **Spam Protection**: Manual review prevents spam

## File Structure
```
src/
├── components/
│   ├── CommentForm.jsx          # Comment submission form
│   ├── CommentDisplay.jsx       # Comment display component
│   └── CommentsSection.jsx      # Main comments section
├── content/
│   └── comments/                # Comment files (auto-generated)
netlify/
└── functions/
    └── submit-comment.js        # Comment processing function
```

## Usage

### For Users
1. Scroll to any trending story
2. Click "Comments & Reactions" to expand
3. Select reaction emojis
4. Fill in name and comment
5. Submit (comment goes to review)

### For Admins
1. Check GitHub for new pull requests
2. Review comment content
3. Merge PR to approve comment
4. Or use Netlify CMS to manage comments

## Customization

### Styling
- All components use your existing SA IS A MOVIE theme
- Colors match your brand (yellow, red, black)
- Responsive design for mobile/desktop

### Reactions
You can modify reactions in `CommentForm.jsx`:
```javascript
const reactionIcons = {
  like: { icon: ThumbsUp, label: 'Like', emoji: '👍' },
  love: { icon: Heart, label: 'Love', emoji: '❤️' },
  // Add more reactions here
};
```

### Comment Fields
Modify the form fields in `CommentForm.jsx` or update the Netlify CMS config in `public/admin/config.yml`.

## Troubleshooting

### Common Issues
1. **Comments not submitting**: Check GitHub token permissions
2. **PRs not creating**: Verify GITHUB_OWNER and GITHUB_REPO variables
3. **Comments not showing**: Ensure comments are approved in CMS

### Testing
1. Deploy to Netlify
2. Test comment submission
3. Check GitHub for new PRs
4. Approve and verify comments appear

## Security Notes
- All comments are moderated before publication
- GitHub token should have minimal required permissions
- Email addresses are optional and not required
- Spam protection through manual review process

Your comments system is now ready to engage your SA IS A MOVIE audience! 🎬