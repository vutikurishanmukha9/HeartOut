import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ErrorBoundary, { RouteErrorBoundary } from '../components/ErrorBoundary.jsx';
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

// Component that throws error on demand
function FaultyComponent({ shouldThrow = false }) {
  if (shouldThrow) {
    throw new Error('Test sanctuary explosion');
  }
  return <div>Peaceful sanctuary content</div>;
}

describe('ErrorBoundary Component', () => {
  let originalConsoleError;

  beforeEach(() => {
    vi.clearAllMocks();
    originalConsoleError = console.error;
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('renders children peacefully when no error occurs', () => {
    render(
      <ErrorBoundary>
        <FaultyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Peaceful sanctuary content')).toBeInTheDocument();
  });

  it('catches exception and renders sanctuary error recovery card', () => {
    render(
      <ErrorBoundary>
        <FaultyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('A quiet pause in the sanctuary')).toBeInTheDocument();
    expect(
      screen.getByText(/A momentary pause occurred while rendering this reflection/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('error-retry-button')).toBeInTheDocument();
    expect(screen.getByTestId('error-home-link')).toBeInTheDocument();
  });

  it('supports custom fallback UI prop', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom Safe Shelter</div>}>
        <FaultyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.getByText('Custom Safe Shelter')).toBeInTheDocument();
    expect(screen.queryByText('A quiet pause in the sanctuary')).toBeNull();
  });

  it('renders contextual route name when provided', () => {
    render(
      <RouteErrorBoundary routeName="feed">
        <FaultyComponent shouldThrow={true} />
      </RouteErrorBoundary>
    );

    expect(screen.getByText(/problem loading the feed/i)).toBeInTheDocument();
  });

  it('triggers haptic.medium and resets error state when retry button is clicked', async () => {
    let shouldThrow = true;

    function DynamicFaulty() {
      if (shouldThrow) {
        throw new Error('Temporary glitch');
      }
      return <div>Restored sanctuary space</div>;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <DynamicFaulty />
      </ErrorBoundary>
    );

    expect(screen.getByText('A quiet pause in the sanctuary')).toBeInTheDocument();

    const retryButton = screen.getByTestId('error-retry-button');
    shouldThrow = false;

    act(() => {
      fireEvent.click(retryButton);
    });

    expect(haptic.medium).toHaveBeenCalledTimes(1);

    // Wait for the gentle 200ms restoration timer
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });

    rerender(
      <ErrorBoundary>
        <DynamicFaulty />
      </ErrorBoundary>
    );

    expect(screen.getByText('Restored sanctuary space')).toBeInTheDocument();
  });

  it('toggles diagnostic trace and triggers haptic.selection', () => {
    render(
      <ErrorBoundary>
        <FaultyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const toggle = screen.getByTestId('error-details-toggle');
    expect(screen.queryByTestId('error-details-content')).toBeNull();

    fireEvent.click(toggle);
    expect(haptic.selection).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('error-details-content')).toBeInTheDocument();
    expect(screen.getByText(/Test sanctuary explosion/i)).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(haptic.selection).toHaveBeenCalledTimes(2);
    expect(screen.queryByTestId('error-details-content')).toBeNull();
  });

  it('copies diagnostic trace to clipboard and triggers haptic.light', async () => {
    const originalClipboard = navigator.clipboard;
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <ErrorBoundary>
        <FaultyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Open details drawer
    fireEvent.click(screen.getByTestId('error-details-toggle'));

    const copyBtn = screen.getByTestId('error-copy-button');
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(haptic.light).toHaveBeenCalled();
    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('Test sanctuary explosion'));

    Object.assign(navigator, { clipboard: originalClipboard });
  });

  it('triggers haptic.light when Return to Sanctuary link is clicked', () => {
    render(
      <ErrorBoundary>
        <FaultyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const homeLink = screen.getByTestId('error-home-link');
    fireEvent.click(homeLink);

    expect(haptic.light).toHaveBeenCalledTimes(1);
  });
});
