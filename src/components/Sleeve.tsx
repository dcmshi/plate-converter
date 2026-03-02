import Plate from './Plate';
import { type PlateCount } from '../utils/loading';
import { type PlateUnit } from '../utils/constants';

interface SleeveProps {
  plates: PlateCount[];
  unit: PlateUnit;
  isEleiko: boolean;
}

// The bar stub (sleeve half) visual
function BarStub() {
  return (
    <div className="flex items-center flex-shrink-0">
      {/* Collar */}
      <div
        style={{
          width: '10px',
          height: '28px',
          backgroundColor: '#71717a',
          borderRadius: '2px 0 0 2px',
          flexShrink: 0,
        }}
      />
      {/* Sleeve */}
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

export default function Sleeve({ plates, unit, isEleiko }: SleeveProps) {
  const hasPlates = plates.length > 0 && plates.some((p) => p.count > 0);

  return (
    <div className="flex items-center overflow-x-auto py-2">
      <BarStub />
      {/* Plates: innermost (heaviest) first on the left */}
      <div className="flex items-center gap-[2px]">
        {hasPlates ? (
          plates
            .filter((p) => p.count > 0)
            .map((p) => (
              <Plate
                key={p.weight}
                weight={p.weight}
                unit={unit}
                isEleiko={isEleiko}
                count={p.count}
              />
            ))
        ) : (
          <span className="text-zinc-600 text-xs ml-3">No plates</span>
        )}
      </div>
      {/* End cap */}
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
  );
}
