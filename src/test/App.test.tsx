import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

afterEach(() => {
  window.history.pushState({}, '', '/');
  window.localStorage.clear();
});

describe('App — URL params', () => {

  it('?kg=150 initialises kg input to 150 and syncs lb', () => {
    window.history.pushState({}, '', '?kg=150');
    render(<App />);
    const [kgInput, lbInput] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(kgInput.value).toBe('150');
    // kgToLb(150) = 330.693 → Math.round(...*100)/100 = 330.69
    expect(lbInput.value).toBe('330.69');
  });

  it('?kg=150&bar=womens activates the Women\'s bar', () => {
    window.history.pushState({}, '', '?kg=150&bar=womens');
    render(<App />);
    const womensButton = screen.getByRole('button', { name: /Women's/ });
    expect(womensButton).toHaveClass('bg-zinc-600');
  });

  it('?kg=abc (invalid) falls back to DEFAULT_KG (100)', () => {
    window.history.pushState({}, '', '?kg=abc');
    render(<App />);
    const [kgInput] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(kgInput.value).toBe('100');
  });

  it('?kg=9999 (over max) falls back to DEFAULT_KG (100)', () => {
    window.history.pushState({}, '', '?kg=9999');
    render(<App />);
    const [kgInput] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(kgInput.value).toBe('100');
  });

  it('no params defaults to 100 kg / Men\'s bar', () => {
    render(<App />);
    const [kgInput] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(kgInput.value).toBe('100');
    const mensButton = screen.getByRole('button', { name: /Men's/ });
    expect(mensButton).toHaveClass('bg-zinc-600');
  });
});

describe('App — initial state', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('PlateConverter')).toBeInTheDocument();
  });

  it('initialises with 100 kg and the equivalent lb value', () => {
    render(<App />);
    const [kgInput, lbInput] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(kgInput.value).toBe('100');
    expect(lbInput.value).toBe('220.46');
  });

  it('shows the KGS plate breakdown for the default weight', () => {
    render(<App />);
    // 100 kg with Men's 20 kg bar: 40 kg/side → 1×25 + 1×15
    expect(screen.getByText('1×25 + 1×15 per side')).toBeInTheDocument();
  });
});

describe('App — KG ↔ LB sync', () => {
  it('updating the kg input syncs the lb input', () => {
    render(<App />);
    const [kgInput, lbInput] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    fireEvent.change(kgInput, { target: { value: '50' } });
    // kgToLb(50) = 110.231 → rounded to 110.23
    expect(lbInput.value).toBe('110.23');
  });

  it('updating the lb input syncs the kg input', () => {
    render(<App />);
    const [kgInput, lbInput] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    // 110 lb → lbToKg(110) ≈ 49.895 → roundToNearestHalfKg → 50
    fireEvent.change(lbInput, { target: { value: '110' } });
    expect(kgInput.value).toBe('50');
  });
});

