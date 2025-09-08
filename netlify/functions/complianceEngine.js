// Real-time Blog Content Compliance Engine for SA_isaMovie

const fetch = require('node-fetch');

// API Configuration
const CONFIG = {
  languageTool: {
    url: 'https://api.languagetoolplus.com/v2/check',
    apiKey: process.env.LANGUAGE_TOOL_API_KEY
  },
  perspective: {
    url: 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze',
    apiKey: process.env.GOOGLE_PERSPECTIVE_API_KEY
  },
  factCheck: {
    url: 'https://factchecktools.googleapis.com/v1alpha1/claims:search',
    apiKey: process.env.GOOGLE_FACT_CHECK_API_KEY
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  }
};

// AdSense Policy Rules
const ADSENSE_RULES = {
  minWordCount: 300,
  maxKeywordDensity: 0.03,
  prohibitedTerms: [
    'casino', 'gambling', 'adult', 'violence', 'drugs', 'weapons',
    'tobacco', 'alcohol', 'hate speech', 'illegal'
  ],
  requiredElements: ['title', 'metaDescription', 'featuredImage', 'altTags'],
  minParagraphLength: 50,
  maxDuplicateRatio: 0.2
};

// SEO Configuration
const SEO_RULES = {
  title: { min: 30, max: 60 },
  metaDescription: { min: 120, max: 160 },
  minLinks: 2
};

// Main handler function
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Environment variable check
  const requiredEnvVars = ['LANGUAGE_TOOL_API_KEY', 'GOOGLE_PERSPECTIVE_API_KEY', 'GOOGLE_FACT_CHECK_API_KEY', 'OPENAI_API_KEY'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Server configuration error',
        details: `The following environment variables are not set: ${missingEnvVars.join(', ')}`
      })
    };
  }

  try {
    const { content, title, metaDescription, images } = JSON.parse(event.body);

    // Basic input validation
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'Content is required and must be a non-empty string.' 
        })
      };
    }

    // Run all checks in parallel for speed
    const [grammarCheck, adsenseCheck, factCheck, seoCheck] = await Promise.all([
      checkGrammarAndReadability(content),
      checkAdsenseCompliance(content, title, metaDescription, images),
      checkFactsAndCredibility(content, title),
      checkSEOOptimization(content, title, metaDescription)
    ]);

    // Calculate overall score
    const overallScore = calculateOverallScore({
      grammar: grammarCheck,
      adsense: adsenseCheck,
      facts: factCheck,
      seo: seoCheck
    });

    // Generate recommendations if needed
    const recommendations = generateRecommendations({
      grammarCheck,
      adsenseCheck,
      factCheck,
      seoCheck
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        score: overallScore,
        checks: {
          grammar: grammarCheck,
          adsense: adsenseCheck,
          facts: factCheck,
          seo: seoCheck
        },
        recommendations,
        canPublish: overallScore >= 70
      })
    };
  } catch (error) {
    console.error('Compliance check error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: false, 
        error: 'Compliance check failed',
        details: error.message 
      })
    };
  }
};

