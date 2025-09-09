// Service Worker Registration
import { Workbox } from 'workbox-window';

let wb;

// Only register service worker in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  wb = new Workbox('/sw.js');

  wb.addEventListener('controlling', () => {
    // Service worker is controlling the page
    console.log('Service worker is controlling the page');
  });

  wb.addEventListener('activated', () => {
    // Service worker is activated
    console.log('Service worker is activated');
  });

  // Register the service worker
  wb.register().then(() => {
    console.log('Service worker registered successfully');
  }).catch((error) => {
    console.error('Service worker registration failed:', error);
  });
} else if (import.meta.env.DEV) {
  console.log('Service worker registration skipped in development mode');
}

export default wb;