// ============================================
// PRIVACY-FIRST ENGAGEMENT TRACKER
// ============================================

class PrivacyEngagementTracker {
  constructor(options = {}) {
    this.consent = false;
    this.sessionId = this.generateSessionId();
    this.buffer = [];
    this.maxBufferSize = options.maxBufferSize || 20;
    this.flushInterval = options.flushInterval || 5000;
    this.viewportSegments = this.calculateViewportSegments();
    this.engagementZones = new Map();
    this.lastInteraction = Date.now();
    
    // Privacy-preserving defaults
    this.trackingGranularity = options.granularity || 'coarse'; // coarse, medium, fine
    this.anonymizeData = options.anonymize !== false;
    
    // Start periodic flush
    this.startPeriodicFlush();
  }

  generateSessionId() {
    // Generate anonymous session ID
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  calculateViewportSegments() {
    // Divide viewport into engagement zones
    const vh = window.innerHeight;
    return {
      aboveFold: { start: 0, end: vh },
      firstScroll: { start: vh, end: vh * 2 },
      midContent: { start: vh * 2, end: vh * 4 },
      deepContent: { start: vh * 4, end: Infinity }
    };
  }

  trackEngagement(element, type = 'view') {
    if (!this.consent) return;
    
    const rect = element.getBoundingClientRect();
    const zone = this.getZone(rect.top + window.scrollY);
    const timestamp = Date.now();
    
    // Aggregate data for privacy
    const event = {
      zone,
      type,
      duration: timestamp - this.lastInteraction,
      timestamp: this.anonymizeTimestamp(timestamp),
      context: this.getAnonymousContext()
    };
    
    this.buffer.push(event);
    this.lastInteraction = timestamp;
    
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  getZone(scrollPosition) {
    for (const [zone, bounds] of Object.entries(this.viewportSegments)) {
      if (scrollPosition >= bounds.start && scrollPosition < bounds.end) {
        return zone;
      }
    }
    return 'deepContent';
  }

  anonymizeTimestamp(ts) {
    // Round to nearest minute for privacy
    return Math.floor(ts / 60000) * 60000;
  }

  getAnonymousContext() {
    // Get context without PII
    return {
      viewport: this.getViewportCategory(),
      dayPart: this.getDayPart(),
      referrerType: this.getReferrerType()
    };
  }

  getViewportCategory() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  getDayPart() {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  getReferrerType() {
    const referrer = document.referrer;
    if (!referrer) return 'direct';
    if (referrer.includes('google.com')) return 'search';
    if (referrer.includes('facebook.com') || referrer.includes('twitter.com') || referrer.includes('instagram.com')) return 'social';
    return 'other';
  }

  startPeriodicFlush() {
    setInterval(() => {
      if (this.buffer.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  async flush() {
    if (this.buffer.length === 0) return;
    
    const aggregatedData = this.aggregateEvents(this.buffer);
    this.buffer = [];
    
    try {
      await fetch('/api/engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          data: aggregatedData
        })
      });
    } catch (error) {
      console.error('Failed to send engagement data:', error);
    }
  }

  aggregateEvents(events) {
    // Aggregate events to preserve privacy
    const zones = {};
    events.forEach(event => {
      if (!zones[event.zone]) {
        zones[event.zone] = {
          count: 0,
          totalDuration: 0,
          types: {}
        };
      }
      zones[event.zone].count++;
      zones[event.zone].totalDuration += event.duration;
      zones[event.zone].types[event.type] = (zones[event.zone].types[event.type] || 0) + 1;
    });
    return zones;
  }

  setConsent(hasConsent) {
    this.consent = hasConsent;
    if (!hasConsent) {
      this.buffer = [];
      this.engagementZones.clear();
    }
  }

  // Cleanup method
  destroy() {
    if (this.buffer.length > 0) {
      this.flush();
    }
  }
}

export default PrivacyEngagementTracker;
