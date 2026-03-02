import { type PlateUnit } from '../utils/constants';

interface WeightInputProps {
  value: string;
  unit: PlateUnit;
  onChange: (val: string) => void;
  label: string;
}

export default function WeightInput({ value, unit, onChange, label }: WeightInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-500 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={0}
          step={unit === 'kg' ? 0.5 : 2.5}
          onChange={(e) => onChange(e.target.value)}
          className="w-32 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-lg font-mono tabular-nums focus:outline-none focus:border-zinc-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-zinc-400 text-sm">{unit}</span>
      </div>
    </div>
  );
}
