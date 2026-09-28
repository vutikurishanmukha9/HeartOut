/**
 * HeartOut Sensory Haptic Touch System
 * Provides tactile physical feedback for interactions across mobile, desktop, and touch interfaces.
 * Uses the Web Vibration API with intelligent fallback, debounce protection, and accessibility guards.
 */

// Vibration pattern durations in milliseconds
export const HAPTIC_PATTERNS = {
  selection: 8,                    // Micro-tick for tabs, category pills, slider notches, dropdown rows
  light: 12,                       // Crisp subtle tap for standard buttons, links, search triggers
  medium: 22,                      // Firm impulse for likes, reactions, bookmarks, toggles, drafts
  heavy: 38,                       // Pronounced thud for destructive actions (delete, sign out, critical dialogs)
  success: [12, 45, 15],           // Delicate double-pulse for successfully publishing, saving, or copying
  warning: [20, 50, 20],           // Alert double-tap for validation warnings or sensitive confirmations
  error: [30, 45, 30, 45, 30],     // Triple-thump pulse for submission errors
};

/**
 * Check if the current browser environment supports the Vibration API
 */
export const isHapticSupported = () => {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator;
};

/**
 * Check if haptic feedback is allowed by user preferences and system settings
 */
export const isHapticEnabled = () => {
  if (!isHapticSupported()) return false;

  // Check stored user preferences in localStorage
  try {
    const saved = localStorage.getItem('heartout-theme-preferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      if (prefs.hapticFeedback === false) return false;
      if (prefs.reducedMotion === true) return false;
    }
  } catch (e) {
    // If parsing fails, default to allowing feedback
  }

  // Check system reduced-motion preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
  }

  return true;
};

let lastVibrationTimestamp = 0;
const VIBRATION_DEBOUNCE_MS = 35;

export const _resetDebounceForTesting = () => {
  lastVibrationTimestamp = 0;
};

/**
 * Trigger a haptic vibration pattern
 * @param {'selection' | 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'} type
 * @param {boolean} force - Force bypass debounce for critical actions or testing
 */
export const triggerHaptic = (type = 'light', force = false) => {
  if (!isHapticEnabled()) return false;

  const now = Date.now();
  if (!force && now - lastVibrationTimestamp < VIBRATION_DEBOUNCE_MS) {
    return false;
  }
  lastVibrationTimestamp = now;

  const pattern = HAPTIC_PATTERNS[type] || HAPTIC_PATTERNS.light;

  try {
    return navigator.vibrate(pattern);
  } catch (e) {
    // Silently handle any browser security restrictions or unsupported environments
    return false;
  }
};

/**
 * Convenient shorthand helper methods
 */
export const haptic = {
  selection: (force = false) => triggerHaptic('selection', force),
  light: (force = false) => triggerHaptic('light', force),
  medium: (force = false) => triggerHaptic('medium', force),
  heavy: (force = false) => triggerHaptic('heavy', force),
  success: (force = false) => triggerHaptic('success', force),
  warning: (force = false) => triggerHaptic('warning', force),
  error: (force = false) => triggerHaptic('error', force),
};

/**
 * Global Delegated Interactive Touch Listener
 * Automatically intercepts clicks and pointerdown events on all interactive elements
 * across every page in the application, ensuring 100% comprehensive haptic coverage.
 */
export const initGlobalHaptics = () => {
  if (typeof window === 'undefined') return () => {};

  const interactiveSelectors = [
    'button',
    'a[href]',
    '[role="button"]',
    '[role="tab"]',
    '[role="switch"]',
    '[role="menuitem"]',
    '[role="option"]',
    'input[type="checkbox"]',
    'input[type="radio"]',
    'input[type="submit"]',
    'input[type="button"]',
    'select',
    '[data-haptic]'
  ].join(', ');

  const handleInteraction = (event) => {
    // Only respond to primary touches or left mouse clicks
    if (event.button !== undefined && event.button !== 0) return;

    const target = event.target;
    if (!target || !(target instanceof Element)) return;

    const interactiveEl = target.closest(interactiveSelectors);
    if (!interactiveEl) return;

    // Skip disabled elements or elements explicitly marked with data-haptic="none"
    if (interactiveEl.hasAttribute('disabled') || interactiveEl.getAttribute('aria-disabled') === 'true') {
      return;
    }

    const explicitHaptic = interactiveEl.getAttribute('data-haptic');
    if (explicitHaptic === 'none') {
      return;
    }

    if (explicitHaptic && HAPTIC_PATTERNS[explicitHaptic]) {
      triggerHaptic(explicitHaptic);
      return;
    }

    // Heuristics for contextual feedback based on element role and content
    const textContent = (interactiveEl.textContent || '').toLowerCase();
    const ariaLabel = (interactiveEl.getAttribute('aria-label') || '').toLowerCase();
    const className = typeof interactiveEl.className === 'string' ? interactiveEl.className.toLowerCase() : '';
    const role = interactiveEl.getAttribute('role');

    // Destructive actions: heavy thud
    const isDestructive =
      textContent.includes('delete') ||
      textContent.includes('sign out') ||
      textContent.includes('logout') ||
      textContent.includes('remove') ||
      textContent.includes('discard') ||
      ariaLabel.includes('delete') ||
      ariaLabel.includes('sign out') ||
      ariaLabel.includes('logout') ||
      ariaLabel.includes('remove') ||
      className.includes('text-red') ||
      className.includes('text-rose') ||
      className.includes('bg-red') ||
      className.includes('bg-rose');

    if (isDestructive) {
      triggerHaptic('heavy');
      return;
    }

    // Toggles and switches: medium firm impulse
    const isToggle =
      role === 'switch' ||
      (interactiveEl instanceof HTMLInputElement && (interactiveEl.type === 'checkbox' || interactiveEl.type === 'radio')) ||
      className.includes('toggle');

    if (isToggle) {
      triggerHaptic('medium');
      return;
    }

    // Tabs and category filter chips: micro selection tick
    const isSelection =
      role === 'tab' ||
      role === 'option' ||
      (className.includes('rounded-full') && (className.includes('border') || className.includes('bg-'))) ||
      className.includes('tab') ||
      className.includes('chip') ||
      className.includes('pill');

    if (isSelection) {
      triggerHaptic('selection');
      return;
    }

    // Default crisp tap for all other buttons, links, and triggers
    triggerHaptic('light');
  };

  const hasPointer = typeof window !== 'undefined' && 'PointerEvent' in window;
  const eventType = hasPointer ? 'pointerdown' : 'click';

  window.addEventListener(eventType, handleInteraction, { passive: true, capture: true });

  return () => {
    window.removeEventListener(eventType, handleInteraction, { capture: true });
  };
};

export default haptic;
