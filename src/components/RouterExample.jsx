import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, User, Settings } from 'lucide-react';

/**
 * Example component demonstrating React Router features
 * Shows navigation, protected routes, and routing utilities
 */
const RouterExample = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useUser();

  const handleNavigateToDashboard = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      navigate('/', { state: { message: 'Please sign in to access dashboard' } });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoForward = () => {
    navigate(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-[#0A0A2A]/50 border border-[#FFA500]/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 saisa-text-yellow">React Router Features</h2>
        
        {/* Current Location Info */}
        <div className="mb-6 p-4 bg-[#0A0A2A]/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Current Location</h3>
          <p className="text-gray-300">Path: <code className="text-[#FFA500]">{location.pathname}</code></p>
          <p className="text-gray-300">Search: <code className="text-[#FFA500]">{location.search || 'none'}</code></p>
          <p className="text-gray-300">Hash: <code className="text-[#FFA500]">{location.hash || 'none'}</code></p>
        </div>

        {/* Navigation Examples */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Navigation Examples</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-black"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              onClick={handleGoForward}
              variant="outline"
              className="border-[#FFA500] text-[#FFA500] hover:bg-[#FFA500] hover:text-black"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Go Forward
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              className="saisa-bg-yellow text-black hover:bg-yellow-300"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            
            <Button 
              onClick={handleNavigateToDashboard}
              className="saisa-bg-red text-white hover:bg-red-600"
            >
              <User className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Link Examples */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Link Examples</h3>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/blog" 
              className="px-4 py-2 bg-[#FFA500] text-black rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Blog
            </Link>
            <Link 
              to="/trending" 
              className="px-4 py-2 bg-[#FFA500] text-black rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Trending
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 bg-[#FFA500] text-black rounded-lg hover:bg-yellow-300 transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="px-4 py-2 bg-[#FFA500] text-black rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Authentication Status */}
        <div className="p-4 bg-[#0A0A2A]/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Authentication Status</h3>
          <p className="text-gray-300">
            Status: <span className={isSignedIn ? 'text-green-400' : 'text-red-400'}>
              {isSignedIn ? 'Signed In' : 'Signed Out'}
            </span>
          </p>
          {isSignedIn && (
            <p className="text-gray-300 mt-2">
              You can access protected routes like the Dashboard.
            </p>
          )}
          {!isSignedIn && (
            <p className="text-gray-300 mt-2">
              Sign in to access protected routes and features.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouterExample;
