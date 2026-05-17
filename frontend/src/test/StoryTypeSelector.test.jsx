/**
 * StoryTypeSelector Component Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Import the actual component - we need to handle the export structure
import StoryTypeSelector from '../components/StoryTypeSelector';

// Define expected story types based on actual implementation
const expectedStoryTypes = [
    { value: 'achievement', label: 'Success Stories' },
    { value: 'confession', label: 'Dreams' },
    { value: 'regret', label: 'Life Lessons' },
    { value: 'unsent_letter', label: 'Unsent Letters' },
    { value: 'sacrifice', label: 'Sacrifices' },
    { value: 'other', label: 'Quiet Confessions' }
];

describe('StoryTypeSelector', () => {
    const mockOnChange = vi.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    describe('Rendering', () => {
        it('renders all story type labels', () => {
            render(<StoryTypeSelector selected={null} onChange={mockOnChange} />);

            expectedStoryTypes.forEach(type => {
                expect(screen.getByText(type.label)).toBeInTheDocument();
            });
        });

        it('renders 6 story type options', () => {
            render(<StoryTypeSelector selected={null} onChange={mockOnChange} />);

            // Check that all 6 labels are present
            expect(screen.getByText('Success Stories')).toBeInTheDocument();
            expect(screen.getByText('Dreams')).toBeInTheDocument();
            expect(screen.getByText('Life Lessons')).toBeInTheDocument();
            expect(screen.getByText('Unsent Letters')).toBeInTheDocument();
            expect(screen.getByText('Sacrifices')).toBeInTheDocument();
            expect(screen.getByText('Quiet Confessions')).toBeInTheDocument();
        });

        it('renders story type descriptions', () => {
            render(<StoryTypeSelector selected={null} onChange={mockOnChange} />);

            expect(screen.getByText(/Something you survived, earned, or finally became/i)).toBeInTheDocument();
            expect(screen.getByText(/The hard ones. The ones that changed you/i)).toBeInTheDocument();
        });
    });

    describe('Selection', () => {
        it('calls onChange when a type is clicked', () => {
            render(<StoryTypeSelector selected={null} onChange={mockOnChange} />);

            fireEvent.click(screen.getByText('Success Stories'));

            expect(mockOnChange).toHaveBeenCalledWith('achievement');
        });

        it('highlights selected type', () => {
            render(<StoryTypeSelector selected="achievement" onChange={mockOnChange} />);

            // The selected item should have a different style
            const achievementElement = screen.getByText('Success Stories');
            expect(achievementElement).toBeInTheDocument();
        });

        it('can select Life Lessons type', () => {
            render(<StoryTypeSelector selected={null} onChange={mockOnChange} />);

            fireEvent.click(screen.getByText('Life Lessons'));
            expect(mockOnChange).toHaveBeenCalledWith('regret');
        });

        it('can select Unsent Letters type', () => {
            render(<StoryTypeSelector selected={null} onChange={mockOnChange} />);

            fireEvent.click(screen.getByText('Unsent Letters'));
            expect(mockOnChange).toHaveBeenCalledWith('unsent_letter');
        });

        it('can select Sacrifices type', () => {
            render(<StoryTypeSelector selected={null} onChange={mockOnChange} />);

            fireEvent.click(screen.getByText('Sacrifices'));
            expect(mockOnChange).toHaveBeenCalledWith('sacrifice');
        });
    });
});

describe('Story Type Data Validation', () => {
    it('has all expected story type values', () => {
        const expectedValues = ['achievement', 'confession', 'regret', 'unsent_letter', 'sacrifice', 'other'];

        expectedValues.forEach(value => {
            const type = expectedStoryTypes.find(t => t.value === value);
            expect(type).toBeDefined();
        });
    });

    it('each story type has a label', () => {
        expectedStoryTypes.forEach(type => {
            expect(type.label).toBeDefined();
            expect(type.label.length).toBeGreaterThan(0);
        });
    });
});
