import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SkipToContent, {
  VisuallyHidden,
  LiveRegion,
  ReadingGuide,
  AccessibilityModal,
} from '../components/Accessibility';
import { ThemeContext } from '../context/ThemeContext';

// Mock localStorage store
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

describe('Sanctuary Accessibility Suite', () => {
  let mockThemeContext;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    mockThemeContext = {
      theme: 'light',
      isDark: false,
      fontSize: 'medium',
      setFontSize: vi.fn(),
      reducedMotion: false,
      toggleReducedMotion: vi.fn(),
      highContrast: false,
      toggleHighContrast: vi.fn(),
      colorBlindFriendly: false,
      toggleColorBlindFriendly: vi.fn(),
      hapticFeedback: true,
      toggleHapticFeedback: vi.fn(),
      resetPreferences: vi.fn(),
    };
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('VisuallyHidden Primitive', () => {
    it('renders children with sr-only class', () => {
      render(<VisuallyHidden>Screen reader announcement</VisuallyHidden>);
      const hiddenEl = screen.getByText('Screen reader announcement');
      expect(hiddenEl).toBeInTheDocument();
      expect(hiddenEl.className).toContain('sr-only');
    });

    it('renders with custom HTML tag', () => {
      render(
        <VisuallyHidden as="h2">Heading for assistive devices</VisuallyHidden>
      );
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Heading for assistive devices');
      expect(heading.className).toContain('sr-only');
    });
  });

  describe('LiveRegion Primitive', () => {
    it('renders with status role and polite aria-live by default', () => {
      render(<LiveRegion>Story published successfully</LiveRegion>);
      const region = screen.getByRole('status');
      expect(region).toHaveAttribute('aria-live', 'polite');
      expect(region).toHaveAttribute('aria-atomic', 'true');
      expect(region).toHaveTextContent('Story published successfully');
    });

    it('supports assertive aria-live politeness', () => {
      render(<LiveRegion politeness="assertive">Network connection lost</LiveRegion>);
      const region = screen.getByRole('status');
      expect(region).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('ReadingGuide Component', () => {
    it('does not render when inactive', () => {
      const { container } = render(<ReadingGuide active={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders ruler tracking bar when active and mouse moves', () => {
      const { container } = render(<ReadingGuide active={true} />);
      act(() => {
        window.dispatchEvent(new MouseEvent('mousemove', { clientY: 250 }));
      });
      expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });
  });

  describe('SkipToContent & Assistive Command Hub', () => {
    it('renders skip link and floating assistive glyph by default', () => {
      render(
        <ThemeContext.Provider value={mockThemeContext}>
          <BrowserRouter>
            <SkipToContent targetId="main-content" />
          </BrowserRouter>
        </ThemeContext.Provider>
      );

      expect(screen.getByText('Skip to Content')).toBeInTheDocument();
      expect(screen.getByText('Jump to Nav')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /open sanctuary assistive hub/i })
      ).toBeInTheDocument();
    });

    it('focuses and smooth-scrolls to target element on skip link click', () => {
      const targetEl = document.createElement('main');
      targetEl.id = 'main-content';
      targetEl.scrollIntoView = vi.fn();
      document.body.appendChild(targetEl);

      render(
        <ThemeContext.Provider value={mockThemeContext}>
          <BrowserRouter>
            <SkipToContent targetId="main-content" />
          </BrowserRouter>
        </ThemeContext.Provider>
      );

      const skipBtn = screen.getByText('Skip to Content');
      fireEvent.click(skipBtn);

      expect(targetEl.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
      document.body.removeChild(targetEl);
    });

    it('opens Accessibility Modal on floating badge click', () => {
      render(
        <ThemeContext.Provider value={mockThemeContext}>
          <BrowserRouter>
            <SkipToContent targetId="main-content" />
          </BrowserRouter>
        </ThemeContext.Provider>
      );

      const badge = screen.getByRole('button', {
        name: /open sanctuary assistive hub/i,
      });
      fireEvent.click(badge);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Sanctuary Assistive Hub')).toBeInTheDocument();
    });

    it('toggles modal on Alt+A keyboard shortcut', () => {
      render(
        <ThemeContext.Provider value={mockThemeContext}>
          <BrowserRouter>
            <SkipToContent targetId="main-content" />
          </BrowserRouter>
        </ThemeContext.Provider>
      );

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', altKey: true }));
      });

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('toggles font sizing, high contrast, and reduced motion in modal', () => {
      render(
        <ThemeContext.Provider value={mockThemeContext}>
          <AccessibilityModal isOpen={true} onClose={vi.fn()} />
        </ThemeContext.Provider>
      );

      // Select Comfort font size
      const comfortBtn = screen.getByText('Comfort');
      fireEvent.click(comfortBtn);
      expect(mockThemeContext.setFontSize).toHaveBeenCalledWith('large');

      // Toggle High Contrast
      const contrastSwitch = screen.getByRole('switch', {
        name: /toggle high contrast mode/i,
      });
      fireEvent.click(contrastSwitch);
      expect(mockThemeContext.toggleHighContrast).toHaveBeenCalled();

      // Switch to Sensory Comfort tab
      const sensoryTab = screen.getByRole('tab', { name: /sensory comfort/i });
      fireEvent.click(sensoryTab);

      // Toggle Calm Motion
      const motionSwitch = screen.getByRole('switch', {
        name: /toggle calm motion mode/i,
      });
      fireEvent.click(motionSwitch);
      expect(mockThemeContext.toggleReducedMotion).toHaveBeenCalled();

      // Toggle Haptic
      const hapticSwitch = screen.getByRole('switch', {
        name: /toggle haptic vibration feedback/i,
      });
      fireEvent.click(hapticSwitch);
      expect(mockThemeContext.toggleHapticFeedback).toHaveBeenCalled();
    });

    it('resets preferences to sanctuary defaults', () => {
      render(
        <ThemeContext.Provider value={mockThemeContext}>
          <AccessibilityModal isOpen={true} onClose={vi.fn()} />
        </ThemeContext.Provider>
      );

      const resetBtn = screen.getByText('Reset Defaults');
      fireEvent.click(resetBtn);

      expect(mockThemeContext.resetPreferences).toHaveBeenCalled();
    });
  });
});
