import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { GOOGLE_CLIENT_ID, validateGoogleConfig } from '@/lib/googleConfig';

/**
 * Example Google OAuth Integration Component
 * This demonstrates how to use Google OAuth with the configured environment variables
 */

const GoogleOAuthExample = () => {
  const [isConfigValid, setIsConfigValid] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validate Google configuration on component mount
    const configValid = validateGoogleConfig();
    setIsConfigValid(configValid);
  }, []);

  // Example function to initialize Google OAuth
  const initializeGoogleAuth = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID is not configured. Please check your environment variables.');
      return;
    }

    // This is where you would initialize Google OAuth
    // For example, with @react-oauth/google:
    /*
    import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
    
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log('Login Success:', credentialResponse);
            setIsAuthenticated(true);
          }}
          onError={() => {
            console.log('Login Failed');
            setError('Google OAuth login failed');
          }}
        />
      </GoogleOAuthProvider>
    );
    */
    
    console.log('Google OAuth would be initialized with Client ID:', GOOGLE_CLIENT_ID);
  };

  // Example function to make Google API requests
  const makeGoogleApiRequest = async () => {
    try {
      // Example API request using the configured API key
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=amapiano&key=${import.meta.env.VITE_GOOGLE_API_KEY}&maxResults=5`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Google API Response:', data);
        setUserInfo({ apiTest: 'Success', results: data.items?.length || 0 });
      } else {
        throw new Error(`API request failed: ${response.status}`);
      }
    } catch (err) {
      setError(`API request failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#0A0A2A]/50 border border-[#FFA500]/30">
        <CardHeader>
          <CardTitle className="text-[#FFA500]">Google OAuth Configuration</CardTitle>
          <CardDescription>
            Example integration showing how to use Google environment variables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Configuration Status */}
          <div className="flex items-center space-x-2">
            {isConfigValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className={isConfigValid ? 'text-green-500' : 'text-red-500'}>
              Google Configuration: {isConfigValid ? 'Valid' : 'Invalid'}
            </span>
          </div>

          {/* Environment Variables Display */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Environment Variables:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">VITE_GOOGLE_CLIENT_ID:</span>
                <span className={import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'text-green-500' : 'text-red-500'}>
                  {import.meta.env.VITE_GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">VITE_GOOGLE_API_KEY:</span>
                <span className={import.meta.env.VITE_GOOGLE_API_KEY ? 'text-green-500' : 'text-red-500'}>
                  {import.meta.env.VITE_GOOGLE_API_KEY ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={initializeGoogleAuth}
              disabled={!isConfigValid}
              className="saisa-bg-yellow text-black hover:bg-yellow-300"
            >
              Initialize Google OAuth
            </Button>
            <Button 
              onClick={makeGoogleApiRequest}
              disabled={!isConfigValid}
              variant="outline"
              className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-black"
            >
              Test Google API
            </Button>
          </div>

          {/* User Info Display */}
          {userInfo && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <h4 className="font-semibold text-green-400 mb-2">API Test Results:</h4>
              <pre className="text-sm text-gray-300">
                {JSON.stringify(userInfo, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card className="bg-[#0A0A2A]/50 border border-[#FFA500]/30">
        <CardHeader>
          <CardTitle className="text-[#FFA500]">Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-300">
          <div>
            <h4 className="font-semibold text-white mb-2">1. Create .env file:</h4>
            <pre className="bg-black/50 p-3 rounded text-xs overflow-x-auto">
{`VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
VITE_GOOGLE_API_KEY=your_google_api_key_here`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-2">2. Add to Netlify Environment:</h4>
            <p>Go to Netlify Dashboard → Site Settings → Build & Deploy → Environment Variables</p>
            <p>Add the same VITE_ variables listed above</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-2">3. Usage in Components:</h4>
            <pre className="bg-black/50 p-3 rounded text-xs overflow-x-auto">
{`import { GOOGLE_CLIENT_ID, GOOGLE_API_KEY } from '@/lib/googleConfig';

const clientId = GOOGLE_CLIENT_ID;
const apiKey = GOOGLE_API_KEY;`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleOAuthExample;



