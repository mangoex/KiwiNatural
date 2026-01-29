import React from 'react';

export const KiwiLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Kiwi Natural Logo"
  >
    {/* Outer Green Ring (The "contorno verde") */}
    <circle cx="50" cy="50" r="50" fill="#84cc16" />
    
    {/* Inner Blue Circle */}
    <circle cx="50" cy="50" r="35" fill="#1e3a8a" />
    
    {/* Seeds Pattern */}
    <g fill="white">
      {/* Top Teardrop */}
      <path d="M50 22 C54 22 58 32 50 42 C42 32 46 22 50 22 Z" />
      {/* Bottom Teardrop */}
      <path d="M50 78 C46 78 42 68 50 58 C58 68 54 78 50 78 Z" />
      {/* Left Teardrop */}
      <path d="M22 50 C22 46 32 42 42 50 C32 58 22 54 22 50 Z" />
      {/* Right Teardrop */}
      <path d="M78 50 C78 54 68 58 58 50 C68 42 78 46 78 50 Z" />
      
      {/* Diagonal Seeds (Dots) */}
      <circle cx="33" cy="33" r="5" />
      <circle cx="67" cy="33" r="5" />
      <circle cx="67" cy="67" r="5" />
      <circle cx="33" cy="67" r="5" />
      
      {/* Center dot */}
      <circle cx="50" cy="50" r="3" />
    </g>
  </svg>
);