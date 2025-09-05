import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <Auth0Provider
      domain="dev-sa-is-a-movie.us.auth0.com"
      clientId="2VtrMELNjVXvVxvNCdTfkqi5hvU0iXSY"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-sa-is-a-movie.us.auth0.com/api/v2/",
        scope: "read:current_user update:current_user_metadata"
      }}
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
