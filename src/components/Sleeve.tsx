import Plate, { type PlateVariant } from './Plate';
import { scaled } from '../utils/constants';
import { type PlateCount } from '../utils/loading';

interface SleeveProps {
  plates: PlateCount[];
  variant: PlateVariant;
}

function BarStub() {
  return (
    <div className="flex items-center flex-shrink-0">
      <div
        className="w-[10px] flex-shrink-0 rounded-l-sm bg-bar-collar"
        style={{ height: scaled(28) }}
      />
      <div
        className="w-[120px] flex-shrink-0 bg-bar-shaft"
        style={{ height: scaled(14) }}
      />
    </div>
  );
}

export default function Sleeve({ plates, variant }: SleeveProps) {
  const hasPlates = plates.length > 0 && plates.some((p) => p.count > 0);

  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="inline-flex min-w-full flex-col">
        <div className="flex items-center">
          <BarStub />
          <div className="flex items-center gap-[2px]">
            {hasPlates ? (
              plates
                .filter((p) => p.count > 0)
                .flatMap((p) =>
                  Array.from({ length: p.count }, (_, i) => (
                    <Plate key={`${p.weight}-${i}`} weight={p.weight} variant={variant} />
                  )),
                )
            ) : (
              <span className="text-zinc-400 text-xs ml-3">No plates</span>
            )}
          </div>
          <div
            className={`h-[10px] w-[6px] flex-shrink-0 rounded-r-sm bg-bar-endcap ${
              hasPlates ? 'ml-[2px]' : ''
            }`}
          />
        </div>
        {/* Shelf + contact shadow: without a floor the bar and plates read as floating */}
        <div aria-hidden="true" className="h-px bg-gradient-to-r from-bar-shelf via-bar-shelf to-transparent" />
        <div aria-hidden="true" className="h-2 bg-gradient-to-b from-black/50 to-transparent" />
      </div>
    </div>
  );
}
