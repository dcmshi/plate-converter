import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

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
});
