# SA_isaMovie Content Compliance Engine - Integration Guide

## 🎯 Overview

The SA_isaMovie Content Compliance Engine is a comprehensive real-time content analysis system that ensures your blog posts meet AdSense policies, SEO best practices, grammar standards, and factual accuracy requirements before publication.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI      │    │  Netlify Function │    │  External APIs  │
│                 │    │                  │    │                 │
│ ComplianceChecker│◄──►│ complianceEngine │◄──►│ LanguageTool    │
│                 │    │                  │    │ Google APIs     │
│ BlogEditor      │    │                  │    │ OpenAI          │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📦 Components

### 1. Serverless Function (`/netlify/functions/complianceEngine.js`)

**Purpose**: Backend API that performs all compliance checks
**Features**:
- Grammar and readability analysis
- AdSense policy compliance
- Fact-checking and credibility verification
- SEO optimization analysis
- Parallel processing for performance

### 2. React Component (`/src/components/ComplianceChecker.jsx`)

**Purpose**: User interface for displaying compliance results
**Features**:
- Real-time compliance checking
- Interactive result display
- Accessibility-compliant design
- Auto-check with debouncing
- Actionable recommendations

### 3. Integration Example (`/src/components/BlogEditor.jsx`)

**Purpose**: Example implementation showing how to integrate the compliance checker
**Features**:
- Complete blog editor interface
- Image upload with alt text
- Publishing workflow integration

## 🔧 Integration Steps

### Step 1: Basic Integration

```jsx
import ComplianceChecker from './components/ComplianceChecker';

function YourBlogEditor() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [images, setImages] = useState([]);

  return (
    <div>
      {/* Your existing editor UI */}
      <ComplianceChecker
        content={content}
        title={title}
        metaDescription={metaDescription}
        images={images}
        onPublish={(results) => {
          if (results.canPublish) {
            // Handle publishing
            console.log('Publishing with score:', results.score);
          }
        }}
      />
    </div>
  );
}
```

### Step 2: Advanced Integration with Custom Publishing

```jsx
const handlePublish = async (complianceResults) => {
  if (!complianceResults.canPublish) {
    // Show user-friendly error message
    setError('Please fix all compliance issues before publishing.');
    return;
  }

  try {
    // Save compliance data for analytics
    await saveComplianceHistory({
      postId: currentPost.id,
      score: complianceResults.score,
      checks: complianceResults.checks,
      published: true
    });

    // Publish the post
    await publishPost({
      ...postData,
      complianceScore: complianceResults.score,
      complianceChecks: complianceResults.checks
    });

    // Track success metrics
    trackEvent('content_published', {
      compliance_score: complianceResults.score,
      category: 'blog'
    });

  } catch (error) {
    console.error('Publishing failed:', error);
    setError('Failed to publish. Please try again.');
  }
};
```

### Step 3: Custom Styling and Theming

```jsx
// Custom theme configuration
const customTheme = {
  colors: {
    primary: 'blue',
    success: 'green',
    warning: 'yellow',
    danger: 'red'
  },
  spacing: {
    padding: 'p-6',
    margin: 'm-4'
  }
};

// Apply custom styling
<ComplianceChecker
  {...props}
  className="custom-compliance-checker"
  theme={customTheme}
/>
```

## 🎨 Customization Options

### 1. Compliance Rules Configuration

```javascript
// In complianceEngine.js
const CUSTOM_ADSENSE_RULES = {
  minWordCount: 500,        // Increase minimum word count
  maxKeywordDensity: 0.02,  // Stricter keyword density
  prohibitedTerms: [
    ...ADSENSE_RULES.prohibitedTerms,
    'custom-prohibited-term'
  ],
  minParagraphLength: 75,   // Longer paragraphs required
  maxDuplicateRatio: 0.15   // Stricter duplicate content check
};
```

### 2. Scoring Weights Adjustment

```javascript
// Customize scoring importance
const CUSTOM_WEIGHTS = {
  grammar: 0.30,    // Increase grammar importance
  adsense: 0.30,    // Decrease AdSense importance
  facts: 0.25,      // Increase fact-checking importance
  seo: 0.15         // Decrease SEO importance
};
```

### 3. UI Customization

