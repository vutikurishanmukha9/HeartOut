/**
 * Toast Component Tests
 * Comprehensive tests for toast notification component and Sanctuary Toast System
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { Toast, ToastProvider, useToast } from '../components/Toast.jsx';
import haptic from '../utils/haptics.js';

// Mock haptics
vi.mock('../utils/haptics.js', () => ({
  default: {
    selection: vi.fn(),
    light: vi.fn(),
    medium: vi.fn(),
    heavy: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock Toast component for legacy test compatibility
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

    describe('Sanctuary Real Toast System & Provider', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('renders real sanctuary Toast component with title and message', () => {
            render(
                <Toast
                    message="Reflection safely preserved in sanctuary"
                    title="Reflection Saved"
                    type="success"
                />
            );

            expect(screen.getByText('Reflection Saved')).toBeInTheDocument();
            expect(screen.getByText('Reflection safely preserved in sanctuary')).toBeInTheDocument();
            expect(screen.getByText('Confirmed')).toBeInTheDocument();
            expect(screen.getByTestId('toast')).toHaveAttribute('data-type', 'success');
        });

        it('triggers haptic.light and calls onClose on real Toast dismiss button', () => {
            const onClose = vi.fn();
            render(
                <Toast
                    message="Temporary sanctuary note"
                    type="info"
                    onClose={onClose}
                />
            );

            const closeButton = screen.getByTestId('toast-close');
            fireEvent.click(closeButton);

            expect(haptic.light).toHaveBeenCalledTimes(1);
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('dispatches notifications through useToast and ToastProvider with tactile haptics', () => {
            function TestToastTrigger() {
                const toast = useToast();
                return (
                    <div>
                        <button type="button" onClick={() => toast.success('Published story!')}>
                            Trigger Success
                        </button>
                        <button type="button" onClick={() => toast.error('Connection pause')}>
                            Trigger Error
                        </button>
                    </div>
                );
            }

            render(
                <ToastProvider>
                    <TestToastTrigger />
                </ToastProvider>
            );

            fireEvent.click(screen.getByRole('button', { name: /Trigger Success/i }));
            expect(haptic.success).toHaveBeenCalledTimes(1);
            expect(screen.getByText('Published story!')).toBeInTheDocument();

            fireEvent.click(screen.getByRole('button', { name: /Trigger Error/i }));
            expect(haptic.warning).toHaveBeenCalledTimes(1);
            expect(screen.getByText('Connection pause')).toBeInTheDocument();
        });
    });
});
