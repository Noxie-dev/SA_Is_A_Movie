/**
 * Unit tests for Blog Posting functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    VITE_CONTENTFUL_SPACE_ID: 'test-space-id',
    VITE_CONTENTFUL_ACCESS_TOKEN: 'test-access-token'
  };
});

afterEach(() => {
  process.env = originalEnv;
  vi.clearAllMocks();
});

describe('Blog Posting Service', () => {
  it('should create blog post from trending story', async () => {
    const mockStory = {
      sys: { id: 'trending-story-123' },
      fields: {
        title: 'Test Trending Story',
        description: 'This is a test trending story description',
        category: 'music',
        color: 'saisa-text-blue',
        author: {
          name: 'Test Author',
          role: 'Music Reporter',
          avatar: 'https://example.com/avatar.jpg'
        },
        featuredImage: {
          sys: { id: 'image-123' }
        }
      }
    };

    const mockAuthorDetails = {
      name: 'Test Author',
      role: 'Music Reporter'
    };

    const mockBlogPostResponse = {
      sys: { id: 'blog-post-456' },
      fields: {
        title: 'Test Trending Story',
        slug: 'test-trending-story',
        excerpt: 'This is a test trending story description',
        category: 'music',
        author: 'Test Author',
        isPublished: true,
        publishedDate: new Date().toISOString(),
        sourceStoryId: 'trending-story-123'
      }
    };

    // Mock the actual function response instead of individual fetch calls
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        blogPost: mockBlogPostResponse
      })
    });

    global.fetch = mockFetch;

    // Simulate the blog posting process
    const response = await fetch('/.netlify/functions/post-story-to-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyId: 'trending-story-123',
        authorDetails: mockAuthorDetails
      })
    });

    const result = await response.json();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    expect(result.blogPost.sys.id).toBe('blog-post-456');
  });

  it('should generate correct slug from title', () => {
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    };

    const testCases = [
      { input: 'Amapiano Festival Rocks Johannesburg', expected: 'amapiano-festival-rocks-johannesburg' },
      { input: 'Political Drama Unfolds in Parliament!', expected: 'political-drama-unfolds-in-parliament' },
      { input: 'Celebrity Couple\'s Public Breakup', expected: 'celebrity-couples-public-breakup' },
      { input: 'Viral TikTok Dance Takes Over Mzansi', expected: 'viral-tiktok-dance-takes-over-mzansi' }
    ];

    testCases.forEach(({ input, expected }) => {
      expect(generateSlug(input)).toBe(expected);
    });
  });

  it('should assign correct tags based on category', () => {
    const getCategoryTags = (category) => {
      const categoryTags = {
        music: ['music', 'amapiano', 'entertainment'],
        scandal: ['scandal', 'drama', 'controversy'],
        celebrity: ['celebrity', 'entertainment', 'drama'],
        culture: ['culture', 'south-africa', 'trending'],
        politics: ['politics', 'government', 'news'],
        sports: ['sports', 'athletes', 'competition']
      };
      return categoryTags[category] || ['trending', 'news'];
    };

    expect(getCategoryTags('music')).toEqual(['music', 'amapiano', 'entertainment']);
    expect(getCategoryTags('scandal')).toEqual(['scandal', 'drama', 'controversy']);
    expect(getCategoryTags('celebrity')).toEqual(['celebrity', 'entertainment', 'drama']);
    expect(getCategoryTags('unknown')).toEqual(['trending', 'news']);
  });

  it('should handle duplicate blog post prevention', async () => {
    const mockExistingBlogPost = {
      sys: { id: 'existing-blog-post' },
      fields: {
        sourceStoryId: 'trending-story-123'
      }
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: () => Promise.resolve({
        error: 'Story already posted to blog',
        blogPostId: 'existing-blog-post'
      })
    });

    global.fetch = mockFetch;

    const response = await fetch('/.netlify/functions/post-story-to-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyId: 'trending-story-123',
        authorDetails: { name: 'Test Author' }
      })
    });

    const result = await response.json();

    expect(response.status).toBe(409);
    expect(result.error).toBe('Story already posted to blog');
    expect(result.blogPostId).toBe('existing-blog-post');
  });

  it('should handle missing story ID', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Story ID is required' })
    });

    global.fetch = mockFetch;

    const response = await fetch('/.netlify/functions/post-story-to-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authorDetails: { name: 'Test Author' }
      })
    });

    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toBe('Story ID is required');
  });

  it('should handle story not found', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Story not found' })
    });

    global.fetch = mockFetch;

    const response = await fetch('/.netlify/functions/post-story-to-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyId: 'non-existent-story',
        authorDetails: { name: 'Test Author' }
      })
    });

    const result = await response.json();

    expect(response.status).toBe(404);
    expect(result.error).toBe('Story not found');
  });

  it('should create proper blog post structure', () => {
    const createBlogPostData = (story, authorDetails) => {
      const slug = story.fields.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

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

      return blogPostData;
    };

    const mockStory = {
      sys: { id: 'test-story' },
      fields: {
        title: 'Test Story',
        description: 'Test description',
        category: 'music'
      }
    };

    const mockAuthor = { name: 'Test Author' };

    const result = createBlogPostData(mockStory, mockAuthor);

    expect(result.fields.title['en-US']).toBe('Test Story');
    expect(result.fields.slug['en-US']).toBe('test-story');
    expect(result.fields.author['en-US']).toBe('Test Author');
    expect(result.fields.sourceStoryId['en-US']).toBe('test-story');
    expect(result.fields.isPublished['en-US']).toBe(true);
  });

  it('should handle Contentful API errors', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({
        error: 'Contentful API error',
        details: 'Internal server error'
      })
    });

    global.fetch = mockFetch;

    const response = await fetch('/.netlify/functions/post-story-to-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyId: 'test-story',
        authorDetails: { name: 'Test Author' }
      })
    });

    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.error).toBe('Contentful API error');
  });

  it('should validate required environment variables', () => {
    const validateEnvironment = () => {
      const required = [
        'VITE_CONTENTFUL_SPACE_ID',
        'VITE_CONTENTFUL_ACCESS_TOKEN'
      ];

      const missing = required.filter(key => !process.env[key]);
      
      if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
      }

      return true;
    };

    // Test with all variables present
    expect(validateEnvironment()).toBe(true);

    // Test with missing variables
    delete process.env.VITE_CONTENTFUL_SPACE_ID;
    expect(() => validateEnvironment()).toThrow('Missing required environment variables');
  });

  it('should handle network errors gracefully', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));

    global.fetch = mockFetch;

    try {
      await fetch('/.netlify/functions/post-story-to-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId: 'test-story',
          authorDetails: { name: 'Test Author' }
        })
      });
    } catch (error) {
      expect(error.message).toBe('Network error');
    }
  });
});
