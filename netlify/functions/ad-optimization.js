// ============================================
// AD OPTIMIZATION API ENDPOINTS
// ============================================

const { Pool } = require('pg');

// Database connection (you'll need to set up PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize bandit state in database
async function initializeBanditState() {
  const arms = [
    'hero-banner',
    'in-article-native', 
    'in-article-display',
    'sidebar-sticky',
    'end-of-content'
  ];
  
  for (const arm of arms) {
    await pool.query(
      `INSERT INTO bandit_state (arm) VALUES ($1) 
       ON CONFLICT (arm) DO NOTHING`,
      [arm]
    );
  }
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
      const result = await pool.query('SELECT * FROM bandit_state ORDER BY total_trials DESC');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.rows)
      };
    }

    // Update bandit with reward
    if (path === '/api/bandit/reward' && method === 'POST') {
      const { arm, reward } = JSON.parse(event.body);
      
      if (reward > 0) {
        await pool.query(
          `UPDATE bandit_state 
           SET alpha = alpha + $1,
               total_rewards = total_rewards + $1,
               total_trials = total_trials + 1,
               last_updated = now()
           WHERE arm = $2`,
          [reward, arm]
        );
      } else {
        await pool.query(
          `UPDATE bandit_state 
           SET beta = beta + $1,
               total_trials = total_trials + 1,
               last_updated = now()
           WHERE arm = $2`,
          [1 - reward, arm]
        );
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
      
      // Get current bandit state
      const banditState = await pool.query('SELECT * FROM bandit_state');
      
      // Run Thompson Sampling
      const arms = banditState.rows;
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
      const result = await pool.query(
        `INSERT INTO ad_placements (page_id, arm_selected, context)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [pageId, selectedArm, JSON.stringify(context)]
      );
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          decisionId: result.rows[0].id,
          selectedArm,
          variant: generateVariant(selectedArm, context)
        })
      };
    }

    // Get metrics summary
    if (path === '/api/metrics/summary' && method === 'GET') {
      const result = await pool.query(`
        SELECT 
          AVG(ctr) as avg_ctr,
          SUM(revenue) as total_revenue,
          AVG(viewability) as avg_viewability,
          AVG(bounce_rate) as bounce_rate
        FROM ad_metrics 
        WHERE updated_at > NOW() - INTERVAL '24 hours'
      `);
      
      const metrics = result.rows[0] || {};
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          avgCTR: parseFloat(metrics.avg_ctr) || 0,
          totalRevenue: parseFloat(metrics.total_revenue) || 0,
          avgViewability: parseFloat(metrics.avg_viewability) || 0,
          bounceRate: parseFloat(metrics.bounce_rate) || 0
        })
      };
    }

    // Get revenue data
    if (path === '/api/metrics/revenue' && method === 'GET') {
      const result = await pool.query(`
        SELECT 
          DATE(created_at) as date,
          SUM(revenue) as revenue,
          SUM(CASE WHEN arm_selected LIKE '%optimized%' THEN revenue ELSE 0 END) as optimized
        FROM ad_placements ap
        JOIN ad_metrics am ON ap.id = am.placement_id
        WHERE ap.created_at > NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.rows)
      };
    }

    // Handle engagement tracking
    if (path === '/api/engagement' && method === 'POST') {
      const { sessionId, data } = JSON.parse(event.body);
      
      // Store aggregated engagement data
      for (const [zone, zoneData] of Object.entries(data)) {
        await pool.query(
          `INSERT INTO engagement_events (session_id, zone, event_count, total_duration, event_types)
           VALUES ($1, $2, $3, $4, $5)`,
          [sessionId, zone, zoneData.count, zoneData.totalDuration, JSON.stringify(zoneData.types)]
        );
      }
      
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
      
      // Store reward data
      await pool.query(
        `INSERT INTO rewards_history (placement_id, arm, reward, revenue_score, engagement_score, experience_score)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [adId, placement, reward, metrics.revenueScore || 0, metrics.engagementScore || 0, metrics.experienceScore || 0]
      );
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    // Handle ad metrics
    if (path.startsWith('/api/ads/') && path.endsWith('/metrics') && method === 'GET') {
      const adId = path.split('/')[3];
      
      // Get metrics for specific ad
      const result = await pool.query(
        `SELECT * FROM ad_metrics WHERE placement_id = $1`,
        [adId]
      );
      
      const metrics = result.rows[0] || {
        impressions: 0,
        clicks: 0,
        viewableImpressions: 0,
        revenue: 0,
        avgDwellTime: 0,
        avgScrollDepth: 0,
        bounceRate: 0
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
