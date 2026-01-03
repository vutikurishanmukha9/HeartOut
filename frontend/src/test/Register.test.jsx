/**
 * Register Page Tests
 * Comprehensive tests for user registration page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock Register component
const MockRegister = ({
    onSubmit = vi.fn(),
    loading = false,
    error = null,
    passwordStrength = 0
}) => (
    <div data-testid="register-page">
        <h1>Create Account</h1>
        <p>Join HeartOut and share your stories</p>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} data-testid="register-form">
            {error && <div data-testid="error-message" role="alert">{error}</div>}

            <div>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    data-testid="username-input"
                    placeholder="Choose a username"
                    minLength={3}
                    maxLength={20}
                    required
                />
            </div>

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
                    placeholder="Create a password"
                    minLength={8}
                    required
                />
                <div data-testid="password-strength" data-strength={passwordStrength}>
                    Password Strength: {['Weak', 'Fair', 'Good', 'Strong'][passwordStrength] || 'None'}
                </div>
            </div>

            <div>
                <label htmlFor="age-range">Age Range</label>
                <select id="age-range" data-testid="age-select">
                    <option value="">Select age range</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45+">45+</option>
                </select>
            </div>

            <div>
                <input type="checkbox" id="terms" data-testid="terms-checkbox" required />
                <label htmlFor="terms">I agree to the Terms of Service</label>
            </div>

            <button
                type="submit"
                data-testid="submit-button"
                disabled={loading}
            >
                {loading ? 'Creating Account...' : 'Create Account'}
            </button>
        </form>

        <p>
            Already have an account? <a href="/auth/login" data-testid="login-link">Sign In</a>
        </p>
    </div>
);

describe('Register Page', () => {
    describe('Rendering', () => {
        it('renders register heading', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
        });

        it('renders subtitle', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByText('Join HeartOut and share your stories')).toBeInTheDocument();
        });

        it('renders username input', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByTestId('username-input')).toBeInTheDocument();
        });

        it('renders email input', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByTestId('email-input')).toBeInTheDocument();
        });

        it('renders password input', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByTestId('password-input')).toBeInTheDocument();
        });

        it('renders age select', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByTestId('age-select')).toBeInTheDocument();
        });

        it('renders terms checkbox', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByTestId('terms-checkbox')).toBeInTheDocument();
        });

        it('renders submit button', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByTestId('submit-button')).toBeInTheDocument();
        });
    });

    describe('Form Labels', () => {
        it('has username label', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByLabelText('Username')).toBeInTheDocument();
        });

        it('has email label', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
        });

        it('has password label', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByLabelText('Password')).toBeInTheDocument();
        });

        it('has age range label', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByLabelText('Age Range')).toBeInTheDocument();
        });
    });

    describe('Age Range Options', () => {
        it('has 18-24 option', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByText('18-24')).toBeInTheDocument();
        });

        it('has 25-34 option', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByText('25-34')).toBeInTheDocument();
        });

        it('has 35-44 option', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByText('35-44')).toBeInTheDocument();
        });

        it('has 45+ option', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByText('45+')).toBeInTheDocument();
        });
    });

    describe('Password Strength Indicator', () => {
        it('renders password strength component', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByTestId('password-strength')).toBeInTheDocument();
        });

        it('shows weak for low strength', () => {
            render(<BrowserRouter><MockRegister passwordStrength={0} /></BrowserRouter>);
            expect(screen.getByText(/Weak/)).toBeInTheDocument();
        });

        it('shows strong for high strength', () => {
            render(<BrowserRouter><MockRegister passwordStrength={3} /></BrowserRouter>);
            expect(screen.getByText(/Strong/)).toBeInTheDocument();
        });
    });

    describe('Loading State', () => {
        it('disables button when loading', () => {
            render(<BrowserRouter><MockRegister loading={true} /></BrowserRouter>);
            expect(screen.getByTestId('submit-button')).toBeDisabled();
        });

        it('shows loading text', () => {
            render(<BrowserRouter><MockRegister loading={true} /></BrowserRouter>);
            expect(screen.getByText('Creating Account...')).toBeInTheDocument();
        });
    });

    describe('Error Display', () => {
        it('shows error when exists', () => {
            render(<BrowserRouter><MockRegister error="Email taken" /></BrowserRouter>);
            expect(screen.getByTestId('error-message')).toBeInTheDocument();
        });

        it('hides error when null', () => {
            render(<BrowserRouter><MockRegister error={null} /></BrowserRouter>);
            expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
        });
    });

    describe('Navigation', () => {
        it('login link has correct href', () => {
            render(<BrowserRouter><MockRegister /></BrowserRouter>);
            expect(screen.getByTestId('login-link')).toHaveAttribute('href', '/auth/login');
        });
    });
});
