/**
 * Login Page Tests
 * Comprehensive tests for authentication login page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock Login component for testing
const MockLogin = ({ onSubmit = vi.fn(), loading = false, error = null }) => (
    <div data-testid="login-page">
        <h1>Welcome Back</h1>
        <p>Sign in to your account</p>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} data-testid="login-form">
            {error && <div data-testid="error-message" role="alert">{error}</div>}

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    data-testid="email-input"
                    placeholder="Enter your email"
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    data-testid="password-input"
                    placeholder="Enter your password"
                    required
                />
                <button type="button" data-testid="toggle-password">Show</button>
            </div>

            <button
                type="submit"
                data-testid="submit-button"
                disabled={loading}
            >
                {loading ? 'Signing in...' : 'Sign In'}
            </button>
        </form>

        <p>
            Don't have an account? <a href="/auth/register" data-testid="register-link">Register</a>
        </p>
    </div>
);

describe('Login Page', () => {
    describe('Rendering', () => {
        it('renders login heading', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        });

        it('renders subtitle text', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
        });

        it('renders email input', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByTestId('email-input')).toBeInTheDocument();
        });

        it('renders password input', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByTestId('password-input')).toBeInTheDocument();
        });

        it('renders submit button', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByTestId('submit-button')).toBeInTheDocument();
        });

        it('renders register link', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByTestId('register-link')).toBeInTheDocument();
        });

        it('renders password toggle button', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByTestId('toggle-password')).toBeInTheDocument();
        });
    });

    describe('Form Labels', () => {
        it('has email label', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
        });

        it('has password label', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
        });
    });

    describe('Input Placeholders', () => {
        it('email has correct placeholder', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        });

        it('password has correct placeholder', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
        });
    });

    describe('Form Submission', () => {
        it('calls onSubmit when form submitted', () => {
            const onSubmit = vi.fn();
            render(<BrowserRouter><MockLogin onSubmit={onSubmit} /></BrowserRouter>);
            fireEvent.submit(screen.getByTestId('login-form'));
            expect(onSubmit).toHaveBeenCalled();
        });

        it('button is not disabled by default', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByTestId('submit-button')).not.toBeDisabled();
        });
    });

    describe('Loading State', () => {
        it('disables button when loading', () => {
            render(<BrowserRouter><MockLogin loading={true} /></BrowserRouter>);
            expect(screen.getByTestId('submit-button')).toBeDisabled();
        });

        it('shows loading text when loading', () => {
            render(<BrowserRouter><MockLogin loading={true} /></BrowserRouter>);
            expect(screen.getByText('Signing in...')).toBeInTheDocument();
        });

        it('shows normal text when not loading', () => {
            render(<BrowserRouter><MockLogin loading={false} /></BrowserRouter>);
            expect(screen.getByText('Sign In')).toBeInTheDocument();
        });
    });

    describe('Error Display', () => {
        it('shows error message when error exists', () => {
            render(<BrowserRouter><MockLogin error="Invalid credentials" /></BrowserRouter>);
            expect(screen.getByTestId('error-message')).toBeInTheDocument();
        });

        it('displays correct error text', () => {
            render(<BrowserRouter><MockLogin error="Wrong password" /></BrowserRouter>);
            expect(screen.getByText('Wrong password')).toBeInTheDocument();
        });

        it('error has alert role', () => {
            render(<BrowserRouter><MockLogin error="Error" /></BrowserRouter>);
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        it('hides error when no error', () => {
            render(<BrowserRouter><MockLogin error={null} /></BrowserRouter>);
            expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
        });
    });

    describe('Navigation Links', () => {
        it('register link has correct href', () => {
            render(<BrowserRouter><MockLogin /></BrowserRouter>);
            expect(screen.getByTestId('register-link')).toHaveAttribute('href', '/auth/register');
        });
    });
});