```jsx
// Custom status colors
const getCustomStatusColor = (status) => {
  switch (status) {
    case 'pass':
      return 'border-emerald-200 bg-emerald-50';
    case 'warning':
      return 'border-amber-200 bg-amber-50';
    case 'fail':
      return 'border-rose-200 bg-rose-50';
    default:
      return 'border-slate-200 bg-white';
  }
};

// Custom icons
const customIcons = {
  grammar: BookOpen,
  adsense: Shield,
  facts: Search,
  seo: TrendingUp
};
```

## 📊 Analytics Integration

### 1. Google Analytics 4

```javascript
// Track compliance metrics
const trackComplianceMetrics = (results) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'content_compliance_check', {
      event_category: 'content_quality',
      event_label: 'compliance_analysis',
      value: results.score,
      custom_parameters: {
        grammar_score: results.checks.grammar.score,
        adsense_score: results.checks.adsense.score,
        facts_score: results.checks.facts.score,
        seo_score: results.checks.seo.score,
        can_publish: results.canPublish
      }
    });
  }
};
```

### 2. Custom Analytics Dashboard

```javascript
// Store compliance data in your database
const saveComplianceData = async (postId, results) => {
  await fetch('/api/compliance-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      postId,
      timestamp: new Date().toISOString(),
      overallScore: results.score,
      grammarScore: results.checks.grammar.score,
      adsenseScore: results.checks.adsense.score,
      factsScore: results.checks.facts.score,
      seoScore: results.checks.seo.score,
      violations: results.checks.adsense.violations,
      warnings: results.checks.adsense.warnings,
      recommendations: results.recommendations
    })
  });
};
```

## 🔄 Workflow Integration

### 1. CMS Integration

```javascript
// Sanity CMS integration example
const sanityComplianceCheck = async (document) => {
  const complianceResults = await fetch('/.netlify/functions/complianceEngine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: document.content,
      title: document.title,
      metaDescription: document.metaDescription,
      images: document.images
    })
  }).then(res => res.json());

  // Update document with compliance data
  await client
    .patch(document._id)
    .set({
      complianceScore: complianceResults.score,
      complianceChecks: complianceResults.checks,
      lastComplianceCheck: new Date().toISOString()
    })
    .commit();
};
```

### 2. Contentful Integration

```javascript
// Contentful webhook integration
const contentfulWebhook = async (req, res) => {
  const { entry } = req.body;
  
  if (entry.sys.contentType.sys.id === 'blogPost') {
    const complianceResults = await checkCompliance({
      content: entry.fields.content['en-US'],
      title: entry.fields.title['en-US'],
      metaDescription: entry.fields.metaDescription['en-US']
    });

    // Update entry with compliance data
    await contentfulClient.getSpace(SPACE_ID)
      .then(space => space.getEnvironment('master'))
      .then(environment => environment.getEntry(entry.sys.id))
      .then(entry => {
        entry.fields.complianceScore = { 'en-US': complianceResults.score };
        return entry.update();
      });
  }
};
```

## 🚀 Performance Optimization

### 1. Caching Strategy

```javascript
// Implement Redis caching
const getCachedComplianceResult = async (contentHash) => {
  const redis = require('redis');
  const client = redis.createClient(process.env.REDIS_URL);
  
  try {
    const cached = await client.get(`compliance:${contentHash}`);
    return cached ? JSON.parse(cached) : null;
  } finally {
    await client.quit();
  }
};

const setCachedComplianceResult = async (contentHash, result) => {
  const redis = require('redis');
  const client = redis.createClient(process.env.REDIS_URL);
  
  try {
    await client.setex(`compliance:${contentHash}`, 3600, JSON.stringify(result));
  } finally {
    await client.quit();
  }
};
```

### 2. Batch Processing

```javascript
// Process multiple posts at once
const batchComplianceCheck = async (posts) => {
  const results = await Promise.allSettled(
    posts.map(async (post) => {
      try {
        const result = await checkCompliance(post);
        return { postId: post.id, result, success: true };
      } catch (error) {
        return { postId: post.id, error: error.message, success: false };
      }
    })
  );
  
  return results.map(r => r.value);
};
```

## 🧪 Testing

### 1. Unit Tests

