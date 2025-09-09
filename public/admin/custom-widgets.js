/**
 * Custom CMS Widgets for SA IS A MOVIE
 * Adds copyright checker and post story functionality
 */

// Wait for CMS to be available before registering widgets
function registerCustomWidgets() {
  if (typeof CMS === 'undefined') {
    console.log('CMS not available yet, retrying...');
    setTimeout(registerCustomWidgets, 100);
    return;
  }
  
  console.log('Registering custom CMS widgets...');

// Copyright Checker Widget
CMS.registerWidget('copyright-checker', {
  // Widget configuration
  label: 'Copyright Checker',
  widget: 'object',
  fields: [
    {
      label: 'Image URL',
      name: 'imageUrl',
      widget: 'string',
      hint: 'URL of the image to check for copyright issues'
    },
    {
      label: 'Check Copyright',
      name: 'checkCopyright',
      widget: 'boolean',
      default: false,
      hint: 'Check this to run copyright analysis on the image'
    },
    {
      label: 'Copyright Status',
      name: 'status',
      widget: 'select',
      options: ['pending', 'approved', 'flagged', 'rejected'],
      default: 'pending'
    },
    {
      label: 'Risk Level',
      name: 'riskLevel',
      widget: 'select',
      options: ['low', 'medium', 'high'],
      default: 'low'
    },
    {
      label: 'Confidence Score',
      name: 'confidence',
      widget: 'number',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0
    },
    {
      label: 'Issues Found',
      name: 'issues',
      widget: 'list',
      default: [],
      field: {
        label: 'Issue',
        name: 'issue',
        widget: 'string'
      }
    },
    {
      label: 'Recommendations',
      name: 'recommendations',
      widget: 'list',
      default: [],
      field: {
        label: 'Recommendation',
        name: 'recommendation',
        widget: 'string'
      }
    }
  ]
});

// Post Story Widget
CMS.registerWidget('post-story', {
  label: 'Post Story to Blog',
  widget: 'object',
  fields: [
    {
      label: 'Enable Auto-Post',
      name: 'autoPost',
      widget: 'boolean',
      default: false,
      hint: 'Automatically post this story to the blog when published'
    },
    {
      label: 'Blog Post Status',
      name: 'blogStatus',
      widget: 'select',
      options: ['not-posted', 'pending', 'posted', 'failed'],
      default: 'not-posted'
    },
    {
      label: 'Blog Post ID',
      name: 'blogPostId',
      widget: 'string',
      required: false,
      hint: 'Auto-generated when posted to blog'
    },
    {
      label: 'Post Date',
      name: 'postDate',
      widget: 'datetime',
      required: false,
      hint: 'When this story was posted to the blog'
    },
    {
      label: 'Error Message',
      name: 'errorMessage',
      widget: 'text',
      required: false,
      hint: 'Error message if posting failed'
    }
  ]
});

// Author Details Widget
CMS.registerWidget('author-details', {
  label: 'Author Details',
  widget: 'object',
  fields: [
    {
      label: 'Author Name',
      name: 'name',
      widget: 'string',
      required: true
    },
    {
      label: 'Author Role',
      name: 'role',
      widget: 'select',
      options: [
        'Editor-in-Chief',
        'Senior Reporter',
        'Music Reporter',
        'Political Correspondent',
        'Entertainment Reporter',
        'Culture Writer',
        'Sports Writer',
        'Contributing Writer',
        'Guest Author'
      ],
      required: true
    },
    {
      label: 'Author Bio',
      name: 'bio',
      widget: 'text',
      required: false,
      hint: 'Short biography of the author'
    },
    {
      label: 'Author Avatar',
      name: 'avatar',
      widget: 'image',
      required: false,
      hint: 'Profile picture of the author'
    },
    {
      label: 'Social Media',
      name: 'social',
      widget: 'object',
      required: false,
      fields: [
        {
          label: 'Twitter Handle',
          name: 'twitter',
          widget: 'string',
          required: false,
          hint: '@username'
        },
        {
          label: 'Instagram Handle',
          name: 'instagram',
          widget: 'string',
          required: false,
          hint: '@username'
        },
        {
          label: 'LinkedIn URL',
          name: 'linkedin',
          widget: 'string',
          required: false
        }
      ]
    },
    {
      label: 'Contact Email',
      name: 'email',
      widget: 'string',
      required: false,
      hint: 'Author contact email'
    }
  ]
});

// Media Gallery Widget
CMS.registerWidget('media-gallery', {
  label: 'Media Gallery',
  widget: 'list',
  default: [],
  field: {
    label: 'Media Item',
    name: 'media',
    widget: 'object',
    fields: [
      {
        label: 'Media Type',
        name: 'type',
        widget: 'select',
        options: ['image', 'video', 'audio'],
        default: 'image'
      },
      {
        label: 'Media File',
        name: 'file',
        widget: 'file',
        required: true
      },
      {
        label: 'Caption',
        name: 'caption',
        widget: 'string',
        required: false
      },
      {
        label: 'Alt Text',
        name: 'alt',
        widget: 'string',
        required: false,
        hint: 'Alternative text for accessibility'
      },
      {
        label: 'Copyright Checked',
        name: 'copyrightChecked',
        widget: 'boolean',
        default: false
      }
    ]
  }
});

// Story Analytics Widget
CMS.registerWidget('story-analytics', {
  label: 'Story Analytics',
  widget: 'object',
  fields: [
    {
      label: 'Views',
      name: 'views',
      widget: 'number',
      default: 0,
      min: 0
    },
    {
      label: 'Shares',
      name: 'shares',
      widget: 'number',
      default: 0,
      min: 0
    },
    {
      label: 'Comments',
      name: 'comments',
      widget: 'number',
      default: 0,
      min: 0
    },
    {
      label: 'Engagement Rate',
      name: 'engagementRate',
      widget: 'number',
      default: 0,
      min: 0,
      max: 100,
      step: 0.1,
      hint: 'Percentage of users who engaged with the story'
    },
    {
      label: 'Last Updated',
      name: 'lastUpdated',
      widget: 'datetime',
      required: false
    }
  ]
});

// Custom CSS for better widget styling
const customCSS = `
  .cms-widget-copyright-checker {
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    background: #f8fafc;
  }
  
  .cms-widget-post-story {
    border: 2px solid #3b82f6;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    background: #eff6ff;
  }
  
  .cms-widget-author-details {
    border: 2px solid #10b981;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    background: #ecfdf5;
  }
  
  .cms-widget-media-gallery {
    border: 2px solid #f59e0b;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    background: #fffbeb;
  }
  
  .cms-widget-story-analytics {
    border: 2px solid #8b5cf6;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    background: #f3e8ff;
  }
`;

// Inject custom CSS
const style = document.createElement('style');
style.textContent = customCSS;
document.head.appendChild(style);

  console.log('SA IS A MOVIE Custom CMS Widgets loaded successfully!');
}

// Start registering widgets
registerCustomWidgets();
