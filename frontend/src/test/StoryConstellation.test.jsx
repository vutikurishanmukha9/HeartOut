import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import StoryConstellation from '../components/StoryConstellation.jsx';
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

const mockStories = [
  {
    id: 'story-1',
    title: 'Surviving the Climb',
    content: 'A long journey reaching the summit.',
    story_type: 'achievement',
    reading_time: 2,
    reactions_count: 5,
  },
  {
    id: 'story-2',
    title: 'Breaking Through Boundaries',
    content: 'Earned my milestone today.',
    story_type: 'achievement',
    reading_time: 3,
    reactions_count: 12,
  },
  {
    id: 'story-3',
    title: 'The Letter Left Behind',
    content: 'Words I never spoke aloud.',
    story_type: 'unsent_letter',
    reading_time: 1,
    reactions_count: 3,
  },
];

describe('StoryConstellation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders poetic empty state when no stories are passed', () => {
    render(<StoryConstellation stories={[]} />);

    expect(screen.getByTestId('constellation-total-count')).toHaveTextContent('0');
    expect(screen.getByTestId('constellation-empty-state')).toBeInTheDocument();
    expect(screen.getByText(/Your constellation is awaiting its first star/i)).toBeInTheDocument();
  });

  it('renders metric header and celestial stars for provided stories', () => {
    render(<StoryConstellation stories={mockStories} />);

    expect(screen.getByTestId('constellation-total-count')).toHaveTextContent('3');
    expect(screen.getByTestId('constellation-svg')).toBeInTheDocument();

    // 2 achievement stars + 1 unsent_letter star + empty markers
    expect(screen.getByLabelText(/Success Stories: Surviving the Climb/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Success Stories: Breaking Through Boundaries/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unsent Letters: The Letter Left Behind/i)).toBeInTheDocument();
  });

  it('renders connective constellation lines for categories with multiple stories', () => {
    render(<StoryConstellation stories={mockStories} />);

    const linesGroup = screen.getByTestId('constellation-lines');
    expect(linesGroup.children.length).toBeGreaterThanOrEqual(1);
  });

  it('triggers onCategoryClick and haptic.selection when selecting category in legend', () => {
    const handleCategoryClick = vi.fn();
    render(<StoryConstellation stories={mockStories} onCategoryClick={handleCategoryClick} />);

    const achievementBtn = screen.getByTestId('constellation-category-achievement');
    fireEvent.click(achievementBtn);

    expect(haptic.selection).toHaveBeenCalledTimes(1);
    expect(handleCategoryClick).toHaveBeenCalledWith('achievement');

    // Clear filter button should now be visible
    const clearBtn = screen.getByTestId('clear-category-filter');
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(handleCategoryClick).toHaveBeenCalledWith(null);
  });

  it('displays tooltip on hover and triggers haptic.selection', () => {
    render(<StoryConstellation stories={mockStories} />);

    const starBtn = screen.getByLabelText(/Success Stories: Surviving the Climb/i);

    fireEvent.mouseEnter(starBtn);
    expect(haptic.selection).toHaveBeenCalled();

    const tooltip = screen.getByTestId('constellation-tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText('Surviving the Climb')).toBeInTheDocument();

    fireEvent.mouseLeave(starBtn);
    expect(screen.queryByTestId('constellation-tooltip')).toBeNull();
  });

  it('opens star inspection drawer on click and triggers haptic.medium', () => {
    render(<StoryConstellation stories={mockStories} />);

    const starBtn = screen.getByLabelText(/Success Stories: Surviving the Climb/i);
    fireEvent.click(starBtn);

    expect(haptic.medium).toHaveBeenCalledTimes(1);

    const inspection = screen.getByTestId('constellation-story-inspection');
    expect(inspection).toBeInTheDocument();
    expect(screen.getByText('2 min read')).toBeInTheDocument();

    // Close inspection drawer
    const closeBtn = screen.getByRole('button', { name: /Close star details/i });
    fireEvent.click(closeBtn);
    expect(haptic.light).toHaveBeenCalled();
    expect(screen.queryByTestId('constellation-story-inspection')).toBeNull();
  });

  it('supports keyboard Enter selection on focused celestial star', () => {
    render(<StoryConstellation stories={mockStories} />);

    const starBtn = screen.getByLabelText(/Unsent Letters: The Letter Left Behind/i);
    fireEvent.keyDown(starBtn, { key: 'Enter' });

    expect(haptic.medium).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('constellation-story-inspection')).toBeInTheDocument();
  });
});
