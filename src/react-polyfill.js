// React polyfill to ensure useLayoutEffect is available
import React from 'react';

// Ensure useLayoutEffect is available
if (typeof React.useLayoutEffect === 'undefined') {
  React.useLayoutEffect = React.useEffect;
}

// Export React to ensure it's available globally
if (typeof window !== 'undefined') {
  window.React = React;
}

export default React;

