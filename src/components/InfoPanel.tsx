import { formatKg, formatLb, formatWeight } from '../utils/conversion';
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

function fmtWeight(n: number, unit: PlateUnit): string {
  return unit === 'kg' ? formatKg(n) : formatLb(n);
}

export default function InfoPanel({ bounds, unit, activeSide, onSelectSide, label }: InfoPanelProps) {
  const active = activeSide === 'down' ? bounds.down : bounds.up;
  const achievable = active.achievable;

  return (
    <div className="flex flex-col gap-2 mb-3">
      {/* Header row */}
      <div className="flex items-baseline gap-2">
        <span className="text-xs text-zinc-500 uppercase tracking-widest">{label}</span>
        <span className="text-2xl font-bold text-white tabular-nums">
          {fmtWeight(achievable, unit)}
        </span>
        <span className="text-sm text-zinc-400">{unit}</span>

        {!bounds.isExact && (
          <span className="ml-auto text-xs text-zinc-500">
            exact: {formatWeight(bounds.exact, unit)}
          </span>
        )}
      </div>

      {/* Round down / up toggle — only shown for non-exact matches */}
      {!bounds.isExact && (
        <div className="flex gap-1 p-0.5 bg-zinc-800 rounded-lg self-start">
          <button
            onClick={() => onSelectSide('down')}
            aria-pressed={activeSide === 'down'}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeSide === 'down'
                ? 'bg-zinc-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ▼ Round Down
          </button>
          <button
            onClick={() => onSelectSide('up')}
            aria-pressed={activeSide === 'up'}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeSide === 'up'
                ? 'bg-zinc-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ▲ Round Up
          </button>
        </div>
      )}

      {/* Bounds track */}
      <BoundsTrack
        bounds={bounds}
        unit={unit}
        activeSide={activeSide}
        onSelect={onSelectSide}
      />

      {/* Plate breakdown: per-side summary with copy button */}
      {active.plates.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-mono">
            {active.plates.map((p) => `${p.count}×${p.weight}`).join(' + ')} per side
          </span>
          <button
            onClick={() => {
              const text = `${fmtWeight(achievable, unit)} ${unit} — ${active.plates.map((p) => `${p.count}×${p.weight}${unit}`).join(' + ')} per side`;
              navigator.clipboard.writeText(text);
            }}
            aria-label="Copy plate configuration"
            title="Copy to clipboard"
            className="text-zinc-600 hover:text-zinc-300 transition-colors text-xs flex-shrink-0"
          >
            ⎘
          </button>
        </div>
      )}
    </div>
  );
}
