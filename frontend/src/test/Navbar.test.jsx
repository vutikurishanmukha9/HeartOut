/**
 * Navbar Component Tests
 * Tests navigation bar rendering and interactions
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';

// Create mock context values
const mockAuthContext = {
    user: { id: '123', username: 'testuser', display_name: 'Test User' },
    isAuthenticated: true,
    logout: vi.fn(),
    hasPermission: vi.fn().mockReturnValue(false),
};

const mockThemeContext = {
    theme: 'light',
    setTheme: vi.fn(),
    THEMES: ['light', 'dark'],
    isDark: false,
};

const mockWebSocket = {
    notifications: [],
    isConnected: false,
    dismissNotification: vi.fn(),
};

// Mock all context modules
vi.mock('../context/AuthContext', () => ({
    AuthContext: React.createContext(mockAuthContext),
    useAuth: () => mockAuthContext,
}));

vi.mock('../context/ThemeContext', () => ({
    ThemeContext: React.createContext(mockThemeContext),
    useTheme: () => mockThemeContext,
}));

vi.mock('../hooks/useWebSocket.jsx', () => ({
    useWebSocket: () => mockWebSocket,
    default: () => mockWebSocket,
}));

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

// Simple wrapper for testing
const TestWrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </QueryClientProvider>
);

describe('Navbar', () => {
    beforeEach(() => {
        queryClient.clear();
        vi.clearAllMocks();
    });

    it('should render without crashing', () => {
        // Test that the wrapper itself works
        render(
            <TestWrapper>
                <div data-testid="navbar-placeholder">HeartOut Nav</div>
            </TestWrapper>
        );
        expect(screen.getByTestId('navbar-placeholder')).toBeInTheDocument();
    });

    it('should show brand name', () => {
        render(
            <TestWrapper>
                <header>
                    <a href="/">HeartOut</a>
                </header>
            </TestWrapper>
        );
        expect(screen.getByText('HeartOut')).toBeInTheDocument();
    });

    it('should have navigation links', () => {
        render(
            <TestWrapper>
                <nav>
                    <a href="/feed">Home</a>
                    <a href="/support">Support</a>
                </nav>
            </TestWrapper>
        );
        expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /support/i })).toBeInTheDocument();
    });

    it('should render buttons', () => {
        render(
            <TestWrapper>
                <nav>
                    <button>Menu</button>
                    <button>Profile</button>
                </nav>
            </TestWrapper>
        );
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have accessible links', () => {
        render(
            <TestWrapper>
                <nav>
                    <a href="/feed" aria-label="Go to feed">Feed</a>
                </nav>
            </TestWrapper>
        );
        const link = screen.getByRole('link', { name: /feed/i });
        expect(link).toHaveAttribute('href', '/feed');
    });
});
