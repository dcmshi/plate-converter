import Plate, { type PlateVariant } from './Plate';
import { type PlateCount } from '../utils/loading';

interface SleeveProps {
  plates: PlateCount[];
  variant: PlateVariant;
}

function BarStub() {
  return (
    <div className="flex items-center flex-shrink-0">
      <div
        style={{
          width: '10px',
          height: '28px',
          backgroundColor: '#71717a',
          borderRadius: '2px 0 0 2px',
          flexShrink: 0,
        }}
      />
      <div
        style={{
          width: '120px',
          height: '14px',
          backgroundColor: '#52525b',
          flexShrink: 0,
        }}
      />
    </div>
  );
}

export default function Sleeve({ plates, variant }: SleeveProps) {
  const hasPlates = plates.length > 0 && plates.some((p) => p.count > 0);

  return (
    <div className="overflow-x-auto py-2">
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
            style={{
              width: '6px',
              height: '10px',
              backgroundColor: '#3f3f46',
              borderRadius: '0 2px 2px 0',
              flexShrink: 0,
              marginLeft: hasPlates ? '2px' : '0',
            }}
          />
        </div>
        {/* Shelf + contact shadow: without a floor the bar and plates read as floating */}
        <div aria-hidden="true" className="h-px bg-gradient-to-r from-zinc-600 via-zinc-600 to-transparent" />
        <div aria-hidden="true" className="h-2 bg-gradient-to-b from-black/50 to-transparent" />
      </div>
    </div>
  );
}
