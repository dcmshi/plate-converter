import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BoundsTrack from '../components/BoundsTrack';
import { type BoundsResult } from '../utils/loading';

const exactBounds: BoundsResult = {
  down: { plates: [], achievable: 100, perSide: 40, remainder: 0 },
  up:   { plates: [], achievable: 100, perSide: 40, remainder: 0 },
  exact: 100,
  isExact: true,
};

const nonExactBounds: BoundsResult = {
  down: { plates: [{ weight: 25, count: 2 }], achievable: 90, perSide: 35, remainder: 2 },
  up:   { plates: [{ weight: 25, count: 2 }, { weight: 5, count: 1 }], achievable: 100, perSide: 40, remainder: 0 },
  exact: 95,
  isExact: false,
};

describe('BoundsTrack — exact match', () => {
  it('shows exact match message', () => {
    render(
      <BoundsTrack bounds={exactBounds} unit="kg" activeSide="down" onSelect={() => {}} />,
    );
    expect(screen.getByText(/Exact match/)).toBeInTheDocument();
  });
});

describe('BoundsTrack — non-exact', () => {
  it('shows both bound labels', () => {
    render(
      <BoundsTrack bounds={nonExactBounds} unit="kg" activeSide="down" onSelect={() => {}} />,
    );
    expect(screen.getByText('90 kg')).toBeInTheDocument();
    expect(screen.getByText('100 kg')).toBeInTheDocument();
  });

  it('calls onSelect with "up" when up bound clicked', () => {
    const onSelect = vi.fn();
    render(
      <BoundsTrack bounds={nonExactBounds} unit="kg" activeSide="down" onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByText('100 kg'));
    expect(onSelect).toHaveBeenCalledWith('up');
  });

  it('calls onSelect with "down" when down bound clicked', () => {
    const onSelect = vi.fn();
    render(
      <BoundsTrack bounds={nonExactBounds} unit="kg" activeSide="up" onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByText('90 kg'));
    expect(onSelect).toHaveBeenCalledWith('down');
  });

  it('formats lb values correctly', () => {
    const lbBounds: BoundsResult = {
      ...nonExactBounds,
      down: { ...nonExactBounds.down, achievable: 220 },
      up:   { ...nonExactBounds.up, achievable: 225 },
    };
    render(
      <BoundsTrack bounds={lbBounds} unit="lb" activeSide="down" onSelect={() => {}} />,
    );
    expect(screen.getByText('220 lb')).toBeInTheDocument();
    expect(screen.getByText('225 lb')).toBeInTheDocument();
  });
});
