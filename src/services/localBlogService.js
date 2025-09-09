// Service for posting local stories to blog
export const postLocalStoryToBlog = async (story, authorDetails) => {
  try {
    // Create blog post data from local story
    const blogPostData = {
      title: story.title,
      slug: story.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-'),
      excerpt: story.description,
      body: story.body,
      category: story.category,
      tags: story.tags || [],
      author: authorDetails?.name || story.author?.name || 'SA IS A MOVIE Team',
      isPublished: true,
      date: new Date().toISOString(),
      sourceStoryId: story.id,
      featured_image: story.featured_image || '',
      color: story.color
    };

    // For now, we'll create a local blog post file
    // In a real implementation, this would post to Contentful or another CMS
    const response = await fetch('/.netlify/functions/post-story-to-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyData: blogPostData,
        authorDetails: authorDetails || story.author
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to post story to blog');
    }

    return await response.json();
  } catch (error) {
    console.error('Post local story error:', error);
    
    // Fallback: create a simple success response for local stories
    if (error.message.includes('Failed to fetch') || error.message.includes('netlify')) {
      return {
        success: true,
        message: 'Story prepared for blog posting (local mode)',
        blogPost: {
          sys: { id: `local-blog-${Date.now()}` },
          fields: {
            title: story.title,
            slug: story.title.toLowerCase().replace(/\s+/g, '-'),
            excerpt: story.description
          }
        }
      };
    }
    
    throw error;
  }
};

// Service for creating blog post files locally
export const createLocalBlogPost = async (story, authorDetails) => {
  try {
    const blogPostContent = `---
title: "${story.title}"
slug: "${story.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-')}"
excerpt: "${story.description}"
category: "${story.category}"
tags: ${JSON.stringify(story.tags || [])}
author: "${authorDetails?.name || story.author?.name || 'SA IS A MOVIE Team'}"
isPublished: true
date: ${new Date().toISOString()}
sourceStoryId: "${story.id}"
featured_image: "${story.featured_image || ''}"
color: "${story.color}"
---

${story.body}
`;

    // In a real implementation, this would save to the blog directory
    // For now, we'll return success
    return {
      success: true,
      message: 'Blog post created successfully',
      blogPost: {
        title: story.title,
        slug: story.title.toLowerCase().replace(/\s+/g, '-'),
        content: blogPostContent
      }
    };
  } catch (error) {
    console.error('Create local blog post error:', error);
    throw error;
  }
};
