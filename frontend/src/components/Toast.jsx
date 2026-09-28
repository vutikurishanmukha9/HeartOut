import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Feather,
  X,
  Sparkles,
} from 'lucide-react';
import haptic from '../utils/haptics';

// Toast Context
const ToastContext = createContext(null);

// Sanctuary notification configurations aligned with design-highlights-50
export const TOAST_CONFIG = {
  success: {
    icon: CheckCircle2,
    badgeLabel: 'Confirmed',
    accentColor: '#15803D',
    darkAccentColor: '#4ADE80',
    borderColor: 'border-emerald-600/30 dark:border-emerald-500/30',
    beaconColor: 'bg-emerald-600 dark:bg-emerald-400',
    glowColor: 'rgba(21, 128, 61, 0.12)',
  },
  error: {
    icon: AlertCircle,
    badgeLabel: 'Notice',
    accentColor: '#C85828',
    darkAccentColor: '#F87171',
    borderColor: 'border-[#C85828]/40 dark:border-rose-500/40',
    beaconColor: 'bg-[#C85828] dark:bg-rose-400',
    glowColor: 'rgba(200, 88, 40, 0.14)',
  },
  warning: {
    icon: AlertTriangle,
    badgeLabel: 'Attention',
    accentColor: '#D97706',
    darkAccentColor: '#FBBF24',
    borderColor: 'border-amber-600/35 dark:border-amber-500/35',
    beaconColor: 'bg-amber-600 dark:bg-amber-400',
    glowColor: 'rgba(217, 119, 6, 0.12)',
  },
  info: {
    icon: Feather,
    badgeLabel: 'Reflection',
    accentColor: '#8C3A16',
    darkAccentColor: '#E8A87C',
    borderColor: 'border-[#E8DDD0] dark:border-[#2D2621]',
    beaconColor: 'bg-[#8C3A16] dark:bg-[#E8A87C]',
    glowColor: 'rgba(140, 58, 22, 0.08)',
  },
};

/**
 * Sanctuary Toast Notification Component
 * Designed from scratch in accordance with design-highlights-50 principles:
 * - Linear Pick #24 surface ladder with crisp 1px hairlines
 * - Claude Pick #9 warm sanctuary parchment and obsidian palette
 * - Apple Pick #3 literary typography with tight tracking
 * - Raycast Pick #39 monospace metadata and progress indicators
 * - Sensory haptic feedback on presentation and dismissal
 */
export function Toast({
  toast,
  onRemove,
  message: directMessage,
  type: directType,
  title: directTitle,
  duration: directDuration,
  onClose: directOnClose,
  visible = true,
  className = '',
}) {
  if (!visible) return null;

  const currentType = toast?.type || directType || 'info';
  const currentMessage = toast?.message || directMessage || '';
  const currentTitle = toast?.title || directTitle || '';
  const currentDuration = toast?.duration || directDuration || 5000;
  const config = TOAST_CONFIG[currentType] || TOAST_CONFIG.info;
  const Icon = config.icon;

  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(currentDuration);

  const handleDismiss = useCallback(() => {
    haptic.light();
    if (onRemove && toast?.id) {
      onRemove(toast.id);
    } else if (directOnClose) {
      directOnClose();
    }
  }, [onRemove, toast?.id, directOnClose]);

  // Smooth auto-dismiss timer and progress calculation
  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = 50;
    const timer = setInterval(() => {
      remainingTimeRef.current -= interval;
      const pct = Math.max(0, (remainingTimeRef.current / currentDuration) * 100);
      setProgress(pct);

      if (remainingTimeRef.current <= 0) {
        clearInterval(timer);
        handleDismiss();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, currentDuration, handleDismiss]);

  return (
    <div
      role="alert"
      data-testid="toast"
      data-type={currentType}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`
        relative overflow-hidden group
        bg-[#FFFDF9]/95 dark:bg-[#141210]/95
        border ${config.borderColor}
        rounded-2xl p-4 sm:p-4.5
        shadow-[0_12px_36px_rgba(20,10,5,0.08)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.65)]
        backdrop-blur-md transition-all duration-200
        min-w-[280px] sm:min-w-[340px] max-w-[440px]
        pointer-events-auto
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Sanctuary Icon Badge with Live Beacon */}
        <div className="relative shrink-0 mt-0.5">
          <div className="
            w-8 h-8 rounded-xl flex items-center justify-center
            bg-[#FAF5EF] dark:bg-[#1C1815]
            border border-[#E8DDD0] dark:border-[#2D2621]
          ">
            <span data-testid="toast-icon">
              <Icon
                className="w-4 h-4"
                style={{ color: config.accentColor }}
                strokeWidth={1.8}
              />
            </span>
          </div>

          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.beaconColor} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${config.beaconColor}`} />
          </span>
        </div>

        {/* Narrative & Inscription Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-stone-400 dark:text-stone-500">
              {config.badgeLabel}
            </span>
            {currentTitle && (
              <>
                <span className="text-stone-300 dark:text-stone-600 text-[10px]">·</span>
                <h4 className="font-stories text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                  {currentTitle}
                </h4>
              </>
            )}
          </div>

          <p
            data-testid="toast-message"
            className="font-body text-xs sm:text-[13px] text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line"
          >
            {currentMessage}
          </p>
        </div>

        {/* Tactile Dismiss Trigger */}
        <button
          type="button"
          onClick={handleDismiss}
          data-testid="toast-close"
          aria-label="Close notification"
          className="
            shrink-0 p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200
            hover:bg-[#FAF5EF] dark:hover:bg-[#1C1815]
            transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85828]
          "
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hairline Reading Duration Progression Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8DDD0]/40 dark:bg-[#2D2621]/40">
        <div
          className="h-full transition-all duration-75 ease-linear"
          style={{
            width: `${progress}%`,
            backgroundColor: config.accentColor,
          }}
        />
      </div>
    </div>
  );
}

// Floating Toast Portal Container
export function ToastContainer({ toasts = [], removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div
      data-testid="toast-container"
      className="fixed top-5 right-4 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-[92vw] sm:max-w-md w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}

// Global Sanctuary Toast Provider
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, ...options }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    {
      success: (message, options) => {
        haptic.success();
        return addToast(message, 'success', options);
      },
      error: (message, options) => {
        haptic.warning();
        return addToast(message, 'error', { duration: 8000, ...options });
      },
      warning: (message, options) => {
        haptic.warning();
        return addToast(message, 'warning', options);
      },
      info: (message, options) => {
        haptic.light();
        return addToast(message, 'info', options);
      },
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// Hook to access sanctuary toast system
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      success: (msg) => {
        haptic.success();
        if (typeof console !== 'undefined') console.log('Sanctuary Confirmed:', msg);
      },
      error: (msg) => {
        haptic.warning();
        if (typeof console !== 'undefined') console.error('Sanctuary Notice:', msg);
      },
      warning: (msg) => {
        haptic.warning();
        if (typeof console !== 'undefined') console.warn('Sanctuary Attention:', msg);
      },
      info: (msg) => {
        haptic.light();
        if (typeof console !== 'undefined') console.info('Sanctuary Reflection:', msg);
      },
    };
  }
  return context;
}

export default ToastProvider;
