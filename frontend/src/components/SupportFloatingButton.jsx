import React, { useState, useEffect, useRef } from 'react';
import { Heart, Phone, X, ChevronUp, Shield, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { helplines, HelplineCard } from './HelplineCard';
import haptic from '../utils/haptics';

/**
 * Sanctuary Crisis & Immediate Support Floating Hub
 * Architectural, non-generic support trigger providing immediate access
 * to verified, free, and confidential crisis helplines.
 */
export default function SupportFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        haptic.light();
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        haptic.light();
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    haptic.medium();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] right-3.5 sm:bottom-6 sm:right-6 z-[90]">
      {/* Expanded Support Drawer */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-hub-title"
          className="
            absolute bottom-14 right-0 w-[calc(100vw-2rem)] max-w-sm sm:w-96
            bg-[#FFFDF9] dark:bg-[#141210]
            rounded-2xl border border-[#E8DDD0] dark:border-[#2D2621]
            shadow-[0_16px_44px_rgba(20,10,5,0.14)] dark:shadow-[0_16px_44px_rgba(0,0,0,0.65)]
            overflow-hidden animate-fade-in flex flex-col text-stone-900 dark:text-stone-100
          "
        >
          {/* Masthead */}
          <div className="px-4 py-3.5 bg-[#F6EFE6]/70 dark:bg-[#1A1613]/70 border-b border-[#E8DDD0] dark:border-[#26211C] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C85828]/10 dark:bg-amber-400/10 border border-[#C85828]/20 dark:border-amber-400/20 flex items-center justify-center text-[#C85828] dark:text-amber-400 shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 id="support-hub-title" className="font-heading font-semibold text-sm tracking-tight text-stone-900 dark:text-stone-100">
                    Immediate Support
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                    24/7 Live
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Confidential, non-judgmental assistance
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                haptic.light();
                setIsOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label="Close support panel"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-[#EAE0D3] dark:hover:bg-[#25201B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C85828]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Helpline Feed */}
          <div className="p-3.5 space-y-2.5 max-h-[60vh] sm:max-h-80 overflow-y-auto">
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed px-0.5">
              If you or someone you know is carrying distress, free certified counselors are available now:
            </p>

            {helplines.map((helpline) => (
              <HelplineCard key={helpline.id} helpline={helpline} compact />
            ))}

            {/* Link to Full Support Sanctuary */}
            <Link
              to="/support"
              onClick={() => {
                haptic.selection();
                setIsOpen(false);
              }}
              className="
                mt-2 flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl
                bg-[#FAF5EF] dark:bg-[#1C1815]
                border border-[#E8DDD0] dark:border-[#2D2621]
                hover:border-amber-400/50 hover:bg-[#F2E8DC] dark:hover:bg-[#241F1B]
                text-stone-800 dark:text-stone-200 text-xs font-semibold
                transition-all active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-[#C85828]
              "
            >
              <span>Explore All Counseling & Helplines</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" />
            </Link>
          </div>

          {/* Privacy Seal Footer */}
          <div className="px-4 py-2.5 bg-[#F6EFE6]/50 dark:bg-[#1A1613]/50 border-t border-[#E8DDD0] dark:border-[#26211C] flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#C85828] dark:text-amber-400 shrink-0" />
              <span>Free, 100% confidential, and untracked</span>
            </div>
            <kbd className="hidden sm:inline-block font-mono text-[9px] text-stone-400 dark:text-stone-500">
              Esc to close
            </kbd>
          </div>
        </div>
      )}

      {/* Floating Sanctuary Trigger Capsule */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        aria-label={isOpen ? 'Close support resources' : 'Open support resources'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`
          group flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl
          bg-[#FFFDF9]/95 dark:bg-[#141210]/95 backdrop-blur-md
          border transition-all duration-200
          ${
            isOpen
              ? 'border-[#C85828] dark:border-amber-400 ring-2 ring-[#C85828]/25 dark:ring-amber-400/25 shadow-md'
              : 'border-[#E8DDD0] dark:border-[#2D2621] hover:border-[#C85828]/60 dark:hover:border-amber-400/60 shadow-[0_4px_16px_rgba(20,10,5,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
          }
          active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C85828]
        `}
      >
        {isOpen ? (
          <>
            <ChevronUp className="w-4 h-4 text-stone-600 dark:text-stone-300" />
            <span className="font-heading text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
              Close Support
            </span>
          </>
        ) : (
          <>
            {/* Live Indicator Beacon */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C85828] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C85828] dark:bg-amber-400" />
            </span>

            <Heart className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400 shrink-0" />
            <span className="hidden sm:inline font-heading text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
              I need support right now
            </span>
            <span className="sm:hidden font-heading text-xs font-semibold text-stone-800 dark:text-stone-200">
              Support
            </span>
          </>
        )}
      </button>
    </div>
  );
}
