import './react-polyfill.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))

// Render app without Auth0 - using Netlify Identity for CMS access
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
