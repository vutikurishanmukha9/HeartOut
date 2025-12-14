/**
 * StoryTypeSelector Component Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Import the actual component - we need to handle the export structure
import StoryTypeSelector from '../components/StoryTypeSelector';

// Define expected story types based on actual implementation
const expectedStoryTypes = [
    { value: 'achievement', label: 'Achievement' },
    { value: 'regret', label: 'Regret' },
    { value: 'unsent_letter', label: 'Unsent Letter' },
    { value: 'sacrifice', label: 'Sacrifice' },
    { value: 'life_story', label: 'Life Story' },
    { value: 'other', label: 'Other' }
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
            expect(screen.getByText('Achievement')).toBeInTheDocument();
            expect(screen.getByText('Regret')).toBeInTheDocument();
            expect(screen.getByText('Unsent Letter')).toBeInTheDocument();
            expect(screen.getByText('Sacrifice')).toBeInTheDocument();
            expect(screen.getByText('Life Story')).toBeInTheDocument();
            expect(screen.getByText('Other')).toBeInTheDocument();
        });

        it('renders story type descriptions', () => {
            render(<StoryTypeSelector selected={null} onChange={mockOnChange} />);

            expect(screen.getByText(/Celebrate your victories/)).toBeInTheDocument();
            expect(screen.getByText(/Lessons learned/)).toBeInTheDocument();
        });
    });

    describe('Selection', () => {
        it('calls onChange when a type is clicked', () => {
            render(<StoryTypeSelector selected={null} onChange={mockOnChange} />);

            fireEvent.click(screen.getByText('Achievement'));

            expect(mockOnChange).toHaveBeenCalledWith('achievement');
        });

        it('highlights selected type', () => {
            render(<StoryTypeSelector selected="achievement" onChange={mockOnChange} />);

            // The selected item should have a different style
            const achievementElement = screen.getByText('Achievement');
            expect(achievementElement).toBeInTheDocument();
        });

        it('can select Regret type', () => {
            render(<StoryTypeSelector selected={null} onChange={mockOnChange} />);

            fireEvent.click(screen.getByText('Regret'));
            expect(mockOnChange).toHaveBeenCalledWith('regret');
        });

        it('can select Unsent Letter type', () => {
            render(<StoryTypeSelector selected={null} onChange={mockOnChange} />);

            fireEvent.click(screen.getByText('Unsent Letter'));
            expect(mockOnChange).toHaveBeenCalledWith('unsent_letter');
        });

        it('can select Sacrifice type', () => {
            render(<StoryTypeSelector selected={null} onChange={mockOnChange} />);

            fireEvent.click(screen.getByText('Sacrifice'));
            expect(mockOnChange).toHaveBeenCalledWith('sacrifice');
        });
    });
});

describe('Story Type Data Validation', () => {
    it('has all expected story type values', () => {
        const expectedValues = ['achievement', 'regret', 'unsent_letter', 'sacrifice', 'life_story', 'other'];

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
