import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InfoPanel from '../components/InfoPanel';
import { type BoundsResult } from '../utils/loading';

const exactBounds: BoundsResult = {
  down: { plates: [{ weight: 25, count: 1 }, { weight: 15, count: 1 }], achievable: 100, perSide: 40, remainder: 0 },
  up:   { plates: [{ weight: 25, count: 1 }, { weight: 15, count: 1 }], achievable: 100, perSide: 40, remainder: 0 },
  exact: 100,
  isExact: true,
};

const nonExactBounds: BoundsResult = {
  down: { plates: [{ weight: 25, count: 2 }], achievable: 90, perSide: 35, remainder: 2 },
  up:   { plates: [{ weight: 25, count: 2 }, { weight: 5, count: 1 }], achievable: 100, perSide: 40, remainder: 0 },
  exact: 95,
  isExact: false,
};

describe('InfoPanel — exact match', () => {
  it('shows the achievable weight', () => {
    render(
      <InfoPanel bounds={exactBounds} unit="kg" activeSide="down" onSelectSide={() => {}} label="KGS" />,
    );
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('does not render the round-down/up toggle', () => {
    render(
      <InfoPanel bounds={exactBounds} unit="kg" activeSide="down" onSelectSide={() => {}} label="KGS" />,
    );
    expect(screen.queryByText('▼ Round Down')).not.toBeInTheDocument();
    expect(screen.queryByText('▲ Round Up')).not.toBeInTheDocument();
  });
});

describe('InfoPanel — non-exact match', () => {
  it('shows the round-down/up toggle', () => {
    render(
      <InfoPanel bounds={nonExactBounds} unit="kg" activeSide="down" onSelectSide={() => {}} label="KGS" />,
    );
    expect(screen.getByText('▼ Round Down')).toBeInTheDocument();
    expect(screen.getByText('▲ Round Up')).toBeInTheDocument();
  });

  it('highlights the active side button', () => {
    render(
      <InfoPanel bounds={nonExactBounds} unit="kg" activeSide="down" onSelectSide={() => {}} label="KGS" />,
    );
    expect(screen.getByText('▼ Round Down')).toHaveClass('bg-zinc-600');
    expect(screen.getByText('▲ Round Up')).not.toHaveClass('bg-zinc-600');
  });

  it('calls onSelectSide("up") when Round Up is clicked', () => {
    const onSelectSide = vi.fn();
    render(
      <InfoPanel bounds={nonExactBounds} unit="kg" activeSide="down" onSelectSide={onSelectSide} label="KGS" />,
    );
    fireEvent.click(screen.getByText('▲ Round Up'));
    expect(onSelectSide).toHaveBeenCalledWith('up');
  });

  it('calls onSelectSide("down") when Round Down is clicked', () => {
    const onSelectSide = vi.fn();
    render(
      <InfoPanel bounds={nonExactBounds} unit="kg" activeSide="up" onSelectSide={onSelectSide} label="KGS" />,
    );
    fireEvent.click(screen.getByText('▼ Round Down'));
    expect(onSelectSide).toHaveBeenCalledWith('down');
  });

  it('shows the exact weight as a muted badge', () => {
    render(
      <InfoPanel bounds={nonExactBounds} unit="kg" activeSide="down" onSelectSide={() => {}} label="KGS" />,
    );
    expect(screen.getByText(/exact: 95 kg/)).toBeInTheDocument();
  });

  it('shows the per-side plate breakdown', () => {
    render(
      <InfoPanel bounds={nonExactBounds} unit="kg" activeSide="down" onSelectSide={() => {}} label="KGS" />,
    );
    expect(screen.getByText(/per side/)).toBeInTheDocument();
  });
});

describe('InfoPanel — copy button', () => {
  it('calls clipboard.writeText with the formatted plate configuration', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <InfoPanel bounds={exactBounds} unit="kg" activeSide="down" onSelectSide={() => {}} label="KGS" />,
    );

    fireEvent.click(screen.getByLabelText('Copy plate configuration'));
    expect(writeText).toHaveBeenCalledWith('100 kg — 1×25kg + 1×15kg per side');
  });

  it('does not show ✓ and does not crash when clipboard write fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <InfoPanel bounds={exactBounds} unit="kg" activeSide="down" onSelectSide={() => {}} label="KGS" />,
    );

    fireEvent.click(screen.getByLabelText('Copy plate configuration'));
    await new Promise((r) => setTimeout(r, 0));

    // Copy button should still show ⎘, not ✓, after a failed write
    expect(screen.getByLabelText('Copy plate configuration')).toHaveTextContent('⎘');
  });

  it('shows ✓ after a successful copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <InfoPanel bounds={exactBounds} unit="kg" activeSide="down" onSelectSide={() => {}} label="KGS" />,
    );

    fireEvent.click(screen.getByLabelText('Copy plate configuration'));
    expect(await screen.findByText('✓')).toBeInTheDocument();
  });
});
