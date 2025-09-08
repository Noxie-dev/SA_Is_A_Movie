import React from 'react';

const FooterLogo = ({ className = "h-8 w-8" }) => {
  return (
    <img 
      src="/footer-logo.svg" 
      alt="SA IS A MOVIE Footer Logo" 
      className={className}
    />
  );
};

export default FooterLogo;
