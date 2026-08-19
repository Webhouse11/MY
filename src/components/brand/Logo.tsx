import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = false,
  showBadge = false,
  className = '',
  onClick
}) => {
  const isDarkVariant = variant === 'dark' || variant === 'white';
  
  // Emblem Icon Dimensions
  const markDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
    xl: 'w-16 h-16'
  }[size];

  // Brand Name Typography Sizes
  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl'
  }[size];

  // Tagline Sizes
  const taglineSizes = {
    sm: 'text-[8.5px]',
    md: 'text-[9.5px] sm:text-[10.5px]',
    lg: 'text-[11px] sm:text-xs',
    xl: 'text-xs sm:text-sm'
  }[size];

  return (
    <div
      id="brand-logo-container"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none cursor-pointer group ${className}`}
    >
      {/* High-Definition 3D Emblem Mark (Faithfully matching uploaded brand artwork) */}
      <div
        className={`relative flex items-center justify-center shrink-0 ${markDimensions} rounded-2xl p-1 group-hover:scale-105 transition-transform duration-200 drop-shadow-md`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* 3D Blue Circular Arc Gradient */}
            <linearGradient id="ct-blue-gradient" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00A3FF" />
              <stop offset="45%" stopColor="#0066CC" />
              <stop offset="100%" stopColor="#071A33" />
            </linearGradient>

            {/* 3D Golden Orange T-Beam Gradient */}
            <linearGradient id="ct-orange-gradient" x1="50" y1="10" x2="90" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFB300" />
              <stop offset="35%" stopColor="#F7931E" />
              <stop offset="100%" stopColor="#D95A00" />
            </linearGradient>

            {/* Top Swish Arc Gradient */}
            <linearGradient id="ct-swish-gradient" x1="30" y1="5" x2="85" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFA000" />
              <stop offset="100%" stopColor="#F7931E" />
            </linearGradient>

            {/* Bar Chart Deep Blue Gradient */}
            <linearGradient id="ct-bar-gradient" x1="45" y1="40" x2="65" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0084FF" />
              <stop offset="100%" stopColor="#0A2540" />
            </linearGradient>

            {/* Subtle Inner Glow & Shadow Filter */}
            <filter id="ct-drop-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#071A33" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Top Golden Orange Arc Swish */}
          <path
            d="M 33 12 C 48 5, 68 7, 78 22 C 72 15, 52 11, 33 12 Z"
            fill="url(#ct-swish-gradient)"
          />

          {/* 3D Bold Blue 'C' Circular Ring */}
          <path
            d="M 68 28 C 55 12, 28 15, 18 35 C 8 55, 18 78, 40 82 C 58 85, 72 73, 76 56 C 78 48, 71 44, 66 48 C 62 52, 55 70, 39 68 C 26 66, 20 50, 26 38 C 32 26, 52 23, 62 34 C 65 37, 70 34, 68 28 Z"
            fill="url(#ct-blue-gradient)"
            filter="url(#ct-drop-shadow)"
          />

          {/* Bottom Blue Tail Swish */}
          <path
            d="M 67 76 C 73 70, 77 62, 78 54 C 76 60, 71 67, 63 71 Z"
            fill="#0066CC"
          />

          {/* Ascending Financial/Analytics Bar Chart (Inside the circle) */}
          {/* Bar 1 (Short) */}
          <rect x="42" y="49" width="7" height="23" rx="1.5" fill="url(#ct-bar-gradient)" />
          {/* Bar 2 (Medium) */}
          <rect x="51" y="41" width="7" height="31" rx="1.5" fill="url(#ct-bar-gradient)" />
          {/* Bar 3 (Tall) */}
          <rect x="60" y="36" width="7" height="36" rx="1.5" fill="url(#ct-bar-gradient)" />

          {/* Upward Growth Arrow Vector (Rising from bottom-left to top-right) */}
          <path
            d="M 30 52 L 44 42 L 53 47 L 66 31"
            stroke="#0084FF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow Head */}
          <path
            d="M 61 28 L 71 27 L 68 37 Z"
            fill="#0084FF"
          />

          {/* 3D Bold Orange 'T' Structure (Interlocking with C) */}
          {/* T Top Horizontal Bar */}
          <path
            d="M 54 22 L 88 22 C 89.5 22, 91 23.5, 90 25.5 L 83 37 L 76 37 L 76 70 C 76 71.5, 74.5 73, 73 73 L 67 73 C 65.5 73, 64 71.5, 64 70 L 64 37 L 57 37 Z"
            fill="url(#ct-orange-gradient)"
            filter="url(#ct-drop-shadow)"
          />
          {/* 3D Light Highlight Edge on T */}
          <path
            d="M 54 22 L 88 22 L 85 25 L 56 25 Z"
            fill="#FFE082"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Brand Typographic Identity (ClementTrends) */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-tight leading-none ${titleSizes} font-sans flex items-baseline`}>
          <span className={isDarkVariant ? 'text-white' : 'text-[#071A33]'}>
            Clement
          </span>
          <span className="text-[#F7931E]">
            Trends
          </span>
        </div>

        {/* Sub-Tagline */}
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-[1.5px] bg-[#F7931E] rounded-full hidden sm:inline-block"></span>
            <span
              className={`font-semibold tracking-wider uppercase ${taglineSizes} ${
                isDarkVariant ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Insights, Trends &amp; Ideas for a Smarter Future
            </span>
            <span className="w-2.5 h-[1.5px] bg-[#0066CC] rounded-full hidden sm:inline-block"></span>
          </div>
        )}

        {/* Optional Domain Badge */}
        {showBadge && (
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#071A33] border border-[#F7931E]/40 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold text-white">clementtrends.com.ng</span>
          </div>
        )}
      </div>
    </div>
  );
};

