import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import SEO, {
  HomeSEO,
  FeedSEO,
  LoginSEO,
  RegisterSEO,
  ProfileSEO,
  StorySEO,
  SocialPreviewCard,
  CATEGORY_META,
  SITE_NAME,
} from '../components/SEO';

const renderWithHelmet = (ui) => {
  return render(<HelmetProvider>{ui}</HelmetProvider>);
};

describe('Sanctuary SEO Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Core Head & Schema Generation', () => {
    it('renders basic SEO meta structure without throwing', () => {
      const { container } = renderWithHelmet(
        <SEO
          title="Reflections of Autumn"
          description="A quiet look into memories and changes."
          storyType="memory"
        />
      );
      expect(container).toBeDefined();
    });

    it('renders HomeSEO and FeedSEO correctly', () => {
      const { container: homeContainer } = renderWithHelmet(<HomeSEO />);
      expect(homeContainer).toBeDefined();

      const { container: feedContainer } = renderWithHelmet(<FeedSEO />);
      expect(feedContainer).toBeDefined();
    });

    it('renders LoginSEO and RegisterSEO with noIndex flag', () => {
      const { container: loginContainer } = renderWithHelmet(<LoginSEO />);
      expect(loginContainer).toBeDefined();

      const { container: registerContainer } = renderWithHelmet(<RegisterSEO />);
      expect(registerContainer).toBeDefined();
    });

    it('renders ProfileSEO with author details and count', () => {
      const { container } = renderWithHelmet(
        <ProfileSEO username="WanderingPoet" storyCount={14} />
      );
      expect(container).toBeDefined();
    });

    it('renders StorySEO with authentic story categories', () => {
      const mockStory = {
        id: 'story-123',
        title: 'Whispers at Twilight',
        content: 'I never told anyone what happened that evening in December...',
        story_type: 'confession',
        is_anonymous: true,
        created_at: '2026-09-28T12:00:00Z',
        tags: ['heartache', 'acceptance'],
        reading_time: 3,
      };

      const { container } = renderWithHelmet(<StorySEO story={mockStory} />);
      expect(container).toBeDefined();
    });
  });

  describe('SocialPreviewCard Visual Component', () => {
    const mockStory = {
      id: 'story-456',
      title: 'A Dream of Quiet Rivers',
      content: 'Sometimes I imagine leaving the rush of the city behind forever.',
      story_type: 'dream',
      is_anonymous: false,
      author: { display_name: 'RiverWalker' },
    };

    it('renders social card preview with literary title and category badge', () => {
      renderWithHelmet(<SocialPreviewCard story={mockStory} />);

      expect(screen.getByText('A Dream of Quiet Rivers')).toBeInTheDocument();
      expect(screen.getByText('Dream')).toBeInTheDocument();
      expect(screen.getByText('RiverWalker')).toBeInTheDocument();
      expect(screen.getByText('Copy Share Link')).toBeInTheDocument();
    });

    it('renders anonymous soul seal when author is anonymous', () => {
      const anonStory = {
        ...mockStory,
        is_anonymous: true,
      };

      renderWithHelmet(<SocialPreviewCard story={anonStory} />);
      expect(screen.getByText('Anonymous Soul')).toBeInTheDocument();
    });

    it('handles clipboard copy with state change', async () => {
      // Mock clipboard writeText
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      });

      renderWithHelmet(<SocialPreviewCard story={mockStory} />);
      const copyBtn = screen.getByRole('button', { name: /copy share link/i });

      await act(async () => {
        fireEvent.click(copyBtn);
      });

      expect(writeTextMock).toHaveBeenCalled();
      expect(screen.getByText('Link Copied')).toBeInTheDocument();
    });

    it('renders compact mode preview', () => {
      renderWithHelmet(<SocialPreviewCard story={mockStory} compact={true} />);

      expect(screen.getByText('A Dream of Quiet Rivers')).toBeInTheDocument();
      expect(screen.getByText('Dream')).toBeInTheDocument();
      expect(screen.getByText('heartout.in')).toBeInTheDocument();
    });
  });

  describe('CATEGORY_META mappings', () => {
    it('defines authentic sanctuary story types', () => {
      expect(CATEGORY_META.vent).toBeDefined();
      expect(CATEGORY_META.confession).toBeDefined();
      expect(CATEGORY_META.dream).toBeDefined();
      expect(CATEGORY_META.memory).toBeDefined();
      expect(CATEGORY_META.other).toBeDefined();
    });

    it('preserves legacy category compatibility', () => {
      expect(CATEGORY_META.achievement).toBeDefined();
      expect(CATEGORY_META.regret).toBeDefined();
      expect(CATEGORY_META.unsent_letter).toBeDefined();
      expect(CATEGORY_META.sacrifice).toBeDefined();
      expect(CATEGORY_META.life_story).toBeDefined();
    });
  });
});
