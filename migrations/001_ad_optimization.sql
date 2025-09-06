-- ============================================
-- AD OPTIMIZATION DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bandit state table
CREATE TABLE IF NOT EXISTS bandit_state (
  arm TEXT PRIMARY KEY,
  alpha NUMERIC DEFAULT 1,
  beta NUMERIC DEFAULT 1,
  total_rewards NUMERIC DEFAULT 0,
  total_trials INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Ad placements table
CREATE TABLE IF NOT EXISTS ad_placements (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  page_id TEXT,
  placement_variant JSONB,
  arm_selected TEXT,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad metrics table
CREATE TABLE IF NOT EXISTS ad_metrics (
  id SERIAL PRIMARY KEY,
  placement_id INTEGER REFERENCES ad_placements(id),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  viewable_impressions INTEGER DEFAULT 0,
  revenue NUMERIC(10,4) DEFAULT 0,
  dwell_time NUMERIC DEFAULT 0,
  scroll_depth NUMERIC DEFAULT 0,
  bounce_rate NUMERIC DEFAULT 0,
  page_load_time NUMERIC DEFAULT 0,
  ads_per_page INTEGER DEFAULT 0,
  intrusive_ads INTEGER DEFAULT 0,
  ctr NUMERIC DEFAULT 0,
  viewability NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Engagement events table (privacy-preserved)
CREATE TABLE IF NOT EXISTS engagement_events (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  zone TEXT,
  event_count INTEGER,
  total_duration INTEGER,
  event_types JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rewards history table
CREATE TABLE IF NOT EXISTS rewards_history (
  id SERIAL PRIMARY KEY,
  placement_id INTEGER REFERENCES ad_placements(id),
  arm TEXT,
  reward NUMERIC,
  revenue_score NUMERIC,
  engagement_score NUMERIC,
  experience_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consent tracking table
CREATE TABLE IF NOT EXISTS consent_tracking (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  consent_given BOOLEAN,
  consent_type TEXT DEFAULT 'ad_optimization',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance monitoring table
CREATE TABLE IF NOT EXISTS performance_monitoring (
  id SERIAL PRIMARY KEY,
  page_id TEXT,
  viewport TEXT,
  day_part TEXT,
  referrer_type TEXT,
  load_time NUMERIC,
  bounce_rate NUMERIC,
  engagement_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_placements_session ON ad_placements(session_id);
CREATE INDEX IF NOT EXISTS idx_placements_page ON ad_placements(page_id);
CREATE INDEX IF NOT EXISTS idx_placements_created ON ad_placements(created_at);
CREATE INDEX IF NOT EXISTS idx_placements_arm ON ad_placements(arm_selected);

CREATE INDEX IF NOT EXISTS idx_metrics_placement ON ad_metrics(placement_id);
CREATE INDEX IF NOT EXISTS idx_metrics_updated ON ad_metrics(updated_at);
CREATE INDEX IF NOT EXISTS idx_metrics_revenue ON ad_metrics(revenue);

CREATE INDEX IF NOT EXISTS idx_rewards_created ON rewards_history(created_at);
CREATE INDEX IF NOT EXISTS idx_rewards_arm ON rewards_history(arm);
CREATE INDEX IF NOT EXISTS idx_rewards_placement ON rewards_history(placement_id);

CREATE INDEX IF NOT EXISTS idx_engagement_session ON engagement_events(session_id);
CREATE INDEX IF NOT EXISTS idx_engagement_created ON engagement_events(created_at);
CREATE INDEX IF NOT EXISTS idx_engagement_zone ON engagement_events(zone);

CREATE INDEX IF NOT EXISTS idx_consent_session ON consent_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_consent_created ON consent_tracking(created_at);

CREATE INDEX IF NOT EXISTS idx_performance_page ON performance_monitoring(page_id);
CREATE INDEX IF NOT EXISTS idx_performance_created ON performance_monitoring(created_at);

-- Initial bandit arms
INSERT INTO bandit_state (arm) VALUES 
  ('hero-banner'),
  ('in-article-native'),
  ('in-article-display'),
  ('sidebar-sticky'),
  ('end-of-content')
ON CONFLICT (arm) DO NOTHING;

-- Create views for common queries
CREATE OR REPLACE VIEW bandit_performance AS
SELECT 
  arm,
  alpha,
  beta,
  total_rewards,
  total_trials,
  CASE 
    WHEN total_trials = 0 THEN 0
    ELSE alpha / (alpha + beta)
  END as success_rate,
  CASE 
    WHEN total_trials = 0 THEN 0
    ELSE (alpha * beta) / ((alpha + beta) * (alpha + beta) * (alpha + beta + 1))
  END as variance,
  last_updated
FROM bandit_state
ORDER BY success_rate DESC;

CREATE OR REPLACE VIEW daily_metrics AS
SELECT 
  DATE(ap.created_at) as date,
  COUNT(*) as total_placements,
  AVG(am.ctr) as avg_ctr,
  SUM(am.revenue) as total_revenue,
  AVG(am.viewability) as avg_viewability,
  AVG(am.bounce_rate) as avg_bounce_rate,
  COUNT(DISTINCT ap.arm_selected) as arms_used
FROM ad_placements ap
LEFT JOIN ad_metrics am ON ap.id = am.placement_id
WHERE ap.created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(ap.created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW arm_performance_summary AS
SELECT 
  bs.arm,
  bs.total_trials,
  bs.total_rewards,
  bs.alpha / (bs.alpha + bs.beta) as success_rate,
  COUNT(ap.id) as placement_count,
  AVG(am.ctr) as avg_ctr,
  SUM(am.revenue) as total_revenue,
  AVG(am.viewability) as avg_viewability
FROM bandit_state bs
LEFT JOIN ad_placements ap ON bs.arm = ap.arm_selected
LEFT JOIN ad_metrics am ON ap.id = am.placement_id
GROUP BY bs.arm, bs.total_trials, bs.total_rewards, bs.alpha, bs.beta
ORDER BY success_rate DESC;

-- Functions for common operations
CREATE OR REPLACE FUNCTION update_bandit_reward(arm_name TEXT, reward_value NUMERIC)
RETURNS VOID AS $$
BEGIN
  IF reward_value > 0 THEN
    UPDATE bandit_state 
    SET alpha = alpha + reward_value,
        total_rewards = total_rewards + reward_value,
        total_trials = total_trials + 1,
        last_updated = NOW()
    WHERE arm = arm_name;
  ELSE
    UPDATE bandit_state 
    SET beta = beta + (1 - reward_value),
        total_trials = total_trials + 1,
        last_updated = NOW()
    WHERE arm = arm_name;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_optimal_arm(context_data JSONB)
RETURNS TEXT AS $$
DECLARE
  arm_record RECORD;
  max_sample NUMERIC := -1;
  selected_arm TEXT;
  sample_value NUMERIC;
  context_multiplier NUMERIC;
BEGIN
  FOR arm_record IN SELECT * FROM bandit_state LOOP
    -- Sample from Beta distribution (simplified)
    sample_value := random() * (arm_record.alpha / (arm_record.alpha + arm_record.beta));
    
    -- Apply context multiplier (simplified)
    context_multiplier := 1.0;
    IF context_data->>'viewport' = 'mobile' AND arm_record.arm LIKE '%native%' THEN
      context_multiplier := 1.2;
    END IF;
    
    sample_value := sample_value * context_multiplier;
    
    IF sample_value > max_sample THEN
      max_sample := sample_value;
      selected_arm := arm_record.arm;
    END IF;
  END LOOP;
  
  RETURN selected_arm;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_metrics_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_metrics_timestamp
  BEFORE UPDATE ON ad_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_metrics_timestamp();

CREATE OR REPLACE FUNCTION update_consent_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_consent_timestamp
  BEFORE UPDATE ON consent_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_consent_timestamp();

-- Sample data for testing (optional)
-- INSERT INTO ad_placements (page_id, arm_selected, context) VALUES 
--   ('test-page-1', 'hero-banner', '{"viewport": "desktop", "dayPart": "afternoon"}'),
--   ('test-page-2', 'in-article-native', '{"viewport": "mobile", "dayPart": "evening"}');

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
