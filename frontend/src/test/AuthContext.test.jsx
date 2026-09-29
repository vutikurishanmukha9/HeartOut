/**
 * Authentication Context Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
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

// Mock sessionStorage
const sessionStorageMock = {
    store: {},
    getItem: vi.fn((key) => sessionStorageMock.store[key] || null),
    setItem: vi.fn((key, value) => { sessionStorageMock.store[key] = value; }),
    removeItem: vi.fn((key) => { delete sessionStorageMock.store[key]; }),
    clear: vi.fn(() => { sessionStorageMock.store = {}; })
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock, configurable: true, writable: true });
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock, configurable: true, writable: true });
try {
    globalThis.localStorage = localStorageMock;
    globalThis.sessionStorage = sessionStorageMock;
} catch {
    // Ignore in environments where globalThis storage is read-only
}

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
            <button
                data-testid="login-remember"
                onClick={async () => { await auth.login('test@example.com', 'pass123', true); }}
            >
                Login Remember
            </button>
            <button
                data-testid="login-session-only"
                onClick={async () => { await auth.login('test@example.com', 'pass123', false); }}
            >
                Login Session Only
            </button>
        </div>
    );
}

describe('AuthContext', () => {
    beforeEach(() => {
        localStorageMock.clear();
        sessionStorageMock.clear();
        global.fetch.mockReset();
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

    describe('Remember Device Session Persistence', () => {
        it('persists session in localStorage when rememberDevice is true', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({
                    message: 'Login successful',
                    access_token: 'fake-jwt-token-remember',
                    user: { username: 'testuser' }
                })
            });

            render(
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            );

            fireEvent.click(screen.getByTestId('login-remember'));

            await waitFor(() => {
                expect(localStorageMock.setItem).toHaveBeenCalledWith('has_session', 'true');
                expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', 'fake-jwt-token-remember');
                expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('has_session');
            });
        });

        it('stores session in sessionStorage when rememberDevice is false', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({
                    message: 'Login successful',
                    access_token: 'fake-jwt-token-session',
                    user: { username: 'sessionuser' }
                })
            });

            render(
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            );

            fireEvent.click(screen.getByTestId('login-session-only'));

            await waitFor(() => {
                expect(sessionStorageMock.setItem).toHaveBeenCalledWith('has_session', 'true');
                expect(sessionStorageMock.setItem).toHaveBeenCalledWith('access_token', 'fake-jwt-token-session');
                expect(localStorageMock.removeItem).toHaveBeenCalledWith('has_session');
            });
        });
    });
});
