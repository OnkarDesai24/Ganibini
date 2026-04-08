import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = "", variant = 'dark' }) => {
  const textColor = variant === 'light' ? 'text-white' : 'text-secondary';
  const subtextColor = variant === 'light' ? 'text-slate-400' : 'text-slate-500';
  const curveColor = variant === 'light' ? 'stroke-white/20' : 'stroke-slate-300';

  return (
    <div className={`flex flex-col items-center transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-2 md:gap-4">
        {/* Left Icon: Musical Note with Microphone */}
        <div className="relative w-10 h-10 md:w-16 md:h-16 flex items-center justify-center">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Note Heads */}
            <ellipse cx="20" cy="85" rx="18" ry="12" fill="#FF6B00" transform="rotate(-15 20 85)" />
            <ellipse cx="70" cy="75" rx="18" ry="12" fill="#FF6B00" transform="rotate(-15 70 75)" />
            
            {/* Stems */}
            <path d="M34 85V30" stroke="#FF6B00" strokeWidth="12" strokeLinecap="round" />
            <path d="M84 75V20" stroke="#FF6B00" strokeWidth="12" strokeLinecap="round" />
            
            {/* Top Connecting Bar */}
            <path d="M34 30C34 30 55 20 84 20" stroke="#FF6B00" strokeWidth="14" strokeLinecap="round" />
            
            {/* Microphone Head (on the left stem) */}
            <g transform="translate(34, 30) rotate(-15)">
              <rect x="-14" y="-28" width="28" height="36" rx="14" fill="#1A1A1A" />
              <rect x="-14" y="-14" width="28" height="4" fill="white" />
              <line x1="-8" y1="-22" x2="8" y2="-22" stroke="white" strokeWidth="1" opacity="0.3" />
              <line x1="-8" y1="-18" x2="8" y2="-18" stroke="white" strokeWidth="1" opacity="0.3" />
            </g>
          </svg>
        </div>

        {/* Main Text */}
        <h1 className={`text-3xl md:text-7xl font-black tracking-tighter ${textColor} flex items-center font-display`}>
          गाणी-बीनी
        </h1>

        {/* Right Icon: Sound Waves */}
        <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M6 8C8 10 8 14 6 16" stroke="#FF6B00" strokeWidth="4" strokeLinecap="round" />
            <path d="M11 5C14 8 14 16 11 19" stroke="#FF6B00" strokeWidth="4" strokeLinecap="round" />
            <path d="M16 2C20 6 20 18 16 22" stroke="#FF6B00" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Bottom Section: Curve and URL */}
      <div className="w-full flex flex-col items-center -mt-1 md:-mt-2">
        <svg width="280" height="20" viewBox="0 0 280 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 md:w-72 max-w-full">
          <path d="M10 6C100 16 180 16 270 6" className={curveColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
        <span className={`text-[8px] md:text-base font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] ${subtextColor} -mt-1 md:-mt-2`}>
          ganibini.com
        </span>
      </div>
    </div>
  );
};
