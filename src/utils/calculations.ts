import { CalculationResult } from '../types';

/**
 * Pure Mathematical SIP Compounding Formula:
 * M = P * [ ((1 + i)^n - 1) / i ] * (1 + i)
 * 
 * Where:
 * P = Monthly Investment Amount
 * i = Monthly interest rate (Annual rate r / 12 / 100)
 * n = Total compounding months (Years * 12)
 * M = Projected Total Maturity Value
 */
export function calculateSip(
  monthlyAmount: number,
  annualReturnRate: number,
  years: number
): CalculationResult {
  const i = annualReturnRate / 12 / 100;
  const n = years * 12;
  
  if (i === 0) {
    const totalInvested = monthlyAmount * n;
    return {
      totalInvested,
      estimatedReturns: 0,
      totalMaturityValue: totalInvested,
      yearlyBreakdown: Array.from({ length: years }, (_, idx) => ({
        year: idx + 1,
        invested: monthlyAmount * (idx + 1) * 12,
        value: monthlyAmount * (idx + 1) * 12,
      })),
    };
  }

  // Pure SIP maturity calculation
  const totalMaturityValue = monthlyAmount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const totalInvested = monthlyAmount * n;
  const estimatedReturns = Math.max(0, totalMaturityValue - totalInvested);

  // Yearly progression breakdown for visualization
  const yearlyBreakdown = Array.from({ length: years }, (_, idx) => {
    const currentYear = idx + 1;
    const currentMonths = currentYear * 12;
    const yearInvested = monthlyAmount * currentMonths;
    const yearMaturity = monthlyAmount * ((Math.pow(1 + i, currentMonths) - 1) / i) * (1 + i);
    return {
      year: currentYear,
      invested: Math.round(yearInvested),
      value: Math.round(yearMaturity),
    };
  });

  return {
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.round(estimatedReturns),
    totalMaturityValue: Math.round(totalMaturityValue),
    yearlyBreakdown,
  };
}

/**
 * Lumpsum Compound Growth Formula:
 * A = P * (1 + r/100)^t
 */
export function calculateLumpsum(
  principal: number,
  annualReturnRate: number,
  years: number
): CalculationResult {
  const r = annualReturnRate / 100;
  const totalMaturityValue = principal * Math.pow(1 + r, years);
  const estimatedReturns = Math.max(0, totalMaturityValue - principal);

  const yearlyBreakdown = Array.from({ length: years }, (_, idx) => {
    const currentYear = idx + 1;
    const yearMaturity = principal * Math.pow(1 + r, currentYear);
    return {
      year: currentYear,
      invested: Math.round(principal),
      value: Math.round(yearMaturity),
    };
  });

  return {
    totalInvested: Math.round(principal),
    estimatedReturns: Math.round(estimatedReturns),
    totalMaturityValue: Math.round(totalMaturityValue),
    yearlyBreakdown,
  };
}

/**
 * Goal Required Monthly SIP Calculation:
 * P = Target / [ ((1 + i)^n - 1) / i * (1 + i) ]
 */
export function calculateRequiredSipForGoal(
  targetCorpus: number,
  annualReturnRate: number,
  years: number
): { requiredMonthlySip: number; totalInvested: number; estimatedReturns: number } {
  const i = annualReturnRate / 12 / 100;
  const n = years * 12;

  if (i === 0) {
    const required = targetCorpus / n;
    return {
      requiredMonthlySip: Math.round(required),
      totalInvested: Math.round(targetCorpus),
      estimatedReturns: 0,
    };
  }

  const factor = ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const requiredMonthlySip = targetCorpus / factor;
  const totalInvested = requiredMonthlySip * n;
  const estimatedReturns = Math.max(0, targetCorpus - totalInvested);

  return {
    requiredMonthlySip: Math.round(requiredMonthlySip),
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.round(estimatedReturns),
  };
}
