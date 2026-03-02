import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WeightInput from '../components/WeightInput';

describe('WeightInput', () => {
  it('renders the label', () => {
    render(<WeightInput value="100" unit="kg" onChange={() => {}} label="Kilograms" />);
    expect(screen.getByText('Kilograms')).toBeInTheDocument();
  });

  it('renders the unit', () => {
    render(<WeightInput value="100" unit="kg" onChange={() => {}} label="Kilograms" />);
    expect(screen.getByText('kg')).toBeInTheDocument();
  });

  it('renders the current value', () => {
    render(<WeightInput value="220.46" unit="lb" onChange={() => {}} label="Pounds" />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('220.46');
  });

  it('calls onChange when value changes', () => {
    const onChange = vi.fn();
    render(<WeightInput value="100" unit="kg" onChange={onChange} label="Kilograms" />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '150' } });
    expect(onChange).toHaveBeenCalledWith('150');
  });

  it('passes an empty string through to onChange', () => {
    const onChange = vi.fn();
    render(<WeightInput value="100" unit="kg" onChange={onChange} label="Kilograms" />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('clamps negative input to "0"', () => {
    const onChange = vi.fn();
    render(<WeightInput value="0" unit="kg" onChange={onChange} label="Kilograms" />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '-5' } });
    expect(onChange).toHaveBeenCalledWith('0');
  });

  it('passes large values through unchanged', () => {
    const onChange = vi.fn();
    render(<WeightInput value="0" unit="kg" onChange={onChange} label="Kilograms" />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '99999' } });
    expect(onChange).toHaveBeenCalledWith('99999');
  });

  it('shows a red border when the value prop is negative', () => {
    render(<WeightInput value="-5" unit="kg" onChange={() => {}} label="Kilograms" />);
    expect(screen.getByRole('spinbutton')).toHaveClass('border-red-500');
  });
});
