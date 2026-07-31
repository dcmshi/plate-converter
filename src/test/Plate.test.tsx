import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Plate from '../components/Plate';
import { LB_PLATES, LB_PLATE_HEIGHT } from '../utils/constants';

describe('Plate — eleiko variant', () => {
  it('renders without crashing for a valid kg plate', () => {
    const { container } = render(<Plate weight={25} variant="eleiko" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders null for unknown weight', () => {
    const { container } = render(<Plate weight={999} variant="eleiko" />);
    expect(container.firstChild).toBeNull();
  });
});

describe('Plate — iron variant', () => {
  it('renders without crashing for a valid lb plate', () => {
    const { container } = render(<Plate weight={45} variant="iron" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders null for unknown lb weight', () => {
    const { container } = render(<Plate weight={999} variant="iron" />);
    expect(container.firstChild).toBeNull();
  });

  it('paints iron plates from the plate tokens', () => {
    const { container } = render(<Plate weight={45} variant="iron" />);
    expect(container.firstElementChild).toHaveClass('bg-plate-iron', 'border-plate-rim');
    expect(screen.getByText('45')).toHaveClass('text-plate-label');
  });

  it('carries no inline colour for iron plates', () => {
    const { container } = render(<Plate weight={25} variant="iron" />);
    expect(container.firstElementChild!.getAttribute('style')).not.toMatch(/color/);
  });

  it('sizes each iron plate from its size band', () => {
    for (const { weight, size } of LB_PLATES) {
      const { container, unmount } = render(<Plate weight={weight} variant="iron" />);
      expect(container.firstElementChild).toHaveStyle({ height: `${LB_PLATE_HEIGHT[size]}px` });
      unmount();
    }
  });

  it('shows weight label text', () => {
    render(<Plate weight={45} variant="iron" />);
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('shows 2.5 label for 2.5 lb plate', () => {
    render(<Plate weight={2.5} variant="iron" />);
    expect(screen.getByText('2.5')).toBeInTheDocument();
  });
});
