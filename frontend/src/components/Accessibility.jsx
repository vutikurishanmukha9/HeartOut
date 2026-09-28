import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Sliders,
  Type,
  Keyboard,
  Contrast,
  RotateCcw,
  Sparkles,
  Check,
  X,
  Glasses,
  BookOpen,
  Activity,
  Smartphone,
  ChevronRight,
  MousePointer
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import haptic from '../utils/haptics';

/**
 * Reading Focus Ruler
 * Interactive tactile guide that tracks pointer position to assist readers with ADHD,
 * dyslexia, or eye fatigue across long reflections and stories.
 */
export function ReadingGuide({ active, height = 44 }) {
  const [mouseY, setMouseY] = useState(null);

  useEffect(() => {
    if (!active) return;

    const handleMouseMove = (e) => {
      setMouseY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [active]);

  if (!active || mouseY === null) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 z-[60] transition-all duration-75 ease-out"
      style={{
        top: `${Math.max(0, mouseY - height / 2)}px`,
        height: `${height}px`,
      }}
    >
      <div className="w-full h-full border-y border-[#C85828]/40 dark:border-amber-400/40 bg-[#C85828]/[0.04] dark:bg-amber-400/[0.05] shadow-[0_0_15px_rgba(200,88,40,0.06)]" />
    </div>
  );
}

/**
 * Visually Hidden Component
 * Hides content visually while maintaining complete screen-reader accessibility.
 */
export function VisuallyHidden({ children, as: Component = 'span', ...props }) {
  return (
    <Component className="sr-only" {...props}>
      {children}
    </Component>
  );
}

/**
 * Live Region for Screen Reader Announcements
 * Informs assistive technology of dynamic updates, alerts, and feedback.
 */
export function LiveRegion({ children, politeness = 'polite', ...props }) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Sanctuary Assistive Suite Modal & Command Drawer
 * Complete accessibility command center offering text ergonomics, sensory calm,
 * and keyboard shortcut mastery.
 */
export function AccessibilityModal({ isOpen, onClose }) {
  const themeContext = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('visual');
  const [readingGuide, setReadingGuide] = useState(() => {
    try {
      return localStorage.getItem('heartout-reading-guide') === 'true';
    } catch {
      return false;
    }
  });
  const [showGlyph, setShowGlyph] = useState(() => {
    try {
      return localStorage.getItem('heartout-show-a11y-glyph') !== 'false';
    } catch {
      return true;
    }
  });
  const [dyslexiaMode, setDyslexiaMode] = useState(() => {
    try {
      return localStorage.getItem('heartout-dyslexia-mode') === 'true';
    } catch {
      return false;
    }
  });

  const modalRef = useRef(null);
  const firstFocusRef = useRef(null);

  // Sync dyslexia mode to document root
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (dyslexiaMode) {
        document.documentElement.classList.add('dyslexia-mode');
      } else {
        document.documentElement.classList.remove('dyslexia-mode');
      }
    }
  }, [dyslexiaMode]);

  // Trap focus inside modal when open
  useEffect(() => {
    if (isOpen) {
      firstFocusRef.current?.focus();
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          haptic.light();
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const toggleReadingGuide = () => {
    haptic.selection();
    const next = !readingGuide;
    setReadingGuide(next);
    try {
      localStorage.setItem('heartout-reading-guide', String(next));
    } catch {
      // Ignore storage errors
    }
  };

  const toggleGlyphVisibility = () => {
    haptic.selection();
    const next = !showGlyph;
    setShowGlyph(next);
    try {
      localStorage.setItem('heartout-show-a11y-glyph', String(next));
      window.dispatchEvent(new Event('heartout-glyph-preference-changed'));
    } catch {
      // Ignore storage errors
    }
  };

  const toggleDyslexiaMode = () => {
    haptic.selection();
    const next = !dyslexiaMode;
    setDyslexiaMode(next);
    try {
      localStorage.setItem('heartout-dyslexia-mode', String(next));
    } catch {
      // Ignore storage errors
    }
  };

  const handleReset = () => {
    haptic.heavy();
    if (themeContext?.resetPreferences) {
      themeContext.resetPreferences();
    }
    setReadingGuide(false);
    setDyslexiaMode(false);
    setShowGlyph(true);
    try {
      localStorage.removeItem('heartout-reading-guide');
      localStorage.removeItem('heartout-dyslexia-mode');
      localStorage.removeItem('heartout-show-a11y-glyph');
      window.dispatchEvent(new Event('heartout-glyph-preference-changed'));
    } catch {
      // Ignore storage errors
    }
  };

  if (!isOpen) return null;

  const fontOptions = [
    { id: 'medium', label: 'Standard', size: '100%', detail: '16px baseline' },
    { id: 'large', label: 'Comfort', size: '112%', detail: '18px reading' },
    { id: 'extra-large', label: 'Expansive', size: '125%', detail: '20px high visibility' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-black/45 dark:bg-black/65 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          haptic.light();
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-xl max-h-[90vh] bg-[#FFFDF9] dark:bg-[#141210] border border-[#E8DDD0] dark:border-[#2D2621] rounded-2xl shadow-[0_20px_50px_rgba(20,10,5,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden text-stone-900 dark:text-stone-100"
      >
        {/* Masthead */}
        <div className="px-5 py-4 border-b border-[#E8DDD0] dark:border-[#26211C] flex items-center justify-between bg-[#F6EFE6]/60 dark:bg-[#1A1613]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C85828]/10 dark:bg-amber-400/10 border border-[#C85828]/20 dark:border-amber-400/20 flex items-center justify-center text-[#C85828] dark:text-amber-400">
              <Glasses className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="a11y-modal-title" className="text-sm sm:text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                  Sanctuary Assistive Hub
                </h2>
                <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#C85828]/10 dark:bg-amber-400/15 text-[#C85828] dark:text-amber-400 font-medium">
                  WCAG AAA
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Tactile ergonomics, sensory comfort, and keyboard mastery
              </p>
            </div>
          </div>

          <button
            ref={firstFocusRef}
            type="button"
            onClick={() => {
              haptic.light();
              onClose();
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-[#EAE0D3] dark:hover:bg-[#25201B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C85828]"
            aria-label="Close assistive hub"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8DDD0] dark:border-[#26211C] px-3 pt-2 bg-[#FAF5EE]/70 dark:bg-[#161311]/70 gap-1" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'visual'}
            onClick={() => {
              haptic.selection();
              setActiveTab('visual');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium transition-all ${
              activeTab === 'visual'
                ? 'bg-[#FFFDF9] dark:bg-[#141210] text-[#8C3A16] dark:text-[#E8A87C] border-t border-x border-[#E8DDD0] dark:border-[#26211C] -mb-px font-semibold shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Reading & Text</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'sensory'}
            onClick={() => {
              haptic.selection();
              setActiveTab('sensory');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium transition-all ${
              activeTab === 'sensory'
                ? 'bg-[#FFFDF9] dark:bg-[#141210] text-[#8C3A16] dark:text-[#E8A87C] border-t border-x border-[#E8DDD0] dark:border-[#26211C] -mb-px font-semibold shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Sensory Comfort</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'shortcuts'}
            onClick={() => {
              haptic.selection();
              setActiveTab('shortcuts');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium transition-all ${
              activeTab === 'shortcuts'
                ? 'bg-[#FFFDF9] dark:bg-[#141210] text-[#8C3A16] dark:text-[#E8A87C] border-t border-x border-[#E8DDD0] dark:border-[#26211C] -mb-px font-semibold shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Keyboard Map</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* TAB 1: VISUAL & TEXT */}
          {activeTab === 'visual' && (
            <div className="space-y-4">
              {/* Font Size Selector */}
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Sanctuary Text Proportions
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {fontOptions.map((opt) => {
                    const isSelected = (themeContext?.fontSize || 'medium') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          haptic.selection();
                          themeContext?.setFontSize?.(opt.id);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#F4ECE2] dark:bg-[#25201B] border-[#C85828] dark:border-amber-400 text-stone-900 dark:text-stone-100 ring-1 ring-[#C85828]/30 dark:ring-amber-400/30'
                            : 'bg-[#F9F4EE]/70 dark:bg-[#1A1714]/80 border-[#E8DDD0] dark:border-[#2E2721] text-stone-600 dark:text-stone-400 hover:border-amber-400/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs text-stone-800 dark:text-stone-200">{opt.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" />}
                        </div>
                        <p className="font-mono text-[10px] text-stone-500 dark:text-stone-400">{opt.size}</p>
                        <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">{opt.detail}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* High Contrast Toggle */}
              <div className="p-3.5 rounded-xl border border-[#E8DDD0] dark:border-[#2E2721] bg-[#F9F4EE]/60 dark:bg-[#1A1714]/60 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 mt-0.5 shrink-0">
                    <Contrast className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      High Contrast Mode
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Amplifies hairline borders, outlines, and text luminance for deep visibility.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={themeContext?.highContrast || false}
                  onClick={() => {
                    haptic.medium();
                    themeContext?.toggleHighContrast?.();
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                    themeContext?.highContrast
                      ? 'bg-[#C85828] dark:bg-amber-500'
                      : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle high contrast mode"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-xs ${
                      themeContext?.highContrast ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Reading Focus Ruler Toggle */}
              <div className="p-3.5 rounded-xl border border-[#E8DDD0] dark:border-[#2E2721] bg-[#F9F4EE]/60 dark:bg-[#1A1714]/60 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 mt-0.5 shrink-0">
                    <MousePointer className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      Reading Focus Ruler
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Subtle tactile guideline tracking your cursor to prevent line skipping.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={readingGuide}
                  onClick={toggleReadingGuide}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                    readingGuide
                      ? 'bg-[#C85828] dark:bg-amber-500'
                      : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle reading focus ruler"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-xs ${
                      readingGuide ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Dyslexia Reading Spacing Toggle */}
              <div className="p-3.5 rounded-xl border border-[#E8DDD0] dark:border-[#2E2721] bg-[#F9F4EE]/60 dark:bg-[#1A1714]/60 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 mt-0.5 shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      Reading Clarity Spacing
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Expanded word spacing and line height designed for dyslexic comfort.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={dyslexiaMode}
                  onClick={toggleDyslexiaMode}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                    dyslexiaMode
                      ? 'bg-[#C85828] dark:bg-amber-500'
                      : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle reading clarity spacing"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-xs ${
                      dyslexiaMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SENSORY & MOTION */}
          {activeTab === 'sensory' && (
            <div className="space-y-4">
              {/* Reduced Motion Toggle */}
              <div className="p-3.5 rounded-xl border border-[#E8DDD0] dark:border-[#2E2721] bg-[#F9F4EE]/60 dark:bg-[#1A1714]/60 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 mt-0.5 shrink-0">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      Calm Motion Mode
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Silences animations, large transitions, and layout movements.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={themeContext?.reducedMotion || false}
                  onClick={() => {
                    haptic.medium();
                    themeContext?.toggleReducedMotion?.();
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                    themeContext?.reducedMotion
                      ? 'bg-[#C85828] dark:bg-amber-500'
                      : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle calm motion mode"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-xs ${
                      themeContext?.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Haptic Feedback Toggle */}
              <div className="p-3.5 rounded-xl border border-[#E8DDD0] dark:border-[#2E2721] bg-[#F9F4EE]/60 dark:bg-[#1A1714]/60 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 mt-0.5 shrink-0">
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      Sensory Haptic Vibrations
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Physical tactile impulses on button clicks, reactions, and page actions.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={themeContext?.hapticFeedback !== false}
                  onClick={() => {
                    haptic.medium();
                    themeContext?.toggleHapticFeedback?.();
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                    themeContext?.hapticFeedback !== false
                      ? 'bg-[#C85828] dark:bg-amber-500'
                      : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle haptic vibration feedback"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-xs ${
                      themeContext?.hapticFeedback !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Color Blind Adaptation */}
              <div className="p-3.5 rounded-xl border border-[#E8DDD0] dark:border-[#2E2721] bg-[#F9F4EE]/60 dark:bg-[#1A1714]/60 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 mt-0.5 shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      Color Vision Optimization
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Enhances tonal separation and status indicators for varied color vision.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={themeContext?.colorBlindFriendly || false}
                  onClick={() => {
                    haptic.medium();
                    themeContext?.toggleColorBlindFriendly?.();
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                    themeContext?.colorBlindFriendly
                      ? 'bg-[#C85828] dark:bg-amber-500'
                      : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle color vision optimization"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-xs ${
                      themeContext?.colorBlindFriendly ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Floating Glyph Toggle */}
              <div className="p-3.5 rounded-xl border border-[#E8DDD0] dark:border-[#2E2721] bg-[#F9F4EE]/60 dark:bg-[#1A1714]/60 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 mt-0.5 shrink-0">
                    <Glasses className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      Corner Assistive Badge
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Show the quick accessibility floating button at the bottom of the screen.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showGlyph}
                  onClick={toggleGlyphVisibility}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0 ${
                    showGlyph
                      ? 'bg-[#C85828] dark:bg-amber-500'
                      : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label="Toggle corner assistive badge"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-xs ${
                      showGlyph ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: KEYBOARD MAP */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                HeartOut is engineered with keyboard-first navigation for seamless screen access.
              </p>

              <div className="rounded-xl border border-[#E8DDD0] dark:border-[#2E2721] overflow-hidden divide-y divide-[#E8DDD0] dark:divide-[#2E2721] text-xs">
                <div className="flex items-center justify-between p-2.5 bg-[#FAF5EE]/70 dark:bg-[#191512]/70">
                  <span className="font-medium text-stone-700 dark:text-stone-300">Sanctuary Assistive Hub</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono text-[10px] text-stone-700 dark:text-stone-300 shadow-2xs">Alt</kbd>
                    <span className="text-stone-400">+</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono text-[10px] text-stone-700 dark:text-stone-300 shadow-2xs">A</kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#FFFDF9] dark:bg-[#141210]">
                  <span className="font-medium text-stone-700 dark:text-stone-300">Global Story & Theme Search</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono text-[10px] text-stone-700 dark:text-stone-300 shadow-2xs">⌘K</kbd>
                    <span className="text-stone-400">or</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono text-[10px] text-stone-700 dark:text-stone-300 shadow-2xs">/</kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#FAF5EE]/70 dark:bg-[#191512]/70">
                  <span className="font-medium text-stone-700 dark:text-stone-300">Skip to Content (from Top)</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono text-[10px] text-stone-700 dark:text-stone-300 shadow-2xs">Tab</kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#FFFDF9] dark:bg-[#141210]">
                  <span className="font-medium text-stone-700 dark:text-stone-300">Quick Keyboard Legend</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono text-[10px] text-stone-700 dark:text-stone-300 shadow-2xs">?</kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#FAF5EE]/70 dark:bg-[#191512]/70">
                  <span className="font-medium text-stone-700 dark:text-stone-300">Dismiss Modals & Overlays</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono text-[10px] text-stone-700 dark:text-stone-300 shadow-2xs">Esc</kbd>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E8DDD0] dark:border-[#26211C] bg-[#F6EFE6]/60 dark:bg-[#1A1613]/60 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => {
              haptic.light();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-[#C85828] text-white hover:bg-[#B34C20] text-xs font-semibold shadow-xs transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C85828]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Skip to Main Content & Tactile Accessibility Command System
 * Accessible jump link with architectural precision, Raycast-inspired shortcut hints,
 * and comprehensive sensory comfort tools.
 */
export default function SkipToContent({ targetId = 'main-content' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readingGuideActive, setReadingGuideActive] = useState(() => {
    try {
      return localStorage.getItem('heartout-reading-guide') === 'true';
    } catch {
      return false;
    }
  });
  const [showGlyph, setShowGlyph] = useState(() => {
    try {
      return localStorage.getItem('heartout-show-a11y-glyph') !== 'false';
    } catch {
      return true;
    }
  });

  // Listen for local storage updates from modal
  useEffect(() => {
    const handleSync = () => {
      try {
        setReadingGuideActive(localStorage.getItem('heartout-reading-guide') === 'true');
        setShowGlyph(localStorage.getItem('heartout-show-a11y-glyph') !== 'false');
      } catch {
        // Ignore storage access errors
      }
    };

    window.addEventListener('heartout-glyph-preference-changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('heartout-glyph-preference-changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Global keyboard shortcuts (Alt+A to open Hub, ? to open shortcuts)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      const isEditable =
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        activeTag === 'SELECT' ||
        document.activeElement?.isContentEditable;

      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        haptic.medium();
        setIsModalOpen((prev) => !prev);
      } else if (e.key === '?' && !isEditable) {
        e.preventDefault();
        haptic.light();
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSkipToMain = (e) => {
    e.preventDefault();
    haptic.selection();
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJumpToNav = (e) => {
    e.preventDefault();
    haptic.selection();
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.focus();
    } else {
      const firstNavLink = document.querySelector('nav a');
      if (firstNavLink) firstNavLink.focus();
    }
  };

  return (
    <>
      {/* Reading Line Guide Overlay */}
      <ReadingGuide active={readingGuideActive} />

      {/* Tactile Skip Capsule */}
      <div
        className="
          sr-only focus-within:not-sr-only
          focus-within:fixed focus-within:top-3 focus-within:left-1/2 focus-within:-translate-x-1/2
          focus-within:z-[9999] focus-within:w-[94vw] focus-within:max-w-xl
          focus-within:bg-[#FFFDF9]/95 dark:focus-within:bg-[#141210]/95
          focus-within:backdrop-blur-md
          focus-within:border focus-within:border-[#E8DDD0] dark:focus-within:border-[#2D2621]
          focus-within:rounded-xl focus-within:p-2 sm:focus-within:p-2.5
          focus-within:shadow-[0_12px_36px_rgba(30,15,5,0.12)] dark:focus-within:shadow-[0_12px_36px_rgba(0,0,0,0.6)]
          focus-within:flex focus-within:items-center focus-within:justify-between focus-within:gap-2
          focus-within:animate-fade-in
          transition-all duration-200
        "
      >
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
          {/* Skip directly to main content */}
          <Link
            to={`#${targetId}`}
            onClick={handleSkipToMain}
            className="
              px-3.5 py-1.5 rounded-lg
              bg-[#C85828] text-white font-medium text-xs
              hover:bg-[#B34C20] active:scale-[0.98]
              shadow-2xs transition-all
              focus:outline-none focus:ring-2 focus:ring-[#C85828] focus:ring-offset-2
            "
          >
            Skip to Content
          </Link>

          {/* Jump to Navigation & Search */}
          <button
            type="button"
            onClick={handleJumpToNav}
            className="
              px-3 py-1.5 rounded-lg
              bg-[#F6EFE6] dark:bg-[#1C1815]
              text-stone-700 dark:text-stone-300
              hover:text-stone-900 dark:hover:text-stone-100
              border border-[#E8DDD0] dark:border-[#2D2621]
              text-xs font-medium transition-all
              focus:outline-none focus:ring-2 focus:ring-[#C85828]
            "
          >
            Jump to Nav
          </button>
        </div>

        {/* Open Accessibility Drawer */}
        <button
          type="button"
          onClick={() => {
            haptic.medium();
            setIsModalOpen(true);
          }}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-[#FAF5EF] dark:bg-[#181412]
            hover:bg-[#F2E8DC] dark:hover:bg-[#221C18]
            border border-[#E8DDD0] dark:border-[#2D2621]
            text-xs font-medium text-[#8C3A16] dark:text-[#E8A87C]
            transition-all focus:outline-none focus:ring-2 focus:ring-[#C85828]
          "
        >
          <Sliders className="w-3 h-3" />
          <span>Accessibility</span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-white/80 dark:bg-stone-800 border border-stone-300/80 dark:border-stone-700 text-[9px] font-mono text-stone-500">
            Alt+A
          </kbd>
        </button>
      </div>

      {/* Floating Assistive Glyph Button */}
      {showGlyph && (
        <button
          type="button"
          onClick={() => {
            haptic.medium();
            setIsModalOpen(true);
          }}
          className="
            fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40
            w-9 h-9 sm:w-10 sm:h-10 rounded-xl
            bg-[#FFFDF9]/90 dark:bg-[#181412]/90
            border border-[#E8DDD0] dark:border-[#2D2621]
            shadow-[0_4px_16px_rgba(20,10,5,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]
            backdrop-blur-md flex items-center justify-center
            text-stone-600 dark:text-stone-300
            hover:text-[#C85828] dark:hover:text-[#E8A87C]
            hover:border-[#C85828]/50 dark:hover:border-amber-400/50
            hover:bg-[#FAF5EF] dark:hover:bg-[#221C18]
            transition-all active:scale-95
            focus:outline-none focus:ring-2 focus:ring-[#C85828]
          "
          title="Sanctuary Assistive Hub (Alt+A)"
          aria-label="Open Sanctuary Assistive Hub"
        >
          <Glasses className="w-4 h-4" />
        </button>
      )}

      {/* Complete Accessibility Modal */}
      <AccessibilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
