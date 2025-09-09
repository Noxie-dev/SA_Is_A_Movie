# SA_isaMovie Content Compliance Engine - Setup Guide

## 🚀 Quick Start

This guide will help you set up the Real-time Blog Content Compliance Engine for SA_isaMovie.

## 📋 Prerequisites

### 1. Environment Variables Setup

Create a `.env` file in your root directory with the following API keys:

```env
# Language Tool API (Grammar Check)
LANGUAGE_TOOL_API_KEY=your_languagetool_api_key_here

# Google APIs
GOOGLE_PERSPECTIVE_API_KEY=your_perspective_api_key_here
GOOGLE_FACT_CHECK_API_KEY=your_fact_check_api_key_here

# OpenAI (for enhanced analysis)
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Get Your API Keys

#### LanguageTool API
- Visit: https://languagetoolplus.com/api
- Sign up for a free account
- Get your API key from the dashboard
- Free tier: 1000 requests/day

#### Google Perspective API
1. Go to: https://console.cloud.google.com
2. Create a new project or select existing one
3. Enable the "Perspective Comment Analyzer API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Restrict the key to the Perspective API for security
6. Free tier: 1000 requests/day

#### Google Fact Check Tools API
1. In Google Cloud Console (same project as above)
2. Enable "Fact Check Tools API"
3. Use the same API key or create a new one
4. Free tier: 1000 requests/day

#### OpenAI API
- Visit: https://platform.openai.com/api-keys
- Create a new API key
- Add billing information (pay-per-use)
- Recommended model: GPT-3.5-turbo for cost efficiency

## 🛠️ Installation Steps

### Step 1: Install Dependencies

```bash
# In your project root
npm install node-fetch

# For the React component (if not already installed)
npm install lucide-react
```

### Step 2: Deploy the Serverless Function

The compliance engine function is already created at `/netlify/functions/complianceEngine.js`.

### Step 3: Set Netlify Environment Variables

Set your environment variables in Netlify:

```bash
# Using Netlify CLI
netlify env:set LANGUAGE_TOOL_API_KEY "your_languagetool_api_key_here"
netlify env:set GOOGLE_PERSPECTIVE_API_KEY "your_perspective_api_key_here"
netlify env:set GOOGLE_FACT_CHECK_API_KEY "your_fact_check_api_key_here"
netlify env:set OPENAI_API_KEY "your_openai_api_key_here"

# Or set them in Netlify Dashboard:
# Site Settings → Environment Variables → Add Variable
```

### Step 4: Integrate the React Component

Add the ComplianceChecker component to your CMS editor:

```jsx
import ComplianceChecker from './components/ComplianceChecker';

function BlogEditor() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [images, setImages] = useState([]);

  const handlePublish = async (complianceResults) => {
    if (complianceResults.canPublish) {
      // Your publish logic here
      await publishBlogPost({
        title,
        content,
        metaDescription,
        images,
        complianceScore: complianceResults.score
      });
    }
  };

  return (
    <div>
      {/* Your existing editor UI */}
      
      {/* Add the Compliance Checker */}
      <ComplianceChecker
        content={content}
        title={title}
        metaDescription={metaDescription}
        images={images}
        onPublish={handlePublish}
      />
    </div>
  );
}
```

## 📊 Feature Configuration

### Customize Compliance Rules

Edit the `ADSENSE_RULES` object in `complianceEngine.js`:

```javascript
const ADSENSE_RULES = {
  minWordCount: 300,        // Minimum words required
  maxKeywordDensity: 0.03,  // Maximum keyword density (3%)
  prohibitedTerms: [...],   // Add/remove prohibited terms
  minParagraphLength: 50,   // Minimum paragraph length
  maxDuplicateRatio: 0.2    // Maximum duplicate content ratio
};
```

### Adjust Scoring Weights

Modify the scoring weights in `calculateOverallScore`:

```javascript
const weights = {
  grammar: 0.25,    // 25% weight for grammar
  adsense: 0.35,    // 35% weight for AdSense compliance
  facts: 0.20,      // 20% weight for fact-checking
  seo: 0.20         // 20% weight for SEO
};
```

## 🎨 UI Customization

### Theme Colors

The component uses Tailwind classes. Customize the color scheme by modifying the `getStatusColor` function:

```jsx
const getStatusColor = (status) => {
  switch (status) {
    case 'pass':
      return 'border-green-200 bg-green-50';
    case 'warning':
      return 'border-yellow-200 bg-yellow-50';
    case 'fail':
      return 'border-red-200 bg-red-50';
    default:
      return 'border-gray-200 bg-white';
  }
};
```

### Auto-Check Delay

Adjust the debounce delay for auto-checking:

```jsx
// Line 15 in ComplianceChecker
const timer = setTimeout(() => {
  runComplianceCheck();
}, 2000); // Change from 2000ms to your preferred delay
```

## 🔒 Security Best Practices

1. **API Key Security**
   - Never commit `.env` files to Git
   - Use Netlify environment variables for production
   - Rotate API keys regularly
   - Restrict API keys to specific services

2. **Rate Limiting**
   - The compliance engine includes built-in rate limiting
   - Monitor API usage in your cloud console
   - Implement caching for repeated checks

3. **Content Validation**
   - Always validate content server-side
   - Never trust client-side validation alone
   - Sanitize user input before processing

## 📈 Monitoring & Analytics

### Track Compliance Metrics

Add analytics tracking to monitor content quality:

```javascript
// In handlePublish function
const trackComplianceMetrics = (results) => {
  // Send to Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'content_compliance', {
      'event_category': 'blog',
      'event_label': 'compliance_check',
      'value': results.score,
      'custom_dimensions': {
        'grammar_score': results.checks.grammar.score,
        'adsense_score': results.checks.adsense.score,
        'seo_score': results.checks.seo.score
      }
    });
  }
};
```

### Database Schema for Tracking

```sql
CREATE TABLE blog_compliance_history (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES blog_posts(id),
  check_date TIMESTAMP DEFAULT NOW(),
  overall_score INTEGER,
  grammar_score INTEGER,
  adsense_score INTEGER,
  facts_score INTEGER,
  seo_score INTEGER,
  violations JSON,
  warnings JSON,
  published BOOLEAN DEFAULT FALSE
);
```

## 🚦 Testing

### Test Content Examples

Use these test cases to verify the compliance engine:

```javascript
// Test 1: Good content (should pass)
const goodContent = `
  # The Future of South African Cinema

  South African cinema has experienced remarkable growth over the past decade. 
  With over 500 productions completed in 2023, the industry shows no signs 
  of slowing down. Major studios have invested billions of rand into local 
  productions, creating thousands of jobs.

  ## Key Developments

  The establishment of new film studios in Cape Town and Johannesburg has 
  attracted international productions. According to the National Film and 
  Video Foundation, the industry contributed R7.2 billion to the GDP in 2023.

  Local streaming platforms have also emerged, providing new distribution 
  channels for South African content. This digital revolution has made 
  local films more accessible than ever before.
`;

