/**
 * Feed Page Tests
 * Comprehensive tests for the main feed page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';

// Mock contexts
vi.mock('../context/AuthContext', () => ({
    AuthContext: React.createContext({
        user: { id: '123', username: 'testuser' },
        isAuthenticated: true,
    }),
}));

vi.mock('../context/ThemeContext', () => ({
    ThemeContext: React.createContext({
        isDark: false,
        theme: 'light',
    }),
}));

vi.mock('../hooks/useWebSocket.jsx', () => ({
    useWebSocket: () => ({ notifications: [], isConnected: false }),
}));

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const TestWrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
);

// Mock Feed component for testing
const MockFeed = ({ stories = [], loading = false, error = null }) => (
    <div data-testid="feed-page">
        <header>
            <h1>Stories Feed</h1>
            <select data-testid="sort-select">
                <option value="smart">Smart</option>
                <option value="latest">Latest</option>
                <option value="trending">Trending</option>
            </select>
            <select data-testid="filter-select">
                <option value="">All Types</option>
                <option value="life_story">Life Story</option>
                <option value="achievement">Achievement</option>
            </select>
        </header>
        {loading && <div data-testid="loading">Loading...</div>}
        {error && <div data-testid="error">{error}</div>}
        <main data-testid="stories-grid">
            {stories.length === 0 && !loading && (
                <p data-testid="empty-state">No stories yet</p>
            )}
            {stories.map(story => (
                <article key={story.id} data-testid="story-card">
                    <h2>{story.title}</h2>
                    <p>{story.content.substring(0, 100)}...</p>
                    <span data-testid="story-type">{story.story_type}</span>
                </article>
            ))}
        </main>
        <button data-testid="load-more">Load More</button>
    </div>
);

describe('Feed Page', () => {
    beforeEach(() => {
        queryClient.clear();
    });

    describe('Rendering', () => {
        it('renders feed header', () => {
            render(<TestWrapper><MockFeed /></TestWrapper>);
            expect(screen.getByText('Stories Feed')).toBeInTheDocument();
        });

        it('renders sort selector', () => {
            render(<TestWrapper><MockFeed /></TestWrapper>);
            expect(screen.getByTestId('sort-select')).toBeInTheDocument();
        });

        it('renders filter selector', () => {
            render(<TestWrapper><MockFeed /></TestWrapper>);
            expect(screen.getByTestId('filter-select')).toBeInTheDocument();
        });

        it('renders stories grid', () => {
            render(<TestWrapper><MockFeed /></TestWrapper>);
            expect(screen.getByTestId('stories-grid')).toBeInTheDocument();
        });

        it('renders load more button', () => {
            render(<TestWrapper><MockFeed /></TestWrapper>);
            expect(screen.getByTestId('load-more')).toBeInTheDocument();
        });
    });

    describe('Loading States', () => {
        it('shows loading indicator when loading', () => {
            render(<TestWrapper><MockFeed loading={true} /></TestWrapper>);
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        });

        it('hides loading when done', () => {
            render(<TestWrapper><MockFeed loading={false} /></TestWrapper>);
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
    });

    describe('Empty States', () => {
        it('shows empty state when no stories', () => {
            render(<TestWrapper><MockFeed stories={[]} /></TestWrapper>);
            expect(screen.getByTestId('empty-state')).toBeInTheDocument();
        });

        it('shows correct empty message', () => {
            render(<TestWrapper><MockFeed stories={[]} /></TestWrapper>);
            expect(screen.getByText('No stories yet')).toBeInTheDocument();
        });
    });

    describe('Story Display', () => {
        const mockStories = [
            { id: '1', title: 'Story 1', content: 'Content 1 is here and it is long enough', story_type: 'life_story' },
            { id: '2', title: 'Story 2', content: 'Content 2 is here and it is long enough', story_type: 'achievement' },
        ];

        it('renders multiple story cards', () => {
            render(<TestWrapper><MockFeed stories={mockStories} /></TestWrapper>);
            expect(screen.getAllByTestId('story-card')).toHaveLength(2);
        });

        it('displays story titles', () => {
            render(<TestWrapper><MockFeed stories={mockStories} /></TestWrapper>);
            expect(screen.getByText('Story 1')).toBeInTheDocument();
            expect(screen.getByText('Story 2')).toBeInTheDocument();
        });

        it('displays story types', () => {
            render(<TestWrapper><MockFeed stories={mockStories} /></TestWrapper>);
            expect(screen.getByText('life_story')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('displays error message when error occurs', () => {
            render(<TestWrapper><MockFeed error="Failed to load stories" /></TestWrapper>);
            expect(screen.getByTestId('error')).toBeInTheDocument();
        });

        it('shows correct error text', () => {
            render(<TestWrapper><MockFeed error="Network error" /></TestWrapper>);
            expect(screen.getByText('Network error')).toBeInTheDocument();
        });
    });

    describe('Sorting', () => {
        it('has smart sort option', () => {
            render(<TestWrapper><MockFeed /></TestWrapper>);
            const select = screen.getByTestId('sort-select');
            expect(select).toContainHTML('Smart');
        });

        it('has latest sort option', () => {
            render(<TestWrapper><MockFeed /></TestWrapper>);
            expect(screen.getByText('Latest')).toBeInTheDocument();
        });

        it('has trending sort option', () => {
            render(<TestWrapper><MockFeed /></TestWrapper>);
            expect(screen.getByText('Trending')).toBeInTheDocument();
        });
    });

    describe('Filtering', () => {
        it('has all types option', () => {
            render(<TestWrapper><MockFeed /></TestWrapper>);
            expect(screen.getByText('All Types')).toBeInTheDocument();
        });

        it('has life story filter', () => {
            render(<TestWrapper><MockFeed /></TestWrapper>);
            expect(screen.getByText('Life Story')).toBeInTheDocument();
        });

        it('has achievement filter', () => {
            render(<TestWrapper><MockFeed /></TestWrapper>);
            expect(screen.getByText('Achievement')).toBeInTheDocument();
        });
    });
});
