import React from 'react';

const SALogo = ({ className = "h-10 w-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* South Africa Map Shape */}
      <path
        d="M20 30 L45 25 L65 30 L75 45 L70 65 L55 75 L35 70 L25 55 L20 30 Z"
        fill="#FF66B2"
        stroke="#FFA500"
        strokeWidth="1"
      />
      
      {/* Film Reel */}
      <circle
        cx="50"
        cy="50"
        r="12"
        fill="none"
        stroke="#00FFFF"
        strokeWidth="2"
      />
      
      {/* Film Reel Holes */}
      <circle cx="50" cy="45" r="1.5" fill="#00FFFF" />
      <circle cx="50" cy="55" r="1.5" fill="#00FFFF" />
      <circle cx="45" cy="50" r="1.5" fill="#00FFFF" />
      <circle cx="55" cy="50" r="1.5" fill="#00FFFF" />
      
      {/* Film Strip */}
      <rect
        x="35"
        y="48"
        width="30"
        height="4"
        fill="#FFA500"
        rx="1"
      />
      
      {/* Film Strip Perforations */}
      <rect x="37" y="47" width="1" height="6" fill="#0A0A2A" />
      <rect x="40" y="47" width="1" height="6" fill="#0A0A2A" />
      <rect x="43" y="47" width="1" height="6" fill="#0A0A2A" />
      <rect x="46" y="47" width="1" height="6" fill="#0A0A2A" />
      <rect x="49" y="47" width="1" height="6" fill="#0A0A2A" />
      <rect x="52" y="47" width="1" height="6" fill="#0A0A2A" />
      <rect x="55" y="47" width="1" height="6" fill="#0A0A2A" />
      <rect x="58" y="47" width="1" height="6" fill="#0A0A2A" />
      <rect x="61" y="47" width="1" height="6" fill="#0A0A2A" />
      <rect x="64" y="47" width="1" height="6" fill="#0A0A2A" />
      
      {/* Film Strip Extension */}
      <rect
        x="25"
        y="48"
        width="15"
        height="4"
        fill="#FFA500"
        rx="1"
      />
      
      {/* Additional Film Strip Perforations */}
      <rect x="27" y="47" width="1" height="6" fill="#0A0A2A" />
      <rect x="30" y="47" width="1" height="6" fill="#0A0A2A" />
      <rect x="33" y="47" width="1" height="6" fill="#0A0A2A" />
      <rect x="36" y="47" width="1" height="6" fill="#0A0A2A" />
    </svg>
  );
};

export default SALogo;
