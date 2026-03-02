const FACTOR = 2.20462;

export function kgToLb(kg: number): number {
  return kg * FACTOR;
}

export function lbToKg(lb: number): number {
  return lb / FACTOR;
}

export function roundToNearestHalfKg(kg: number): number {
  return Math.round(kg * 2) / 2;
}

/** Round to nearest 2.5 lb (smallest lb plate) */
export function roundToNearestLb(lb: number, step = 2.5): number {
  return Math.round(lb / step) * step;
}

export function formatKg(kg: number): string {
  return Number.isInteger(kg) ? `${kg}` : kg.toFixed(1);
}

export function formatLb(lb: number): string {
  const rounded = Math.round(lb * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(2).replace(/\.?0+$/, '');
}