```javascript
// Jest test example
describe('ComplianceEngine', () => {
  test('should pass good content', async () => {
    const goodContent = `
      # The Future of South African Cinema
      
      South African cinema has experienced remarkable growth over the past decade.
      With over 500 productions completed in 2023, the industry shows no signs
      of slowing down.
    `;
    
    const result = await checkCompliance({
      content: goodContent,
      title: 'The Future of South African Cinema',
      metaDescription: 'An in-depth look at the growth of South African cinema industry'
    });
    
    expect(result.score).toBeGreaterThan(70);
    expect(result.canPublish).toBe(true);
  });
  
  test('should fail content with prohibited terms', async () => {
    const badContent = 'This content contains gambling and casino information.';
    
    const result = await checkCompliance({
      content: badContent,
      title: 'Test Title',
      metaDescription: 'Test description'
    });
    
    expect(result.checks.adsense.violations).toContainEqual(
      expect.objectContaining({
        rule: 'PROHIBITED_CONTENT'
      })
    );
    expect(result.canPublish).toBe(false);
  });
});
```

### 2. Integration Tests

```javascript
// Cypress test example
describe('Compliance Checker UI', () => {
  it('should display compliance results', () => {
    cy.visit('/blog-editor');
    
    // Enter content
    cy.get('[data-testid="content-input"]').type(`
      # Test Blog Post
      
      This is a test blog post with sufficient content to trigger
      the compliance checker. It should pass most checks.
    `);
    
    // Wait for auto-check
    cy.get('[data-testid="compliance-score"]', { timeout: 10000 })
      .should('be.visible');
    
    // Verify score display
    cy.get('[data-testid="compliance-score"]')
      .should('contain.text', '%');
  });
});
```

## 🔧 Troubleshooting

### Common Issues

1. **API Rate Limits**
   ```javascript
   // Implement exponential backoff
   const retryWithBackoff = async (fn, maxRetries = 3) => {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (error.status === 429 && i < maxRetries - 1) {
           await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
           continue;
         }
         throw error;
       }
     }
   };
   ```

2. **Environment Variables Not Set**
   ```javascript
   // Add validation in your function
   const validateEnvironment = () => {
     const required = ['LANGUAGE_TOOL_API_KEY', 'GOOGLE_PERSPECTIVE_API_KEY'];
     const missing = required.filter(key => !process.env[key]);
     
     if (missing.length > 0) {
       throw new Error(`Missing environment variables: ${missing.join(', ')}`);
     }
   };
   ```

3. **Slow Response Times**
   ```javascript
   // Implement timeout and fallback
   const checkComplianceWithTimeout = async (data, timeout = 30000) => {
     const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), timeout);
     
     try {
       const response = await fetch('/.netlify/functions/complianceEngine', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
         signal: controller.signal
       });
       
       clearTimeout(timeoutId);
       return await response.json();
     } catch (error) {
       clearTimeout(timeoutId);
       if (error.name === 'AbortError') {
         throw new Error('Compliance check timed out');
       }
       throw error;
     }
   };
   ```

## 📈 Monitoring and Maintenance

### 1. Health Checks

```javascript
// Add health check endpoint
exports.healthCheck = async (event, context) => {
  const checks = {
    languageTool: await checkLanguageToolAPI(),
    perspective: await checkPerspectiveAPI(),
    factCheck: await checkFactCheckAPI(),
    openai: await checkOpenAIAPI()
  };
  
  const allHealthy = Object.values(checks).every(check => check.healthy);
  
  return {
    statusCode: allHealthy ? 200 : 503,
    body: JSON.stringify({
      status: allHealthy ? 'healthy' : 'unhealthy',
      checks
    })
  };
};
```

### 2. Usage Monitoring

```javascript
// Track API usage
const trackAPIUsage = async (service, endpoint, responseTime) => {
  await fetch('/api/usage-tracking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service,
      endpoint,
      responseTime,
      timestamp: new Date().toISOString()
    })
  });
};
```

## 🎯 Best Practices

1. **Always validate input** on both client and server side
2. **Implement proper error handling** with user-friendly messages
3. **Use caching** to reduce API calls and improve performance
4. **Monitor API usage** to avoid rate limits and unexpected costs
5. **Regularly update** prohibited terms and compliance rules
6. **Test thoroughly** with various content types and edge cases
7. **Document customizations** for future maintenance
8. **Implement analytics** to track compliance trends and improvements

## 📞 Support

For additional support:
- Check the troubleshooting section above
- Review API documentation for external services
- Monitor console logs for detailed error information
- Contact the development team with specific error messages and reproduction steps

---

This integration guide provides comprehensive instructions for implementing the SA_isaMovie Content Compliance Engine. Follow the steps carefully and customize according to your specific needs.
