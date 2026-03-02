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
      />,
    );
    expect(screen.getByText('Inventory')).toBeInTheDocument();
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
      />,
    );
    fireEvent.click(screen.getByText('25 kg'));
    expect(onTogglePlate).toHaveBeenCalledWith(25);
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
      />,
    );
    const disabledBtn = screen.getByText('15 kg');
    expect(disabledBtn).toHaveClass('line-through');
  });
});
