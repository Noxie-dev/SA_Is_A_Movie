// Simple Publish Button for Netlify CMS
// This script adds a prominent publish button to the CMS interface

(function() {
  'use strict';
  
  console.log('Loading simple publish button...');
  
  function addPublishButton() {
    // Remove existing button if it exists
    const existingButton = document.getElementById('saisa-publish-btn');
    if (existingButton) {
      existingButton.remove();
    }
    
    // Create the publish button
    const publishButton = document.createElement('button');
    publishButton.id = 'saisa-publish-btn';
    publishButton.innerHTML = '🚀 PUBLISH TO BLOG';
    publishButton.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: linear-gradient(135deg, #FFA500, #FF6600) !important;
      color: white !important;
      border: none !important;
      padding: 15px 25px !important;
      border-radius: 30px !important;
      font-weight: bold !important;
      font-size: 16px !important;
      cursor: pointer !important;
      box-shadow: 0 6px 20px rgba(255, 165, 0, 0.4) !important;
      z-index: 9999 !important;
      transition: all 0.3s ease !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
    `;
    
    // Add hover effects
    publishButton.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 8px 25px rgba(255, 165, 0, 0.6)';
    });
    
    publishButton.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 6px 20px rgba(255, 165, 0, 0.4)';
    });
    
    // Add click handler
    publishButton.addEventListener('click', function() {
      publishStory();
    });
    
    // Add to page
    document.body.appendChild(publishButton);
    console.log('Publish button added to page');
  }
  
  function publishStory() {
    // Get form data from the CMS
    const form = document.querySelector('form, .nc-root form, [data-testid="entry-form"]');
    if (!form) {
      alert('❌ Please open a story to publish first!');
      return;
    }
    
    // Extract form data
    const formData = new FormData(form);
    const title = formData.get('title') || document.querySelector('input[name="title"]')?.value || 'Untitled Story';
    const description = formData.get('description') || document.querySelector('textarea[name="description"]')?.value || '';
    const body = formData.get('body') || document.querySelector('textarea[name="body"]')?.value || '';
    const category = formData.get('category') || document.querySelector('select[name="category"]')?.value || 'culture';
    
    if (!title || title === 'Untitled Story') {
      alert('❌ Please enter a story title first!');
      return;
    }
    
    if (!body) {
      alert('❌ Please enter story content first!');
      return;
    }
    
    // Show confirmation
    if (!confirm(`🚀 Publish "${title}" to the blog?\n\nThis will create a new blog post with your story content.`)) {
      return;
    }
    
    // Show loading state
    const button = document.getElementById('saisa-publish-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '⏳ PUBLISHING...';
    button.disabled = true;
    
    // Prepare story data
    const storyData = {
      title: title,
      description: description,
      body: body,
      category: category,
      tags: [category, 'trending', 'sa-is-a-movie'],
      author: { name: 'SA IS A MOVIE Team' },
      featured_image: '',
      color: 'saisa-text-blue'
    };
    
    // Call publish API
    fetch('/.netlify/functions/post-story-to-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        storyData: storyData,
        authorDetails: storyData.author
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(`🎉 SUCCESS!\n\nStory "${title}" has been published to the blog!\n\nBlog Post ID: ${data.blogPost?.sys?.id || data.blogPost?.slug || 'N/A'}\n\nYou can now view it on your blog page.`);
        
        // Try to update the form with blog post info
        const blogPostIdField = document.querySelector('input[name="blogPostId"]');
        if (blogPostIdField) {
          blogPostIdField.value = data.blogPost?.sys?.id || data.blogPost?.slug || 'published';
        }
        
        const publishStatusField = document.querySelector('input[name="publishToBlog"]');
        if (publishStatusField) {
          publishStatusField.checked = true;
        }
      } else {
        alert('❌ Failed to publish story: ' + (data.error || 'Unknown error'));
      }
    })
    .catch(error => {
      console.error('Publish error:', error);
      alert('❌ Failed to publish story: ' + error.message);
    })
    .finally(() => {
      button.innerHTML = originalText;
      button.disabled = false;
    });
  }
  
  // Add button when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addPublishButton);
  } else {
    addPublishButton();
  }
  
  // Also add button when CMS loads (for dynamic content)
  setTimeout(addPublishButton, 1000);
  setTimeout(addPublishButton, 3000);
  setTimeout(addPublishButton, 5000);
  
  // Listen for CMS events when available
  function addCMSListeners() {
    if (window.CMS) {
      console.log('Adding CMS event listeners for publish button...');
      // Use a valid event name - preSave is a valid CMS event
      window.CMS.registerEventListener({
        name: 'preSave',
        handler: () => {
          console.log('CMS pre-save event, ensuring publish button is available');
          addPublishButton();
        }
      });
    } else {
      console.log('CMS not available for event listeners, retrying...');
      setTimeout(addCMSListeners, 100);
    }
  }
  
  // Start adding CMS listeners
  addCMSListeners();
  
  console.log('Simple publish button script loaded');
})();
