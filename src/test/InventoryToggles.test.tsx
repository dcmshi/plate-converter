import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InventoryToggles from '../components/InventoryToggles';

const plates = [25, 20, 15, 10, 5, 2.5];
const allEnabled = new Set(plates);

describe('InventoryToggles', () => {
  it('renders toggle open button', () => {
    render(
      <InventoryToggles
        plates={plates}
        enabled={allEnabled}
        unit="kg"
        open={false}
        onToggleOpen={() => {}}
        onTogglePlate={() => {}}
        onApplyPreset={() => {}}
      />,
    );
    expect(screen.getByText('Inventory')).toBeInTheDocument();
  });

  it('shows no plate count while the full set is enabled', () => {
    render(
      <InventoryToggles
        plates={plates}
        enabled={allEnabled}
        unit="kg"
        open={false}
        onToggleOpen={() => {}}
        onTogglePlate={() => {}}
        onApplyPreset={() => {}}
      />,
    );
    expect(screen.queryByText(/plates\)/)).not.toBeInTheDocument();
  });

  it('shows how many plates are enabled when some are off', () => {
    render(
      <InventoryToggles
        plates={plates}
        enabled={new Set([25, 20])}
        unit="kg"
        open={false}
        onToggleOpen={() => {}}
        onTogglePlate={() => {}}
        onApplyPreset={() => {}}
      />,
    );
    expect(screen.getByText('(2/6 plates)')).toBeInTheDocument();
  });

  it('does not show plates when closed', () => {
    render(
      <InventoryToggles
        plates={plates}
        enabled={allEnabled}
        unit="kg"
        open={false}
        onToggleOpen={() => {}}
        onTogglePlate={() => {}}
        onApplyPreset={() => {}}
      />,
    );
    expect(screen.queryByText('25 kg')).not.toBeInTheDocument();
  });

  it('shows plates when open', () => {
    render(
      <InventoryToggles
        plates={plates}
        enabled={allEnabled}
        unit="kg"
        open={true}
        onToggleOpen={() => {}}
        onTogglePlate={() => {}}
        onApplyPreset={() => {}}
      />,
    );
    expect(screen.getByText('25 kg')).toBeInTheDocument();
    expect(screen.getByText('2.5 kg')).toBeInTheDocument();
  });

  it('calls onToggleOpen when header clicked', () => {
    const onToggleOpen = vi.fn();
    render(
      <InventoryToggles
        plates={plates}
        enabled={allEnabled}
        unit="kg"
        open={false}
        onToggleOpen={onToggleOpen}
        onTogglePlate={() => {}}
        onApplyPreset={() => {}}
      />,
    );
    fireEvent.click(screen.getByText('Inventory'));
    expect(onToggleOpen).toHaveBeenCalled();
  });

  it('calls onTogglePlate when a plate is clicked', () => {
    const onTogglePlate = vi.fn();
    render(
      <InventoryToggles
        plates={plates}
        enabled={allEnabled}
        unit="kg"
        open={true}
        onToggleOpen={() => {}}
        onTogglePlate={onTogglePlate}
        onApplyPreset={() => {}}
      />,
    );
    fireEvent.click(screen.getByText('25 kg'));
    expect(onTogglePlate).toHaveBeenCalledWith(25);
  });

  it('shows amber warning when all plates are disabled', () => {
    render(
      <InventoryToggles
        plates={plates}
        enabled={new Set()}
        unit="kg"
        open={true}
        onToggleOpen={() => {}}
        onTogglePlate={() => {}}
        onApplyPreset={() => {}}
      />,
    );
    expect(screen.getByText('All plates disabled — only bar weight will load.')).toBeInTheDocument();
  });

  it('gives the disclosure and plate chips a 44px minimum hit area', () => {
    render(
      <InventoryToggles
        plates={plates}
        enabled={allEnabled}
        unit="kg"
        open={true}
        onToggleOpen={() => {}}
        onTogglePlate={() => {}}
        onApplyPreset={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /Inventory/ })).toHaveClass('min-h-11');
    const chip = screen.getByRole('button', { name: 'Toggle 25 kg plate' });
    expect(chip).toHaveClass('min-h-11', 'min-w-11');
  });

  it('applies line-through style for disabled plates', () => {
    const partialEnabled = new Set([25, 20]); // 15, 10, 5, 2.5 disabled
    render(
      <InventoryToggles
        plates={plates}
        enabled={partialEnabled}
        unit="kg"
        open={true}
        onToggleOpen={() => {}}
        onTogglePlate={() => {}}
        onApplyPreset={() => {}}
      />,
    );
    const disabledBtn = screen.getByText('15 kg');
    expect(disabledBtn).toHaveClass('line-through');
  });

  it('marks disabled plates with a dashed border, not colour alone', () => {
    render(
      <InventoryToggles
        plates={plates}
        enabled={new Set([25, 20])}
        unit="kg"
        open={true}
        onToggleOpen={() => {}}
        onTogglePlate={() => {}}
        onApplyPreset={() => {}}
      />,
    );
    const disabled = screen.getByRole('button', { name: 'Toggle 15 kg plate' });
    const enabled = screen.getByRole('button', { name: 'Toggle 25 kg plate' });
    expect(disabled).toHaveClass('border-dashed');
    expect(enabled).toHaveClass('border-solid');
    expect(enabled).not.toHaveClass('border-dashed');
  });

  it('keeps disabled plate labels at readable contrast', () => {
    render(
      <InventoryToggles
        plates={plates}
        enabled={new Set([25, 20])}
        unit="kg"
        open={true}
        onToggleOpen={() => {}}
        onTogglePlate={() => {}}
        onApplyPreset={() => {}}
      />,
    );
    expect(screen.getByText('15 kg')).toHaveClass('text-zinc-400');
  });
});
