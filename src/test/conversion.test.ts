import { describe, it, expect } from 'vitest';
import {
  kgToLb,
  lbToKg,
  roundToNearestHalfKg,
  roundToNearestLb,
  formatKg,
  formatLb,
} from '../utils/conversion';

describe('kgToLb', () => {
  it('converts 0 kg to 0 lb', () => {
    expect(kgToLb(0)).toBe(0);
  });

  it('converts 1 kg to 2.20462 lb', () => {
    expect(kgToLb(1)).toBeCloseTo(2.20462);
  });

  it('converts 100 kg to 220.462 lb', () => {
    expect(kgToLb(100)).toBeCloseTo(220.462);
  });

  it('converts 20 kg (mens bar) to ~44.09 lb', () => {
    expect(kgToLb(20)).toBeCloseTo(44.09, 1);
  });
});

describe('lbToKg', () => {
  it('converts 0 lb to 0 kg', () => {
    expect(lbToKg(0)).toBe(0);
  });

  it('converts 2.20462 lb to 1 kg', () => {
    expect(lbToKg(2.20462)).toBeCloseTo(1);
  });

  it('converts 225 lb to ~102.06 kg', () => {
    expect(lbToKg(225)).toBeCloseTo(102.058, 2);
  });

  it('is the inverse of kgToLb', () => {
    expect(lbToKg(kgToLb(50))).toBeCloseTo(50);
  });
});

describe('roundToNearestHalfKg', () => {
  it('rounds 102.058 to 102', () => {
    expect(roundToNearestHalfKg(102.058)).toBe(102);
  });

  it('rounds 102.3 to 102.5', () => {
    expect(roundToNearestHalfKg(102.3)).toBe(102.5);
  });

  it('leaves 100 as 100', () => {
    expect(roundToNearestHalfKg(100)).toBe(100);
  });

  it('rounds 0.3 to 0.5', () => {
    expect(roundToNearestHalfKg(0.3)).toBe(0.5);
  });

  it('rounds 0.1 to 0', () => {
    expect(roundToNearestHalfKg(0.1)).toBe(0);
  });
});

describe('roundToNearestLb', () => {
  it('rounds 220.46 to 220', () => {
    expect(roundToNearestLb(220.46)).toBeCloseTo(220);
  });

  it('rounds 221 to nearest 2.5 (220)', () => {
    expect(roundToNearestLb(221)).toBeCloseTo(220);
  });

  it('uses custom step', () => {
    expect(roundToNearestLb(10, 5)).toBe(10);
    expect(roundToNearestLb(12, 5)).toBe(10);
    expect(roundToNearestLb(13, 5)).toBe(15);
  });
});

describe('formatKg', () => {
  it('formats integers without decimals', () => {
    expect(formatKg(100)).toBe('100');
  });

  it('formats non-integers with one decimal', () => {
    expect(formatKg(102.5)).toBe('102.5');
  });
});

describe('formatLb', () => {
  it('formats integers without decimals', () => {
    expect(formatLb(220)).toBe('220');
  });

  it('formats 220.46 correctly', () => {
    expect(formatLb(220.46)).toBe('220.46');
  });

  it('strips trailing zeros', () => {
    expect(formatLb(220.50)).toBe('220.5');
  });
});
