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
  remaining = Math.abs(remaining) < 0.001 ? 0 : remaining;

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

  let upAchievable = downAchievable;
  let upResult = downResult;

  if (downResult.remainder > 0.001 && smallestPlate > 0) {
    // Try adding one of the smallest plate to exceed the target
    // but first check if we can add a plate to just cover the remainder
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i] >= downResult.remainder - 0.001) {
        // This plate covers the remainder (or is the smallest that goes over)
        const upPerSide = downResult.perSide + sorted[i];
        const candidate = greedyLoad(upPerSide, inventory);
        candidate.achievable = barWeight + candidate.perSide * 2;
        upResult = candidate;
        upAchievable = candidate.achievable;
        break;
      }
    }
    // If nothing found, add the smallest plate
    if (upAchievable === downAchievable) {
      const upPerSide = downResult.perSide + smallestPlate;
      upResult = greedyLoad(upPerSide, inventory);
      upResult.achievable = barWeight + upResult.perSide * 2;
      upAchievable = upResult.achievable;
    }
  }

  const isExact = downResult.remainder < 0.001;

  return {
    down: downResult,
    up: upResult,
    exact: exactWeight,
    isExact,
  };
}
