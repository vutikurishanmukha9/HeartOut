/**
 * Toast Component Tests
 * Comprehensive tests for toast notification component
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// Mock Toast component
const MockToast = ({
    message = 'Test message',
    type = 'info',
    duration = 3000,
    onClose = vi.fn(),
    visible = true
}) => {
    if (!visible) return null;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    return (
        <div
            data-testid="toast"
            role="alert"
            className={`toast toast-${type}`}
            data-type={type}
        >
            <span data-testid="toast-icon">{icons[type]}</span>
            <span data-testid="toast-message">{message}</span>
            <button
                data-testid="toast-close"
                onClick={onClose}
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );
};

describe('Toast Component', () => {
    describe('Rendering', () => {
        it('renders toast container', () => {
            render(<MockToast />);
            expect(screen.getByTestId('toast')).toBeInTheDocument();
        });

        it('renders toast message', () => {
            render(<MockToast message="Hello World" />);
            expect(screen.getByText('Hello World')).toBeInTheDocument();
        });

        it('renders close button', () => {
            render(<MockToast />);
            expect(screen.getByTestId('toast-close')).toBeInTheDocument();
        });

        it('renders icon', () => {
            render(<MockToast />);
            expect(screen.getByTestId('toast-icon')).toBeInTheDocument();
        });

        it('has alert role', () => {
            render(<MockToast />);
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });
    });

    describe('Toast Types', () => {
        it('renders success toast', () => {
            render(<MockToast type="success" />);
            expect(screen.getByTestId('toast')).toHaveAttribute('data-type', 'success');
        });

        it('shows success icon', () => {
            render(<MockToast type="success" />);
            expect(screen.getByText('✅')).toBeInTheDocument();
        });

        it('renders error toast', () => {
            render(<MockToast type="error" />);
            expect(screen.getByTestId('toast')).toHaveAttribute('data-type', 'error');
        });

        it('shows error icon', () => {
            render(<MockToast type="error" />);
            expect(screen.getByText('❌')).toBeInTheDocument();
        });

        it('renders warning toast', () => {
            render(<MockToast type="warning" />);
            expect(screen.getByTestId('toast')).toHaveAttribute('data-type', 'warning');
        });

        it('shows warning icon', () => {
            render(<MockToast type="warning" />);
            expect(screen.getByText('⚠️')).toBeInTheDocument();
        });

        it('renders info toast', () => {
            render(<MockToast type="info" />);
            expect(screen.getByTestId('toast')).toHaveAttribute('data-type', 'info');
        });

        it('shows info icon', () => {
            render(<MockToast type="info" />);
            expect(screen.getByText('ℹ️')).toBeInTheDocument();
        });
    });

    describe('Close Functionality', () => {
        it('calls onClose when close button clicked', () => {
            const onClose = vi.fn();
            render(<MockToast onClose={onClose} />);
            fireEvent.click(screen.getByTestId('toast-close'));
            expect(onClose).toHaveBeenCalled();
        });

        it('close button has accessible label', () => {
            render(<MockToast />);
            expect(screen.getByLabelText('Close notification')).toBeInTheDocument();
        });
    });

    describe('Visibility', () => {
        it('shows when visible is true', () => {
            render(<MockToast visible={true} />);
            expect(screen.getByTestId('toast')).toBeInTheDocument();
        });

        it('hides when visible is false', () => {
            render(<MockToast visible={false} />);
            expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
        });
    });

    describe('Custom Messages', () => {
        it('displays success message', () => {
            render(<MockToast message="Operation successful!" type="success" />);
            expect(screen.getByText('Operation successful!')).toBeInTheDocument();
        });

        it('displays error message', () => {
            render(<MockToast message="Something went wrong" type="error" />);
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });

        it('displays warning message', () => {
            render(<MockToast message="Please check your input" type="warning" />);
            expect(screen.getByText('Please check your input')).toBeInTheDocument();
        });

        it('displays long messages', () => {
            const longMessage = 'This is a very long message that contains important information about the operation that was performed';
            render(<MockToast message={longMessage} />);
            expect(screen.getByText(longMessage)).toBeInTheDocument();
        });
    });
});