describe('App — bar switch', () => {
  it('recalculates KGS plate configuration when switching to the Women\'s bar', () => {
    render(<App />);
    // Men's 100 kg: 40 kg/side → 1×25 + 1×15
    expect(screen.getByText('1×25 + 1×15 per side')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Women's/ }));

    // Women's 100 kg: 42.5 kg/side → 1×25 + 1×15 + 1×2.5
    expect(screen.getByText('1×25 + 1×15 + 1×2.5 per side')).toBeInTheDocument();
  });
});

describe('App — inventory toggle', () => {
  it('adapts the KGS plate configuration when the 25 kg plate is disabled', () => {
    render(<App />);
    // Open the KGS inventory panel (first "Inventory" button = kg side)
    const inventoryButtons = screen.getAllByRole('button', { name: /Inventory/ });
    fireEvent.click(inventoryButtons[0]);

    // Disable the 25 kg plate
    fireEvent.click(screen.getByRole('button', { name: 'Toggle 25 kg plate' }));

    // 40 kg/side without 25 kg → 2×20 per side
    expect(screen.getByText('2×20 per side')).toBeInTheDocument();
  });

  it('resets bound side to up after toggling a plate', () => {
    render(<App />);
    // 100 kg → LB side is non-exact (220.46 lb → 87.73 lb/side) — pill is visible
    fireEvent.click(screen.getByText('▼ Round Down'));
    expect(screen.getByText('▼ Round Down')).toHaveClass('bg-zinc-600');

    // Toggle a LB plate (second Inventory button = lb side)
    const inventoryButtons = screen.getAllByRole('button', { name: /Inventory/ });
    fireEvent.click(inventoryButtons[1]);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle 45 lb plate' }));

    // Bound side should have reset to 'up'
    expect(screen.getByText('▼ Round Down')).not.toHaveClass('bg-zinc-600');
    expect(screen.getByText('▲ Round Up')).toHaveClass('bg-zinc-600');
  });

  it('encodes the inventory in the URL when a plate is toggled', () => {
    render(<App />);
    expect(window.location.search).not.toContain('kgp');

    const inventoryButtons = screen.getAllByRole('button', { name: /Inventory/ });
    fireEvent.click(inventoryButtons[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle 25 kg plate' }));

    const kgp = new URLSearchParams(window.location.search).get('kgp');
    expect(kgp).toBe('20,15,10,5,2.5,2,1.5,1,0.5');
  });

  it('removes the inventory URL param when the plate is re-enabled', () => {
    render(<App />);
    const inventoryButtons = screen.getAllByRole('button', { name: /Inventory/ });
    fireEvent.click(inventoryButtons[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle 25 kg plate' }));
    fireEvent.click(screen.getByRole('button', { name: 'Toggle 25 kg plate' }));
    expect(window.location.search).not.toContain('kgp');
  });
});

describe('App — inventory persistence', () => {
  it('?kgp=25,20 enables only those plates', () => {
    window.history.pushState({}, '', '?kgp=25,20');
    render(<App />);
    const inventoryButtons = screen.getAllByRole('button', { name: /Inventory/ });
    fireEvent.click(inventoryButtons[0]);
    expect(screen.getByRole('button', { name: 'Toggle 25 kg plate' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Toggle 20 kg plate' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Toggle 15 kg plate' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('?kgp=banana (invalid) falls back to all plates enabled', () => {
    window.history.pushState({}, '', '?kgp=banana');
    render(<App />);
    const inventoryButtons = screen.getAllByRole('button', { name: /Inventory/ });
    fireEvent.click(inventoryButtons[0]);
    expect(screen.getByRole('button', { name: 'Toggle 15 kg plate' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('restores a toggled inventory from localStorage on remount', () => {
    const { unmount } = render(<App />);
    let inventoryButtons = screen.getAllByRole('button', { name: /Inventory/ });
    fireEvent.click(inventoryButtons[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle 25 kg plate' }));
    unmount();

    window.history.pushState({}, '', '/');
    render(<App />);
    inventoryButtons = screen.getAllByRole('button', { name: /Inventory/ });
    fireEvent.click(inventoryButtons[0]);
    expect(screen.getByRole('button', { name: 'Toggle 25 kg plate' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Toggle 20 kg plate' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('URL inventory param overrides localStorage', () => {
    window.localStorage.setItem('plate-converter:inventory:kg', JSON.stringify([10, 5]));
    window.history.pushState({}, '', '?kgp=25,20');
    render(<App />);
    const inventoryButtons = screen.getAllByRole('button', { name: /Inventory/ });
    fireEvent.click(inventoryButtons[0]);
    expect(screen.getByRole('button', { name: 'Toggle 25 kg plate' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Toggle 10 kg plate' })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('App — presets', () => {
  it('applying a saved preset updates the plate configuration and the URL', () => {
    window.localStorage.setItem(
      'plate-converter:presets:kg',
      JSON.stringify({ 'No bumpers': [20, 10, 5, 2.5, 2, 1.5, 1, 0.5] }),
    );
    render(<App />);
    const inventoryButtons = screen.getAllByRole('button', { name: /Inventory/ });
    fireEvent.click(inventoryButtons[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Apply preset No bumpers' }));

    // 40 kg/side without the 25 → 2×20
    expect(screen.getByText('2×20 per side')).toBeInTheDocument();
    const kgp = new URLSearchParams(window.location.search).get('kgp');
    expect(kgp).toBe('20,10,5,2.5,2,1.5,1,0.5');
  });
});

describe('App — empty input', () => {
  it('does not crash when the kg input is cleared', () => {
    render(<App />);
    const [kgInput] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    fireEvent.change(kgInput, { target: { value: '' } });
    expect(screen.getByText('PlateConverter')).toBeInTheDocument();
  });
});
