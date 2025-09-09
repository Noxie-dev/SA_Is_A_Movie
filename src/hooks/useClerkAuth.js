import { useUser, useAuth } from '@clerk/clerk-react';

// Custom hook for Clerk authentication
export const useClerkAuth = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useAuth();

  const isAuthenticated = userLoaded && !!user;
  const isLoading = !userLoaded;

  const login = () => {
    // Clerk handles this automatically with their components
    window.location.href = '/sign-in';
  };

  const logout = () => {
    signOut();
  };

  const signup = () => {
    // Clerk handles this automatically with their components
    window.location.href = '/sign-up';
  };

  return {
    user: user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      name: user.fullName || user.firstName || user.primaryEmailAddress?.emailAddress?.split('@')[0],
      picture: user.imageUrl,
      metadata: user.publicMetadata
    } : null,
    isAuthenticated,
    isLoading,
    login,
    logout,
    signup
  };
};




