import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SupportFloatingButton from '../components/SupportFloatingButton';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('SupportFloatingButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders closed trigger button initially', () => {
    renderWithRouter(<SupportFloatingButton />);
    const trigger = screen.getByRole('button', { name: /open support resources/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens support dialog panel when clicked', () => {
    renderWithRouter(<SupportFloatingButton />);
    const trigger = screen.getByRole('button', { name: /open support resources/i });
    fireEvent.click(trigger);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Immediate Support')).toBeInTheDocument();
    expect(screen.getByText('Tele MANAS')).toBeInTheDocument();
    expect(screen.getByText('iCall')).toBeInTheDocument();
  });

  it('closes panel when close button is clicked', () => {
    renderWithRouter(<SupportFloatingButton />);
    const trigger = screen.getByRole('button', { name: /open support resources/i });
    fireEvent.click(trigger);

    const closeBtn = screen.getByRole('button', { name: /close support panel/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes panel on Escape keydown', () => {
    renderWithRouter(<SupportFloatingButton />);
    const trigger = screen.getByRole('button', { name: /open support resources/i });
    fireEvent.click(trigger);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('provides a link to full support page', () => {
    renderWithRouter(<SupportFloatingButton />);
    const trigger = screen.getByRole('button', { name: /open support resources/i });
    fireEvent.click(trigger);

    const supportLink = screen.getByRole('link', {
      name: /explore all counseling & helplines/i,
    });
    expect(supportLink).toBeInTheDocument();
    expect(supportLink).toHaveAttribute('href', '/support');
  });
});
