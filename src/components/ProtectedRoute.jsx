import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

/**
 * ProtectedRoute component that requires authentication
 * Redirects unauthenticated users to the home page
 */
const ProtectedRoute = ({ children, redirectTo = '/' }) => {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFA500]"></div>
      </div>
    );
  }

  // If not signed in, redirect to home page with return URL
  if (!isSignedIn) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If signed in, render the protected component
  return children;
};

export default ProtectedRoute;
