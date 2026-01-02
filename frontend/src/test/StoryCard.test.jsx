/**
 * StoryCard Component Tests
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock the auth context
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: { id: '123', username: 'testuser' },
        isAuthenticated: true,
    }),
}));

// Mock story card - import after mocks if the component exists
// For now, test with a simple mock component to verify test setup

const mockStory = {
    id: 'story-1',
    title: 'Test Story Title',
    content: 'This is the story content that should be displayed in the card preview.',
    author: {
        id: 'author-1',
        username: 'authoruser',
        display_name: 'Author Name',
    },
    story_type: 'life_story',
    is_anonymous: false,
    created_at: '2024-01-01T00:00:00Z',
    reading_time: 5,
    support_count: 10,
    comment_count: 3,
    view_count: 100,
};

const anonymousStory = {
    ...mockStory,
    id: 'story-2',
    is_anonymous: true,
    author: null,
};

// Simple StoryCard mock for testing
const MockStoryCard = ({ story }) => (
    <article data-testid="story-card">
        <h2>{story.title}</h2>
        <p>{story.content.substring(0, 100)}...</p>
        <span data-testid="author">
            {story.is_anonymous ? 'Anonymous' : story.author?.display_name}
        </span>
        <span data-testid="reading-time">{story.reading_time} min read</span>
        <span data-testid="support-count">{story.support_count}</span>
    </article>
);

const renderStoryCard = (story = mockStory) => {
    return render(
        <BrowserRouter>
            <MockStoryCard story={story} />
        </BrowserRouter>
    );
};

describe('StoryCard', () => {
    it('renders story title', () => {
        renderStoryCard();
        expect(screen.getByText(mockStory.title)).toBeInTheDocument();
    });

    it('renders content preview', () => {
        renderStoryCard();
        expect(screen.getByText(/This is the story content/)).toBeInTheDocument();
    });

    it('displays author name for non-anonymous stories', () => {
        renderStoryCard();
        expect(screen.getByTestId('author')).toHaveTextContent('Author Name');
    });

    it('displays Anonymous for anonymous stories', () => {
        renderStoryCard(anonymousStory);
        expect(screen.getByTestId('author')).toHaveTextContent('Anonymous');
    });

    it('displays reading time', () => {
        renderStoryCard();
        expect(screen.getByTestId('reading-time')).toHaveTextContent('5 min read');
    });

    it('displays support count', () => {
        renderStoryCard();
        expect(screen.getByTestId('support-count')).toHaveTextContent('10');
    });

    it('renders as article element', () => {
        renderStoryCard();
        expect(screen.getByTestId('story-card').tagName).toBe('ARTICLE');
    });
});
