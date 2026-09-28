import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LiveReaderBadge from '../components/LiveReaderBadge.jsx';
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

// Mock WebSocket hook
const mockJoinStory = vi.fn();
const mockLeaveStory = vi.fn();
const mockGetReaderCount = vi.fn();

vi.mock('../hooks/useWebSocket.jsx', () => ({
  useWebSocket: () => ({
    isConnected: true,
    joinStory: mockJoinStory,
    leaveStory: mockLeaveStory,
    getReaderCount: mockGetReaderCount,
  }),
}));

describe('LiveReaderBadge Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetReaderCount.mockReturnValue(3);
  });

  it('renders correctly with default badge variant and plural souls', () => {
    render(<LiveReaderBadge storyId="story-101" />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('souls reading')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /3 people reading with you/i })).toBeInTheDocument();
  });

  it('renders single soul correctly when count is 1 with forceShow', () => {
    mockGetReaderCount.mockReturnValue(1);
    render(<LiveReaderBadge storyId="story-102" forceShow={true} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('soul reading')).toBeInTheDocument();
  });

  it('does not render when reader count is <= 1 without forceShow', () => {
    mockGetReaderCount.mockReturnValue(1);
    const { container } = render(<LiveReaderBadge storyId="story-103" />);

    expect(container.firstChild).toBeNull();
  });

  it('does not render when reader count is 0 without forceShow', () => {
    mockGetReaderCount.mockReturnValue(0);
    const { container } = render(<LiveReaderBadge storyId="story-104" />);

    expect(container.firstChild).toBeNull();
  });

  it('respects count override prop regardless of websocket count', () => {
    render(<LiveReaderBadge storyId="story-105" count={7} />);

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('souls reading')).toBeInTheDocument();
  });

  it('renders compact variant properly', () => {
    render(<LiveReaderBadge storyId="story-106" variant="compact" count={4} />);

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders minimal variant properly', () => {
    render(<LiveReaderBadge storyId="story-107" variant="minimal" count={2} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('reading with you')).toBeInTheDocument();
  });

  it('joins room on mount and leaves room on unmount', () => {
    const { unmount } = render(<LiveReaderBadge storyId="story-room-test" count={5} />);

    expect(mockJoinStory).toHaveBeenCalledWith('story-room-test');
    expect(mockLeaveStory).not.toHaveBeenCalled();

    unmount();
    expect(mockLeaveStory).toHaveBeenCalledWith('story-room-test');
  });

  it('toggles sanctuary presence tooltip and triggers haptic feedback on badge click', () => {
    render(<LiveReaderBadge storyId="story-108" count={3} />);

    const badgeButton = screen.getByRole('button', { name: /3 people reading with you/i });

    // Initially tooltip is not present
    expect(screen.queryByRole('tooltip')).toBeNull();

    // Click to open tooltip
    fireEvent.click(badgeButton);
    expect(haptic.selection).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Shared Presence')).toBeInTheDocument();
    expect(screen.getByText(/3 souls are currently reflecting on this piece/i)).toBeInTheDocument();

    // Click again to close tooltip
    fireEvent.click(badgeButton);
    expect(haptic.selection).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
