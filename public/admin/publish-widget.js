/**
 * Custom Publish to Blog Widget for SA IS A MOVIE CMS
 * Adds a prominent publish button to the trending stories form
 */

// Wait for CMS to be available before registering widgets
function registerPublishWidget() {
  if (typeof CMS === 'undefined') {
    console.log('CMS not available yet for publish widget, retrying...');
    setTimeout(registerPublishWidget, 100);
    return;
  }
  
  console.log('Registering publish widget...');

// Register the publish widget
CMS.registerWidget('publish-to-blog', {
  label: 'Publish to Blog',
  widget: 'object',
  fields: [
    {
      label: 'Publish Status',
      name: 'publishStatus',
      widget: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Ready to Publish', value: 'ready' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' }
      ],
      default: 'draft'
    },
    {
      label: 'Auto-Publish to Blog',
      name: 'autoPublish',
      widget: 'boolean',
      default: false,
      hint: 'Automatically publish this story to the blog when saved'
    },
    {
      label: 'Blog Post URL',
      name: 'blogPostUrl',
      widget: 'string',
      required: false,
      hint: 'URL of the published blog post (auto-generated)'
    },
    {
      label: 'Publish Date',
      name: 'publishDate',
      widget: 'datetime',
      required: false,
      hint: 'When this story was published to the blog'
    }
  ]
});

// Add custom CSS for the publish widget
const publishWidgetCSS = `
  .cms-widget-publish-to-blog {
    border: 3px solid #FFA500 !important;
    border-radius: 12px !important;
    padding: 20px !important;
    margin: 20px 0 !important;
    background: linear-gradient(135deg, #FFA50020, #FF660020) !important;
    box-shadow: 0 4px 15px rgba(255, 165, 0, 0.2) !important;
  }
  
  .cms-widget-publish-to-blog .cms-widget-label {
    color: #FFA500 !important;
    font-weight: bold !important;
    font-size: 1.2em !important;
    margin-bottom: 15px !important;
  }
  
  .cms-widget-publish-to-blog .cms-widget-field {
    margin-bottom: 15px !important;
  }
  
  .cms-widget-publish-to-blog .cms-widget-field label {
    color: #333 !important;
    font-weight: 600 !important;
  }
  
  .cms-widget-publish-to-blog .cms-widget-field input,
  .cms-widget-publish-to-blog .cms-widget-field select {
    border: 2px solid #FFA500 !important;
    border-radius: 6px !important;
    padding: 8px 12px !important;
  }
  
  .cms-widget-publish-to-blog .cms-widget-field input:focus,
  .cms-widget-publish-to-blog .cms-widget-field select:focus {
    border-color: #FF6600 !important;
    box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1) !important;
  }
  
  .cms-widget-publish-to-blog .cms-widget-hint {
    color: #666 !important;
    font-style: italic !important;
    font-size: 0.9em !important;
  }
`;

// Inject the CSS
const publishStyle = document.createElement('style');
publishStyle.textContent = publishWidgetCSS;
document.head.appendChild(publishStyle);

// Add publish functionality
window.publishStoryToBlog = function(storyData) {
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = 'Publishing...';
  button.disabled = true;
  
  // Show confirmation dialog
  if (!confirm('Are you sure you want to publish this story to the blog?')) {
    button.textContent = originalText;
    button.disabled = false;
    return;
  }
  
  // Prepare story data
  const publishData = {
    title: storyData.title || 'Untitled Story',
    description: storyData.description || '',
    body: storyData.body || '',
    category: storyData.category || 'culture',
    tags: storyData.tags || [],
    author: storyData.author || { name: 'SA IS A MOVIE Team' },
    featured_image: storyData.featured_image || '',
    color: storyData.color || 'saisa-text-blue'
  };
  
  // Call the publish API
  fetch('/.netlify/functions/post-story-to-blog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      storyData: publishData,
      authorDetails: publishData.author
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert(`🎉 Story successfully published to blog!\n\nTitle: ${publishData.title}\nBlog Post ID: ${data.blogPost?.sys?.id || data.blogPost?.slug || 'N/A'}\n\nYou can now view it on your blog!`);
      
      // Update the form with the blog post URL
      const blogUrlField = document.querySelector('input[name*="blogPostUrl"]');
      if (blogUrlField) {
        blogUrlField.value = `/blog/${data.blogPost?.slug || 'published-story'}`;
      }
      
      // Update publish status
      const statusField = document.querySelector('select[name*="publishStatus"]');
      if (statusField) {
        statusField.value = 'published';
      }
      
      // Update publish date
      const dateField = document.querySelector('input[name*="publishDate"]');
      if (dateField) {
        dateField.value = new Date().toISOString();
      }
    } else {
      alert('❌ Failed to publish story: ' + (data.error || 'Unknown error'));
    }
  })
  .catch(error => {
    console.error('Publish story error:', error);
    alert('❌ Failed to publish story: ' + error.message);
  })
  .finally(() => {
    button.textContent = originalText;
    button.disabled = false;
  });
};

  console.log('SA IS A MOVIE Publish Widget loaded successfully!');
}

// Start registering publish widget
registerPublishWidget();
