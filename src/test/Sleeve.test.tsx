import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sleeve from '../components/Sleeve';
import { type PlateCount } from '../utils/loading';

const kgPlates: PlateCount[] = [
  { weight: 25, count: 2 },
  { weight: 5, count: 1 },
];

const lbPlates: PlateCount[] = [
  { weight: 45, count: 2 },
  { weight: 10, count: 1 },
];

describe('Sleeve', () => {
  it('renders with eleiko plates', () => {
    const { container } = render(<Sleeve plates={kgPlates} variant="eleiko" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders with iron plates', () => {
    const { container } = render(<Sleeve plates={lbPlates} variant="iron" />);
    expect(container.firstChild).not.toBeNull();
  });

  it('shows "No plates" when empty', () => {
    render(<Sleeve plates={[]} variant="eleiko" />);
    expect(screen.getByText('No plates')).toBeInTheDocument();
  });

  it('grounds the bar with a shelf line and contact shadow', () => {
    const { container } = render(<Sleeve plates={kgPlates} variant="eleiko" />);
    const [row, shelf, shadow] = [...container.firstElementChild!.firstElementChild!.children];
    expect(row.className).toContain('items-center');
    expect(shelf.className).toContain('bg-gradient-to-r');
    expect(shadow.className).toContain('bg-gradient-to-b');
  });

  it('paints the bar hardware from design tokens, not inline hex', () => {
    const { container } = render(<Sleeve plates={kgPlates} variant="eleiko" />);
    expect(container.querySelector('.bg-bar-collar')).not.toBeNull();
    expect(container.querySelector('.bg-bar-shaft')).not.toBeNull();
    expect(container.querySelector('.bg-bar-endcap')).not.toBeNull();
    for (const el of container.querySelectorAll('[style]')) {
      // Only the plates carry inline colour (the Eleiko colour standard)
      if (!el.className.includes('bg-')) continue;
      expect(el.getAttribute('style')).not.toMatch(/background-color/);
    }
  });

  it('butts the bar shaft against the first plate', () => {
    const { container } = render(<Sleeve plates={kgPlates} variant="eleiko" />);
    const [row] = [...container.firstElementChild!.firstElementChild!.children];
    expect(row.className).not.toMatch(/\bgap-/);
  });

  it('renders "No plates" at readable contrast', () => {
    render(<Sleeve plates={[]} variant="eleiko" />);
    expect(screen.getByText('No plates')).toHaveClass('text-zinc-400');
  });

  it('renders each plate instance individually (count=2 → two elements)', () => {
    const { container } = render(
      <Sleeve plates={[{ weight: 25, count: 2 }]} variant="eleiko" />,
    );
    const plateDivs = container.querySelectorAll('[style*="background-color: rgb(210, 39, 48)"]');
    expect(plateDivs).toHaveLength(2);
  });

  it('renders plates with count 0 as empty', () => {
    render(<Sleeve plates={[{ weight: 25, count: 0 }]} variant="eleiko" />);
    expect(screen.getByText('No plates')).toBeInTheDocument();
  });
});
