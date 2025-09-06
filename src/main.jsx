import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Lazy load Auth0Provider to reduce initial bundle size
const Auth0Provider = lazy(() => import('@auth0/auth0-react').then(module => ({ default: module.Auth0Provider })))

const root = createRoot(document.getElementById('root'))

// Check if required environment variables are available
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN?.replace(/[\[\]]/g, '');
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID?.replace(/[\[\]]/g, '');
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE;

// If Auth0 is not properly configured, render app without Auth0
if (!auth0Domain || !auth0ClientId) {
  console.warn('Auth0 not properly configured, running without authentication');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A2A]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFA500]"></div>
        </div>
      }>
        <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: auth0Audience,
            scope: "read:current_user update:current_user_metadata"
          }}
          useRefreshTokens={true}
        >
          <App />
        </Auth0Provider>
      </Suspense>
    </StrictMode>
  );
}
