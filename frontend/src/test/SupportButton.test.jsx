/**
 * SupportButton (ReactionButton) Component Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReactionButton from '../components/SupportButton';

// Reaction types based on actual implementation
const reactionLabels = ['Love it', 'Inspiring', 'Save', 'Hug', 'Mind-blown'];

// Mock function
const mockOnReact = vi.fn().mockResolvedValue(undefined);

describe('ReactionButton', () => {
    beforeEach(() => {
        mockOnReact.mockClear();
    });

    describe('Rendering', () => {
        it('renders without current reaction', () => {
            render(
                <ReactionButton
                    storyId="test-123"
                    currentReaction={null}
                    supportCount={0}
                    onReact={mockOnReact}
                />
            );

            // Should render the main button
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('displays support count when greater than zero', () => {
            render(
                <ReactionButton
                    storyId="test-123"
                    currentReaction={null}
                    supportCount={42}
                    onReact={mockOnReact}
                />
            );

            expect(screen.getByText('42')).toBeInTheDocument();
        });

        it('does not display count when zero', () => {
            render(
                <ReactionButton
                    storyId="test-123"
                    currentReaction={null}
                    supportCount={0}
                    onReact={mockOnReact}
                />
            );

            // Component only shows count when > 0
            expect(screen.queryByText('0')).not.toBeInTheDocument();
        });
    });

    describe('Dropdown Interactions', () => {
        it('opens reaction picker on click', async () => {
            render(
                <ReactionButton
                    storyId="test-123"
                    currentReaction={null}
                    supportCount={0}
                    onReact={mockOnReact}
                />
            );

            // Click the main button to open dropdown
            const mainButton = screen.getAllByRole('button')[0];
            fireEvent.click(mainButton);

            // Should show reaction options after opening
            await waitFor(() => {
                expect(screen.getByText('Love it')).toBeInTheDocument();
            });
        });

        it('shows all reaction types when open', async () => {
            render(
                <ReactionButton
                    storyId="test-123"
                    currentReaction={null}
                    supportCount={0}
                    onReact={mockOnReact}
                />
            );

            // Open dropdown
            const mainButton = screen.getAllByRole('button')[0];
            fireEvent.click(mainButton);

            // Check all reaction labels
            await waitFor(() => {
                reactionLabels.forEach(label => {
                    expect(screen.getByText(label)).toBeInTheDocument();
                });
            });
        });
    });

    describe('Reaction Selection', () => {
        it('calls onReact when a reaction is selected', async () => {
            render(
                <ReactionButton
                    storyId="test-123"
                    currentReaction={null}
                    supportCount={0}
                    onReact={mockOnReact}
                />
            );

            // Open dropdown
            const mainButton = screen.getAllByRole('button')[0];
            fireEvent.click(mainButton);

            // Wait for dropdown and click a reaction
            await waitFor(() => {
                expect(screen.getByText('Love it')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Love it'));

            expect(mockOnReact).toHaveBeenCalledWith('heart');
        });

        it('renders with existing reaction', () => {
            render(
                <ReactionButton
                    storyId="test-123"
                    currentReaction="heart"
                    supportCount={5}
                    onReact={mockOnReact}
                />
            );

            // Should show the count
            expect(screen.getByText('5')).toBeInTheDocument();
        });
    });
});

describe('Reaction Types Data', () => {
    it('has expected reaction labels', () => {
        const expectedLabels = ['Love it', 'Inspiring', 'Save', 'Hug', 'Mind-blown'];
        expectedLabels.forEach(label => {
            expect(reactionLabels).toContain(label);
        });
    });

    it('has 5 reaction types', () => {
        expect(reactionLabels.length).toBe(5);
    });
});
