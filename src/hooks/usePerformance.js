import { useEffect, useState } from 'react';

/**
 * Performance monitoring hook
 * Tracks Core Web Vitals and performance metrics
 */
export const usePerformance = () => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVitals = () => {
      // First Contentful Paint (FCP)
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({
                ...prev,
                fcp: entry.startTime
              }));
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });
      }

      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics(prev => ({
            ...prev,
            lcp: lastEntry.startTime
          }));
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      }

      // Cumulative Layout Shift (CLS)
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          setMetrics(prev => ({
            ...prev,
            cls: clsValue
          }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }

      // First Input Delay (FID)
      if ('PerformanceObserver' in window) {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            setMetrics(prev => ({
              ...prev,
              fid: entry.processingStart - entry.startTime
            }));
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      }
    };

    // Track page load time
    const trackPageLoad = () => {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          setMetrics(prev => ({
            ...prev,
            pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart
          }));
        }
      });
    };

    trackWebVitals();
    trackPageLoad();

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance metrics:', metrics);
    }
  }, []);

  return metrics;
};

/**
 * Hook to measure component render time
 */
export const useRenderTime = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
};

export default usePerformance;