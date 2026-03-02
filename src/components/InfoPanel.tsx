import { type BoundsResult } from '../utils/loading';
import { type PlateUnit } from '../utils/constants';
import BoundsTrack from './BoundsTrack';

interface InfoPanelProps {
  bounds: BoundsResult;
  unit: PlateUnit;
  activeSide: 'down' | 'up';
  onSelectSide: (side: 'down' | 'up') => void;
  label: string; // "KGS" | "LBS"
}

function fmtWeight(n: number, unit: PlateUnit) {
  if (unit === 'kg') {
    return `${n % 1 === 0 ? n : n.toFixed(1)}`;
  }
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(2).replace(/\.?0+$/, '');
}

export default function InfoPanel({ bounds, unit, activeSide, onSelectSide, label }: InfoPanelProps) {
  const active = activeSide === 'down' ? bounds.down : bounds.up;
  const achievable = active.achievable;

  return (
    <div className="flex flex-col gap-2 mb-3">
      {/* Header row */}
      <div className="flex items-baseline gap-2">
        <span className="text-xs text-zinc-500 uppercase tracking-widest">{label}</span>
        {/* Achievable weight */}
        <span className="text-2xl font-bold text-white tabular-nums">
          {fmtWeight(achievable, unit)}
        </span>
        <span className="text-sm text-zinc-400">{unit}</span>

        {/* Exact badge */}
        {!bounds.isExact && (
          <span className="ml-auto text-xs text-zinc-500">
            exact: {fmtWeight(bounds.exact, unit)} {unit}
          </span>
        )}
      </div>

      {/* Bounds track */}
      <BoundsTrack
        bounds={bounds}
        unit={unit}
        activeSide={activeSide}
        onSelect={onSelectSide}
      />

      {/* Plate breakdown: per-side summary */}
      {active.plates.length > 0 && (
        <div className="text-xs text-zinc-500 font-mono">
          {active.plates.map((p) => `${p.count}×${p.weight}`).join(' + ')} per side
        </div>
      )}
    </div>
  );
}
