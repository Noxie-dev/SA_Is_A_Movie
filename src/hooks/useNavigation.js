import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

/**
 * Custom hook for navigation utilities
 * Provides navigation functions and current location info
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useUser();

  const navigateTo = (path, options = {}) => {
    navigate(path, options);
  };

  const navigateBack = () => {
    navigate(-1);
  };

  const navigateForward = () => {
    navigate(1);
  };

  const navigateToDashboard = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      navigate('/', { state: { from: '/dashboard' } });
    }
  };

  const navigateToBlog = () => {
    navigate('/blog');
  };

  const navigateToTrending = () => {
    navigate('/trending');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const isCurrentPath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getCurrentPath = () => {
    return location.pathname;
  };

  const getPathSegments = () => {
    return location.pathname.split('/').filter(Boolean);
  };

  return {
    navigateTo,
    navigateBack,
    navigateForward,
    navigateToDashboard,
    navigateToBlog,
    navigateToTrending,
    navigateToHome,
    isCurrentPath,
    getCurrentPath,
    getPathSegments,
    currentPath: location.pathname,
    isSignedIn
  };
};
