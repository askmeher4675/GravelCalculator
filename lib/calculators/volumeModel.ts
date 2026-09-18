// Single source of truth for the raw volume -> waste-adjusted volume -> supplier order
// pipeline shared by every bulk-material calculator (gravel, driveway, concrete, mulch,
// topsoil). Every downstream figure (weight, bag count, cost) MUST be derived from the
// waste-adjusted volume returned here, never from the rounded supplier order — the order
// is a separate, clearly-labeled purchasing suggestion and must not feed other totals.

export const CUBIC_FT_PER_CUBIC_YD = 27;

export interface RawVolume {
  cubicFt: number;
  cubicYd: number;
}

/** Area (ft²) x depth (ft) -> the exact, unrounded volume, in both units. */
export function rawVolume(areaSqFt: number, depthFt: number): RawVolume {
  const cubicFt = areaSqFt * depthFt;
  return { cubicFt, cubicYd: cubicFt / CUBIC_FT_PER_CUBIC_YD };
}

/** Applies a waste percentage to any volume figure (ft³, yd³, or any other unit). */
export function withWaste(value: number, wastePercent: number): number {
  return value * (1 + wastePercent / 100);
}

/**
 * Rounds a value up to the nearest multiple of `increment` (e.g. 0.1 yd³ for bagged
 * aggregate, 0.25 yd³ for quarter-yard ready-mix truck orders). Guards against floating
 * point drift (e.g. 2.1999999999997) with a small epsilon before rounding the result to
 * 6 decimal places.
 */
export function roundUpToIncrement(value: number, increment: number): number {
  const steps = Math.ceil(value / increment - 1e-9);
  return Math.round(steps * increment * 1e6) / 1e6;
}
