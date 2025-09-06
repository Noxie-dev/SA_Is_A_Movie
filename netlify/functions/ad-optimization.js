// ============================================
// AD OPTIMIZATION API ENDPOINTS
// ============================================

// Note: This is a simplified version for initial deployment
// For full functionality, you'll need to set up PostgreSQL and uncomment the database code below

// const { Pool } = require('pg');

// Database connection (you'll need to set up PostgreSQL)
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });

// In-memory storage for demo purposes (replace with database in production)
const memoryStore = {
  banditState: [
    { arm: 'hero-banner', alpha: 1, beta: 1, total_rewards: 0, total_trials: 0 },
    { arm: 'in-article-native', alpha: 1, beta: 1, total_rewards: 0, total_trials: 0 },
    { arm: 'in-article-display', alpha: 1, beta: 1, total_rewards: 0, total_trials: 0 },
    { arm: 'sidebar-sticky', alpha: 1, beta: 1, total_rewards: 0, total_trials: 0 },
    { arm: 'end-of-content', alpha: 1, beta: 1, total_rewards: 0, total_trials: 0 }
  ],
  placements: [],
  metrics: []
};

// Initialize bandit state (in-memory version)
async function initializeBanditState() {
  // Already initialized in memoryStore
  return true;
}

// Helper function to sample from Beta distribution
function sampleBeta(alpha, beta) {
  // Simple Beta sampling using Gamma distribution approximation
  const x = sampleGamma(alpha);
  const y = sampleGamma(beta);
  return x / (x + y);
}

function sampleGamma(shape) {
  // Marsaglia and Tsang method for Gamma sampling
  if (shape < 1) {
    return sampleGamma(1 + shape) * Math.pow(Math.random(), 1 / shape);
  }
  
  const d = shape - 1/3;
  const c = 1 / Math.sqrt(9 * d);
  
  while (true) {
    const x = randomNormal();
    const v = Math.pow(1 + c * x, 3);
    const u = Math.random();
    
    if (v > 0 && Math.log(u) < 0.5 * x * x + d - d * v + d * Math.log(v)) {
      return d * v;
    }
  }
}

