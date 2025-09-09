// ============================================
// REACT HOOK FOR AD OPTIMIZATION
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import PrivacyEngagementTracker from '../lib/privacyEngagement.js';
import ThompsonSamplingBandit from '../lib/adaptiveAlgorithm.js';
import ContentLayoutOptimizer from '../lib/contentOptimizer.js';
import RewardCalculator from '../lib/rewardCalculator.js';

export function useAdOptimization(pageId, config = {}) {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState(null);
  const [banditStats, setBanditStats] = useState({});
  
  const trackerRef = useRef(null);
  const banditRef = useRef(null);
  const optimizerRef = useRef(null);
  const rewardCalcRef = useRef(null);

  useEffect(() => {
    // Initialize systems
    try {
      trackerRef.current = new PrivacyEngagementTracker(config.tracking || {});
      
      const arms = [
        'hero-banner',
        'in-article-native',
        'in-article-display',
        'sidebar-sticky',
        'end-of-content'
      ];
      banditRef.current = new ThompsonSamplingBandit(arms);
      optimizerRef.current = new ContentLayoutOptimizer();
      rewardCalcRef.current = new RewardCalculator();

      // Check consent
      checkConsent();
    } catch (err) {
      setError('Failed to initialize ad optimization system');
      console.error('Ad optimization initialization error:', err);
    }
  }, [pageId]);

  const checkConsent = async () => {
    try {
      // Check localStorage first
      const storedConsent = localStorage.getItem('ad_optimization_consent');
      if (storedConsent !== null) {
        const hasConsent = storedConsent === 'true';
        setConsent(hasConsent);
        if (trackerRef.current) {
          trackerRef.current.setConsent(hasConsent);
        }
        return;
      }

      // If no stored consent, check server
      const response = await fetch('/api/consent/status');
      if (response.ok) {
        const data = await response.json();
        setConsent(data.hasConsent);
        if (trackerRef.current) {
          trackerRef.current.setConsent(data.hasConsent);
        }
      }
    } catch (error) {
      console.error('Failed to check consent:', error);
      // Default to no consent if check fails
      setConsent(false);
    }
  };

  const initializePlacements = useCallback(async () => {
    if (!consent) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Get decision from server
      const context = {
        pageId,
        viewport: trackerRef.current.getViewportCategory(),
        dayPart: trackerRef.current.getDayPart(),
        referrerType: trackerRef.current.getReferrerType()
      };
      
      const response = await fetch('/api/placement-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
      });
      
      if (!response.ok) {
        throw new Error('Failed to get placement decision');
      }
      
      const { variant, decisionId } = await response.json();
      
      // Use bandit to select placements
      const selectedArm = banditRef.current.selectArm(context);
      
      // Analyze content and find placements
      const container = document.querySelector('[data-content-container]');
      if (container) {
        const analysis = optimizerRef.current.analyzeContent(container);
        const optimalPlacements = optimizerRef.current.findOptimalPlacements(
          analysis, 
          variant
        );
        
        setPlacements(optimalPlacements);
        
        // Track placement decision
        trackerRef.current.trackEngagement(container, 'placement_initialized');
        
        // Update bandit stats
        setBanditStats(banditRef.current.getStatistics());
      } else {
        console.warn('No content container found for ad optimization');
      }
    } catch (error) {
      console.error('Failed to initialize placements:', error);
      setError('Failed to initialize ad placements');
    } finally {
      setLoading(false);
    }
  }, [consent, pageId]);

  const trackAdImpression = useCallback((adId, placement) => {
    if (!trackerRef.current || !consent) return;
    
    try {
      const adElement = document.querySelector(`[data-ad-id="${adId}"]`);
      if (adElement) {
        trackerRef.current.trackEngagement(adElement, 'ad_impression');
        
        // Schedule reward calculation
        setTimeout(() => calculateAndUpdateReward(adId, placement), 5000);
      }
    } catch (error) {
      console.error('Failed to track ad impression:', error);
    }
  }, [consent]);

  const calculateAndUpdateReward = async (adId, placement) => {
    try {
      // Get metrics for this ad
      const response = await fetch(`/api/ads/${adId}/metrics`);
      if (!response.ok) {
        console.warn('Failed to fetch ad metrics');
        return;
      }
      
      const metrics = await response.json();
      
      // Calculate reward
      const reward = rewardCalcRef.current.calculateReward(metrics);
      
      // Update bandit
      banditRef.current.updateArm(placement, reward);
      
      // Send reward to server
      await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adId,
          placement,
          reward,
          metrics
        })
      });
      
      // Adjust spacing if needed
      const adElement = document.querySelector(`[data-ad-id="${adId}"]`);
      if (adElement) {
        optimizerRef.current.adjustSpacing(adElement, metrics);
      }
      
      // Update bandit stats
      setBanditStats(banditRef.current.getStatistics());
    } catch (error) {
      console.error('Failed to calculate reward:', error);
    }
  };

  const trackAdClick = useCallback((adId, placement) => {
    if (!trackerRef.current || !consent) return;
    
    try {
      // Use a more defensive approach to find the ad element
      const adElement = document.querySelector(`[data-ad-id="${adId}"]`);
      if (adElement && adElement.parentNode) {
        trackerRef.current.trackEngagement(adElement, 'ad_click');
        
        // Immediate reward for click
        setTimeout(() => calculateAndUpdateReward(adId, placement), 1000);
      }
    } catch (error) {
      console.error('Failed to track ad click:', error);
    }
  }, [consent]);

  const setConsentStatus = useCallback((hasConsent) => {
    setConsent(hasConsent);
    if (trackerRef.current) {
      trackerRef.current.setConsent(hasConsent);
    }
    
    // Store consent preference
    localStorage.setItem('ad_optimization_consent', hasConsent.toString());
    
    // Notify server
    fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consent: hasConsent })
    }).catch(error => {
      console.error('Failed to update consent on server:', error);
    });
  }, []);

  const getOptimizationStats = useCallback(() => {
    if (!banditRef.current) return null;
    
    return {
      banditStats: banditRef.current.getStatistics(),
      confidenceIntervals: banditRef.current.getConfidenceIntervals(),
      explorationRatio: banditRef.current.getExplorationRatio(),
      totalTrials: banditRef.current.history.length
    };
  }, []);

  const resetOptimization = useCallback(() => {
    if (banditRef.current) {
      banditRef.current.arms.forEach(arm => {
        banditRef.current.resetArm(arm);
      });
      setBanditStats(banditRef.current.getStatistics());
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackerRef.current) {
        trackerRef.current.destroy();
      }
    };
  }, []);

  return {
    placements,
    loading,
    consent,
    error,
    banditStats,
    initializePlacements,
    trackAdImpression,
    trackAdClick,
    setConsentStatus,
    getOptimizationStats,
    resetOptimization
  };
}
