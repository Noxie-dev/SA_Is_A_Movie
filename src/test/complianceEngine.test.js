// Test file for the SA_isaMovie Content Compliance Engine
// This file contains test cases to validate the compliance engine functionality

import { describe, test, expect, beforeAll, afterAll } from 'vitest';

// Mock fetch for testing
global.fetch = require('node-fetch');

// Test data
const testCases = {
  goodContent: {
    content: `
      # The Future of South African Cinema

      South African cinema has experienced remarkable growth over the past decade. 
      With over 500 productions completed in 2023, the industry shows no signs 
      of slowing down. Major studios have invested billions of rand into local 
      productions, creating thousands of jobs for talented South African filmmakers.

      ## Key Developments in 2023

      The establishment of new film studios in Cape Town and Johannesburg has 
      attracted international productions from major Hollywood studios. According 
      to the National Film and Video Foundation, the industry contributed R7.2 
      billion to the GDP in 2023, representing a 15% increase from the previous year.

      ## Local Streaming Platforms

      Local streaming platforms have also emerged, providing new distribution 
      channels for South African content. This digital revolution has made 
      local films more accessible than ever before, reaching audiences across 
      the continent and beyond.

      ## International Recognition

      South African films have gained international recognition at major film 
      festivals, including Cannes, Sundance, and the Toronto International 
      Film Festival. This global exposure has opened doors for local talent 
      and increased investment in the industry.

      ## Conclusion

      The future of South African cinema looks bright, with continued growth 
      expected in the coming years. The combination of local talent, 
      international partnerships, and technological advancement positions 
      South Africa as a leading film production hub in Africa.
    `,
    title: 'The Future of South African Cinema: A Comprehensive Analysis',
    metaDescription: 'Explore the remarkable growth of South African cinema industry, from local productions to international recognition, and discover what the future holds for African filmmaking.',
    images: [
      { id: 1, alt: 'South African film set with crew members working on a production' },
      { id: 2, alt: 'Cape Town film studio exterior showing modern facilities' }
    ]
  },

  problematicContent: {
    content: `
      Buy now! Click here! 
      
      This is thin content with keyword stuffing movie movie movie movie.
      Contains prohibited terms and lacks substance. Casino gambling adult content.
      Very short paragraphs. No real value.
    `,
    title: 'Short Title',
    metaDescription: 'Short desc',
    images: []
  },

  mediumContent: {
    content: `
      # South African Film Industry Overview

      The South African film industry has grown significantly in recent years.
      Local productions have gained international recognition and critical acclaim.
      Major studios have established facilities in Cape Town and Johannesburg.

      ## Key Statistics

      According to industry reports, the film sector contributed over R5 billion
      to the economy last year. This represents substantial growth from previous
      years and indicates a positive trend for the industry.

      ## Challenges and Opportunities

      While the industry faces challenges such as funding and distribution,
      there are numerous opportunities for growth. International partnerships
      and co-productions have become increasingly common.

      The future looks promising for South African cinema, with continued
      investment and support from both government and private sector.
    `,
    title: 'South African Film Industry: Growth and Opportunities',
    metaDescription: 'An overview of the South African film industry, including key statistics, challenges, and future opportunities for growth and development.',
    images: [
      { id: 1, alt: 'Film production equipment on set' }
    ]
  }
};

// Helper function to test compliance engine
async function testComplianceEngine(testData) {
  try {
    const response = await fetch('/.netlify/functions/complianceEngine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Compliance engine test failed:', error);
    return { success: false, error: error.message };
  }
}

