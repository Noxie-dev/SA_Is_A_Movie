// ============================================
// CONTENT LAYOUT OPTIMIZER
// ============================================

class ContentLayoutOptimizer {
  constructor() {
    this.adPlacements = new Map();
    this.contentSegments = [];
    this.optimalSpacing = {
      beforeAd: 100, // px
      afterAd: 100,
      betweenAds: 500,
      fromCTA: 200
    };
    
    // SA IS A MOVIE specific content patterns
    this.contentPatterns = {
      trendingStory: {
        minReadingTime: 30, // seconds
        naturalBreaks: ['h2', 'h3', 'hr', '.story-break'],
        avoidNear: ['.cta', '.social-share', '.newsletter-signup']
      },
      celebrityNews: {
        minReadingTime: 45,
        naturalBreaks: ['h2', 'h3', '.quote', '.image-caption'],
        avoidNear: ['.cta', '.related-stories']
      },
      musicNews: {
        minReadingTime: 25,
        naturalBreaks: ['h2', 'h3', '.song-title', '.artist-name'],
        avoidNear: ['.music-player', '.spotify-embed']
      }
    };
  }

  analyzeContent(container) {
    // Analyze content structure for optimal ad placement
    const analysis = {
      paragraphs: [],
      headings: [],
      images: [],
      naturalBreaks: [],
      readingFlow: [],
      contentType: this.detectContentType(container)
    };

    // Find paragraphs and their reading time
    container.querySelectorAll('p').forEach(p => {
      const wordCount = p.textContent.split(/\s+/).length;
      const readingTime = wordCount / 200; // Average reading speed
      
      analysis.paragraphs.push({
        element: p,
        wordCount,
        readingTime,
        position: p.getBoundingClientRect().top + window.scrollY
      });
    });

    // Find natural content breaks
    const breakSelectors = this.contentPatterns[analysis.contentType]?.naturalBreaks || 
                          ['h1', 'h2', 'h3', 'hr'];
    
    container.querySelectorAll(breakSelectors.join(', ')).forEach(element => {
      analysis.naturalBreaks.push({
        element,
        type: element.tagName.toLowerCase(),
        position: element.getBoundingClientRect().top + window.scrollY,
        priority: this.getBreakPriority(element)
      });
    });

    // Calculate reading flow
    let cumulativeTime = 0;
    analysis.paragraphs.forEach((p, index) => {
      cumulativeTime += p.readingTime;
      
      // Mark good ad positions after ~30 seconds of reading
      if (cumulativeTime >= 0.5 && !analysis.readingFlow.some(f => f.type === 'ad')) {
        analysis.readingFlow.push({
          type: 'ad',
          position: p.position + p.element.offsetHeight,
          priority: 'high',
          reason: 'engagement_point'
        });
      }
    });

    return analysis;
  }

  detectContentType(container) {
    // Detect content type based on SA IS A MOVIE categories
    const content = container.textContent.toLowerCase();
    
    if (content.includes('amapiano') || content.includes('music') || content.includes('song')) {
      return 'musicNews';
    } else if (content.includes('celebrity') || content.includes('scandal') || content.includes('drama')) {
      return 'celebrityNews';
    } else {
      return 'trendingStory';
    }
  }

  getBreakPriority(element) {
    // Prioritize different types of content breaks
    const tagName = element.tagName.toLowerCase();
    const className = element.className;
    
    if (tagName === 'h1') return 'highest';
    if (tagName === 'h2') return 'high';
    if (tagName === 'h3') return 'medium';
    if (className.includes('story-break') || className.includes('quote')) return 'high';
    
    return 'low';
  }

  findOptimalPlacements(analysis, variant) {
    const placements = [];
    
    // Rules for ethical ad placement
    const rules = {
      minDistanceFromTop: 300,
      minDistanceBetweenAds: 500,
      maxAdsPerScreen: 1,
      avoidNearCTA: true,
      respectNaturalBreaks: true,
      minReadingTime: this.contentPatterns[analysis.contentType]?.minReadingTime || 30
    };

    // Place ads at natural breaks with good engagement potential
    analysis.naturalBreaks.forEach((breakPoint, index) => {
      if (this.isValidPlacement(breakPoint.position, placements, rules, analysis)) {
        placements.push({
          position: breakPoint.position,
          type: this.selectAdType(breakPoint, variant, analysis),
          container: this.createAdContainer(breakPoint.position, analysis.contentType),
          priority: breakPoint.priority
        });
      }
    });

    // Sort by priority and limit number
    return placements
      .sort((a, b) => this.getPriorityScore(b.priority) - this.getPriorityScore(a.priority))
      .slice(0, 3); // Maximum 3 ads per page
  }

  getPriorityScore(priority) {
    const scores = {
      'highest': 4,
      'high': 3,
      'medium': 2,
      'low': 1
    };
    return scores[priority] || 1;
  }

