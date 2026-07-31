import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Plate from '../components/Plate';
import { LB_PLATES, LB_PLATE_HEIGHT, scaled } from '../utils/constants';

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

describe('Plate — responsive scaling', () => {
  it('multiplies kg plate dimensions by --plate-scale', () => {
    const { container } = render(<Plate weight={25} variant="eleiko" />);
    const el = container.firstElementChild as HTMLElement;
    // 25 kg bumper: 160px tall, 22px thick
    expect(el.style.height).toBe('calc(160px * var(--plate-scale))');
    expect(el.style.width).toBe('calc(22px * var(--plate-scale))');
  });

  it('multiplies iron plate dimensions by --plate-scale', () => {
    const { container } = render(<Plate weight={2.5} variant="iron" />);
    const el = container.firstElementChild as HTMLElement;
    // 2.5 lb: 70px tall, 8px thick
    expect(el.style.height).toBe('calc(70px * var(--plate-scale))');
    expect(el.style.width).toBe('calc(8px * var(--plate-scale))');
  });

  it('scaled() builds a calc expression', () => {
    expect(scaled(90)).toBe('calc(90px * var(--plate-scale))');
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
      expect((container.firstElementChild as HTMLElement).style.height).toBe(
        scaled(LB_PLATE_HEIGHT[size]),
      );
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
