import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FeatureHighlights, { SANCTUARY_PILLARS, SANCTUARY_TESTIMONIALS } from '../components/FeatureHighlights.jsx';
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

describe('FeatureHighlights Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders default Bento layout with 4 architectural pillars and masthead', () => {
    render(<FeatureHighlights />);

    expect(screen.getByTestId('feature-highlights-bento')).toBeInTheDocument();
    expect(screen.getByText('Crafted for emotional safety.')).toBeInTheDocument();

    SANCTUARY_PILLARS.forEach((pillar) => {
      expect(screen.getByText(pillar.title)).toBeInTheDocument();
      expect(screen.getByText(pillar.index)).toBeInTheDocument();
      expect(screen.getByText(pillar.metric)).toBeInTheDocument();
    });
  });

  it('activates a pillar on click and triggers haptic.selection', () => {
    render(<FeatureHighlights />);

    const securityCard = screen.getByTestId('pillar-card-security');
    fireEvent.click(securityCard);

    expect(haptic.selection).toHaveBeenCalledTimes(1);
    expect(securityCard).toHaveClass('border-[#C85828]');
  });

  it('supports keyboard activation via Enter key on pillar cards', () => {
    render(<FeatureHighlights />);

    const communityCard = screen.getByTestId('pillar-card-community');
    fireEvent.keyDown(communityCard, { key: 'Enter' });

    expect(haptic.selection).toHaveBeenCalledTimes(1);
    expect(communityCard).toHaveClass('border-[#C85828]');
  });

  it('renders compact horizontal pills variant when specified', () => {
    render(<FeatureHighlights variant="pills" />);

    expect(screen.getByTestId('feature-highlights-pills')).toBeInTheDocument();
    expect(screen.queryByTestId('feature-highlights-bento')).toBeNull();

    SANCTUARY_PILLARS.forEach((pillar) => {
      expect(screen.getByText(pillar.title)).toBeInTheDocument();
    });
  });

  it('navigates testimonials using prev and next buttons with haptic feedback', () => {
    render(<FeatureHighlights autoPlay={false} />);

    expect(screen.getByText(new RegExp(SANCTUARY_TESTIMONIALS[0].author, 'i'))).toBeInTheDocument();

    const nextBtn = screen.getByTestId('testimonial-next-btn');
    fireEvent.click(nextBtn);

    expect(haptic.selection).toHaveBeenCalledTimes(1);
    expect(screen.getByText(new RegExp(SANCTUARY_TESTIMONIALS[1].author, 'i'))).toBeInTheDocument();

    const prevBtn = screen.getByTestId('testimonial-prev-btn');
    fireEvent.click(prevBtn);

    expect(haptic.selection).toHaveBeenCalledTimes(2);
    expect(screen.getByText(new RegExp(SANCTUARY_TESTIMONIALS[0].author, 'i'))).toBeInTheDocument();
  });

  it('selects testimonial via dot indicators', () => {
    render(<FeatureHighlights autoPlay={false} />);

    const dot2 = screen.getByTestId('testimonial-dot-2');
    fireEvent.click(dot2);

    expect(haptic.selection).toHaveBeenCalled();
    expect(screen.getByText(new RegExp(SANCTUARY_TESTIMONIALS[2].author, 'i'))).toBeInTheDocument();
  });

  it('can hide testimonials when showTestimonials is false', () => {
    render(<FeatureHighlights showTestimonials={false} />);

    expect(screen.queryByText(/Voices from the Sanctuary/i)).toBeNull();
  });
});
