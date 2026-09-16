import React from 'react';
import { PAGE_BACKGROUNDS, PageBackgroundConfig } from '../utils/pageBackgrounds';

interface PageBackgroundProps {
  page?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Reusable PageBackground component
 * Creates a dark, dim, low-contrast ambient atmospheric background with
 * dark overlay (0.65 - 0.82) behind page UI content.
 */
export const PageBackground: React.FC<PageBackgroundProps> = ({
  page = 'overview',
  backgroundImage,
  overlayOpacity,
  className = '',
  children,
}) => {
  const pageConfig: PageBackgroundConfig = PAGE_BACKGROUNDS[page] || PAGE_BACKGROUNDS.overview;
  const activeImage = backgroundImage || pageConfig.imageSrc;
  const activeOpacity = overlayOpacity !== undefined ? overlayOpacity : pageConfig.overlayOpacity;

  return (
    <div
      id={`page-wrapper-${page}`}
      className={`relative min-h-full w-full ${className}`}
    >
      {/* Ambient Atmospheric Visual Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Full page background image */}
        <img
          key={activeImage}
          src={activeImage}
          alt=""
          referrerPolicy="no-referrer"
          loading="lazy"
          className="h-full w-full object-cover object-center filter brightness-[0.85] contrast-[0.95] transition-opacity duration-700 ease-in-out"
        />

        {/* Dark dimming overlay to guarantee low intensity and maximum UI readability (0.65 — 0.80+) */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{ backgroundColor: `rgba(0, 0, 0, ${activeOpacity})` }}
        />

        {/* Soft edge ambient grounding so the background feels like a subtle ambient glow rather than a poster */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/80" />
      </div>

      {/* Primary UI Layer - Always positioned securely in front with pristine glass readability */}
      <div className="relative z-10 w-full min-h-full">
        {children}
      </div>
    </div>
  );
};
