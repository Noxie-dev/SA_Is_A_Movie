// ============================================
// THOMPSON SAMPLING MULTI-ARMED BANDIT
// ============================================

class ThompsonSamplingBandit {
  constructor(arms, priorAlpha = 1, priorBeta = 1) {
    this.arms = arms;
    this.alpha = {};
    this.beta = {};
    
    // Initialize with prior beliefs
    arms.forEach(arm => {
      this.alpha[arm] = priorAlpha;
      this.beta[arm] = priorBeta;
    });
    
    this.history = [];
    this.explorationRate = 0.1; // For epsilon-greedy fallback
  }

  selectArm(context = {}) {
    // Thompson Sampling with contextual awareness
    const samples = {};
    let maxSample = -Infinity;
    let selectedArm = null;

    // Sample from Beta distribution for each arm
    this.arms.forEach(arm => {
      const alpha = this.alpha[arm];
      const beta = this.beta[arm];
      
      // Beta distribution sampling using inverse transform
      const sample = this.sampleBeta(alpha, beta);
      
      // Apply context multiplier
      const contextMultiplier = this.getContextMultiplier(arm, context);
      samples[arm] = sample * contextMultiplier;
      
      if (samples[arm] > maxSample) {
        maxSample = samples[arm];
        selectedArm = arm;
      }
    });

    // Record selection
    this.history.push({
      arm: selectedArm,
      context,
      timestamp: Date.now()
    });

    return selectedArm;
  }

  sampleBeta(alpha, beta) {
    // Simple Beta sampling using Gamma distribution approximation
    const x = this.sampleGamma(alpha);
    const y = this.sampleGamma(beta);
    return x / (x + y);
  }

  sampleGamma(shape) {
    // Marsaglia and Tsang method for Gamma sampling
    if (shape < 1) {
      return this.sampleGamma(1 + shape) * Math.pow(Math.random(), 1 / shape);
    }
    
    const d = shape - 1/3;
    const c = 1 / Math.sqrt(9 * d);
    
    while (true) {
      const x = this.randomNormal();
      const v = Math.pow(1 + c * x, 3);
      const u = Math.random();
      
      if (v > 0 && Math.log(u) < 0.5 * x * x + d - d * v + d * Math.log(v)) {
        return d * v;
      }
    }
  }

  randomNormal() {
    // Box-Muller transform for normal distribution
    const u = 1 - Math.random();
    const v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  getContextMultiplier(arm, context) {
    // Adjust selection based on context
    let multiplier = 1.0;
    
    // Mobile users prefer smaller ads
    if (context.viewport === 'mobile') {
      if (arm.includes('small') || arm.includes('native')) {
        multiplier *= 1.2;
      } else if (arm.includes('large')) {
        multiplier *= 0.8;
      }
    }
    
    // Time of day preferences
    if (context.dayPart === 'evening' && arm.includes('video')) {
      multiplier *= 1.1; // Higher engagement with video in evening
    }
    
    // Referrer-based adjustments
    if (context.referrerType === 'social' && arm.includes('native')) {
      multiplier *= 1.15; // Social traffic responds well to native ads
    }
    
    // South African context adjustments
    if (context.dayPart === 'afternoon' && arm.includes('in-article')) {
      multiplier *= 1.05; // Higher engagement during SA afternoon browsing
    }
    
    return multiplier;
  }

  updateArm(arm, reward) {
    // Update Beta distribution parameters
    if (reward > 0) {
      this.alpha[arm] += reward;
    } else {
      this.beta[arm] += (1 - reward);
    }
  }

  getStatistics() {
    const stats = {};
    this.arms.forEach(arm => {
      const alpha = this.alpha[arm];
      const beta = this.beta[arm];
      stats[arm] = {
        mean: alpha / (alpha + beta),
        variance: (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1)),
        samples: alpha + beta - 2 // Subtract initial priors
      };
    });
    return stats;
  }

  // Get confidence intervals for each arm
  getConfidenceIntervals(confidence = 0.95) {
    const intervals = {};
    const z = this.getZScore(confidence);
    
    this.arms.forEach(arm => {
      const alpha = this.alpha[arm];
      const beta = this.beta[arm];
      const n = alpha + beta;
      const p = alpha / n;
      const se = Math.sqrt((p * (1 - p)) / n);
      
      intervals[arm] = {
        lower: Math.max(0, p - z * se),
        upper: Math.min(1, p + z * se),
        mean: p
      };
    });
    
    return intervals;
  }

  getZScore(confidence) {
    // Approximate Z-scores for common confidence levels
    const zScores = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576
    };
    return zScores[confidence] || 1.96;
  }

  // Reset arm to initial state (useful for A/B testing)
  resetArm(arm) {
    this.alpha[arm] = 1;
    this.beta[arm] = 1;
  }

  // Get exploration vs exploitation ratio
  getExplorationRatio() {
    const totalTrials = this.history.length;
    if (totalTrials === 0) return 1.0;
    
    const recentTrials = this.history.slice(-100); // Last 100 trials
    const uniqueArms = new Set(recentTrials.map(trial => trial.arm));
    
    return uniqueArms.size / this.arms.length;
  }
}

export default ThompsonSamplingBandit;
