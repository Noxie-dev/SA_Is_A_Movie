// ============================================
// PRIVACY CONSENT COMPONENT
// ============================================

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Shield, Eye, Settings } from 'lucide-react';

export function PrivacyConsent({ onConsentChange }) {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check for existing consent
    const storedConsent = localStorage.getItem('ad_optimization_consent');
    if (storedConsent === null) {
      setShowBanner(true);
    } else {
      setConsent(storedConsent === 'true');
      onConsentChange(storedConsent === 'true');
    }
  }, [onConsentChange]);

  const handleConsent = async (hasConsent) => {
    setConsent(hasConsent);
    setShowBanner(false);
    localStorage.setItem('ad_optimization_consent', hasConsent.toString());
    
    // Notify server
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: hasConsent })
      });
    } catch (error) {
      console.error('Failed to update consent on server:', error);
    }
    
    onConsentChange(hasConsent);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Default to no consent if dismissed
    handleConsent(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm shadow-lg z-50 border-t border-gray-200">
      <Card className="max-w-4xl mx-auto p-6 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Privacy & Ad Optimization
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use privacy-preserving algorithms to optimize ad placement and improve your experience on SA IS A MOVIE. 
              This includes anonymous engagement tracking and adaptive content layout. 
              <strong> No personal data is collected or shared.</strong>
            </p>
          </div>
        </div>

        {showDetails && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              What We Track (Anonymously)
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Content engagement zones (above fold, mid-content, etc.)</li>
              <li>• Reading time and scroll depth</li>
              <li>• Device type and time of day</li>
              <li>• Ad performance metrics</li>
              <li>• Page load times and user experience</li>
            </ul>
            
            <h4 className="font-semibold text-gray-900 mb-2 mt-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              How We Use This Data
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Optimize ad placement for better user experience</li>
              <li>• Reduce intrusive advertising</li>
              <li>• Improve page load times</li>
              <li>• Ensure content remains the focus</li>
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => handleConsent(true)} 
            className="bg-orange-600 hover:bg-orange-700 text-white flex-1"
          >
            Accept Optimization
          </Button>
          <Button 
            onClick={() => handleConsent(false)} 
            variant="outline" 
            className="flex-1"
          >
            Use Standard Layout
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          You can change this preference anytime in your browser settings.
          <br />
          <a 
            href="/privacy-policy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-600 hover:text-orange-700 underline"
          >
            Read our full privacy policy
          </a>
        </div>
      </Card>
    </div>
  );
}
