import { type PlateUnit } from '../utils/constants';

interface WeightInputProps {
  value: string;
  unit: PlateUnit;
  onChange: (val: string) => void;
  label: string;
}

export default function WeightInput({ value, unit, onChange, label }: WeightInputProps) {
  const numVal = parseFloat(value);
  const isInvalid = value !== '' && (isNaN(numVal) || numVal < 0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const n = parseFloat(raw);
    if (raw !== '' && !isNaN(n) && n < 0) {
      onChange('0');
    } else {
      onChange(raw);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-500 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={0}
          step={unit === 'kg' ? 0.5 : 2.5}
          onChange={handleChange}
          className={`w-32 px-3 py-2 bg-zinc-800 rounded-lg text-white text-lg font-mono tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border ${
            isInvalid
              ? 'border-red-500 focus:border-red-400'
              : 'border-zinc-700 focus:border-zinc-500'
          }`}
        />
        <span className="text-zinc-400 text-sm">{unit}</span>
      </div>
    </div>
  );
}
