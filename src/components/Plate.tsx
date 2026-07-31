import {
  KG_PLATES,
  LB_PLATES,
  PLATE_HEIGHT,
  LB_PLATE_HEIGHT,
  KG_PLATE_WIDTH,
  LB_PLATE_WIDTH,
} from '../utils/constants';

export type PlateVariant = 'eleiko' | 'iron';

interface PlateProps {
  weight: number;
  variant: PlateVariant;
}

export default function Plate({ weight, variant }: PlateProps) {
  if (variant === 'eleiko') {
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

  // Iron plate
  const def = LB_PLATES.find((p) => p.weight === weight);
  if (!def) return null;

  const height = LB_PLATE_HEIGHT[def.size];
  const width = LB_PLATE_WIDTH[weight] ?? 12;
  const label = Number.isInteger(weight) ? `${weight}` : weight.toFixed(1);

  return (
    <div
      className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-[3px] border-2 border-plate-rim bg-plate-iron [writing-mode:vertical-rl]"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <span
        className="rotate-180 font-mono text-[7px] font-bold tracking-wider text-plate-label"
      >
        {label}
      </span>
    </div>
  );
}
