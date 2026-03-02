export const KG_TO_LB = 2.20462;

export function kgToLb(kg: number): number {
  return kg * KG_TO_LB;
}

export function lbToKg(lb: number): number {
  return lb / KG_TO_LB;
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

/** Format a weight value with its unit label — single source of truth for display. */
export function formatWeight(n: number, unit: 'kg' | 'lb'): string {
  return unit === 'kg' ? `${formatKg(n)} kg` : `${formatLb(n)} lb`;
}
