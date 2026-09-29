import React from 'react';

/**
 * Sanctuary Architectural Background
 * Designed from scratch in accordance with design-highlights-50 principles.
 * Replaces generic gradient blobs with architectural precision:
 * - Mathematical topographic resonance contours representing emotional landscapes
 * - Sub-hairline structural coordinate grid with intersection registration crosshairs
 * - Dual-layer radial ambient warmth tuned for literary focus
 * - Handcrafted sanctuary compass rose and coordinate markers
 */
export default function HeartOutBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden select-none -z-10"
      aria-hidden="true"
    >
      {/* Layer 1: Ambient Sanctuary Vignette Halos */}
      <div className="absolute inset-0 bg-[#FBF6EF]/80 dark:bg-[#12100E]/80 transition-colors duration-300" />

      {/* Subtle Top-Right Ambient Warmth */}
      <div
        className="absolute -top-32 -right-32 w-[580px] h-[580px] rounded-full opacity-60 dark:opacity-35 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(245, 185, 120, 0.35) 0%, rgba(200, 88, 40, 0.12) 35%, rgba(200, 88, 40, 0.04) 55%, transparent 70%)',
        }}
      />

      {/* Subtle Bottom-Left Ambient Warmth */}
      <div
        className="absolute -bottom-36 -left-36 w-[620px] h-[620px] rounded-full opacity-55 dark:opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(232, 168, 124, 0.3) 0%, rgba(180, 70, 30, 0.1) 40%, rgba(180, 70, 30, 0.03) 58%, transparent 70%)',
        }}
      />

      {/* Center Subtle Spotlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-4xl h-[70vh] rounded-full opacity-40 dark:opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255, 235, 210, 0.4) 0%, rgba(200, 88, 40, 0.04) 45%, rgba(200, 88, 40, 0.01) 62%, transparent 75%)',
        }}
      />

      {/* Layer 2: Precision Architectural Grid & Registration Crosshairs */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="sanctuary-grid"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-[#C85828] dark:text-[#E8A87C]"
            />
            {/* Registration Crosshair at Corner */}
            <path
              d="M -3 0 L 3 0 M 0 -3 L 0 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-[#C85828] dark:text-[#E8A87C]"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sanctuary-grid)" />
      </svg>

      {/* Layer 3: Topographic Resonance Contours (Top-Right) */}
      <svg
        className="absolute -top-12 -right-12 sm:top-0 sm:right-0 w-[420px] sm:w-[620px] h-[420px] sm:h-[620px] opacity-70 dark:opacity-40"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="contour-grad-tr" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C85828" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#E8A87C" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#C85828" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Nested Topographic Curves */}
        <path
          d="M 600 120 C 460 140 380 220 340 320 C 300 420 220 480 60 520"
          stroke="url(#contour-grad-tr)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M 600 180 C 490 200 430 270 390 360 C 350 450 280 500 140 550"
          stroke="url(#contour-grad-tr)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <path
          d="M 600 240 C 510 260 470 320 430 400 C 390 480 340 520 210 570"
          stroke="url(#contour-grad-tr)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 600 300 C 530 320 500 370 470 440 C 430 510 390 550 290 590"
          stroke="url(#contour-grad-tr)"
          strokeWidth="1"
        />
        <path
          d="M 600 360 C 550 380 530 420 500 480 C 470 540 440 570 370 600"
          stroke="url(#contour-grad-tr)"
          strokeWidth="0.8"
        />
      </svg>

      {/* Layer 4: Topographic Resonance Contours (Bottom-Left) */}
      <svg
        className="absolute -bottom-16 -left-16 sm:bottom-0 sm:left-0 w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] opacity-65 dark:opacity-35"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="contour-grad-bl" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C85828" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#E8A87C" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#C85828" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <path
          d="M 0 460 C 130 440 210 370 250 270 C 290 170 380 110 540 70"
          stroke="url(#contour-grad-bl)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M 0 400 C 100 380 170 310 210 220 C 250 130 320 80 460 30"
          stroke="url(#contour-grad-bl)"
          strokeWidth="1.2"
          strokeDasharray="5 4"
        />
        <path
          d="M 0 340 C 80 320 130 260 170 180 C 210 100 270 50 390 10"
          stroke="url(#contour-grad-bl)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 0 280 C 60 260 100 200 130 140 C 160 80 210 30 310 0"
          stroke="url(#contour-grad-bl)"
          strokeWidth="0.8"
        />
      </svg>

      {/* Layer 5: Sanctuary Horizon Compass Emblem (Top Left Margin) */}
      <div className="hidden lg:block absolute top-8 left-8 w-24 h-24 opacity-30 dark:opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          {/* Concentric Calibration Ring */}
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="#C85828"
            strokeWidth="0.8"
            strokeDasharray="2 3"
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="#C85828"
            strokeWidth="0.5"
          />
          {/* Cardinal Coordinate Ticks */}
          <line x1="50" y1="2" x2="50" y2="10" stroke="#C85828" strokeWidth="1.2" />
          <line x1="50" y1="90" x2="50" y2="98" stroke="#C85828" strokeWidth="1.2" />
          <line x1="2" y1="50" x2="10" y2="50" stroke="#C85828" strokeWidth="1.2" />
          <line x1="90" y1="50" x2="98" y2="50" stroke="#C85828" strokeWidth="1.2" />
          {/* Central Sanctuary Point */}
          <circle cx="50" cy="50" r="2" fill="#C85828" />
        </svg>
      </div>

      {/* Layer 6: Architectural Coordinate Labels (Subtle Editorial Notes) */}
      <div className="hidden xl:flex absolute bottom-8 left-12 items-center gap-3 font-mono text-[9px] uppercase tracking-widest text-stone-500/35 dark:text-stone-400/25 pointer-events-none select-none">
        <span>Sanctuary Spatial Grid</span>
        <span>•</span>
        <span>Ref 42.08°N</span>
        <span>•</span>
        <span>Anonymous Haven</span>
      </div>

      <div className="hidden xl:flex absolute top-8 right-12 items-center gap-3 font-mono text-[9px] uppercase tracking-widest text-stone-500/35 dark:text-stone-400/25 pointer-events-none select-none">
        <span>HeartOut Identity Matrix</span>
        <span>•</span>
        <span>v2.4</span>
      </div>
    </div>
  );
}
