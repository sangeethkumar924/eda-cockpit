/**
 * Engineering calculations & formula evaluations for VISION-EDA
 */

/**
 * Calculates percentage power reduction using the strict formula:
 * ((Original Power - Optimized Power) / Original Power) * 100
 */
export function calculatePowerSaving(orig, opt) {
  if (!orig || orig <= 0) return 0;
  const saving = ((orig - opt) / orig) * 100;
  return Number(saving.toFixed(1));
}

/**
 * Calculates LUT reduction percentage
 */
export function calculateLutReduction(orig, opt) {
  if (!orig || orig <= 0) return 0;
  const reduction = ((orig - opt) / orig) * 100;
  return Number(reduction.toFixed(1));
}

/**
 * Format watts into readable engineering units (e.g. 0.52 W or 520 mW)
 */
export function formatPower(watts) {
  if (watts === undefined || watts === null) return '0.00 W';
  return `${Number(watts).toFixed(2)} W`;
}

/**
 * Format delay into nanoseconds
 */
export function formatDelay(ns) {
  if (ns === undefined || ns === null) return '0.00 ns';
  return `${Number(ns).toFixed(2)} ns`;
}

/**
 * Calculates estimation error percentage
 */
export function calculateErrorRate(actual, predicted) {
  if (!actual || actual <= 0) return 0;
  const err = (Math.abs(actual - predicted) / actual) * 100;
  return Number(err.toFixed(2));
}
