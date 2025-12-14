/**
 * Authentication Context Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: vi.fn((key) => localStorageMock.store[key] || null),
    setItem: vi.fn((key, value) => { localStorageMock.store[key] = value; }),
    removeItem: vi.fn((key) => { delete localStorageMock.store[key]; }),
    clear: vi.fn(() => { localStorageMock.store = {}; })
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = vi.fn();

// Test component to access context
function TestConsumer() {
    const auth = useContext(AuthContext);

    if (!auth) {
        return <div data-testid="no-context">No context</div>;
    }

    return (
        <div>
            <span data-testid="loading">{auth.loading.toString()}</span>
            <span data-testid="authenticated">{auth.isAuthenticated.toString()}</span>
            <span data-testid="username">{auth.user?.username || 'none'}</span>
            <span data-testid="has-login">{typeof auth.login === 'function' ? 'yes' : 'no'}</span>
            <span data-testid="has-logout">{typeof auth.logout === 'function' ? 'yes' : 'no'}</span>
            <span data-testid="has-register">{typeof auth.register === 'function' ? 'yes' : 'no'}</span>
        </div>
    );
}

describe('AuthContext', () => {
    beforeEach(() => {
        localStorageMock.clear();
        global.fetch.mockClear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Provider Setup', () => {
        it('provides context to children', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ error: 'Unauthorized' })
            });

            render(
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('loading')).toBeInTheDocument();
            });
        });

        it('provides login function', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ error: 'Unauthorized' })
            });

            render(
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('has-login').textContent).toBe('yes');
            });
        });

        it('provides logout function', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ error: 'Unauthorized' })
            });

            render(
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('has-logout').textContent).toBe('yes');
            });
        });

        it('provides register function', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ error: 'Unauthorized' })
            });

            render(
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('has-register').textContent).toBe('yes');
            });
        });
    });

    describe('Authentication State', () => {
        it('starts unauthenticated when no token', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ error: 'Unauthorized' })
            });

            render(
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('authenticated').textContent).toBe('false');
            });
        });

        it('sets loading to false after initialization', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ error: 'Unauthorized' })
            });

            render(
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('loading').textContent).toBe('false');
            });
        });

        it('shows no username when not authenticated', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ error: 'Unauthorized' })
            });

            render(
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            );

            await waitFor(() => {
                expect(screen.getByTestId('username').textContent).toBe('none');
            });
        });
    });
});
