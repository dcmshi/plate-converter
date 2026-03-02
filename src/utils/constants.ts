export type PlateUnit = 'kg' | 'lb';
export type VisualType = 'bumper' | 'standard' | 'change' | 'fractional';
export type IronSize = 'large' | 'medium' | 'small' | 'smaller' | 'smallest';

export interface KgPlate {
  weight: number;
  color: string;
  colorName: string;
  visualType: VisualType;
  borderColor?: string;
}

export interface LbPlate {
  weight: number;
  size: IronSize;
  color: string;
}

export const KG_PLATES: KgPlate[] = [
  { weight: 25,  color: '#D22730', colorName: 'Red',    visualType: 'bumper' },
  { weight: 20,  color: '#005EB8', colorName: 'Blue',   visualType: 'bumper' },
  { weight: 15,  color: '#FFD100', colorName: 'Yellow', visualType: 'bumper' },
  { weight: 10,  color: '#00824D', colorName: 'Green',  visualType: 'bumper' },
  { weight: 5,   color: '#FFFFFF', colorName: 'White',  visualType: 'standard', borderColor: '#bbb' },
  { weight: 2.5, color: '#D22730', colorName: 'Red',    visualType: 'change' },
  { weight: 2,   color: '#005EB8', colorName: 'Blue',   visualType: 'change' },
  { weight: 1.5, color: '#FFD100', colorName: 'Yellow', visualType: 'change' },
  { weight: 1,   color: '#00824D', colorName: 'Green',  visualType: 'change' },
  { weight: 0.5, color: '#FFFFFF', colorName: 'White',  visualType: 'fractional', borderColor: '#bbb' },
];

export const LB_PLATES: LbPlate[] = [
  { weight: 45,  size: 'large',   color: '#18181b' },
  { weight: 25,  size: 'medium',  color: '#18181b' },
  { weight: 10,  size: 'small',   color: '#27272a' },
  { weight: 5,   size: 'smaller', color: '#27272a' },
  { weight: 2.5, size: 'smallest', color: '#27272a' },
];

// Bar weights
export const BAR_WEIGHTS = {
  mens:   { kg: 20, lb: 44.09 },
  womens: { kg: 15, lb: 33.07 },
} as const;

export type BarType = keyof typeof BAR_WEIGHTS;

// Visual dimensions (height in px for the plate SVG/div)
export const PLATE_HEIGHT: Record<VisualType, number> = {
  bumper:    160,
  standard:  140,
  change:     90,
  fractional: 60,
};

// Width (thickness) per weight for kg plates (px)
export const KG_PLATE_WIDTH: Record<number, number> = {
  25:  22,
  20:  20,
  15:  18,
  10:  16,
  5:   14,
  2.5: 10,
  2:    9,
  1.5:  8,
  1:    7,
  0.5:  6,
};

// Width per weight for lb plates (px)
export const LB_PLATE_WIDTH: Record<number, number> = {
  45:  22,
  25:  18,
  10:  14,
  5:   11,
  2.5:  8,
};