// Grammar and Readability Check
async function checkGrammarAndReadability(content) {
  const result = {
    status: 'pending',
    score: 0,
    issues: [],
    suggestions: []
  };

  try {
    // LanguageTool API check
    const response = await fetch(CONFIG.languageTool.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        text: content,
        language: 'en-US',
        enabledRules: 'UPPERCASE_SENTENCE_START,COMMA_PARENTHESIS_WHITESPACE'
      })
    });

    if (!response.ok) {
      throw new Error(`LanguageTool API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Process grammar issues
    if (data.matches && data.matches.length > 0) {
      result.issues = data.matches.map(match => ({
        type: match.rule.category.id,
        message: match.message,
        offset: match.offset,
        length: match.length,
        replacements: match.replacements.slice(0, 3).map(r => r.value)
      }));
    }

    // Calculate readability score (Flesch Reading Ease)
    const readabilityScore = calculateReadability(content);
    
    // Determine status and score
    const grammarIssueCount = result.issues.filter(i => i.type !== 'TYPOS').length;
    
    if (grammarIssueCount === 0 && readabilityScore > 60) {
      result.status = 'pass';
      result.score = 100;
    } else if (grammarIssueCount < 3 && readabilityScore > 50) {
      result.status = 'warning';
      result.score = 70;
      result.suggestions.push('Minor grammar improvements needed');
    } else {
      result.status = 'fail';
      result.score = 40;
      result.suggestions.push('Significant grammar and readability improvements required');
    }

    result.readabilityScore = readabilityScore;
    result.grammarIssueCount = grammarIssueCount;

  } catch (error) {
    console.error('Grammar check error:', error);
    result.status = 'error';
    result.message = 'Grammar check unavailable';
  }

  return result;
}

// AdSense Compliance Check
async function checkAdsenseCompliance(content, title, metaDescription, images) {
  const result = {
    status: 'pending',
    score: 0,
    violations: [],
    warnings: []
  };

  try {
    // 1. Check word count
    const wordCount = content.split(/\s+/).length;
    if (wordCount < ADSENSE_RULES.minWordCount) {
      result.violations.push({
        rule: 'MIN_WORD_COUNT',
        message: `Content too short (${wordCount} words). Minimum required: ${ADSENSE_RULES.minWordCount}`,
        severity: 'high'
      });
    }

    // 2. Check for prohibited terms
    const contentLower = content.toLowerCase();
    const foundProhibited = ADSENSE_RULES.prohibitedTerms.filter(term => 
      contentLower.includes(term)
    );
    
    if (foundProhibited.length > 0) {
      result.violations.push({
        rule: 'PROHIBITED_CONTENT',
        message: `Found prohibited terms: ${foundProhibited.join(', ')}`,
        severity: 'critical'
      });
    }

    // 3. Check keyword stuffing (excluding stop words)
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
    const words = contentLower.split(/\s+/).filter(word => 
      word.length > 4 && !stopWords.has(word)
    );
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    const keywordStuffing = Object.entries(wordFreq).filter(([word, count]) => 
      (count / words.length) > ADSENSE_RULES.maxKeywordDensity
    );
    
    if (keywordStuffing.length > 0) {
      result.warnings.push({
        rule: 'KEYWORD_STUFFING',
        message: `Potential keyword stuffing detected for: ${keywordStuffing.map(k => k[0]).join(', ')}`,
        severity: 'medium'
      });
    }

    // 4. Check required elements
    if (!title || title.length < 10) {
      result.violations.push({
        rule: 'MISSING_TITLE',
        message: 'Title is missing or too short',
        severity: 'high'
      });
    }

    if (!metaDescription || metaDescription.length < 50) {
      result.warnings.push({
        rule: 'WEAK_META',
        message: 'Meta description is missing or too short',
        severity: 'medium'
      });
    }

    // 5. Check images for alt tags
    if (images && images.length > 0) {
      const missingAlt = images.filter(img => !img.alt || img.alt.length < 5);
      if (missingAlt.length > 0) {
        result.warnings.push({
          rule: 'MISSING_ALT_TAGS',
          message: `${missingAlt.length} images missing proper alt tags`,
          severity: 'medium'
        });
      }
    }

    // 6. Use Google Perspective API for content toxicity
    const perspectiveResult = await checkContentToxicity(content);
    if (perspectiveResult.toxic) {
      result.violations.push({
        rule: 'TOXIC_CONTENT',
        message: 'Content may violate community guidelines',
        severity: 'critical',
        details: perspectiveResult.details
      });
    }

    // Calculate compliance score
    const criticalViolations = result.violations.filter(v => v.severity === 'critical').length;
    const highViolations = result.violations.filter(v => v.severity === 'high').length;
    const warnings = result.warnings.length;

    if (criticalViolations > 0) {
      result.score = 0;
      result.status = 'fail';
    } else if (highViolations > 0) {
      result.score = 40 - (highViolations * 10);
      result.status = 'fail';
    } else if (warnings > 2) {
      result.score = 70 - (warnings * 5);
      result.status = 'warning';
    } else {
      result.score = 100 - (warnings * 10);
      result.status = 'pass';
    }

  } catch (error) {
    console.error('AdSense compliance check error:', error);
    result.status = 'error';
    result.message = 'Compliance check unavailable';
  }

  return result;
}

// Fact Checking and Credibility
async function checkFactsAndCredibility(content, title) {
  const result = {
    status: 'pending',
    score: 0,
    claims: [],
    credibilityScore: 0
  };

  try {
    // Extract claims from content
    const claims = extractClaims(content);
    
    if (claims.length > 0) {
      // Check each claim using Google Fact Check API
      const factCheckPromises = claims.slice(0, 5).map(claim => 
        checkClaim(claim)
      );
      
      const factCheckResults = await Promise.all(factCheckPromises);
      
      result.claims = factCheckResults;
      
      // Calculate credibility score
      const verifiedClaims = factCheckResults.filter(r => r.verified).length;
      const falseClaims = factCheckResults.filter(r => r.rating === 'false').length;
      
      if (falseClaims > 0) {
        result.status = 'fail';
        result.score = 0;
        result.credibilityScore = 0;
      } else if (verifiedClaims === factCheckResults.length) {
        result.status = 'pass';
        result.score = 100;
        result.credibilityScore = 100;
      } else {
        result.status = 'warning';
        result.score = 70;
        result.credibilityScore = (verifiedClaims / factCheckResults.length) * 100;
      }
    } else {
      // No claims to verify
      result.status = 'pass';
      result.score = 100;
      result.credibilityScore = 100;
    }

  } catch (error) {
    console.error('Fact checking error:', error);
    result.status = 'error';
    result.message = 'Fact checking unavailable';
  }

  return result;
}

// SEO Optimization Check
async function checkSEOOptimization(content, title, metaDescription) {
  const result = {
    status: 'pending',
    score: 0,
    issues: [],
    suggestions: []
  };

  try {
    // Title optimization
    if (title) {
      if (title.length < SEO_RULES.title.min) {
        result.issues.push(`Title too short for SEO (minimum ${SEO_RULES.title.min} characters)`);
      } else if (title.length > SEO_RULES.title.max) {
        result.issues.push(`Title too long for SEO (maximum ${SEO_RULES.title.max} characters)`);
      }
    } else {
      result.issues.push('Missing title tag');
    }

    // Meta description optimization
    if (metaDescription) {
      if (metaDescription.length < SEO_RULES.metaDescription.min) {
        result.issues.push(`Meta description too short (minimum ${SEO_RULES.metaDescription.min} characters)`);
      } else if (metaDescription.length > SEO_RULES.metaDescription.max) {
        result.issues.push(`Meta description too long (maximum ${SEO_RULES.metaDescription.max} characters)`);
      }
    } else {
      result.issues.push('Missing meta description');
    }

    // Content structure - handle both HTML and Markdown
    const hasH2 = /<h2[^>]*>/i.test(content) || /##\s/m.test(content);
    const hasH3 = /<h3[^>]*>/i.test(content) || /###\s/m.test(content);
    
    if (!hasH2) {
      result.issues.push('Missing H2 headings for content structure');
    }

    // Internal/external links
    const linkCount = (content.match(/<a\s|\\[.*?\\]\\(/gi) || []).length;
    if (linkCount < SEO_RULES.minLinks) {
      result.suggestions.push(`Add more internal/external links for better SEO (minimum ${SEO_RULES.minLinks} recommended)`);
    }

    // Calculate SEO score
    const issueCount = result.issues.length;
    const suggestionCount = result.suggestions.length;

    if (issueCount === 0 && suggestionCount === 0) {
      result.status = 'pass';
      result.score = 100;
    } else if (issueCount <= 1 && suggestionCount <= 1) {
      result.status = 'warning';
      result.score = 80 - (issueCount * 10) - (suggestionCount * 5);
    } else {
      result.status = 'fail';
      result.score = Math.max(0, 60 - (issueCount * 10) - (suggestionCount * 5));
    }

  } catch (error) {
    console.error('SEO check error:', error);
    result.status = 'error';
    result.message = 'SEO check unavailable';
  }

  return result;
}

// Helper Functions

function calculateReadability(text) {
  // Flesch Reading Ease Score
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((count, word) => count + countSyllables(word), 0);
  
  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  
  return Math.max(0, Math.min(100, score));
}

function countSyllables(word) {
  word = word.toLowerCase();
  let count = 0;
  let previousWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = /[aeiouy]/.test(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }
  
  // Adjust for silent e
  if (word.endsWith('e')) {
    count--;
  }
  
  // Ensure at least one syllable
  return Math.max(1, count);
}

async function checkContentToxicity(content) {
  try {
    const response = await fetch(
      `${CONFIG.perspective.url}?key=${CONFIG.perspective.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: { text: content.substring(0, 3000) }, // API limit
          requestedAttributes: {
            TOXICITY: {},
            SEVERE_TOXICITY: {},
            THREAT: {},
            INSULT: {},
            PROFANITY: {}
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Perspective API error: ${response.status}`);
    }

    const data = await response.json();
    const scores = data.attributeScores;
    
    const toxic = scores.TOXICITY.summaryScore.value > 0.7 ||
                  scores.SEVERE_TOXICITY.summaryScore.value > 0.5;
    
    return {
      toxic,
      details: {
        toxicity: scores.TOXICITY.summaryScore.value,
        severeToxicity: scores.SEVERE_TOXICITY.summaryScore.value,
        threat: scores.THREAT.summaryScore.value,
        insult: scores.INSULT.summaryScore.value,
        profanity: scores.PROFANITY.summaryScore.value
      }
    };
  } catch (error) {
    console.error('Toxicity check error:', error);
    return { toxic: false, details: {} };
  }
}

function extractClaims(content) {
  // Simple claim extraction - can be enhanced with NLP
  const claims = [];
  const patterns = [
    /according to .+?, .+/gi,
    /studies show that .+/gi,
    /research indicates .+/gi,
    /\d+% of .+/gi,
    /statistics reveal .+/gi
  ];
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    claims.push(...matches);
  });
  
  return claims.slice(0, 5); // Limit to 5 claims for performance
}

async function checkClaim(claim) {
  try {
    const response = await fetch(
      `${CONFIG.factCheck.url}?key=${CONFIG.factCheck.apiKey}&query=${encodeURIComponent(claim)}`,
      {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error(`Fact Check API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.claims && data.claims.length > 0) {
      const topClaim = data.claims[0];
      return {
        claim: claim,
        verified: true,
        rating: topClaim.claimReview[0].textualRating || 'unknown',
        source: topClaim.claimReview[0].publisher.name
      };
    }
    
    return {
      claim: claim,
      verified: false,
      rating: 'unverified',
      source: null
    };
  } catch (error) {
    console.error('Claim check error:', error);
    return {
      claim: claim,
      verified: false,
      rating: 'error',
      source: null
    };
  }
}

function calculateOverallScore(checks) {
  const weights = {
    grammar: 0.25,
    adsense: 0.35,
    facts: 0.20,
    seo: 0.20
  };
  
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.entries(checks).forEach(([key, check]) => {
    if (check.score !== undefined) {
      totalScore += check.score * weights[key];
      totalWeight += weights[key];
    }
  });
  
  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

function generateRecommendations(checks) {
  const recommendations = [];
  
  // Grammar recommendations
  if (checks.grammarCheck.status === 'warning' || checks.grammarCheck.status === 'fail') {
    recommendations.push({
      category: 'grammar',
      priority: 'high',
      action: 'Fix grammar issues and improve readability',
      details: checks.grammarCheck.suggestions || ['Review grammar and sentence structure']
    });
  }
  
  // AdSense recommendations
  if (checks.adsenseCheck.violations.length > 0) {
    recommendations.push({
      category: 'adsense',
      priority: 'critical',
      action: 'Address AdSense policy violations',
      details: checks.adsenseCheck.violations.map(v => v.message)
    });
  }
  
  if (checks.adsenseCheck.warnings.length > 0) {
    recommendations.push({
      category: 'adsense',
      priority: 'medium',
      action: 'Improve content quality for AdSense',
      details: checks.adsenseCheck.warnings.map(w => w.message)
    });
  }
  
  // Fact-checking recommendations
  if (checks.factCheck.status === 'fail') {
    recommendations.push({
      category: 'facts',
      priority: 'critical',
      action: 'Verify or remove unsubstantiated claims',
      details: checks.factCheck.claims.filter(c => c.rating === 'false').map(c => c.claim)
    });
  }
  
  // SEO recommendations
  if (checks.seoCheck.issues.length > 0) {
    recommendations.push({
      category: 'seo',
      priority: 'medium',
      action: 'Optimize for search engines',
      details: checks.seoCheck.issues
    });
  }
  
  return recommendations;
}
