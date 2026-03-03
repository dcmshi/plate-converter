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

  it('passes "0" through to onChange', () => {
    const onChange = vi.fn();
    render(<WeightInput value="100" unit="kg" onChange={onChange} label="Kilograms" />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '0' } });
    expect(onChange).toHaveBeenCalledWith('0');
  });

  it('clamps negative input to "0"', () => {
    const onChange = vi.fn();
    render(<WeightInput value="0" unit="kg" onChange={onChange} label="Kilograms" />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '-5' } });
    expect(onChange).toHaveBeenCalledWith('0');
  });

  it('clamps values over the kg max (500) to "500"', () => {
    const onChange = vi.fn();
    render(<WeightInput value="0" unit="kg" onChange={onChange} label="Kilograms" />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '99999' } });
    expect(onChange).toHaveBeenCalledWith('500');
  });

  it('clamps values over the lb max (1100) to "1100"', () => {
    const onChange = vi.fn();
    render(<WeightInput value="0" unit="lb" onChange={onChange} label="Pounds" />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '99999' } });
    expect(onChange).toHaveBeenCalledWith('1100');
  });

  it('shows a red border when the value prop is negative', () => {
    render(<WeightInput value="-5" unit="kg" onChange={() => {}} label="Kilograms" />);
    expect(screen.getByRole('spinbutton')).toHaveClass('border-red-500');
  });
});

describe('WeightInput — keyboard increment', () => {
  it('ArrowUp increments kg by 0.5', () => {
    const onChange = vi.fn();
    render(<WeightInput value="100" unit="kg" onChange={onChange} label="Kilograms" />);
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith('100.5');
  });

  it('ArrowDown decrements kg by 0.5', () => {
    const onChange = vi.fn();
    render(<WeightInput value="100" unit="kg" onChange={onChange} label="Kilograms" />);
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith('99.5');
  });

  it('ArrowUp increments lb by 2.5', () => {
    const onChange = vi.fn();
    render(<WeightInput value="225" unit="lb" onChange={onChange} label="Pounds" />);
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith('227.5');
  });

  it('ArrowDown decrements lb by 2.5', () => {
    const onChange = vi.fn();
    render(<WeightInput value="225" unit="lb" onChange={onChange} label="Pounds" />);
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith('222.5');
  });

  it('ArrowDown clamps to 0', () => {
    const onChange = vi.fn();
    render(<WeightInput value="0.5" unit="kg" onChange={onChange} label="Kilograms" />);
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith('0');
  });

  it('ArrowUp clamps to max (500 kg)', () => {
    const onChange = vi.fn();
    render(<WeightInput value="500" unit="kg" onChange={onChange} label="Kilograms" />);
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith('500');
  });

  it('other keys are ignored', () => {
    const onChange = vi.fn();
    render(<WeightInput value="100" unit="kg" onChange={onChange} label="Kilograms" />);
    fireEvent.keyDown(screen.getByRole('spinbutton'), { key: 'Enter' });
    expect(onChange).not.toHaveBeenCalled();
  });
});
