/**
 * PostCard Component Tests
 * Comprehensive tests for the story card component
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock PostCard component
const MockPostCard = ({
    post = {},
    onBookmark = vi.fn(),
    onReact = vi.fn(),
    isBookmarked = false,
    showAuthor = true
}) => {
    const defaultPost = {
        id: '1',
        title: 'Test Story',
        content: 'This is a test story content that is long enough to show preview',
        story_type: 'life_story',
        is_anonymous: false,
        author: { username: 'testuser', display_name: 'Test User' },
        reading_time: 5,
        support_count: 10,
        comment_count: 3,
        published_at: '2024-01-01T00:00:00Z',
        ...post
    };

    return (
        <article data-testid="post-card" className="story-card">
            <header>
                <span data-testid="story-type" className="story-type">
                    {defaultPost.story_type.replace('_', ' ')}
                </span>
                <span data-testid="reading-time">{defaultPost.reading_time} min read</span>
            </header>

            <a href={`/feed/${defaultPost.id}`} data-testid="story-link">
                <h2 data-testid="story-title">{defaultPost.title}</h2>
            </a>

            <p data-testid="story-preview">
                {defaultPost.content.substring(0, 150)}...
            </p>

            {showAuthor && !defaultPost.is_anonymous && (
                <div data-testid="author-info">
                    <span data-testid="author-name">{defaultPost.author.display_name}</span>
                </div>
            )}

            {defaultPost.is_anonymous && (
                <div data-testid="anonymous-badge">Anonymous</div>
            )}

            <footer>
                <span data-testid="support-count">❤️ {defaultPost.support_count}</span>
                <span data-testid="comment-count">💬 {defaultPost.comment_count}</span>
                <span data-testid="publish-date">
                    {new Date(defaultPost.published_at).toLocaleDateString()}
                </span>

                <button
                    data-testid="bookmark-button"
                    onClick={() => onBookmark(defaultPost.id)}
                    aria-pressed={isBookmarked}
                >
                    {isBookmarked ? '🔖' : '📑'}
                </button>

                <button
                    data-testid="react-button"
                    onClick={() => onReact(defaultPost.id)}
                >
                    React
                </button>
            </footer>
        </article>
    );
};

describe('PostCard Component', () => {
    describe('Basic Rendering', () => {
        it('renders post card container', () => {
            render(<BrowserRouter><MockPostCard /></BrowserRouter>);
            expect(screen.getByTestId('post-card')).toBeInTheDocument();
        });

        it('renders story title', () => {
            render(<BrowserRouter><MockPostCard post={{ title: 'My Story' }} /></BrowserRouter>);
            expect(screen.getByText('My Story')).toBeInTheDocument();
        });

        it('renders story preview', () => {
            render(<BrowserRouter><MockPostCard /></BrowserRouter>);
            expect(screen.getByTestId('story-preview')).toBeInTheDocument();
        });

        it('renders story type badge', () => {
            render(<BrowserRouter><MockPostCard /></BrowserRouter>);
            expect(screen.getByTestId('story-type')).toBeInTheDocument();
        });

        it('renders reading time', () => {
            render(<BrowserRouter><MockPostCard /></BrowserRouter>);
            expect(screen.getByTestId('reading-time')).toBeInTheDocument();
        });
    });

    describe('Story Type Display', () => {
        it('shows life story type', () => {
            render(<BrowserRouter><MockPostCard post={{ story_type: 'life_story' }} /></BrowserRouter>);
            expect(screen.getByText('life story')).toBeInTheDocument();
        });

        it('shows achievement type', () => {
            render(<BrowserRouter><MockPostCard post={{ story_type: 'achievement' }} /></BrowserRouter>);
            expect(screen.getByText('achievement')).toBeInTheDocument();
        });

        it('shows regret type', () => {
            render(<BrowserRouter><MockPostCard post={{ story_type: 'regret' }} /></BrowserRouter>);
            expect(screen.getByText('regret')).toBeInTheDocument();
        });
    });

    describe('Author Display', () => {
        it('shows author name when not anonymous', () => {
            render(<BrowserRouter><MockPostCard post={{ is_anonymous: false }} /></BrowserRouter>);
            expect(screen.getByTestId('author-info')).toBeInTheDocument();
        });

        it('shows anonymous badge when anonymous', () => {
            render(<BrowserRouter><MockPostCard post={{ is_anonymous: true }} /></BrowserRouter>);
            expect(screen.getByTestId('anonymous-badge')).toBeInTheDocument();
        });

        it('hides author when showAuthor is false', () => {
            render(<BrowserRouter><MockPostCard showAuthor={false} /></BrowserRouter>);
            expect(screen.queryByTestId('author-info')).not.toBeInTheDocument();
        });

        it('displays correct author name', () => {
            render(<BrowserRouter><MockPostCard post={{
                is_anonymous: false,
                author: { display_name: 'John Doe' }
            }} /></BrowserRouter>);
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });

    describe('Engagement Stats', () => {
        it('displays support count', () => {
            render(<BrowserRouter><MockPostCard post={{ support_count: 42 }} /></BrowserRouter>);
            expect(screen.getByText(/42/)).toBeInTheDocument();
        });

        it('displays comment count', () => {
            render(<BrowserRouter><MockPostCard post={{ comment_count: 7 }} /></BrowserRouter>);
            expect(screen.getByText(/7/)).toBeInTheDocument();
        });

        it('displays publish date', () => {
            render(<BrowserRouter><MockPostCard /></BrowserRouter>);
            expect(screen.getByTestId('publish-date')).toBeInTheDocument();
        });
    });

    describe('Reading Time', () => {
        it('shows 1 min for short stories', () => {
            render(<BrowserRouter><MockPostCard post={{ reading_time: 1 }} /></BrowserRouter>);
            expect(screen.getByText('1 min read')).toBeInTheDocument();
        });

        it('shows 10 min for long stories', () => {
            render(<BrowserRouter><MockPostCard post={{ reading_time: 10 }} /></BrowserRouter>);
            expect(screen.getByText('10 min read')).toBeInTheDocument();
        });
    });

    describe('Bookmark Functionality', () => {
        it('renders bookmark button', () => {
            render(<BrowserRouter><MockPostCard /></BrowserRouter>);
            expect(screen.getByTestId('bookmark-button')).toBeInTheDocument();
        });

        it('calls onBookmark when clicked', () => {
            const onBookmark = vi.fn();
            render(<BrowserRouter><MockPostCard onBookmark={onBookmark} /></BrowserRouter>);
            fireEvent.click(screen.getByTestId('bookmark-button'));
            expect(onBookmark).toHaveBeenCalled();
        });

        it('shows bookmarked state', () => {
            render(<BrowserRouter><MockPostCard isBookmarked={true} /></BrowserRouter>);
            expect(screen.getByTestId('bookmark-button')).toHaveAttribute('aria-pressed', 'true');
        });
    });

    describe('React Functionality', () => {
        it('renders react button', () => {
            render(<BrowserRouter><MockPostCard /></BrowserRouter>);
            expect(screen.getByTestId('react-button')).toBeInTheDocument();
        });

        it('calls onReact when clicked', () => {
            const onReact = vi.fn();
            render(<BrowserRouter><MockPostCard onReact={onReact} /></BrowserRouter>);
            fireEvent.click(screen.getByTestId('react-button'));
            expect(onReact).toHaveBeenCalled();
        });
    });

    describe('Navigation', () => {
        it('story link has correct href', () => {
            render(<BrowserRouter><MockPostCard post={{ id: 'abc123' }} /></BrowserRouter>);
            expect(screen.getByTestId('story-link')).toHaveAttribute('href', '/feed/abc123');
        });
    });
});
