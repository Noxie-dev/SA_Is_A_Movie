// ============================================
// REWARD CALCULATOR
// ============================================

class RewardCalculator {
  constructor() {
    this.weights = {
      revenue: 0.5,      // Direct revenue impact
      engagement: 0.3,   // User engagement metrics
      experience: 0.2    // User experience factors
    };
    
    // SA IS A MOVIE specific baselines
    this.baselines = {
      expectedRPM: 2.0,        // Expected revenue per mille
      expectedCTR: 0.02,       // Expected click-through rate
      expectedViewability: 0.7, // Expected viewability rate
      expectedDwellTime: 30,   // Expected dwell time in seconds
      expectedScrollDepth: 75, // Expected scroll depth percentage
      maxAdsPerPage: 5,        // Maximum ads per page
      maxLoadTime: 5           // Maximum acceptable load time
    };
  }

  calculateReward(metrics) {
    // Composite reward function
    const revenueScore = this.calculateRevenueScore(metrics);
    const engagementScore = this.calculateEngagementScore(metrics);
    const experienceScore = this.calculateExperienceScore(metrics);
    
    const totalReward = 
      this.weights.revenue * revenueScore +
      this.weights.engagement * engagementScore +
      this.weights.experience * experienceScore;
    
    // Normalize to [0, 1]
    return Math.max(0, Math.min(1, totalReward));
  }

  calculateRevenueScore(metrics) {
    // Revenue metrics (normalized)
    const ctr = metrics.clicks / Math.max(1, metrics.impressions);
    const rpm = metrics.revenue / Math.max(1, metrics.pageviews) * 1000;
    
    // SA IS A MOVIE specific revenue factors
    const ctrScore = Math.min(1, ctr / this.baselines.expectedCTR);
    const rpmScore = Math.min(1, rpm / this.baselines.expectedRPM);
    
    // Bonus for South African traffic patterns
    const saTrafficBonus = this.calculateSATrafficBonus(metrics);
    
    return (ctrScore + rpmScore + saTrafficBonus) / 3;
  }

  calculateSATrafficBonus(metrics) {
    // Bonus for South African traffic patterns
    let bonus = 0;
    
    // Higher engagement during SA peak hours (6-10 PM)
    const hour = new Date().getHours();
    if (hour >= 18 && hour <= 22) {
      bonus += 0.1;
    }
    
    // Bonus for mobile traffic (high in SA)
    if (metrics.viewport === 'mobile') {
      bonus += 0.05;
    }
    
    // Bonus for social media traffic (high engagement in SA)
    if (metrics.referrerType === 'social') {
      bonus += 0.08;
    }
    
    return Math.min(0.2, bonus); // Cap at 20% bonus
  }

  calculateEngagementScore(metrics) {
    // Engagement metrics
    const viewability = metrics.viewableImpressions / Math.max(1, metrics.impressions);
    const dwellTime = Math.min(1, metrics.avgDwellTime / this.baselines.expectedDwellTime);
    const scrollDepth = metrics.avgScrollDepth / 100;
    
    // SA IS A MOVIE specific engagement factors
    const contentEngagement = this.calculateContentEngagement(metrics);
    const socialEngagement = this.calculateSocialEngagement(metrics);
    
    return (viewability + dwellTime + scrollDepth + contentEngagement + socialEngagement) / 5;
  }

  calculateContentEngagement(metrics) {
    // Measure engagement with SA IS A MOVIE content
    let score = 0;
    
    // Higher engagement for trending stories
    if (metrics.contentType === 'trendingStory') {
      score += 0.2;
    }
    
    // Higher engagement for celebrity content
    if (metrics.contentType === 'celebrityNews') {
      score += 0.15;
    }
    
    // Higher engagement for music content
    if (metrics.contentType === 'musicNews') {
      score += 0.1;
    }
    
    // Bonus for long-form content engagement
    if (metrics.avgDwellTime > 60) {
      score += 0.1;
    }
    
    return Math.min(1, score);
  }

  calculateSocialEngagement(metrics) {
    // Measure social media engagement patterns
    let score = 0;
    
    // Higher engagement from social media
    if (metrics.referrerType === 'social') {
      score += 0.3;
    }
    
    // Higher engagement for shareable content
    if (metrics.shares > 0) {
      score += 0.2;
    }
    
    // Higher engagement for commented content
    if (metrics.comments > 0) {
      score += 0.15;
    }
    
    return Math.min(1, score);
  }

