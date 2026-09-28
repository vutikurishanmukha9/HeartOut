import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop.jsx';
import haptic from '../utils/haptics.js';

// Mock haptics
vi.mock('../utils/haptics.js', () => ({
  default: {
    selection: vi.fn(),
    light: vi.fn(),
    medium: vi.fn(),
    heavy: vi.fn(),
    success: vi.fn(),
  },
}));

describe('ScrollToTop Component', () => {
  let originalScrollTo;

  beforeEach(() => {
    vi.clearAllMocks();
    originalScrollTo = window.scrollTo;
    window.scrollTo = vi.fn();
    window.pageYOffset = 0;

    Object.defineProperty(document.documentElement, 'scrollTop', {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
  });

  it('renders without crashing and starts invisible at top of page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop threshold={300} />
      </MemoryRouter>
    );

    const button = screen.getByTestId('scroll-to-top-button');
    expect(button).toBeInTheDocument();

    const container = button.closest('.fixed');
    expect(container).toHaveClass('opacity-0');
    expect(container).toHaveClass('pointer-events-none');
  });

  it('becomes visible when window scrolls past threshold', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop threshold={300} />
      </MemoryRouter>
    );

    const button = screen.getByTestId('scroll-to-top-button');
    const container = button.closest('.fixed');

    act(() => {
      window.pageYOffset = 500;
      fireEvent.scroll(window);
    });

    expect(container).toHaveClass('opacity-100');
    expect(container).toHaveClass('pointer-events-auto');
  });

  it('calculates scroll progress and updates aria-label', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop threshold={300} />
      </MemoryRouter>
    );

    const button = screen.getByTestId('scroll-to-top-button');

    // Total scrollable distance = 2000 - 1000 = 1000.
    // 500 scrollTop = 50%
    act(() => {
      window.pageYOffset = 500;
      fireEvent.scroll(window);
    });

    expect(button).toHaveAttribute('aria-label', expect.stringContaining('50% read'));
  });

  it('renders radial progress SVG gauge by default and hides when showIndicator is false', () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop threshold={300} showIndicator={true} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('scroll-progress-ring')).toBeInTheDocument();

    rerender(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop threshold={300} showIndicator={false} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('scroll-progress-ring')).toBeNull();
  });

  it('shows tooltip on hover, triggers haptic.light, and displays percentage', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop threshold={300} />
      </MemoryRouter>
    );

    act(() => {
      window.pageYOffset = 500;
      fireEvent.scroll(window);
    });

    const button = screen.getByTestId('scroll-to-top-button');

    expect(screen.queryByRole('tooltip')).toBeNull();

    fireEvent.mouseEnter(button);
    expect(haptic.light).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Return to summit')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();

    fireEvent.mouseLeave(button);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('calls window.scrollTo and triggers haptic.medium when clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop threshold={300} />
      </MemoryRouter>
    );

    act(() => {
      window.pageYOffset = 600;
      fireEvent.scroll(window);
    });

    const button = screen.getByTestId('scroll-to-top-button');
    fireEvent.click(button);

    expect(haptic.medium).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });

  it('calls instant window.scrollTo on path changes', () => {
    function NavigationHarness() {
      const navigate = useNavigate();
      return (
        <div>
          <ScrollToTop />
          <button type="button" onClick={() => navigate('/support')}>
            Navigate to Support
          </button>
        </div>
      );
    }

    render(
      <MemoryRouter initialEntries={['/feed']}>
        <NavigationHarness />
      </MemoryRouter>
    );

    // Initial route load scroll restoration
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    window.scrollTo.mockClear();

    // Trigger router navigation
    fireEvent.click(screen.getByRole('button', { name: /Navigate to Support/i }));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  });
});
