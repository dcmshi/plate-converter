import { useState, useMemo, useEffect } from 'react';
import { formatKg, formatLb, kgToLb, lbToKg, roundToNearestHalfKg } from './utils/conversion';
import { getBounds } from './utils/loading';
import { KG_PLATES, LB_PLATES, BAR_WEIGHTS, type BarType } from './utils/constants';

import BarSelector from './components/BarSelector';
import WeightInput from './components/WeightInput';
import InfoPanel from './components/InfoPanel';
import Sleeve from './components/Sleeve';
import InventoryToggles from './components/InventoryToggles';
import QrShare from './components/QrShare';

const DEFAULT_KG = 100;

/** Scroll depth (px) past which the compact totals bar appears on small screens. */
const COMPACT_HEADER_SCROLL_PX = 120;

const KG_INVENTORY_KEY = 'plate-converter:inventory:kg';
const LB_INVENTORY_KEY = 'plate-converter:inventory:lb';
const TOGGLES_OPEN_KEY = 'plate-converter:toggles-open';

const ALL_KG_WEIGHTS = KG_PLATES.map((p) => p.weight);
const ALL_LB_WEIGHTS = LB_PLATES.map((p) => p.weight);

/** kg → lb rounded to 2 decimals, as the string shown in the lb input. */
function kgToLbDisplay(kg: number): string {
  return String(Math.round(kgToLb(kg) * 100) / 100);
}

/**
 * Parse a comma-separated enabled-plate list from a URL param.
 * null → param absent; '' → explicitly all disabled; otherwise keep known
 * weights, falling back to null if nothing valid remains.
 */
function parsePlateList(raw: string | null, known: number[]): Set<number> | null {
  if (raw === null) return null;
  if (raw === '') return new Set();
  const weights = raw.split(',').map(Number).filter((w) => known.includes(w));
  return weights.length > 0 ? new Set(weights) : null;
}

function serializePlateList(enabled: Set<number>): string {
  return [...enabled].sort((a, b) => b - a).join(',');
}

/** Read a persisted inventory from localStorage; null if absent or unusable. */
function loadStoredInventory(key: string, known: number[]): Set<number> | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return null;
    return new Set(arr.filter((w): w is number => typeof w === 'number' && known.includes(w)));
  } catch {
    return null;
  }
}

/** Read which inventory disclosures were left open; both closed if absent or unusable. */
function loadTogglesOpen(): { kg: boolean; lb: boolean } {
  try {
    const raw = window.localStorage.getItem(TOGGLES_OPEN_KEY);
    if (raw === null) return { kg: false, lb: false };
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return { kg: false, lb: false };
    const { kg, lb } = parsed as Record<string, unknown>;
    return { kg: kg === true, lb: lb === true };
  } catch {
    return { kg: false, lb: false };
  }
}

interface UrlParams {
  kg: number;
  bar: BarType;
  kgPlates: Set<number> | null;
  lbPlates: Set<number> | null;
}

function parseUrlParams(search = window.location.search): UrlParams {
  const params = new URLSearchParams(search);
  const kgStr = params.get('kg');
  const n = kgStr !== null ? parseFloat(kgStr) : NaN;
  const kg = !isNaN(n) && n >= 0 && n <= 500 ? n : DEFAULT_KG;
  const bar: BarType = params.get('bar') === 'womens' ? 'womens' : 'mens';
  const kgPlates = parsePlateList(params.get('kgp'), ALL_KG_WEIGHTS);
  const lbPlates = parsePlateList(params.get('lbp'), ALL_LB_WEIGHTS);
  return { kg, bar, kgPlates, lbPlates };
}

