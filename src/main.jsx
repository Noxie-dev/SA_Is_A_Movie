import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { ConsentProvider } from './context/ConsentContext'
import './index.css'
import App from './App.jsx'
import './utils/serviceWorker.js'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const root = createRoot(document.getElementById('root'))

// Render app with Clerk authentication and consent management
root.render(
  <StrictMode>
    <ConsentProvider>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </ConsentProvider>
  </StrictMode>
);
