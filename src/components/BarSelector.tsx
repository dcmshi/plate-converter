import { type BarType, BAR_WEIGHTS } from '../utils/constants';

interface BarSelectorProps {
  activeBar: BarType;
  onChange: (bar: BarType) => void;
}

const BAR_DISPLAY_NAME: Record<BarType, string> = {
  mens:   "Men's",
  womens: "Women's",
};

export default function BarSelector({ activeBar, onChange }: BarSelectorProps) {
  return (
    <div className="flex gap-1 p-1 bg-zinc-800 rounded-lg">
      {(Object.keys(BAR_WEIGHTS) as BarType[]).map((bar) => {
        const { kg, lb } = BAR_WEIGHTS[bar];
        return (
          <button
            key={bar}
            onClick={() => onChange(bar)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeBar === bar
                ? 'bg-zinc-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {BAR_DISPLAY_NAME[bar]} {kg} kg / {lb} lb
          </button>
        );
      })}
    </div>
  );
}