export default function App() {
  const [{ kg: initialKg, bar: initialBar, kgPlates: urlKgPlates, lbPlates: urlLbPlates }] =
    useState(parseUrlParams);
  const [kgInput, setKgInput] = useState(String(initialKg));
  const [lbInput, setLbInput] = useState(kgToLbDisplay(initialKg));
  const [activeBar, setActiveBar] = useState<BarType>(initialBar);
  const [kgBoundSide, setKgBoundSide] = useState<'down' | 'up'>('up');
  const [lbBoundSide, setLbBoundSide] = useState<'down' | 'up'>('up');

  // Inventory precedence: URL param > localStorage > all plates enabled
  const [kgEnabled, setKgEnabled] = useState<Set<number>>(
    () => urlKgPlates ?? loadStoredInventory(KG_INVENTORY_KEY, ALL_KG_WEIGHTS) ?? new Set(ALL_KG_WEIGHTS),
  );
  const [lbEnabled, setLbEnabled] = useState<Set<number>>(
    () => urlLbPlates ?? loadStoredInventory(LB_INVENTORY_KEY, ALL_LB_WEIGHTS) ?? new Set(ALL_LB_WEIGHTS),
  );

  const [storedTogglesOpen] = useState(loadTogglesOpen);
  const [kgTogglesOpen, setKgTogglesOpen] = useState(storedTogglesOpen.kg);
  const [lbTogglesOpen, setLbTogglesOpen] = useState(storedTogglesOpen.lb);

  // On phones the inputs scroll out of view above the result cards, so a compact
  // bar keeps the loaded totals on screen once the header is gone.
  const [scrolledPastInputs, setScrolledPastInputs] = useState(false);
  useEffect(() => {
    function onScroll() {
      setScrolledPastInputs(window.scrollY > COMPACT_HEADER_SCROLL_PX);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const kgValue = parseFloat(kgInput) || 0;
  const lbValue = parseFloat(lbInput) || 0;

  const barKg = BAR_WEIGHTS[activeBar].kg;
  const barLb = BAR_WEIGHTS[activeBar].lb;

  const kgInventory = useMemo(
    () => KG_PLATES.filter((p) => kgEnabled.has(p.weight)).map((p) => p.weight),
    [kgEnabled],
  );
  const lbInventory = useMemo(
    () => LB_PLATES.filter((p) => lbEnabled.has(p.weight)).map((p) => p.weight),
    [lbEnabled],
  );

  const kgBounds = useMemo(
    () => getBounds(kgValue, barKg, kgInventory),
    [kgValue, barKg, kgInventory],
  );

  const lbBounds = useMemo(
    () => getBounds(lbValue, barLb, lbInventory),
    [lbValue, barLb, lbInventory],
  );

  const kgActive = kgBoundSide === 'down' ? kgBounds.down : kgBounds.up;
  const lbActive = lbBoundSide === 'down' ? lbBounds.down : lbBounds.up;

  // Query string for the address bar and the QR share link
  const shareQuery = useMemo(() => {
    const params = new URLSearchParams();
    const kgNum = parseFloat(kgInput);
    if (!isNaN(kgNum)) params.set('kg', kgInput);
    if (activeBar !== 'mens') params.set('bar', activeBar);
    // Inventory params omitted when all plates are enabled (the default)
    if (kgEnabled.size !== ALL_KG_WEIGHTS.length) params.set('kgp', serializePlateList(kgEnabled));
    if (lbEnabled.size !== ALL_LB_WEIGHTS.length) params.set('lbp', serializePlateList(lbEnabled));
    return params.toString();
  }, [kgInput, activeBar, kgEnabled, lbEnabled]);

  useEffect(() => {
    window.history.replaceState(null, '', shareQuery ? `?${shareQuery}` : window.location.pathname);
  }, [shareQuery]);

  useEffect(() => {
    try {
      window.localStorage.setItem(KG_INVENTORY_KEY, JSON.stringify([...kgEnabled]));
      window.localStorage.setItem(LB_INVENTORY_KEY, JSON.stringify([...lbEnabled]));
    } catch {
      // localStorage unavailable (private mode, quota) — persistence is best-effort
    }
  }, [kgEnabled, lbEnabled]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        TOGGLES_OPEN_KEY,
        JSON.stringify({ kg: kgTogglesOpen, lb: lbTogglesOpen }),
      );
    } catch {
      // best-effort, as above
    }
  }, [kgTogglesOpen, lbTogglesOpen]);

  function resetBoundSides() {
    setKgBoundSide('up');
    setLbBoundSide('up');
  }

  function handleKgChange(val: string) {
    setKgInput(val);
    const kg = parseFloat(val);
    if (!isNaN(kg) && kg >= 0) {
      setLbInput(kgToLbDisplay(kg));
    }
    resetBoundSides();
  }

  function handleLbChange(val: string) {
    setLbInput(val);
    const lb = parseFloat(val);
    if (!isNaN(lb) && lb >= 0) {
      setKgInput(String(roundToNearestHalfKg(lbToKg(lb))));
    }
    resetBoundSides();
  }

  function handleBarChange(bar: BarType) {
    setActiveBar(bar);
    resetBoundSides();
  }

  function toggleKgPlate(weight: number) {
    setKgEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(weight)) next.delete(weight);
      else next.add(weight);
      return next;
    });
    resetBoundSides();
  }

  function applyKgPreset(weights: number[]) {
    setKgEnabled(new Set(weights.filter((w) => ALL_KG_WEIGHTS.includes(w))));
    resetBoundSides();
  }

  function applyLbPreset(weights: number[]) {
    setLbEnabled(new Set(weights.filter((w) => ALL_LB_WEIGHTS.includes(w))));
    resetBoundSides();
  }

  function toggleLbPlate(weight: number) {
    setLbEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(weight)) next.delete(weight);
      else next.add(weight);
      return next;
    });
    resetBoundSides();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-8">
      {scrolledPastInputs && (
        <div
          role="group"
          aria-label="Loaded totals"
          className="fixed inset-x-0 top-0 z-10 flex items-center justify-center gap-3 border-b border-zinc-800 bg-zinc-950/95 px-4 py-2 backdrop-blur md:hidden"
        >
          <span className="font-mono text-sm tabular-nums text-white">
            {formatKg(kgActive.achievable)} kg
          </span>
          <span aria-hidden="true" className="text-zinc-400">·</span>
          <span className="font-mono text-sm tabular-nums text-white">
            {formatLb(lbActive.achievable)} lb
          </span>
        </div>
      )}

      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">PlateConverter</h1>
          <p className="text-xs text-zinc-400 mt-1">Eleiko KGS · Commercial LBS</p>
        </div>

        <div className="flex justify-center">
          <BarSelector activeBar={activeBar} onChange={handleBarChange} />
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <WeightInput value={kgInput} unit="kg" onChange={handleKgChange} label="Kilograms" />
          <WeightInput value={lbInput} unit="lb" onChange={handleLbChange} label="Pounds" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-zinc-900 rounded-xl p-4 flex flex-col gap-2">
            <InfoPanel
              bounds={kgBounds}
              unit="kg"
              activeSide={kgBoundSide}
              onSelectSide={setKgBoundSide}
              label="KGS — Eleiko"
            />
            <div className="flex min-w-0 flex-1 items-center">
              <Sleeve plates={kgActive.plates} variant="eleiko" />
            </div>
            <InventoryToggles
              plates={KG_PLATES.map((p) => p.weight)}
              enabled={kgEnabled}
              unit="kg"
              open={kgTogglesOpen}
              onToggleOpen={() => setKgTogglesOpen((v) => !v)}
              onTogglePlate={toggleKgPlate}
              onApplyPreset={applyKgPreset}
            />
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 flex flex-col gap-2">
            <InfoPanel
              bounds={lbBounds}
              unit="lb"
              activeSide={lbBoundSide}
              onSelectSide={setLbBoundSide}
              label="LBS — Iron"
            />
            <div className="flex min-w-0 flex-1 items-center">
              <Sleeve plates={lbActive.plates} variant="iron" />
            </div>
            <InventoryToggles
              plates={LB_PLATES.map((p) => p.weight)}
              enabled={lbEnabled}
              unit="lb"
              open={lbTogglesOpen}
              onToggleOpen={() => setLbTogglesOpen((v) => !v)}
              onTogglePlate={toggleLbPlate}
              onApplyPreset={applyLbPreset}
            />
          </div>

        </div>

        <QrShare query={shareQuery} />

        <p className="text-center text-xs text-zinc-400">1 kg = 2.20462 lb</p>

        <p className="text-center text-xs text-zinc-400">
          <a
            href="https://github.com/sponsors/dcmshi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:underline"
          >
            ❤️ Support this project
          </a>
          <span aria-hidden="true" className="mx-2">·</span>
          <a
            href="https://github.com/dcmshi/plate-converter"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white hover:underline"
          >
            View source on GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