  calculateExperienceScore(metrics) {
    // User experience metrics (inverted for penalties)
    const bounceRate = 1 - (metrics.bounceRate || 0);
    const adDensity = 1 - Math.min(1, metrics.adsPerPage / this.baselines.maxAdsPerPage);
    const loadTime = 1 - Math.min(1, metrics.pageLoadTime / this.baselines.maxLoadTime);
    
    // SA IS A MOVIE specific UX factors
    const mobileExperience = this.calculateMobileExperience(metrics);
    const contentQuality = this.calculateContentQuality(metrics);
    
    return (bounceRate + adDensity + loadTime + mobileExperience + contentQuality) / 5;
  }

  calculateMobileExperience(metrics) {
    // Mobile experience is crucial for SA audience
    if (metrics.viewport === 'mobile') {
      // Penalize slow mobile load times
      if (metrics.pageLoadTime > 3) {
        return 0.3;
      }
      // Reward fast mobile experience
      if (metrics.pageLoadTime < 2) {
        return 0.9;
      }
      return 0.7;
    }
    return 0.8; // Desktop baseline
  }

  calculateContentQuality(metrics) {
    // Measure content quality impact on UX
    let score = 0.5; // Base score
    
    // Penalize excessive ads
    if (metrics.adsPerPage > 3) {
      score -= 0.2;
    }
    
    // Reward good content-to-ad ratio
    if (metrics.adsPerPage <= 2) {
      score += 0.2;
    }
    
    // Penalize intrusive ad placements
    if (metrics.intrusiveAds > 0) {
      score -= 0.3;
    }
    
    return Math.max(0, Math.min(1, score));
  }

  adjustWeights(feedback) {
    // Dynamically adjust weights based on business goals
    if (feedback.prioritizeRevenue) {
      this.weights.revenue = 0.6;
      this.weights.engagement = 0.25;
      this.weights.experience = 0.15;
    } else if (feedback.prioritizeExperience) {
      this.weights.revenue = 0.3;
      this.weights.engagement = 0.3;
      this.weights.experience = 0.4;
    } else if (feedback.prioritizeEngagement) {
      this.weights.revenue = 0.4;
      this.weights.engagement = 0.4;
      this.weights.experience = 0.2;
    }
  }

  // Get detailed breakdown of reward calculation
  getRewardBreakdown(metrics) {
    return {
      revenue: {
        score: this.calculateRevenueScore(metrics),
        weight: this.weights.revenue,
        contribution: this.weights.revenue * this.calculateRevenueScore(metrics)
      },
      engagement: {
        score: this.calculateEngagementScore(metrics),
        weight: this.weights.engagement,
        contribution: this.weights.engagement * this.calculateEngagementScore(metrics)
      },
      experience: {
        score: this.calculateExperienceScore(metrics),
        weight: this.weights.experience,
        contribution: this.weights.experience * this.calculateExperienceScore(metrics)
      },
      total: this.calculateReward(metrics)
    };
  }

  // Calculate confidence in reward calculation
  getRewardConfidence(metrics) {
    const sampleSize = metrics.impressions || 0;
    const confidence = Math.min(1, sampleSize / 1000); // Full confidence at 1000 impressions
    
    return {
      confidence,
      sampleSize,
      isReliable: sampleSize >= 100
    };
  }

  // Get recommendations for improvement
  getImprovementRecommendations(metrics) {
    const recommendations = [];
    const breakdown = this.getRewardBreakdown(metrics);
    
    if (breakdown.revenue.score < 0.5) {
      recommendations.push({
        category: 'revenue',
        priority: 'high',
        message: 'Consider optimizing ad placement for better CTR and RPM'
      });
    }
    
    if (breakdown.engagement.score < 0.5) {
      recommendations.push({
        category: 'engagement',
        priority: 'medium',
        message: 'Focus on improving viewability and user engagement'
      });
    }
    
    if (breakdown.experience.score < 0.5) {
      recommendations.push({
        category: 'experience',
        priority: 'high',
        message: 'Reduce ad density and improve page load times'
      });
    }
    
    return recommendations;
  }
}

export default RewardCalculator;