function randomNormal() {
  // Box-Muller transform for normal distribution
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function getContextMultiplier(arm, context) {
  let multiplier = 1.0;
  
  if (context.viewport === 'mobile') {
    if (arm.includes('native') || arm.includes('small')) {
      multiplier *= 1.2;
    } else if (arm.includes('large') || arm.includes('sidebar')) {
      multiplier *= 0.7;
    }
  }
  
  if (context.dayPart === 'evening' && arm.includes('video')) {
    multiplier *= 1.1;
  }
  
  if (context.referrerType === 'social' && arm.includes('native')) {
    multiplier *= 1.15;
  }
  
  // South African context adjustments
  if (context.dayPart === 'afternoon' && arm.includes('in-article')) {
    multiplier *= 1.05;
  }
  
  return multiplier;
}

function generateVariant(arm, context) {
  const variant = {
    hero: null,
    inArticle: null,
    sidebar: null,
    end: null
  };
  
  switch (arm) {
    case 'hero-banner':
      variant.hero = context.viewport === 'mobile' ? 'small-banner' : 'large-banner';
      break;
    case 'in-article-native':
      variant.inArticle = 'native';
      break;
    case 'in-article-display':
      variant.inArticle = 'display';
      break;
    case 'sidebar-sticky':
      variant.sidebar = context.viewport === 'desktop' ? 'sticky-300x600' : null;
      break;
    case 'end-of-content':
      variant.end = 'native-recommendation';
      break;
  }
  
  return variant;
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const path = event.path;
    const method = event.httpMethod;

    // Initialize bandit state on first request
    await initializeBanditState();

    // Get bandit state
    if (path === '/api/bandit/state' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(memoryStore.banditState)
      };
    }

    // Update bandit with reward
    if (path === '/api/bandit/reward' && method === 'POST') {
      const { arm, reward } = JSON.parse(event.body);
      
      const armState = memoryStore.banditState.find(a => a.arm === arm);
      if (armState) {
        if (reward > 0) {
          armState.alpha += reward;
          armState.total_rewards += reward;
        } else {
          armState.beta += (1 - reward);
        }
        armState.total_trials += 1;
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    // Get optimal placement decision
    if (path === '/api/placement-decision' && method === 'POST') {
      const { pageId, context } = JSON.parse(event.body);
      
      // Run Thompson Sampling
      const arms = memoryStore.banditState;
      let maxSample = -Infinity;
      let selectedArm = null;
      
      for (const arm of arms) {
        // Sample from Beta distribution
        const sample = sampleBeta(arm.alpha, arm.beta);
        
        // Apply context multiplier
        const multiplier = getContextMultiplier(arm.arm, context);
        const adjustedSample = sample * multiplier;
        
        if (adjustedSample > maxSample) {
          maxSample = adjustedSample;
          selectedArm = arm.arm;
        }
      }
      
      // Create placement decision
      const decisionId = Date.now();
      memoryStore.placements.push({
        id: decisionId,
        page_id: pageId,
        arm_selected: selectedArm,
        context: context
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          decisionId,
          selectedArm,
          variant: generateVariant(selectedArm, context)
        })
      };
    }

    // Get metrics summary
    if (path === '/api/metrics/summary' && method === 'GET') {
      // Return demo metrics for now
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          avgCTR: 0.025,
          totalRevenue: 125.50,
          avgViewability: 0.75,
          bounceRate: 0.35
        })
      };
    }

    // Get revenue data
    if (path === '/api/metrics/revenue' && method === 'GET') {
      // Return demo revenue data
      const demoData = [
        { date: '2024-12-01', revenue: 45.20, optimized: 52.80 },
        { date: '2024-12-02', revenue: 38.50, optimized: 48.30 },
        { date: '2024-12-03', revenue: 52.10, optimized: 61.40 },
        { date: '2024-12-04', revenue: 41.80, optimized: 49.20 },
        { date: '2024-12-05', revenue: 47.30, optimized: 55.60 }
      ];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(demoData)
      };
    }

    // Handle engagement tracking
    if (path === '/api/engagement' && method === 'POST') {
      const { sessionId, data } = JSON.parse(event.body);
      
      // Store aggregated engagement data in memory
      console.log('Engagement data received:', { sessionId, data });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    // Handle consent
    if (path === '/api/consent' && method === 'POST') {
      const { consent } = JSON.parse(event.body);
      
      // Store consent preference (you might want to store this in a database)
      // For now, we'll just return success
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, consent })
      };
    }

    // Handle consent status check
    if (path === '/api/consent/status' && method === 'GET') {
      // For now, return default consent status
      // In production, you'd check the database
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ hasConsent: false })
      };
    }

    // Handle rewards
    if (path === '/api/rewards' && method === 'POST') {
      const { adId, placement, reward, metrics } = JSON.parse(event.body);
      
      // Store reward data in memory
      memoryStore.metrics.push({
        adId, placement, reward, metrics,
        timestamp: new Date().toISOString()
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    // Handle ad metrics
    if (path.startsWith('/api/ads/') && path.endsWith('/metrics') && method === 'GET') {
      const adId = path.split('/')[3];
      
      // Return demo metrics for specific ad
      const metrics = {
        impressions: Math.floor(Math.random() * 1000) + 100,
        clicks: Math.floor(Math.random() * 50) + 5,
        viewableImpressions: Math.floor(Math.random() * 800) + 80,
        revenue: Math.random() * 10 + 1,
        avgDwellTime: Math.random() * 60 + 15,
        avgScrollDepth: Math.random() * 50 + 25,
        bounceRate: Math.random() * 0.3 + 0.2
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(metrics)
      };
    }

    // 404 for unknown endpoints
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };

  } catch (error) {
    console.error('Ad optimization API error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
