import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
}) => {
  const isDark = variant === 'dark';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl',
  };

  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      {/* Banyan Tree Geometric Icon Emblem */}
      <div
        className={`relative flex items-center justify-center ${iconSizes[size]} rounded-lg border transition-all duration-300 ${
          isDark
            ? 'bg-pine-deep/80 border-gold-dull/40 group-hover:border-gold-radiant text-gold-dull group-hover:text-gold-radiant shadow-subtle'
            : 'bg-white/80 border-gold-dull/30 group-hover:border-gold-dull text-pine-deep group-hover:text-pine-deep'
        }`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6"
        >
          {/* Stylized Tree Trunk & Canopy */}
          <path
            d="M16 28V15M16 15C13 15 9 12 9 8C9 4 12 3 16 3C20 3 23 4 23 8C23 12 19 15 16 15Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Spreading Branches (Akshaya Vriksha - Inexhaustible Canopy) */}
          <path
            d="M16 19C12 19 6 17 6 12C6 9 8 7 10 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16 19C20 19 26 17 26 12C26 9 24 7 22 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="16" cy="7" r="1.5" fill="#D4AF37" />
          <circle cx="11" cy="11" r="1.2" fill="#C5A880" />
          <circle cx="21" cy="11" r="1.2" fill="#C5A880" />
        </svg>
      </div>

      {/* Brand Title & Tagline */}
      <div className="flex flex-col">
        <span
          className={`font-serif font-semibold tracking-wide ${titleSizes[size]} transition-colors duration-200 ${
            isDark ? 'text-ivory-sand group-hover:text-gold-radiant' : 'text-pine-deep group-hover:text-pine-muted'
          }`}
        >
          Akshaya Vriksha
        </span>
        {showSubtitle && (
          <span
            className={`text-[9px] md:text-[10px] font-sans font-medium uppercase tracking-widest-luxury -mt-0.5 ${
              isDark ? 'text-gold-dull/80' : 'text-charcoal-muted'
            }`}
          >
            Wealth • Protection • Legacy
          </span>
        )}
      </div>
    </div>
  );
};
