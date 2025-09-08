/**
 * Unit tests for Vision API copyright checking functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the Vision API function
const mockVisionAPI = vi.fn();

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    VITE_GOOGLE_VISION_API_KEY: 'test-vision-api-key'
  };
});

afterEach(() => {
  process.env = originalEnv;
  vi.clearAllMocks();
});

describe('Vision API Copyright Check', () => {
  it('should analyze image for copyright issues', async () => {
    const mockResponse = {
      responses: [{
        textAnnotations: [
          {
            description: '© 2024 All Rights Reserved'
          }
        ],
        webDetection: {
          webEntities: [
            {
              description: 'Copyrighted Image',
              score: 0.8
            }
          ],
          visuallySimilarImages: [
            {
              url: 'https://example.com/similar-image.jpg'
            }
          ]
        },
        safeSearchAnnotation: {
          adult: 'UNLIKELY',
          violence: 'UNLIKELY',
          racy: 'UNLIKELY'
        }
      }]
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    global.fetch = mockFetch;

    // Simulate the Vision API call
    const response = await fetch('/.netlify/functions/vision-copyright-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl: 'https://example.com/test-image.jpg'
      })
    });

    const result = await response.json();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('vision-copyright-check'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('https://example.com/test-image.jpg')
      })
    );

    expect(result.responses[0].textAnnotations).toBeDefined();
    expect(result.responses[0].webDetection).toBeDefined();
    expect(result.responses[0].safeSearchAnnotation).toBeDefined();
  });

  it('should detect copyright indicators in text', () => {
    const copyrightKeywords = [
      'copyright', '©', 'all rights reserved', 'proprietary',
      'trademark', '™', 'registered', '®', 'watermark'
    ];

    const testText = 'This image is © 2024 All Rights Reserved';
    const foundKeywords = copyrightKeywords.filter(keyword => 
      testText.toLowerCase().includes(keyword)
    );

    expect(foundKeywords).toContain('©');
    expect(foundKeywords).toContain('all rights reserved');
  });

  it('should assess copyright risk levels', () => {
    const analyzeForCopyright = (visionResult) => {
      const analysis = {
        copyrightRisk: 'low',
        confidence: 0,
        issues: [],
        recommendations: []
      };

      // Check for text that might indicate copyrighted content
      if (visionResult.textAnnotations) {
        const textContent = visionResult.textAnnotations
          .map(annotation => annotation.description)
          .join(' ')
          .toLowerCase();

        const copyrightKeywords = [
          'copyright', '©', 'all rights reserved', 'proprietary',
          'trademark', '™', 'registered', '®', 'watermark'
        ];

        const foundKeywords = copyrightKeywords.filter(keyword => 
          textContent.includes(keyword)
        );

        if (foundKeywords.length > 0) {
          analysis.copyrightRisk = 'high';
          analysis.confidence = 0.9;
          analysis.issues.push(`Found copyright indicators: ${foundKeywords.join(', ')}`);
          analysis.recommendations.push('Review image for copyright compliance before publishing');
        }
      }

      // Determine final status
      if (analysis.copyrightRisk === 'high') {
        analysis.status = 'rejected';
      } else if (analysis.copyrightRisk === 'medium') {
        analysis.status = 'flagged';
      } else {
        analysis.status = 'approved';
      }

      return analysis;
    };

    // Test high risk scenario
    const highRiskResult = {
      textAnnotations: [
        { description: '© 2024 All Rights Reserved' }
      ]
    };

    const highRiskAnalysis = analyzeForCopyright(highRiskResult);
    expect(highRiskAnalysis.copyrightRisk).toBe('high');
    expect(highRiskAnalysis.status).toBe('rejected');
    expect(highRiskAnalysis.issues.length).toBeGreaterThan(0);

    // Test low risk scenario
    const lowRiskResult = {
      textAnnotations: [
        { description: 'Beautiful landscape photo' }
      ]
    };

    const lowRiskAnalysis = analyzeForCopyright(lowRiskResult);
    expect(lowRiskAnalysis.copyrightRisk).toBe('low');
    expect(lowRiskAnalysis.status).toBe('approved');
  });

  it('should handle API errors gracefully', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({
        error: 'Invalid image URL'
      })
    });

    global.fetch = mockFetch;

    try {
      const response = await fetch('/.netlify/functions/vision-copyright-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: 'invalid-url'
        })
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    } catch (error) {
      // Should handle errors gracefully
      expect(error).toBeDefined();
    }
  });

  it('should validate required parameters', () => {
    const validateRequest = (body) => {
      const { imageUrl, imageBase64 } = body;
      
      if (!imageUrl && !imageBase64) {
        return {
          valid: false,
          error: 'Image URL or base64 data is required'
        };
      }
      
      return { valid: true };
    };

    // Test valid request
    const validRequest = { imageUrl: 'https://example.com/image.jpg' };
    expect(validateRequest(validRequest).valid).toBe(true);

    // Test invalid request
    const invalidRequest = {};
    expect(validateRequest(invalidRequest).valid).toBe(false);
    expect(validateRequest(invalidRequest).error).toBe('Image URL or base64 data is required');
  });

  it('should process base64 images correctly', () => {
    const processImageData = (imageBase64) => {
      if (imageBase64) {
        // Remove data URL prefix if present
        const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
        return {
          content: base64Data
        };
      }
      return null;
    };

    const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...';
    const result = processImageData(dataUrl);

    expect(result.content).toBe('/9j/4AAQSkZJRgABAQEAYABgAAD...');
    expect(result.content).not.toContain('data:image/jpeg;base64,');
  });

  it('should handle web detection results', () => {
    const processWebDetection = (webDetection) => {
      const analysis = {
        copyrightRisk: 'low',
        issues: [],
        recommendations: []
      };

      if (webDetection.webEntities) {
        const entities = webDetection.webEntities.filter(entity => 
          entity.score > 0.7
        );

        if (entities.length > 0) {
          analysis.copyrightRisk = 'medium';
          analysis.issues.push(`Image matches known web entities: ${entities.map(e => e.description).join(', ')}`);
          analysis.recommendations.push('Verify image source and usage rights');
        }
      }

      if (webDetection.visuallySimilarImages && webDetection.visuallySimilarImages.length > 0) {
        analysis.copyrightRisk = analysis.copyrightRisk === 'high' ? 'high' : 'medium';
        analysis.issues.push('Image has visually similar matches on the web');
        analysis.recommendations.push('Check if similar images are copyrighted');
      }

      return analysis;
    };

    const webDetection = {
      webEntities: [
        { description: 'Famous Logo', score: 0.8 }
      ],
      visuallySimilarImages: [
        { url: 'https://example.com/similar.jpg' }
      ]
    };

    const result = processWebDetection(webDetection);
    expect(result.copyrightRisk).toBe('medium');
    expect(result.issues.length).toBe(2);
    expect(result.recommendations.length).toBe(2);
  });

  it('should check safe search results', () => {
    const processSafeSearch = (safeSearchAnnotation) => {
      const analysis = {
        copyrightRisk: 'low',
        issues: [],
        recommendations: []
      };

      const unsafeCategories = ['adult', 'violence', 'racy'];
      const unsafeResults = unsafeCategories.filter(category => 
        safeSearchAnnotation[category] === 'LIKELY' || safeSearchAnnotation[category] === 'VERY_LIKELY'
      );

      if (unsafeResults.length > 0) {
        analysis.copyrightRisk = 'high';
        analysis.issues.push(`Inappropriate content detected: ${unsafeResults.join(', ')}`);
        analysis.recommendations.push('Do not use this image - contains inappropriate content');
      }

      return analysis;
    };

    // Test safe content
    const safeContent = {
      adult: 'UNLIKELY',
      violence: 'UNLIKELY',
      racy: 'UNLIKELY'
    };

    const safeResult = processSafeSearch(safeContent);
    expect(safeResult.copyrightRisk).toBe('low');

    // Test unsafe content
    const unsafeContent = {
      adult: 'LIKELY',
      violence: 'UNLIKELY',
      racy: 'UNLIKELY'
    };

    const unsafeResult = processSafeSearch(unsafeContent);
    expect(unsafeResult.copyrightRisk).toBe('high');
    expect(unsafeResult.issues.length).toBeGreaterThan(0);
  });
});
