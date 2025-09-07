import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbLabel = (segment, index) => {
    const labels = {
      'blog': 'Blog',
      'trending': 'Trending',
      'about': 'About',
      'contact': 'Contact',
      'dashboard': 'Dashboard',
      'privacy': 'Privacy Policy',
      'terms': 'Terms of Service'
    };
    
    return labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  if (pathSegments.length === 0) {
    return null; // Don't show breadcrumb on home page
  }

  return (
    <nav className="bg-[#0A0A2A]/50 border-b border-[#FFA500]/20 py-3">
      <div className="container mx-auto px-6">
        <div className="flex items-center space-x-2 text-sm">
          <Link 
            to="/" 
            className="flex items-center text-[#FFA500] hover:text-yellow-300 transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const path = '/' + pathSegments.slice(0, index + 1).join('/');
            
            return (
              <React.Fragment key={path}>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {isLast ? (
                  <span className="text-white font-medium">
                    {getBreadcrumbLabel(segment, index)}
                  </span>
                ) : (
                  <Link 
                    to={path}
                    className="text-[#FFA500] hover:text-yellow-300 transition-colors"
                  >
                    {getBreadcrumbLabel(segment, index)}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;
