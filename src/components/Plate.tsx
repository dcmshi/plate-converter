import {
  KG_PLATES,
  LB_PLATES,
  PLATE_HEIGHT,
  KG_PLATE_WIDTH,
  LB_PLATE_WIDTH,
  type PlateUnit,
} from '../utils/constants';

interface PlateProps {
  weight: number;
  unit: PlateUnit;
  isEleiko: boolean;
}

export default function Plate({ weight, unit, isEleiko }: PlateProps) {
  if (isEleiko && unit === 'kg') {
    const def = KG_PLATES.find((p) => p.weight === weight);
    if (!def) return null;

    const height = PLATE_HEIGHT[def.visualType];
    const width = KG_PLATE_WIDTH[weight] ?? 10;
    const border = def.borderColor ? `2px solid ${def.borderColor}` : '2px solid rgba(255,255,255,0.25)';

    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: def.color,
          border,
          borderRadius: '3px',
          flexShrink: 0,
        }}
      />
    );
  }

  // Iron (LBS) plate
  const def = LB_PLATES.find((p) => p.weight === weight);
  if (!def) return null;

  const sizeToHeight: Record<string, number> = {
    large: 160,
    medium: 140,
    small: 110,
    smaller: 90,
    smallest: 70,
  };
  const height = sizeToHeight[def.size] ?? 100;
  const width = LB_PLATE_WIDTH[weight] ?? 12;
  const label = Number.isInteger(weight) ? `${weight}` : weight.toFixed(1);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: def.color,
        border: '2px solid #3f3f46',
        borderRadius: '3px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        writingMode: 'vertical-rl',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          fontSize: '7px',
          color: '#a1a1aa',
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '0.05em',
          transform: 'rotate(180deg)',
        }}
      >
        {label}
      </span>
    </div>
  );
}
