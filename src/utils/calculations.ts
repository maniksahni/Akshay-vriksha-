/**
 * SIP future value, paid at the start of each month:
 * FV = P × [((1 + i)^n − 1) / i] × (1 + i), with i = annual rate / 12, n = months.
 */
export function sipValue(monthly: number, annualRatePct: number, months: number): number {
  if (months <= 0) return 0;
  const i = annualRatePct / 12 / 100;
  if (i === 0) return monthly * months;
  return monthly * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
}

/** Year-by-year values for an SIP that starts after `delayYears` and runs to `years`. */
export function sipSeries(monthly: number, annualRatePct: number, years: number, delayYears = 0) {
  return Array.from({ length: years + 1 }, (_, y) => {
    const months = Math.max(0, y - delayYears) * 12;
    return { year: y, invested: monthly * months, value: sipValue(monthly, annualRatePct, months) };
  });
}
