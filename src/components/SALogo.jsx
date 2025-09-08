import React from 'react';

const SALogo = ({ className = "h-10 w-10" }) => {
  return (
    <img 
      src="/header-logo.svg" 
      alt="SA IS A MOVIE Logo" 
      className={className}
    />
  );
};

export default SALogo;
