import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import SALogo from './SALogo';
import AuthButton from './AuthButton';

const Navigation = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/blog', label: 'Blog' },
    { path: '/trending', label: 'Trending' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0A0A2A]/80 backdrop-blur-sm border-b border-[#FFA500]/20">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3"
          >
            <SALogo className="h-10 w-10" />
            <span className="text-xl font-bold">
              SA IS A <span className="saisa-text-red">MOVIE</span>
            </span>
          </motion.div>
        </Link>
        
        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex items-center space-x-6"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive(item.path)
                  ? 'text-[#FFA500] font-semibold'
                  : 'text-white hover:text-[#FFA500]'
              }`}
            >
              {item.label}
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#FFA500]/10 rounded-lg border border-[#FFA500]/30"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
          
          {/* Dashboard link for authenticated users */}
          <SignedIn>
            <Link
              to="/dashboard"
              className={`relative px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive('/dashboard')
                  ? 'text-[#FFA500] font-semibold'
                  : 'text-white hover:text-[#FFA500]'
              }`}
            >
              Dashboard
              {isActive('/dashboard') && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#FFA500]/10 rounded-lg border border-[#FFA500]/30"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </SignedIn>
          
          <AuthButton />
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="md:hidden"
        >
          <AuthButton />
        </motion.div>
      </div>
    </nav>
  );
};

export default Navigation;
