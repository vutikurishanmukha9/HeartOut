import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp, Sparkles } from 'lucide-react';
import haptic from '../utils/haptics';

/**
 * Sanctuary Scroll Restoration & Summit Return Hub
 * Designed from scratch in accordance with design-highlights-50 principles:
 * - Linear Pick #24 surface ladder with crisp 1px hairlines
 * - Claude Pick #9 warm sanctuary parchment and obsidian palette
 * - Raycast Pick #39 monospace tabular reading progress indicator
 * - Architectural SVG circular progress gauge measuring narrative depth
 * - Dual utility: automatic route scroll restoration and tactile return-to-summit control
 */
export default function ScrollToTop({
  threshold = 300,
  showIndicator = true,
  className = '',
}) {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 1. Seamless Route Scroll Restoration on path navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } else {
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }
    }
    setIsVisible(false);
    setScrollProgress(0);
  }, [pathname]);

  // 2. Track window scroll offset and calculate reading depth percentage
  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Threshold check for visibility
    setIsVisible(scrollTop > threshold);

    // Compute progress ratio (0 to 100)
    if (docHeight > 0) {
      const progress = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
      setScrollProgress(progress);
    } else {
      setScrollProgress(0);
    }
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // 3. Tactile summit return handler
  const scrollToSummit = () => {
    haptic.medium();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    if (typeof window !== 'undefined') {
      if (typeof window.scrollTo === 'function') {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: prefersReducedMotion ? 'instant' : 'smooth',
        });
      } else {
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }
    }
  };

  // SVG Gauge calculations (circle radius = 18, circumference = 2 * PI * 18 ≈ 113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`
        fixed bottom-36 right-4 sm:bottom-20 sm:right-6 z-40
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
        ${className}
      `}
      aria-hidden={!isVisible}
    >
      <div className="relative group">
        {/* Floating Tooltip / Reading Depth Pill */}
        {isHovered && isVisible && (
          <div
            role="tooltip"
            className="
              absolute right-full mr-3 top-1/2 -translate-y-1/2
              px-2.5 py-1 rounded-lg
              bg-[#FFFDF9] dark:bg-[#1C1815]
              border border-[#E8DDD0] dark:border-[#2D2621]
              shadow-[0_4px_16px_rgba(20,10,5,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)]
              text-xs text-stone-700 dark:text-stone-300
              whitespace-nowrap flex items-center gap-1.5
              animate-fade-in pointer-events-none select-none
            "
          >
            <span className="font-heading font-medium text-[11px]">Return to summit</span>
            <span className="text-stone-300 dark:text-stone-600">·</span>
            <span className="font-mono text-[10px] tabular-nums font-semibold text-[#8C3A16] dark:text-[#E8A87C]">
              {scrollProgress}%
            </span>
          </div>
        )}

        {/* Tactile Return-to-Summit Button */}
        <button
          type="button"
          onClick={scrollToSummit}
          onMouseEnter={() => {
            haptic.light();
            setIsHovered(true);
          }}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          data-testid="scroll-to-top-button"
          aria-label={`Return to top of page, currently ${scrollProgress}% read`}
          className="
            relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl
            bg-[#FFFDF9]/95 dark:bg-[#141210]/95
            border border-[#E8DDD0] dark:border-[#2D2621]
            shadow-[0_4px_16px_rgba(20,10,5,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.45)]
            hover:border-[#C85828]/60 dark:hover:border-amber-400/60
            hover:shadow-[0_8px_24px_rgba(200,88,40,0.12)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.65)]
            backdrop-blur-md flex items-center justify-center
            active:scale-95 transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85828]
          "
        >
          {/* Radial Narrative Progress SVG Gauge */}
          {showIndicator && (
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1"
              viewBox="0 0 44 44"
              data-testid="scroll-progress-ring"
              aria-hidden="true"
            >
              {/* Subtle background track */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-[#E8DDD0]/50 dark:stroke-[#2D2621]"
                strokeWidth="2.2"
                fill="none"
              />
              {/* Active terracotta / amber progression sweep */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-[#C85828] dark:stroke-amber-400 transition-all duration-150 ease-out"
                strokeWidth="2.2"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          )}

          {/* Upward Sanctuary Arrow Glyph */}
          <ArrowUp
            className="w-4 h-4 text-[#8C3A16] dark:text-[#E8A87C] group-hover:-translate-y-0.5 transition-transform duration-200"
            strokeWidth={2}
          />
        </button>
      </div>
    </div>
  );
}