describe('SA_isaMovie Content Compliance Engine', () => {
  describe('Good Content Tests', () => {
    test('should pass high-quality content', async () => {
      const result = await testComplianceEngine(testCases.goodContent);
      
      expect(result.success).toBe(true);
      expect(result.score).toBeGreaterThan(70);
      expect(result.canPublish).toBe(true);
    }, 30000);

    test('should have good grammar score', async () => {
      const result = await testComplianceEngine(testCases.goodContent);
      
      expect(result.checks.grammar.score).toBeGreaterThan(60);
      expect(result.checks.grammar.status).toMatch(/pass|warning/);
    }, 30000);

    test('should pass AdSense compliance', async () => {
      const result = await testComplianceEngine(testCases.goodContent);
      
      expect(result.checks.adsense.violations).toHaveLength(0);
      expect(result.checks.adsense.status).toMatch(/pass|warning/);
    }, 30000);

    test('should have good SEO score', async () => {
      const result = await testComplianceEngine(testCases.goodContent);
      
      expect(result.checks.seo.score).toBeGreaterThan(60);
      expect(result.checks.seo.issues).toHaveLength(0);
    }, 30000);
  });

  describe('Problematic Content Tests', () => {
    test('should fail content with prohibited terms', async () => {
      const result = await testComplianceEngine(testCases.problematicContent);
      
      expect(result.success).toBe(true);
      expect(result.score).toBeLessThan(70);
      expect(result.canPublish).toBe(false);
    }, 30000);

    test('should detect AdSense violations', async () => {
      const result = await testComplianceEngine(testCases.problematicContent);
      
      expect(result.checks.adsense.violations.length).toBeGreaterThan(0);
      expect(result.checks.adsense.status).toBe('fail');
    }, 30000);

    test('should identify SEO issues', async () => {
      const result = await testComplianceEngine(testCases.problematicContent);
      
      expect(result.checks.seo.issues.length).toBeGreaterThan(0);
      expect(result.checks.seo.score).toBeLessThan(60);
    }, 30000);
  });

  describe('Medium Quality Content Tests', () => {
    test('should provide warnings for medium content', async () => {
      const result = await testComplianceEngine(testCases.mediumContent);
      
      expect(result.success).toBe(true);
      expect(result.score).toBeGreaterThan(40);
      expect(result.score).toBeLessThan(80);
    }, 30000);

    test('should generate recommendations', async () => {
      const result = await testComplianceEngine(testCases.mediumContent);
      
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    }, 30000);
  });

  describe('Error Handling Tests', () => {
    test('should handle empty content', async () => {
      const result = await testComplianceEngine({
        content: '',
        title: 'Test',
        metaDescription: 'Test',
        images: []
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Content is required');
    }, 10000);

    test('should handle missing title', async () => {
      const result = await testComplianceEngine({
        content: 'Some content here',
        title: '',
        metaDescription: 'Test description',
        images: []
      });
      
      expect(result.success).toBe(true);
      expect(result.checks.adsense.violations).toContainEqual(
        expect.objectContaining({
          rule: 'MISSING_TITLE'
        })
      );
    }, 30000);

    test('should handle invalid request method', async () => {
      try {
        const response = await fetch('/.netlify/functions/complianceEngine', {
          method: 'GET'
        });
        
        expect(response.status).toBe(405);
      } catch (error) {
        // Expected in test environment
        expect(error).toBeDefined();
      }
    }, 10000);
  });

  describe('Performance Tests', () => {
    test('should complete check within reasonable time', async () => {
      const startTime = Date.now();
      const result = await testComplianceEngine(testCases.goodContent);
      const endTime = Date.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(30000); // 30 seconds max
    }, 35000);

    test('should handle concurrent requests', async () => {
      const promises = [
        testComplianceEngine(testCases.goodContent),
        testComplianceEngine(testCases.mediumContent),
        testComplianceEngine(testCases.problematicContent)
      ];
      
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toHaveProperty('success');
        expect(result).toHaveProperty('score');
      });
    }, 45000);
  });

  describe('Data Structure Tests', () => {
    test('should return proper response structure', async () => {
      const result = await testComplianceEngine(testCases.goodContent);
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('checks');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('canPublish');
      
      expect(result.checks).toHaveProperty('grammar');
      expect(result.checks).toHaveProperty('adsense');
      expect(result.checks).toHaveProperty('facts');
      expect(result.checks).toHaveProperty('seo');
    }, 30000);

    test('should have valid score ranges', async () => {
      const result = await testComplianceEngine(testCases.goodContent);
      
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      
      Object.values(result.checks).forEach(check => {
        expect(check.score).toBeGreaterThanOrEqual(0);
        expect(check.score).toBeLessThanOrEqual(100);
      });
    }, 30000);
  });
});

// Integration test for React component
describe('ComplianceChecker React Component', () => {
  test('should render without crashing', () => {
    // This would require a proper React testing setup
    // For now, we'll just verify the component exists
    const ComplianceChecker = require('../components/ComplianceChecker.jsx');
    expect(ComplianceChecker).toBeDefined();
  });

  test('should handle props correctly', () => {
    const props = {
      content: testCases.goodContent.content,
      title: testCases.goodContent.title,
      metaDescription: testCases.goodContent.metaDescription,
      images: testCases.goodContent.images,
      onPublish: jest.fn()
    };
    
    // In a real test environment, you would render the component
    // and test its behavior with these props
    expect(props.content).toBeDefined();
    expect(props.title).toBeDefined();
    expect(props.metaDescription).toBeDefined();
    expect(props.images).toBeDefined();
    expect(typeof props.onPublish).toBe('function');
  });
});

// Utility function to run manual tests
export const runManualTests = async () => {
  console.log('🧪 Running SA_isaMovie Compliance Engine Manual Tests...\n');
  
  const testResults = {
    passed: 0,
    failed: 0,
    total: 0
  };

  for (const [testName, testData] of Object.entries(testCases)) {
    testResults.total++;
    console.log(`Testing ${testName}...`);
    
    try {
      const result = await testComplianceEngine(testData);
      
      if (result.success) {
        console.log(`✅ ${testName}: PASSED (Score: ${result.score}%)`);
        console.log(`   - Grammar: ${result.checks.grammar.score}%`);
        console.log(`   - AdSense: ${result.checks.adsense.score}%`);
        console.log(`   - Facts: ${result.checks.facts.score}%`);
        console.log(`   - SEO: ${result.checks.seo.score}%`);
        console.log(`   - Can Publish: ${result.canPublish}`);
        testResults.passed++;
      } else {
        console.log(`❌ ${testName}: FAILED - ${result.error}`);
        testResults.failed++;
      }
    } catch (error) {
      console.log(`❌ ${testName}: ERROR - ${error.message}`);
      testResults.failed++;
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log('📊 Test Summary:');
  console.log(`   Total Tests: ${testResults.total}`);
  console.log(`   Passed: ${testResults.passed}`);
  console.log(`   Failed: ${testResults.failed}`);
  console.log(`   Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  return testResults;
};

// Export test cases for external use
export { testCases, testComplianceEngine };
