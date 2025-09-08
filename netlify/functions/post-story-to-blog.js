// Function to post trending story to blog
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { storyId, authorDetails } = req.body;

  if (!storyId) {
    return res.status(400).json({ error: 'Story ID is required' });
  }

  try {
    // Get the trending story from Contentful
    const story = await getTrendingStoryById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Check if story is already posted to blog
    const existingBlogPost = await checkExistingBlogPost(storyId);
    if (existingBlogPost) {
      return res.status(409).json({ 
        error: 'Story already posted to blog',
        blogPostId: existingBlogPost.sys.id 
      });
    }

    // Create blog post from trending story
    const blogPost = await createBlogPostFromStory(story, authorDetails);

    return res.status(201).json({
      success: true,
      blogPost: blogPost,
      message: 'Story successfully posted to blog'
    });

  } catch (error) {
    console.error('Error posting story to blog:', error);
    return res.status(500).json({ 
      error: 'Failed to post story to blog',
      details: error.message 
    });
  }
}

async function getTrendingStoryById(storyId) {
  const spaceId = process.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.VITE_CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    throw new Error('Contentful credentials not configured');
  }

  const response = await fetch(
    `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries/${storyId}?access_token=${accessToken}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch story: ${response.statusText}`);
  }

  return await response.json();
}

async function checkExistingBlogPost(storyId) {
  const spaceId = process.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.VITE_CONTENTFUL_ACCESS_TOKEN;

  const response = await fetch(
    `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&content_type=blogPost&fields.sourceStoryId=${storyId}`
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.items.length > 0 ? data.items[0] : null;
}

async function createBlogPostFromStory(story, authorDetails) {
  const spaceId = process.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.VITE_CONTENTFUL_ACCESS_TOKEN;

  // Generate slug from title
  const slug = story.fields.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');

  // Create blog post entry
  const blogPostData = {
    fields: {
      title: {
        'en-US': story.fields.title
      },
      slug: {
        'en-US': slug
      },
      excerpt: {
        'en-US': story.fields.description
      },
      content: {
        'en-US': {
          nodeType: 'document',
          data: {},
          content: [
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: story.fields.description,
                  marks: [],
                  data: {}
                }
              ]
            }
          ]
        }
      },
      category: {
        'en-US': story.fields.category
      },
      author: {
        'en-US': authorDetails?.name || 'SA IS A MOVIE Team'
      },
      isPublished: {
        'en-US': true
      },
      publishedDate: {
        'en-US': new Date().toISOString()
      },
      sourceStoryId: {
        'en-US': story.sys.id
      }
    }
  };

  // Add featured image if available
  if (story.fields.featuredImage) {
    blogPostData.fields.featuredImage = {
      'en-US': {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: story.fields.featuredImage.sys.id
        }
      }
    };
  }

  // Add tags based on category
  const categoryTags = {
    music: ['music', 'amapiano', 'entertainment'],
    scandal: ['scandal', 'drama', 'controversy'],
    celebrity: ['celebrity', 'entertainment', 'drama'],
    culture: ['culture', 'south-africa', 'trending'],
    politics: ['politics', 'government', 'news'],
    sports: ['sports', 'athletes', 'competition']
  };

  blogPostData.fields.tags = {
    'en-US': categoryTags[story.fields.category] || ['trending', 'news']
  };

  const response = await fetch(
    `https://api.contentful.com/spaces/${spaceId}/environments/master/entries`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'X-Contentful-Content-Type': 'blogPost'
      },
      body: JSON.stringify(blogPostData)
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create blog post: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}
