import { type PlateUnit } from '../utils/constants';
import InventoryPresets from './InventoryPresets';

interface InventoryTogglesProps {
  plates: number[];
  enabled: Set<number>;
  unit: PlateUnit;
  open: boolean;
  onToggleOpen: () => void;
  onTogglePlate: (weight: number) => void;
  onApplyPreset: (weights: number[]) => void;
}

export default function InventoryToggles({
  plates,
  enabled,
  unit,
  open,
  onToggleOpen,
  onTogglePlate,
  onApplyPreset,
}: InventoryTogglesProps) {
  return (
    <div className="mt-1">
      <button
        onClick={onToggleOpen}
        aria-expanded={open}
        className="focus-ring min-h-11 pr-2 rounded text-xs text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
      >
        <span>{open ? '▾' : '▸'}</span>
        <span>Inventory</span>
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          {enabled.size === 0 && (
            <p className="text-xs text-amber-500">
              All plates disabled — only bar weight will load.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {plates.map((w) => {
              const on = enabled.has(w);
              const label = Number.isInteger(w) ? `${w}` : w.toFixed(1);
              return (
                <button
                  key={w}
                  onClick={() => onTogglePlate(w)}
                  aria-label={`Toggle ${label} ${unit} plate`}
                  aria-pressed={on}
                  className={`focus-ring min-h-11 min-w-11 px-3 rounded text-xs font-mono transition-colors border ${
                    on
                      ? 'bg-zinc-700 border-solid border-zinc-600 text-white'
                      : 'bg-zinc-900 border-dashed border-zinc-500 text-zinc-400 line-through'
                  }`}
                >
                  {label} {unit}
                </button>
              );
            })}
          </div>
          <InventoryPresets unit={unit} enabled={enabled} onApply={onApplyPreset} />
        </div>
      )}
    </div>
  );
}
