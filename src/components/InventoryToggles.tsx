import { type PlateUnit } from '../utils/constants';

interface InventoryTogglesProps {
  plates: number[];
  enabled: Set<number>;
  unit: PlateUnit;
  open: boolean;
  onToggleOpen: () => void;
  onTogglePlate: (weight: number) => void;
}

export default function InventoryToggles({
  plates,
  enabled,
  unit,
  open,
  onToggleOpen,
  onTogglePlate,
}: InventoryTogglesProps) {
  return (
    <div className="mt-1">
      <button
        onClick={onToggleOpen}
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
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
                  className={`px-2 py-1 rounded text-xs font-mono transition-colors border ${
                    on
                      ? 'bg-zinc-700 border-zinc-600 text-white'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-600 line-through'
                  }`}
                >
                  {label} {unit}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
