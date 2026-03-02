import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BarSelector from '../components/BarSelector';

describe('BarSelector', () => {
  it('renders all three bar options', () => {
    render(<BarSelector activeBar="mens" onChange={() => {}} />);
    expect(screen.getByText("Men's 20 kg")).toBeInTheDocument();
    expect(screen.getByText("Women's 15 kg")).toBeInTheDocument();
    expect(screen.getByText('Iron 45 lb')).toBeInTheDocument();
  });

  it('calls onChange when a bar is clicked', () => {
    const onChange = vi.fn();
    render(<BarSelector activeBar="mens" onChange={onChange} />);
    fireEvent.click(screen.getByText("Women's 15 kg"));
    expect(onChange).toHaveBeenCalledWith('womens');
  });

  it('highlights the active bar', () => {
    render(<BarSelector activeBar="womens" onChange={() => {}} />);
    const womensBtn = screen.getByText("Women's 15 kg");
    expect(womensBtn).toHaveClass('bg-zinc-600');
  });

  it('does not highlight inactive bars', () => {
    render(<BarSelector activeBar="mens" onChange={() => {}} />);
    const womensBtn = screen.getByText("Women's 15 kg");
    expect(womensBtn).not.toHaveClass('bg-zinc-600');
  });
});
