/**
 * HelplineCard Component Tests
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelplineCard, helplines } from '../components/HelplineCard';

// Test wrapper with router
const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('HelplineCard', () => {
    const teleManas = helplines.find(h => h.id === 'telemanas');
    const icall = helplines.find(h => h.id === 'icall');

    describe('Full HelplineCard', () => {
        it('renders helpline name correctly', () => {
            renderWithRouter(<HelplineCard helpline={teleManas} />);
            expect(screen.getByText('Tele MANAS')).toBeInTheDocument();
        });

        it('renders description', () => {
            renderWithRouter(<HelplineCard helpline={teleManas} />);
            expect(screen.getByText(/Government of India/)).toBeInTheDocument();
        });

        it('renders phone number', () => {
            renderWithRouter(<HelplineCard helpline={teleManas} />);
            expect(screen.getByText(/14416/)).toBeInTheDocument();
        });

        it('renders toll-free number for Tele MANAS', () => {
            renderWithRouter(<HelplineCard helpline={teleManas} />);
            expect(screen.getByText(/1800-891-4416/)).toBeInTheDocument();
        });

        it('renders email for iCall', () => {
            renderWithRouter(<HelplineCard helpline={icall} />);
            expect(screen.getByText(/icall@tiss.edu/)).toBeInTheDocument();
        });

        it('renders availability', () => {
            renderWithRouter(<HelplineCard helpline={teleManas} />);
            expect(screen.getByText('24/7, Free')).toBeInTheDocument();
        });

        it('renders privacy note', () => {
            renderWithRouter(<HelplineCard helpline={teleManas} />);
            expect(screen.getByText(/confidential and anonymous/)).toBeInTheDocument();
        });

        it('has phone link with tel: protocol', () => {
            renderWithRouter(<HelplineCard helpline={teleManas} />);
            const phoneLink = screen.getByRole('link', { name: /Call 14416/ });
            expect(phoneLink).toHaveAttribute('href', 'tel:14416');
        });
    });

    describe('Compact HelplineCard', () => {
        it('renders in compact mode', () => {
            renderWithRouter(<HelplineCard helpline={teleManas} compact />);
            expect(screen.getByText('Tele MANAS')).toBeInTheDocument();
        });

        it('shows badge in compact mode', () => {
            renderWithRouter(<HelplineCard helpline={teleManas} compact />);
            expect(screen.getByText('Govt. of India')).toBeInTheDocument();
        });
    });
});

describe('helplines data', () => {
    it('contains Tele MANAS helpline', () => {
        const teleManas = helplines.find(h => h.id === 'telemanas');
        expect(teleManas).toBeDefined();
        expect(teleManas.phone).toBe('14416');
    });

    it('contains iCall helpline', () => {
        const icall = helplines.find(h => h.id === 'icall');
        expect(icall).toBeDefined();
        expect(icall.phone).toBe('9152987821');
    });

    it('all helplines have required fields', () => {
        helplines.forEach(helpline => {
            expect(helpline.id).toBeDefined();
            expect(helpline.name).toBeDefined();
            expect(helpline.phone).toBeDefined();
            expect(helpline.availability).toBeDefined();
        });
    });
});
