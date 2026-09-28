import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StoryTypeShowcase, { STORY_CATEGORIES } from '../components/StoryTypeShowcase.jsx';
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

describe('StoryTypeShowcase Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 6 canonical story categories with indices and literary quotes', () => {
    render(<StoryTypeShowcase />);

    expect(screen.getByTestId('story-type-showcase')).toBeInTheDocument();

    STORY_CATEGORIES.forEach((cat) => {
      expect(screen.getByText(cat.label)).toBeInTheDocument();
      expect(screen.getByText(cat.index)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(cat.quote, 'i'))).toBeInTheDocument();
    });
  });

  it('calls onSelectCategory with category id and triggers haptic.selection when clicked', () => {
    const handleSelect = vi.fn();
    render(<StoryTypeShowcase selectedCategory="all" onSelectCategory={handleSelect} />);

    const achievementCard = screen.getByTestId('story-type-card-achievement');
    fireEvent.click(achievementCard);

    expect(haptic.selection).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('achievement');
  });

  it('toggles back to all when clicking already selected category', () => {
    const handleSelect = vi.fn();
    render(<StoryTypeShowcase selectedCategory="achievement" onSelectCategory={handleSelect} />);

    const achievementCard = screen.getByTestId('story-type-card-achievement');
    fireEvent.click(achievementCard);

    expect(haptic.selection).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('all');
  });

  it('displays story count badges when counts prop is supplied', () => {
    const mockCounts = {
      achievement: 14,
      confession: 9,
    };

    render(<StoryTypeShowcase counts={mockCounts} />);

    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('renders All Sanctuary Stories toggle when showAllOption is true', () => {
    const handleSelect = vi.fn();
    render(
      <StoryTypeShowcase
        selectedCategory="sacrifice"
        onSelectCategory={handleSelect}
        showAllOption={true}
      />
    );

    const allToggle = screen.getByTestId('category-all-toggle');
    expect(allToggle).toBeInTheDocument();

    fireEvent.click(allToggle);
    expect(haptic.selection).toHaveBeenCalled();
    expect(handleSelect).toHaveBeenCalledWith('all');
  });

  it('supports keyboard navigation and activation', () => {
    const handleSelect = vi.fn();
    render(<StoryTypeShowcase onSelectCategory={handleSelect} />);

    const letterCard = screen.getByTestId('story-type-card-unsent_letter');
    fireEvent.keyDown(letterCard, { key: 'Enter' });

    expect(haptic.selection).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('unsent_letter');
  });
});
