import { type BoundsResult } from '../utils/loading';
import { type PlateUnit } from '../utils/constants';

interface BoundsTrackProps {
  bounds: BoundsResult;
  unit: PlateUnit;
  activeSide: 'down' | 'up';
  onSelect: (side: 'down' | 'up') => void;
}

function fmt(n: number, unit: PlateUnit) {
  if (unit === 'kg') {
    return `${n % 1 === 0 ? n : n.toFixed(1)} kg`;
  }
  const rounded = Math.round(n * 100) / 100;
  const str = Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(2).replace(/\.?0+$/, '');
  return `${str} lb`;
}

export default function BoundsTrack({ bounds, unit, activeSide, onSelect }: BoundsTrackProps) {
  if (bounds.isExact) {
    return (
      <div className="flex items-center gap-2 text-xs text-emerald-400">
        <span className="text-emerald-500">✓</span>
        <span>Exact match — {fmt(bounds.exact, unit)}</span>
      </div>
    );
  }

  const downW = bounds.down.achievable;
  const upW = bounds.up.achievable;
  const exact = bounds.exact;

  // Position dot: 0 = at down end, 1 = at up end
  const range = upW - downW;
  const dotPos = range > 0 ? Math.min(1, Math.max(0, (exact - downW) / range)) : 0.5;

  return (
    <div className="flex items-center gap-2">
      {/* Down label */}
      <button
        onClick={() => onSelect('down')}
        className={`text-xs font-mono tabular-nums transition-colors ${
          activeSide === 'down'
            ? 'text-white font-semibold'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        {fmt(downW, unit)}
      </button>

      {/* Track */}
      <div className="relative flex-1 h-1 bg-zinc-700 rounded-full min-w-[60px]">
        {/* Dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400 -translate-x-1/2"
          style={{ left: `${dotPos * 100}%` }}
        />
      </div>

      {/* Up label */}
      <button
        onClick={() => onSelect('up')}
        className={`text-xs font-mono tabular-nums transition-colors ${
          activeSide === 'up'
            ? 'text-white font-semibold'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        {fmt(upW, unit)}
      </button>
    </div>
  );
}
