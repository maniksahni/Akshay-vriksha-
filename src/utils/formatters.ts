/**
 * Indian Rupee Currency Formatter
 * Supports full formatting (₹1,50,000) and luxury abbreviated formatting (₹1.50 Lakh / ₹2.85 Cr)
 */

export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount)) return '₹0';

  if (!compact) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Compact Indian Notation
  const abs = Math.abs(amount);
  if (abs >= 10000000) {
    // 1 Crore = 10,000,000
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  } else if (abs >= 100000) {
    // 1 Lakh = 100,000
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(2)} Lakh`;
  } else if (abs >= 1000) {
    const k = amount / 1000;
    return `₹${k.toFixed(1)}k`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatPercentage(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function formatYears(years: number): string {
  return years === 1 ? '1 Year' : `${years} Years`;
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
