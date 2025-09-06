// ============================================
// AD-OPTIMIZED BLOG POST COMPONENT
// ============================================

import React, { useEffect, useState } from 'react';
import { useAdOptimization } from '../hooks/useAdOptimization';
import { PrivacyConsent } from './PrivacyConsent';
import { AdOptimizationDashboard } from './AdOptimizationDashboard';

export function AdOptimizedBlogPost({ postId, content, title, category }) {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  const {
    placements,
    loading,
    error,
    initializePlacements,
    trackAdImpression,
    trackAdClick
  } = useAdOptimization(postId, {
    tracking: {
      granularity: 'medium',
      anonymize: true
    }
  });

  useEffect(() => {
    if (consentGiven) {
      initializePlacements();
    }
  }, [consentGiven, initializePlacements]);

  useEffect(() => {
    // Insert ad containers at optimal positions
    if (placements.length > 0) {
      insertAdContainers();
    }
  }, [placements]);

  const insertAdContainers = () => {
    placements.forEach((placement, index) => {
      const targetElement = document.querySelector(
        `[data-content-position="${placement.position}"]`
      );
      
      if (targetElement && !targetElement.querySelector('.ad-container')) {
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container';
        adContainer.setAttribute('data-ad-type', placement.type);
        adContainer.setAttribute('data-ad-id', `ad-${Date.now()}-${index}`);
        adContainer.setAttribute('data-placement', placement.type);
        
        // Create AdSense ad unit
        const adUnit = createAdSenseUnit(placement.type, category);
        adContainer.innerHTML = adUnit;
        
        targetElement.appendChild(adContainer);
        
        // Track impression
        trackAdImpression(`ad-${Date.now()}-${index}`, placement.type);
        
        // Add click tracking
        adContainer.addEventListener('click', () => {
          trackAdClick(`ad-${Date.now()}-${index}`, placement.type);
        });
        
        // Initialize AdSense
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    });
  };

  const createAdSenseUnit = (adType, category) => {
    // SA IS A MOVIE specific ad configurations
    const adConfigs = {
      'hero-banner': {
        format: 'auto',
        responsive: true,
        slot: 'hero-banner'
      },
      'in-article-native': {
        format: 'fluid',
        layout: 'in-article',
        slot: 'in-article-native'
      },
      'in-article-display': {
        format: 'auto',
        responsive: true,
        slot: 'in-article-display'
      },
      'sidebar-sticky': {
        format: 'auto',
        responsive: true,
        slot: 'sidebar-sticky'
      },
      'end-of-content': {
        format: 'auto',
        responsive: true,
        slot: 'end-of-content'
      }
    };

    const config = adConfigs[adType] || adConfigs['in-article-display'];
    
    return `
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-YOUR-ADSENSE-ID"
           data-ad-slot="${config.slot}"
           data-ad-format="${config.format}"
           ${config.responsive ? 'data-full-width-responsive="true"' : ''}
           ${config.layout ? `data-ad-layout="${config.layout}"` : ''}></ins>
    `;
  };

  const getCategoryColor = (category) => {
    const colors = {
      music: 'border-l-orange-500',
      scandal: 'border-l-pink-500',
      celebrity: 'border-l-yellow-500',
      culture: 'border-l-blue-500'
    };
    return colors[category] || 'border-l-gray-500';
  };

  return (
    <>
      <PrivacyConsent onConsentChange={setConsentGiven} />
      
      {/* Admin dashboard toggle */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => setShowDashboard(!showDashboard)}
          className="fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-orange-600 transition-colors"
        >
          {showDashboard ? 'Hide' : 'Show'} Dashboard
        </button>
      )}
      
      {showDashboard && <AdOptimizationDashboard />}
      
      <article 
        className={`prose lg:prose-xl mx-auto max-w-4xl ${getCategoryColor(category)}`}
        data-content-container
      >
        {/* Blog Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full capitalize">
              {category}
            </span>
            <span>SA IS A MOVIE</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        {/* Content with ad placement markers */}
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ 
            __html: content.replace(
              /<\/p>/g, 
              '</p><div data-content-position="' + Date.now() + '"></div>'
            )
          }} 
        />

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Optimizing ad placement...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-8">
            <p className="text-red-800">Ad optimization error: {error}</p>
            <p className="text-red-600 text-sm mt-1">
              Ads will display in standard positions.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>© 2024 SA IS A MOVIE. All rights reserved.</p>
              <p>Breaking down South Africa's hottest scandals and entertainment news.</p>
            </div>
            <div className="flex gap-4">
              <button className="text-orange-600 hover:text-orange-700 text-sm">
                Share
              </button>
              <button className="text-orange-600 hover:text-orange-700 text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </footer>
      </article>

      {/* Ad optimization info (only in development) */}
      {process.env.NODE_ENV === 'development' && consentGiven && (
        <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg max-w-xs">
          <h4 className="font-semibold text-sm text-gray-900 mb-2">Ad Optimization</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Placements: {placements.length}</p>
            <p>Status: {loading ? 'Loading...' : 'Active'}</p>
            <p>Consent: {consentGiven ? 'Given' : 'Not given'}</p>
          </div>
        </div>
      )}
    </>
  );
}
