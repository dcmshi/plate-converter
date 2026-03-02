import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Plate from '../components/Plate';

describe('Plate — Eleiko KG', () => {
  it('renders without crashing for a valid kg plate', () => {
    const { container } = render(<Plate weight={25} unit="kg" isEleiko={true} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders null for unknown weight', () => {
    const { container } = render(<Plate weight={999} unit="kg" isEleiko={true} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('Plate — Iron LB', () => {
  it('renders without crashing for a valid lb plate', () => {
    const { container } = render(<Plate weight={45} unit="lb" isEleiko={false} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders null for unknown lb weight', () => {
    const { container } = render(<Plate weight={999} unit="lb" isEleiko={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows weight label text', () => {
    render(<Plate weight={45} unit="lb" isEleiko={false} />);
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('shows 2.5 label for 2.5 lb plate', () => {
    render(<Plate weight={2.5} unit="lb" isEleiko={false} />);
    expect(screen.getByText('2.5')).toBeInTheDocument();
  });
});
