import { describe, it, expect } from 'vitest';
import { greedyLoad, getBounds } from '../utils/loading';

const KG_INVENTORY = [25, 20, 15, 10, 5, 2.5, 2, 1.5, 1, 0.5];
const LB_INVENTORY = [45, 25, 10, 5, 2.5];

describe('greedyLoad', () => {
  it('loads 40 kg/side with 25+15', () => {
    const result = greedyLoad(40, KG_INVENTORY);
    expect(result.perSide).toBeCloseTo(40);
    expect(result.remainder).toBeCloseTo(0);
    const plates = Object.fromEntries(result.plates.map((p) => [p.weight, p.count]));
    expect(plates[25]).toBe(1);
    expect(plates[15]).toBe(1);
  });

  it('loads 0 per side with no plates', () => {
    const result = greedyLoad(0, KG_INVENTORY);
    expect(result.perSide).toBe(0);
    expect(result.remainder).toBe(0);
    expect(result.plates).toHaveLength(0);
  });

  it('leaves remainder when weight is not achievable', () => {
    // 0.3 kg can't be achieved with 0.5 kg smallest plate
    const result = greedyLoad(0.3, KG_INVENTORY);
    expect(result.remainder).toBeGreaterThan(0);
    expect(result.plates).toHaveLength(0);
  });

  it('loads 90 kg/side (3x25+1x15)', () => {
    // 3*25=75, remainder=15, 1*15=15 → total 90
    const result = greedyLoad(90, KG_INVENTORY);
    const plates = Object.fromEntries(result.plates.map((p) => [p.weight, p.count]));
    expect(plates[25]).toBe(3);
    expect(plates[15]).toBe(1);
    expect(result.remainder).toBeCloseTo(0);
  });

  it('uses maximum plates for a large number', () => {
    const result = greedyLoad(100, KG_INVENTORY);
    expect(result.perSide).toBeCloseTo(100);
    expect(result.remainder).toBeCloseTo(0);
  });

  it('loads lb inventory correctly: 90 lb/side', () => {
    const result = greedyLoad(90, LB_INVENTORY);
    const plates = Object.fromEntries(result.plates.map((p) => [p.weight, p.count]));
    expect(plates[45]).toBe(2);
    expect(result.remainder).toBeCloseTo(0);
  });
});

describe('getBounds - KGS', () => {
  const BAR_KG = 20;

  it('100 kg: exact, loads 1x25+1x15 per side (40 kg/side)', () => {
    // (100-20)/2 = 40 per side; 40 = 1*25 + 1*15
    const result = getBounds(100, BAR_KG, KG_INVENTORY);
    expect(result.isExact).toBe(true);
    expect(result.down.achievable).toBeCloseTo(100);
    const plates = Object.fromEntries(result.down.plates.map((p) => [p.weight, p.count]));
    expect(plates[25]).toBe(1);
    expect(plates[15]).toBe(1);
  });

  it('provides down <= exact <= up', () => {
    const exact = 101.3;
    const result = getBounds(exact, BAR_KG, KG_INVENTORY);
    expect(result.down.achievable).toBeLessThanOrEqual(exact + 0.001);
    expect(result.up.achievable).toBeGreaterThanOrEqual(exact - 0.001);
  });

  it('bar weight alone when target = bar weight', () => {
    const result = getBounds(BAR_KG, BAR_KG, KG_INVENTORY);
    expect(result.isExact).toBe(true);
    expect(result.down.plates).toHaveLength(0);
    expect(result.down.achievable).toBe(BAR_KG);
  });

  it('returns bar weight when target < bar weight', () => {
    const result = getBounds(10, BAR_KG, KG_INVENTORY);
    expect(result.down.achievable).toBe(BAR_KG);
  });

  it('225 kg: exact', () => {
    const result = getBounds(225, BAR_KG, KG_INVENTORY);
    expect(result.isExact).toBe(true);
    expect(result.down.achievable).toBeCloseTo(225);
  });
});

describe('getBounds - LBS', () => {
  const BAR_LB = 45;

  it('225 lb: exact (2x45+2x22.5... actually 2x45 per side is 135 + 45 bar = 135... let me recalc)', () => {
    // 225 - 45 = 180 / 2 = 90 per side => 2x45
    const result = getBounds(225, BAR_LB, LB_INVENTORY);
    expect(result.isExact).toBe(true);
    expect(result.down.achievable).toBeCloseTo(225);
  });

  it('220 lb: exact (2x45+2x25+2x10 = 90+50+20=160... + 45 bar = 205... no)', () => {
    // 220 - 45 = 175 / 2 = 87.5 per side
    // 87.5 = 45 + 25 + 10 + 5 + 2.5 = 87.5 exactly
    const result = getBounds(220, BAR_LB, LB_INVENTORY);
    expect(result.isExact).toBe(true);
  });

  it('bounds wrap around non-achievable weight', () => {
    // 221 lb => per side = (221-45)/2 = 88 lb
    // 88 = 45 + 25 + 10 + 5 + 2.5 = 87.5 (not enough, remainder 0.5)
    const result = getBounds(221, BAR_LB, LB_INVENTORY);
    expect(result.isExact).toBe(false);
    expect(result.down.achievable).toBeLessThan(221);
    expect(result.up.achievable).toBeGreaterThan(221);
  });

  it('empty inventory returns bar weight on both sides', () => {
    const result = getBounds(100, BAR_LB, []);
    expect(result.down.achievable).toBe(BAR_LB);
    expect(result.up.achievable).toBe(BAR_LB);
  });
});
