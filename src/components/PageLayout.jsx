import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Breadcrumb from './Breadcrumb';

const PageLayout = ({ children, showBreadcrumb = true }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen saisa-bg text-white">
      <Navigation />
      {!isHomePage && showBreadcrumb && <Breadcrumb />}
      <main className={isHomePage ? '' : 'pt-20'}>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
