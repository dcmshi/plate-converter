import { useState, useMemo } from 'react';
import { kgToLb, lbToKg, roundToNearestHalfKg } from './utils/conversion';
import { getBounds } from './utils/loading';
import { KG_PLATES, LB_PLATES, BAR_WEIGHTS, type BarType } from './utils/constants';

import BarSelector from './components/BarSelector';
import WeightInput from './components/WeightInput';
import InfoPanel from './components/InfoPanel';
import Sleeve from './components/Sleeve';
import InventoryToggles from './components/InventoryToggles';

const DEFAULT_KG = 100;

export default function App() {
  const [kgInput, setKgInput] = useState<string>(String(DEFAULT_KG));
  const [lbInput, setLbInput] = useState<string>(String(Math.round(kgToLb(DEFAULT_KG) * 100) / 100));
  const [activeBar, setActiveBar] = useState<BarType>('mens');
  const [kgBoundSide, setKgBoundSide] = useState<'down' | 'up'>('down');
  const [lbBoundSide, setLbBoundSide] = useState<'down' | 'up'>('down');

  const [kgEnabled, setKgEnabled] = useState<Set<number>>(
    new Set(KG_PLATES.map((p) => p.weight)),
  );
  const [lbEnabled, setLbEnabled] = useState<Set<number>>(
    new Set(LB_PLATES.map((p) => p.weight)),
  );

  const [kgTogglesOpen, setKgTogglesOpen] = useState(false);
  const [lbTogglesOpen, setLbTogglesOpen] = useState(false);

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

  function handleKgChange(val: string) {
    setKgInput(val);
    const kg = parseFloat(val);
    if (!isNaN(kg) && kg >= 0) {
      setLbInput(String(Math.round(kgToLb(kg) * 100) / 100));
    }
    setKgBoundSide('down');
    setLbBoundSide('down');
  }

  function handleLbChange(val: string) {
    setLbInput(val);
    const lb = parseFloat(val);
    if (!isNaN(lb) && lb >= 0) {
      setKgInput(String(roundToNearestHalfKg(lbToKg(lb))));
    }
    setKgBoundSide('down');
    setLbBoundSide('down');
  }

  function handleBarChange(bar: BarType) {
    setActiveBar(bar);
    setKgBoundSide('down');
    setLbBoundSide('down');
  }

  function toggleKgPlate(weight: number) {
    setKgEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(weight)) next.delete(weight);
      else next.add(weight);
      return next;
    });
  }

  function toggleLbPlate(weight: number) {
    setLbEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(weight)) next.delete(weight);
      else next.add(weight);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">PlateConverter</h1>
          <p className="text-xs text-zinc-500 mt-1">Eleiko KGS · Commercial LBS</p>
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
            <div className="overflow-x-auto">
              <Sleeve plates={kgActive.plates} variant="eleiko" />
            </div>
            <InventoryToggles
              plates={KG_PLATES.map((p) => p.weight)}
              enabled={kgEnabled}
              unit="kg"
              open={kgTogglesOpen}
              onToggleOpen={() => setKgTogglesOpen((v) => !v)}
              onTogglePlate={toggleKgPlate}
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
            <div className="overflow-x-auto">
              <Sleeve plates={lbActive.plates} variant="iron" />
            </div>
            <InventoryToggles
              plates={LB_PLATES.map((p) => p.weight)}
              enabled={lbEnabled}
              unit="lb"
              open={lbTogglesOpen}
              onToggleOpen={() => setLbTogglesOpen((v) => !v)}
              onTogglePlate={toggleLbPlate}
            />
          </div>

        </div>

        <p className="text-center text-xs text-zinc-700">1 kg = 2.20462 lb</p>
      </div>
    </div>
  );
}
