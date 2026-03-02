import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BarSelector from '../components/BarSelector';

describe('BarSelector', () => {
  it('renders both bar options with exact weights from constants', () => {
    render(<BarSelector activeBar="mens" onChange={() => {}} />);
    expect(screen.getByText("Men's 20 kg / 44.09 lb")).toBeInTheDocument();
    expect(screen.getByText("Women's 15 kg / 33.07 lb")).toBeInTheDocument();
  });

  it('calls onChange when a bar is clicked', () => {
    const onChange = vi.fn();
    render(<BarSelector activeBar="mens" onChange={onChange} />);
    fireEvent.click(screen.getByText("Women's 15 kg / 33.07 lb"));
    expect(onChange).toHaveBeenCalledWith('womens');
  });

  it('highlights the active bar', () => {
    render(<BarSelector activeBar="womens" onChange={() => {}} />);
    expect(screen.getByText("Women's 15 kg / 33.07 lb")).toHaveClass('bg-zinc-600');
  });

  it('does not highlight inactive bars', () => {
    render(<BarSelector activeBar="mens" onChange={() => {}} />);
    expect(screen.getByText("Women's 15 kg / 33.07 lb")).not.toHaveClass('bg-zinc-600');
  });
});