// Test 2: Problematic content (should fail)
const problematicContent = `
  Buy now! Click here! 
  
  This is thin content with keyword stuffing movie movie movie movie.
  Contains prohibited terms and lacks substance.
`;
```

### API Testing

Test the compliance endpoint directly:

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/complianceEngine \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your test content here",
    "title": "Test Article",
    "metaDescription": "Test description",
    "images": []
  }'
```

## 📚 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| API rate limits | Implement caching and reduce check frequency |
| False positives in fact-checking | Whitelist trusted sources, adjust sensitivity |
| Slow response times | Enable parallel processing, optimize API calls |
| Grammar check too strict | Adjust LanguageTool rules and sensitivity |
| Missing environment variables | Check Netlify dashboard and redeploy |

### Debug Mode

Enable debug logging in the compliance engine:

```javascript
// Add to complianceEngine.js
const DEBUG = process.env.DEBUG_MODE === 'true';

function debugLog(...args) {
  if (DEBUG) console.log('[Compliance]', ...args);
}
```

## 🎯 Performance Optimization

### Caching Strategy

Implement Redis caching for repeated checks:

```javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

async function getCachedResult(contentHash) {
  const cached = await client.get(`compliance:${contentHash}`);
  return cached ? JSON.parse(cached) : null;
}

async function setCachedResult(contentHash, result) {
  await client.setex(
    `compliance:${contentHash}`, 
    3600, // Cache for 1 hour
    JSON.stringify(result)
  );
}
```

### Batch Processing

For multiple articles, use batch processing:

```javascript
async function batchComplianceCheck(articles) {
  const results = await Promise.allSettled(
    articles.map(article => 
      checkCompliance(article).catch(err => ({
        error: err.message,
        article: article.id
      }))
    )
  );
  
  return results.map(r => r.status === 'fulfilled' ? r.value : r.reason);
}
```

## 🔄 Updates & Maintenance

### Regular Updates Checklist

- [ ] Update prohibited terms list monthly
- [ ] Review AdSense policy changes quarterly
- [ ] Update grammar rules based on false positives
- [ ] Refresh fact-checking sources
- [ ] Monitor API usage and costs
- [ ] Review and update SEO best practices

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check console logs for detailed errors
4. Contact support with error logs and reproduction steps

## 🎉 Success Metrics

Track these KPIs after implementation:

- **AdSense Approval Rate**: Target >95%
- **Average Compliance Score**: Target >80%
- **Publishing Time Reduction**: Target 50% faster
- **Content Quality Improvement**: Track via engagement metrics
- **SEO Performance**: Monitor search rankings

---

**Remember**: The compliance engine is a tool to assist, not replace, human judgment. Always review critical content manually before publishing.
