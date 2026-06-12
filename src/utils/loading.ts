// Threshold for treating a floating-point remainder as zero
const FLOAT_EPSILON = 0.001;

export interface PlateCount {
  weight: number;
  count: number;
}

export interface LoadResult {
  plates: PlateCount[];
  achievable: number; // total weight (both sides + bar)
  perSide: number;    // weight loaded per side
  remainder: number;  // how much couldn't be loaded
}

export interface BoundsResult {
  down: LoadResult;
  up: LoadResult;
  exact: number;       // exact target weight
  isExact: boolean;    // exact weight is perfectly achievable
}

/**
 * Greedy loading algorithm.
 * inventory: sorted largest-first array of available plate weights
 * targetPerSide: weight to load on each side
 */
export function greedyLoad(
  targetPerSide: number,
  inventory: number[],
): LoadResult {
  // Sort descending just in case
  const sorted = [...inventory].sort((a, b) => b - a);
  const plates: PlateCount[] = [];
  let remaining = targetPerSide;

  for (const plateWeight of sorted) {
    if (remaining <= 0) break;
    const count = Math.floor(remaining / plateWeight);
    if (count > 0) {
      plates.push({ weight: plateWeight, count });
      remaining -= plateWeight * count;
    }
  }

  // Round tiny floating point remainders to 0
  remaining = Math.abs(remaining) < FLOAT_EPSILON ? 0 : remaining;

  const perSide = targetPerSide - remaining;

  return {
    plates,
    achievable: 0, // caller fills this in
    perSide,
    remainder: remaining,
  };
}

/**
 * Get the rounded-down and rounded-up achievable configurations
 * for a given exact target weight.
 */
export function getBounds(
  exactWeight: number,
  barWeight: number,
  inventory: number[],
): BoundsResult {
  const exactPerSide = (exactWeight - barWeight) / 2;

  if (exactPerSide < 0) {
    const empty: LoadResult = { plates: [], achievable: barWeight, perSide: 0, remainder: 0 };
    return { down: empty, up: empty, exact: exactWeight, isExact: true };
  }

  // Load greedy for the exact amount — this always rounds down
  const downResult = greedyLoad(exactPerSide, inventory);
  const downAchievable = barWeight + downResult.perSide * 2;
  downResult.achievable = downAchievable;

  // For round-up: find smallest plate to add to get above exact
  const sorted = [...inventory].sort((a, b) => b - a);
  const smallestPlate = sorted[sorted.length - 1] ?? 0;

  let upResult = downResult;

  if (downResult.remainder > FLOAT_EPSILON && smallestPlate > 0) {
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i] >= downResult.remainder - FLOAT_EPSILON) {
        const coveringPlate = sorted[i];
        const upPerSide = downResult.perSide + coveringPlate;
        const candidate = greedyLoad(upPerSide, inventory);
        if (candidate.remainder <= FLOAT_EPSILON) {
          // Greedy hit the target exactly — preferred, as it may consolidate plates
          candidate.achievable = barWeight + candidate.perSide * 2;
          upResult = candidate;
        } else {
          // Greedy missed (possible with sparse inventories, e.g. [25, 10] only) —
          // construct directly: the down loadout plus one covering plate is always achievable
          const plates = downResult.plates.map((p) => ({ ...p }));
          const existing = plates.find((p) => p.weight === coveringPlate);
          if (existing) existing.count += 1;
          else {
            plates.push({ weight: coveringPlate, count: 1 });
            plates.sort((a, b) => b.weight - a.weight);
          }
          upResult = {
            plates,
            achievable: barWeight + upPerSide * 2,
            perSide: upPerSide,
            remainder: 0,
          };
        }
        break;
      }
    }
  }

  const isExact = downResult.remainder < FLOAT_EPSILON;

  return {
    down: downResult,
    up: upResult,
    exact: exactWeight,
    isExact,
  };
}
