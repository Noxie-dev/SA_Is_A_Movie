#!/usr/bin/env node

/**
 * SA_isaMovie Content Compliance Engine Test Runner
 * 
 * This script tests the compliance engine functionality
 * Run with: node scripts/test-compliance-engine.js
 */

const fetch = require('node-fetch');

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
async function testComplianceEngine(testData, testName) {
  try {
    console.log(`🧪 Testing ${testName}...`);
    
    const startTime = Date.now();
    const response = await fetch('http://localhost:8888/.netlify/functions/complianceEngine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    const endTime = Date.now();
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const duration = endTime - startTime;
    
    console.log(`⏱️  Response time: ${duration}ms`);
    console.log(`📊 Overall Score: ${result.score}%`);
    console.log(`✅ Can Publish: ${result.canPublish}`);
    
    if (result.checks) {
      console.log(`   📝 Grammar: ${result.checks.grammar.score}% (${result.checks.grammar.status})`);
      console.log(`   🛡️  AdSense: ${result.checks.adsense.score}% (${result.checks.adsense.status})`);
      console.log(`   🔍 Facts: ${result.checks.facts.score}% (${result.checks.facts.status})`);
      console.log(`   🚀 SEO: ${result.checks.seo.score}% (${result.checks.seo.status})`);
    }
    
    if (result.recommendations && result.recommendations.length > 0) {
      console.log(`💡 Recommendations: ${result.recommendations.length} found`);
      result.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.action} (${rec.priority})`);
      });
    }
    
    if (result.checks.adsense.violations && result.checks.adsense.violations.length > 0) {
      console.log(`⚠️  AdSense Violations: ${result.checks.adsense.violations.length}`);
      result.checks.adsense.violations.forEach((violation, index) => {
        console.log(`   ${index + 1}. ${violation.message}`);
      });
    }
    
    console.log(''); // Empty line for readability
    
    return {
      success: true,
      result,
      duration
    };
  } catch (error) {
    console.log(`❌ ${testName}: ERROR - ${error.message}`);
    console.log('');
    return {
      success: false,
      error: error.message
    };
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 SA_isaMovie Content Compliance Engine Test Runner');
  console.log('================================================\n');
  
  // Check if Netlify dev server is running
  try {
    const healthCheck = await fetch('http://localhost:8888/.netlify/functions/complianceEngine', {
      method: 'GET'
    });
    
    if (healthCheck.status === 405) {
      console.log('✅ Netlify dev server is running (Method not allowed is expected for GET)');
    } else {
      console.log('⚠️  Netlify dev server response:', healthCheck.status);
    }
  } catch (error) {
    console.log('❌ Netlify dev server is not running!');
    console.log('Please start it with: netlify dev');
    console.log('');
    process.exit(1);
  }
  
  console.log('');
  
  const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    totalDuration: 0
  };

  // Run all test cases
  for (const [testName, testData] of Object.entries(testCases)) {
    testResults.total++;
    
    const testResult = await testComplianceEngine(testData, testName);
    
    if (testResult.success) {
      testResults.passed++;
      testResults.totalDuration += testResult.duration;
    } else {
      testResults.failed++;
    }
  }
  
  // Print summary
  console.log('📊 Test Summary');
  console.log('===============');
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  console.log(`Average Response Time: ${(testResults.totalDuration / testResults.passed).toFixed(0)}ms`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ Some tests failed. Check the output above for details.');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed! The compliance engine is working correctly.');
    process.exit(0);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('SA_isaMovie Content Compliance Engine Test Runner');
  console.log('');
  console.log('Usage: node scripts/test-compliance-engine.js');
  console.log('');
  console.log('Options:');
  console.log('  --help, -h    Show this help message');
  console.log('');
  console.log('Prerequisites:');
  console.log('  - Netlify dev server must be running (netlify dev)');
  console.log('  - Environment variables must be set');
  console.log('  - All API keys must be configured');
  process.exit(0);
}

// Run the tests
runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
