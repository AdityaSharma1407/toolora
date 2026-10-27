/**
 * Mathematical Percentage Utilities.
 * Zero external dependencies.
 */

/**
 * Calculates: What is P% of total?
 * Formula: (P / 100) * total
 */
export function calculateWhatIsPercentOf(percent, total) {
  const p = Number(percent);
  const t = Number(total);
  if (isNaN(p) || isNaN(t)) return null;

  const result = (p / 100) * t;
  return {
    result: Number(result.toFixed(4)),
    formula: `(${p} ÷ 100) × ${t} = ${Number(result.toFixed(4))}`,
    explanation: `${p}% of ${t} is ${Number(result.toFixed(4))}.`,
  };
}

/**
 * Calculates: X is what percent of Y?
 * Formula: (X / Y) * 100
 */
export function calculatePercentIsWhatOf(value, total) {
  const v = Number(value);
  const t = Number(total);
  if (isNaN(v) || isNaN(t) || t === 0) return null;

  const result = (v / t) * 100;
  return {
    result: Number(result.toFixed(4)),
    formula: `(${v} ÷ ${t}) × 100 = ${Number(result.toFixed(4))}%`,
    explanation: `${v} is ${Number(result.toFixed(4))}% of ${t}.`,
  };
}

/**
 * Calculates percentage increase or decrease from initial to final value.
 * Formula: ((final - initial) / initial) * 100
 */
export function calculatePercentageChange(initial, final) {
  const init = Number(initial);
  const fin = Number(final);
  if (isNaN(init) || isNaN(fin) || init === 0) return null;

  const diff = fin - init;
  const percent = (diff / Math.abs(init)) * 100;
  const isIncrease = diff > 0;
  const isDecrease = diff < 0;

  return {
    percent: Number(Math.abs(percent).toFixed(4)),
    difference: Number(diff.toFixed(4)),
    type: isIncrease ? "increase" : isDecrease ? "decrease" : "no change",
    formula: `((${fin} - ${init}) ÷ |${init}|) × 100 = ${percent > 0 ? "+" : ""}${Number(percent.toFixed(4))}%`,
    explanation: `${init} to ${fin} represents a ${Number(Math.abs(percent).toFixed(4))}% ${isIncrease ? "increase" : isDecrease ? "decrease" : "change"}.`,
  };
}

/**
 * Adds or subtracts percentage from a base value (e.g. Sales Tax, Tips, Discounts).
 */
export function calculateAddSubtractPercent(value, percent, operation = "add") {
  const v = Number(value);
  const p = Number(percent);
  if (isNaN(v) || isNaN(p)) return null;

  const delta = (p / 100) * v;
  const result = operation === "subtract" ? v - delta : v + delta;

  return {
    result: Number(result.toFixed(4)),
    delta: Number(delta.toFixed(4)),
    operation,
    formula:
      operation === "subtract"
        ? `${v} - (${p}% of ${v}) = ${v} - ${Number(delta.toFixed(4))} = ${Number(result.toFixed(4))}`
        : `${v} + (${p}% of ${v}) = ${v} + ${Number(delta.toFixed(4))} = ${Number(result.toFixed(4))}`,
    explanation:
      operation === "subtract"
        ? `Subtracting ${p}% discount from ${v} leaves ${Number(result.toFixed(4))} (saved ${Number(delta.toFixed(4))}).`
        : `Adding ${p}% to ${v} equals ${Number(result.toFixed(4))} (additional ${Number(delta.toFixed(4))}).`,
  };
}
