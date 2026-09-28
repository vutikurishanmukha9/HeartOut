import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  triggerHaptic,
  haptic,
  isHapticSupported,
  isHapticEnabled,
  initGlobalHaptics,
  _resetDebounceForTesting,
  HAPTIC_PATTERNS,
} from '../utils/haptics';

// Mock functional localStorage store for jsdom environment
const localStorageMock = {
  store: {},
  getItem: vi.fn((key) => localStorageMock.store[key] || null),
  setItem: vi.fn((key, value) => {
    localStorageMock.store[key] = String(value);
  }),
  removeItem: vi.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

describe('Haptics Utility System', () => {
  let originalVibrate;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    _resetDebounceForTesting();
    originalVibrate = navigator.vibrate;
    navigator.vibrate = vi.fn().mockReturnValue(true);
  });

  afterEach(() => {
    navigator.vibrate = originalVibrate;
    localStorageMock.clear();
    _resetDebounceForTesting();
  });

  describe('isHapticSupported', () => {
    it('returns true when navigator.vibrate is defined', () => {
      expect(isHapticSupported()).toBe(true);
    });

    it('returns false when navigator.vibrate is not available', () => {
      delete navigator.vibrate;
      expect(isHapticSupported()).toBe(false);
    });
  });

  describe('isHapticEnabled', () => {
    it('returns true by default when supported', () => {
      expect(isHapticEnabled()).toBe(true);
    });

    it('returns false when hapticFeedback preference is false', () => {
      localStorageMock.setItem(
        'heartout-theme-preferences',
        JSON.stringify({ hapticFeedback: false })
      );
      expect(isHapticEnabled()).toBe(false);
    });

    it('returns false when reducedMotion preference is true', () => {
      localStorageMock.setItem(
        'heartout-theme-preferences',
        JSON.stringify({ reducedMotion: true })
      );
      expect(isHapticEnabled()).toBe(false);
    });
  });

  describe('triggerHaptic patterns', () => {
    it('triggers light vibration by default', () => {
      triggerHaptic('light', true);
      expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.light);
    });

    it('triggers selection micro-vibration', () => {
      triggerHaptic('selection', true);
      expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.selection);
    });

    it('triggers medium vibration', () => {
      triggerHaptic('medium', true);
      expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.medium);
    });

    it('triggers heavy thud vibration', () => {
      triggerHaptic('heavy', true);
      expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.heavy);
    });

    it('triggers success pulse pattern', () => {
      triggerHaptic('success', true);
      expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.success);
    });

    it('triggers warning alert pattern', () => {
      triggerHaptic('warning', true);
      expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.warning);
    });

    it('triggers error alert pattern', () => {
      triggerHaptic('error', true);
      expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.error);
    });

    it('handles convenience helper methods', () => {
      haptic.light(true);
      expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.light);
    });
  });

  describe('Global Delegated Haptic Listener', () => {
    let cleanup;

    beforeEach(() => {
      cleanup = initGlobalHaptics();
    });

    afterEach(() => {
      if (cleanup) cleanup();
      document.body.innerHTML = '';
    });

    const triggerClick = (element) => {
      _resetDebounceForTesting();
      element.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          button: 0,
        })
      );
    };

    it('triggers vibration when clicking a standard button', () => {
      const btn = document.createElement('button');
      btn.textContent = 'Submit Story';
      document.body.appendChild(btn);

      triggerClick(btn);
      expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.light);
    });

    it('triggers heavy vibration on destructive delete buttons', () => {
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete Reflection';
      deleteBtn.className = 'text-red-600';
      document.body.appendChild(deleteBtn);

      triggerClick(deleteBtn);
      expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.heavy);
    });

    it('triggers medium vibration on switches and checkboxes', () => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      document.body.appendChild(checkbox);

      triggerClick(checkbox);
      expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.medium);
    });

    it('triggers selection vibration on tabs and pills', () => {
      const tab = document.createElement('button');
      tab.setAttribute('role', 'tab');
      tab.className = 'pill-chip rounded-full';
      tab.textContent = 'Dreams';
      document.body.appendChild(tab);

      triggerClick(tab);
      expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_PATTERNS.selection);
    });

    it('respects data-haptic="none"', () => {
      const silentBtn = document.createElement('button');
      silentBtn.setAttribute('data-haptic', 'none');
      document.body.appendChild(silentBtn);

      triggerClick(silentBtn);
      expect(navigator.vibrate).not.toHaveBeenCalled();
    });

    it('does not trigger on disabled elements', () => {
      const disabledBtn = document.createElement('button');
      disabledBtn.disabled = true;
      document.body.appendChild(disabledBtn);

      triggerClick(disabledBtn);
      expect(navigator.vibrate).not.toHaveBeenCalled();
    });
  });
});
