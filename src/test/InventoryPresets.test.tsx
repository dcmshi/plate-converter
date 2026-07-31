import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InventoryPresets from '../components/InventoryPresets';

afterEach(() => {
  window.localStorage.clear();
});

const enabled = new Set([25, 20, 15]);

describe('InventoryPresets', () => {
  it('renders the name input and a disabled Save button when the name is empty', () => {
    render(<InventoryPresets unit="kg" enabled={enabled} onApply={() => {}} />);
    expect(screen.getByLabelText('Preset name (kg)')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeDisabled();
  });

  it('saves the current inventory under the entered name', () => {
    render(<InventoryPresets unit="kg" enabled={enabled} onApply={() => {}} />);
    fireEvent.change(screen.getByLabelText('Preset name (kg)'), { target: { value: 'Home gym' } });
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByRole('button', { name: 'Apply preset Home gym' })).toBeInTheDocument();
    const stored = JSON.parse(window.localStorage.getItem('plate-converter:presets:kg')!);
    expect(stored['Home gym']).toEqual([25, 20, 15]);
  });

  it('clears the name input after saving', () => {
    render(<InventoryPresets unit="kg" enabled={enabled} onApply={() => {}} />);
    const input = screen.getByLabelText('Preset name (kg)') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Home gym' } });
    fireEvent.click(screen.getByText('Save'));
    expect(input.value).toBe('');
  });

  it('saves on Enter key', () => {
    render(<InventoryPresets unit="kg" enabled={enabled} onApply={() => {}} />);
    const input = screen.getByLabelText('Preset name (kg)');
    fireEvent.change(input, { target: { value: 'Comp' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByRole('button', { name: 'Apply preset Comp' })).toBeInTheDocument();
  });

  it('does not save a whitespace-only name', () => {
    render(<InventoryPresets unit="kg" enabled={enabled} onApply={() => {}} />);
    const input = screen.getByLabelText('Preset name (kg)');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(window.localStorage.getItem('plate-converter:presets:kg')).toBeNull();
  });

  it('calls onApply with the preset weights when a preset chip is clicked', () => {
    window.localStorage.setItem('plate-converter:presets:kg', JSON.stringify({ 'Home gym': [25, 10] }));
    const onApply = vi.fn();
    render(<InventoryPresets unit="kg" enabled={enabled} onApply={onApply} />);
    fireEvent.click(screen.getByRole('button', { name: 'Apply preset Home gym' }));
    expect(onApply).toHaveBeenCalledWith([25, 10]);
  });

  it('deletes a preset and removes it from localStorage', () => {
    window.localStorage.setItem('plate-converter:presets:kg', JSON.stringify({ 'Home gym': [25, 10] }));
    render(<InventoryPresets unit="kg" enabled={enabled} onApply={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete preset Home gym' }));

    expect(screen.queryByRole('button', { name: 'Apply preset Home gym' })).not.toBeInTheDocument();
    const stored = JSON.parse(window.localStorage.getItem('plate-converter:presets:kg')!);
    expect(stored).toEqual({});
  });

  it('overwrites an existing preset saved under the same name', () => {
    window.localStorage.setItem('plate-converter:presets:kg', JSON.stringify({ 'Home gym': [25, 10] }));
    render(<InventoryPresets unit="kg" enabled={enabled} onApply={() => {}} />);
    fireEvent.change(screen.getByLabelText('Preset name (kg)'), { target: { value: 'Home gym' } });
    fireEvent.click(screen.getByText('Save'));

    const stored = JSON.parse(window.localStorage.getItem('plate-converter:presets:kg')!);
    expect(stored['Home gym']).toEqual([25, 20, 15]);
  });

  it('ignores corrupt localStorage content', () => {
    window.localStorage.setItem('plate-converter:presets:kg', 'not json');
    render(<InventoryPresets unit="kg" enabled={enabled} onApply={() => {}} />);
    expect(screen.queryAllByRole('button', { name: /Apply preset/ })).toHaveLength(0);
  });

  it('gives the apply and delete buttons a 44px minimum hit area', () => {
    window.localStorage.setItem('plate-converter:presets:kg', JSON.stringify({ 'Home gym': [25, 10] }));
    render(<InventoryPresets unit="kg" enabled={enabled} onApply={() => {}} />);
    expect(screen.getByRole('button', { name: 'Apply preset Home gym' })).toHaveClass('min-h-11');
    expect(screen.getByRole('button', { name: 'Delete preset Home gym' })).toHaveClass('min-h-11', 'min-w-11');
  });

  it('keeps kg and lb presets separate', () => {
    window.localStorage.setItem('plate-converter:presets:kg', JSON.stringify({ 'KG set': [25] }));
    render(<InventoryPresets unit="lb" enabled={new Set([45])} onApply={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Apply preset KG set' })).not.toBeInTheDocument();
  });
});
