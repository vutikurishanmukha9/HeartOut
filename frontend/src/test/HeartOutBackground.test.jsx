import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import HeartOutBackground from '../components/HeartOutBackground';

describe('HeartOutBackground', () => {
  it('renders decorative background with aria-hidden="true"', () => {
    const { container } = render(<HeartOutBackground />);
    const root = container.firstChild;

    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root.className).toContain('pointer-events-none');
    expect(root.className).toContain('fixed');
  });

  it('renders architectural coordinate grid and SVG contours', () => {
    const { container } = render(<HeartOutBackground />);
    const svgs = container.querySelectorAll('svg');

    expect(svgs.length).toBeGreaterThanOrEqual(3);
    const pattern = container.querySelector('#sanctuary-grid');
    expect(pattern).toBeInTheDocument();
  });

  it('contains ambient vignette layers', () => {
    const { container } = render(<HeartOutBackground />);
    const vignetteElements = container.querySelectorAll('[style*="radial-gradient"]');

    expect(vignetteElements.length).toBeGreaterThanOrEqual(3);
  });
});
