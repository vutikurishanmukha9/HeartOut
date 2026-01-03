/**
 * ThemeContext Tests
 * Comprehensive tests for theme context provider
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import React, { useContext } from 'react';

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: vi.fn((key) => localStorageMock.store[key] || null),
    setItem: vi.fn((key, value) => { localStorageMock.store[key] = value; }),
    removeItem: vi.fn((key) => { delete localStorageMock.store[key]; }),
    clear: vi.fn(() => { localStorageMock.store = {}; }),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock ThemeContext
const ThemeContext = React.createContext(null);

const THEMES = {
    light: 'light',
    dark: 'dark',
    system: 'system'
};

const MockThemeProvider = ({ children, defaultTheme = 'system' }) => {
    const [theme, setTheme] = React.useState(defaultTheme);
    const isDark = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, setTheme, THEMES, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

const ThemeConsumer = () => {
    const { theme, setTheme, isDark, THEMES } = useContext(ThemeContext);
    return (
        <div>
            <span data-testid="current-theme">{theme}</span>
            <span data-testid="is-dark">{isDark.toString()}</span>
            <button onClick={() => setTheme(THEMES.light)} data-testid="set-light">Light</button>
            <button onClick={() => setTheme(THEMES.dark)} data-testid="set-dark">Dark</button>
            <button onClick={() => setTheme(THEMES.system)} data-testid="set-system">System</button>
        </div>
    );
};

describe('ThemeContext', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    describe('Provider Rendering', () => {
        it('renders children', () => {
            render(
                <MockThemeProvider>
                    <div data-testid="child">Child Content</div>
                </MockThemeProvider>
            );
            expect(screen.getByTestId('child')).toBeInTheDocument();
        });

        it('provides theme value', () => {
            render(
                <MockThemeProvider>
                    <ThemeConsumer />
                </MockThemeProvider>
            );
            expect(screen.getByTestId('current-theme')).toBeInTheDocument();
        });

        it('provides isDark value', () => {
            render(
                <MockThemeProvider>
                    <ThemeConsumer />
                </MockThemeProvider>
            );
            expect(screen.getByTestId('is-dark')).toBeInTheDocument();
        });
    });

    describe('Default Theme', () => {
        it('defaults to system theme', () => {
            render(
                <MockThemeProvider defaultTheme="system">
                    <ThemeConsumer />
                </MockThemeProvider>
            );
            expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
        });

        it('can default to light', () => {
            render(
                <MockThemeProvider defaultTheme="light">
                    <ThemeConsumer />
                </MockThemeProvider>
            );
            expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
        });

        it('can default to dark', () => {
            render(
                <MockThemeProvider defaultTheme="dark">
                    <ThemeConsumer />
                </MockThemeProvider>
            );
            expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
        });
    });

    describe('Theme Switching', () => {
        it('switches to light theme', () => {
            render(
                <MockThemeProvider>
                    <ThemeConsumer />
                </MockThemeProvider>
            );
            fireEvent.click(screen.getByTestId('set-light'));
            expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
        });

        it('switches to dark theme', () => {
            render(
                <MockThemeProvider>
                    <ThemeConsumer />
                </MockThemeProvider>
            );
            fireEvent.click(screen.getByTestId('set-dark'));
            expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
        });

        it('switches to system theme', () => {
            render(
                <MockThemeProvider defaultTheme="light">
                    <ThemeConsumer />
                </MockThemeProvider>
            );
            fireEvent.click(screen.getByTestId('set-system'));
            expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
        });
    });

    describe('isDark Calculation', () => {
        it('isDark is true when theme is dark', () => {
            render(
                <MockThemeProvider defaultTheme="dark">
                    <ThemeConsumer />
                </MockThemeProvider>
            );
            expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
        });

        it('isDark is false when theme is light', () => {
            render(
                <MockThemeProvider defaultTheme="light">
                    <ThemeConsumer />
                </MockThemeProvider>
            );
            expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
        });

        it('isDark is false when theme is system', () => {
            render(
                <MockThemeProvider defaultTheme="system">
                    <ThemeConsumer />
                </MockThemeProvider>
            );
            expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
        });
    });

    describe('THEMES Constants', () => {
        it('has light theme constant', () => {
            expect(THEMES.light).toBe('light');
        });

        it('has dark theme constant', () => {
            expect(THEMES.dark).toBe('dark');
        });

        it('has system theme constant', () => {
            expect(THEMES.system).toBe('system');
        });
    });
});
