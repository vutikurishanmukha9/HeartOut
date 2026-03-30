import React from 'react';

export const CrackedHeartIcon = ({ className = 'w-5 h-5', strokeWidth = 2, style, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    {/* Heart outline */}
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    {/* Jagged crack down the middle */}
    <path d="M12 5.5v2.5l-1.5 1.5 2.5 2-1.5 2.5v1.5" />
    {/* Radiating lines (cracks extending out) */}
    <path d="M5 4l-2 -1" />
    <path d="M19 4l2 -1" />
    <path d="M22 10h1" />
    <path d="M1 10h1" />
  </svg>
);

export const OpenPalmsIcon = ({ className = 'w-5 h-5', strokeWidth = 2, style, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    {/* Left hand (palm opening up) */}
    <path d="M4 14a3 3 0 0 1 0-6c2 0 4 3 8 3" />
    <path d="M4 14a2 2 0 0 0 2 2h2c2 0 4-2 4-2" />
    
    {/* Right hand (palm opening up) */}
    <path d="M20 14a3 3 0 0 0 0-6c-2 0-4 3-8 3" />
    <path d="M20 14a2 2 0 0 1-2 2h-2c-2 0-4-2-4-2" />
    
    {/* Offering energy/space in between */}
    <path d="M12 7v1" strokeWidth="2.5" opacity="0.6" />
    <path d="M12 11v1" strokeWidth="2.5" opacity="0.3" />
  </svg>
);

export const RippleTearIcon = ({ className = 'w-5 h-5', strokeWidth = 2, style, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    {/* Small inner face */}
    <circle cx="12" cy="7" r="4.5" />
    {/* Closed eyes - peaceful/moved */}
    <path d="M10 6.5s.5-.5 1 0" strokeWidth="1" />
    <path d="M14 6.5s-.5-.5-1 0" strokeWidth="1" />
    
    {/* Single falling tear */}
    <path d="M12 13v3" strokeWidth="1.5" />
    <circle cx="12" cy="17" r="1.5" fill="currentColor" />
    
    {/* Spreading ripples at the bottom */}
    <path d="M8 20c2 1 6 1 8 0" opacity="0.6" strokeWidth={strokeWidth} />
    <path d="M4 22c3.5 1.5 12.5 1.5 16 0" opacity="0.3" strokeWidth={strokeWidth} />
  </svg>
);

export const DoubleStarIcon = ({ className = 'w-5 h-5', strokeWidth = 2, style, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    {/* Outer star shell */}
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    {/* Inner solid burning star */}
    <polygon points="12 8 13.5 11 17 11.5 14.5 14 15 17.5 12 16 9 17.5 9.5 14 7 11.5 10.5 11 12 8" fill="currentColor" opacity="0.8" />
  </svg>
);

export const BurstingSeedIcon = ({ className = 'w-5 h-5', strokeWidth = 2, style, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    {/* The seed body - cracked horizontally */}
    <path d="M4 15c0 4.5 4 6 8 6s8-1.5 8-6" />
    <path d="M4 15c0-2 4-4 8-4s8 2 8 4" opacity="0.5" />
    
    {/* Crack opening at the center */}
    <path d="M10 15c1-1 3-1 4 0" />
    
    {/* Light rays bursting upward from the center */}
    <path d="M12 11V3" strokeWidth="2.5" />
    <path d="M8 11.5L4 5" strokeWidth="2.5" opacity="0.8" />
    <path d="M16 11.5l4-6.5" strokeWidth="2.5" opacity="0.8" />
  </svg>
);
