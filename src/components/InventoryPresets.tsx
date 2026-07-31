import { useState } from 'react';
import { type PlateUnit } from '../utils/constants';
import { CloseIcon } from './icons';

interface InventoryPresetsProps {
  unit: PlateUnit;
  enabled: Set<number>;
  onApply: (weights: number[]) => void;
}

type PresetMap = Record<string, number[]>;

function presetsKey(unit: PlateUnit): string {
  return `plate-converter:presets:${unit}`;
}

function loadPresets(unit: PlateUnit): PresetMap {
  try {
    const raw = window.localStorage.getItem(presetsKey(unit));
    if (raw === null) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    const result: PresetMap = {};
    for (const [name, weights] of Object.entries(parsed)) {
      if (Array.isArray(weights) && weights.every((w) => typeof w === 'number')) {
        result[name] = weights;
      }
    }
    return result;
  } catch {
    return {};
  }
}

function storePresets(unit: PlateUnit, presets: PresetMap) {
  try {
    window.localStorage.setItem(presetsKey(unit), JSON.stringify(presets));
  } catch {
    // localStorage unavailable — presets just won't survive a reload
  }
}

export default function InventoryPresets({ unit, enabled, onApply }: InventoryPresetsProps) {
  const [presets, setPresets] = useState<PresetMap>(() => loadPresets(unit));
  const [name, setName] = useState('');

  const trimmed = name.trim();

  function save() {
    if (!trimmed) return;
    const next = { ...presets, [trimmed]: [...enabled].sort((a, b) => b - a) };
    setPresets(next);
    storePresets(unit, next);
    setName('');
  }

  function remove(presetName: string) {
    const next = { ...presets };
    delete next[presetName];
    setPresets(next);
    storePresets(unit, next);
  }

  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
      <span className="text-xs text-zinc-400 uppercase tracking-widest">Presets</span>

      {Object.keys(presets).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(presets).map(([presetName, weights]) => (
            <span
              key={presetName}
              className="flex items-center rounded border border-zinc-700 bg-zinc-800 overflow-hidden"
            >
              <button
                onClick={() => onApply(weights)}
                aria-label={`Apply preset ${presetName}`}
                title={weights.join(', ') + ` ${unit}`}
                className="focus-ring min-h-11 px-3 text-xs text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                {presetName}
              </button>
              <button
                onClick={() => remove(presetName)}
                aria-label={`Delete preset ${presetName}`}
                className="focus-ring min-h-11 min-w-11 flex items-center justify-center text-xs text-zinc-400 hover:text-red-400 transition-colors border-l border-zinc-700"
              >
                <CloseIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
          placeholder="Save current as…"
          aria-label={`Preset name (${unit})`}
          className="focus-ring w-36 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500"
        />
        <button
          onClick={save}
          disabled={!trimmed}
          className="focus-ring px-2 py-1 rounded text-xs font-medium transition-colors border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
}