  isValidPlacement(position, existingPlacements, rules, analysis) {
    // Check if position violates any rules
    if (position < rules.minDistanceFromTop) return false;
    
    for (const placement of existingPlacements) {
      if (Math.abs(position - placement.position) < rules.minDistanceBetweenAds) {
        return false;
      }
    }
    
    // Check proximity to CTAs and avoid elements
    const avoidSelectors = this.contentPatterns[analysis.contentType]?.avoidNear || 
                          ['.cta', 'button', '[role="button"]'];
    
    for (const selector of avoidSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        if (Math.abs(position - elementPosition) < rules.fromCTA) {
          return false;
        }
      }
    }
    
    return true;
  }

  selectAdType(breakPoint, variant, analysis) {
    // Choose ad type based on context and content type
    if (breakPoint.type === 'h1' || breakPoint.type === 'h2') {
      return variant.inArticle || 'native';
    }
    
    // SA IS A MOVIE specific ad type selection
    if (analysis.contentType === 'musicNews') {
      return variant.musicAd || 'display';
    } else if (analysis.contentType === 'celebrityNews') {
      return variant.celebrityAd || 'native';
    }
    
    return variant.sidebar || 'display';
  }

  createAdContainer(position, contentType) {
    const container = document.createElement('div');
    container.className = 'ad-container dynamic-placement';
    container.setAttribute('data-position', position);
    container.setAttribute('data-content-type', contentType);
    
    // SA IS A MOVIE themed styling
    const baseStyles = `
      margin: ${this.optimalSpacing.beforeAd}px 0 ${this.optimalSpacing.afterAd}px;
      min-height: 100px;
      background: rgba(255, 165, 0, 0.05);
      border: 1px solid rgba(255, 165, 0, 0.1);
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
    `;
    
    // Add content-type specific styling
    const typeStyles = {
      musicNews: 'border-left: 3px solid #FFA500;',
      celebrityNews: 'border-left: 3px solid #FF69B4;',
      trendingStory: 'border-left: 3px solid #00BFFF;'
    };
    
    container.style.cssText = baseStyles + (typeStyles[contentType] || '');
    
    // Add subtle SA IS A MOVIE branding
    const label = document.createElement('div');
    label.className = 'ad-label';
    label.textContent = 'Advertisement';
    label.style.cssText = `
      position: absolute;
      top: 5px;
      right: 10px;
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;
    container.appendChild(label);
    
    return container;
  }

  adjustSpacing(element, metrics) {
    // Dynamically adjust spacing based on performance
    const performance = metrics.ctr || 0;
    const bounceRate = metrics.bounceRate || 0;
    
    if (performance < 0.01 || bounceRate > 0.7) {
      // Poor performance - increase spacing
      this.optimalSpacing.beforeAd = Math.min(150, this.optimalSpacing.beforeAd + 10);
      this.optimalSpacing.afterAd = Math.min(150, this.optimalSpacing.afterAd + 10);
    } else if (performance > 0.03 && bounceRate < 0.4) {
      // Good performance - can reduce spacing slightly
      this.optimalSpacing.beforeAd = Math.max(80, this.optimalSpacing.beforeAd - 5);
      this.optimalSpacing.afterAd = Math.max(80, this.optimalSpacing.afterAd - 5);
    }
    
    // Update existing ad containers
    document.querySelectorAll('.ad-container.dynamic-placement').forEach(container => {
      container.style.marginTop = `${this.optimalSpacing.beforeAd}px`;
      container.style.marginBottom = `${this.optimalSpacing.afterAd}px`;
    });
  }

  // Get content engagement score for placement decisions
  getContentEngagementScore(container) {
    const content = container.textContent;
    const wordCount = content.split(/\s+/).length;
    const hasImages = container.querySelectorAll('img').length;
    const hasVideos = container.querySelectorAll('video, iframe').length;
    
    // SA IS A MOVIE engagement factors
    const engagementFactors = {
      wordCount: Math.min(1, wordCount / 500), // Normalize to 500 words
      mediaRichness: (hasImages * 0.3 + hasVideos * 0.7) / 3, // Max 3 media items
      saisaKeywords: this.countSaisaKeywords(content) / 10, // SA-specific terms
      readability: this.calculateReadability(content)
    };
    
    return Object.values(engagementFactors).reduce((sum, factor) => sum + factor, 0) / 4;
  }

  countSaisaKeywords(content) {
    const keywords = [
      'amapiano', 'johannesburg', 'cape town', 'durban', 'south africa',
      'celebrity', 'scandal', 'trending', 'viral', 'drama', 'gossip',
      'music', 'artist', 'song', 'festival', 'award', 'nomination'
    ];
    
    return keywords.reduce((count, keyword) => {
      return count + (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
    }, 0);
  }

  calculateReadability(content) {
    // Simple readability score based on sentence length and word complexity
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    // Lower scores are better for readability
    const readabilityScore = 1 - Math.min(1, (avgWordsPerSentence - 10) / 20 + (avgWordLength - 4) / 10);
    return Math.max(0, readabilityScore);
  }
}

export default ContentLayoutOptimizer;
