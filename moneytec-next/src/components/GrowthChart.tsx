import { motion } from 'framer-motion';
import { useId } from 'react';
import { EASE, sipValue } from './ui';

/**
 * The illustration as a living chart: the gradient curve is the illustrated value, the dashed line what you put
 * in, and the gap between them is growth. It redraws whenever the amount, horizon or return changes. `start` is
 * money already set aside, which grows at the same rate from year 0.
 */
export function GrowthChart({ monthly, rate, years, compact, start = 0 }: { monthly: number; rate: number; years: number; compact: boolean; start?: number }) {
  // two charts live on the page at once, and an id inside a hidden one would leave the other uncoloured
  const id = useId().replace(/:/g, '');
  const W = 360, H = compact ? 84 : 150, N = 30;
  const value = (y: number) => sipValue(monthly, rate, y * 12) + start * Math.pow(1 + rate / 100, y);
  const max = value(years) || 1;
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const y = (i / N) * years;
    return { x: (i / N) * W, v: H - (value(y) / max) * (H - 8), c: H - ((start + monthly * 12 * y) / max) * (H - 8) };
  });
  const line = (k: 'v' | 'c') => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p[k].toFixed(1)}`).join(' ');
  const area = `${line('v')} L${W},${H} L0,${H} Z`;
  const gap = `${line('v')} ${pts.slice().reverse().map((p) => `L${p.x.toFixed(1)},${p.c.toFixed(1)}`).join(' ')} Z`;
  const t = { duration: 0.7, ease: EASE };
  return (
    <div className="calc-chart">
      <svg viewBox={`0 -6 ${W} ${H + 26}`} className="h-auto w-full" aria-hidden>
        <defs>
          <linearGradient id={`calc-area-${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#FF375F" stopOpacity=".28" /><stop offset="1" stopColor="#FF375F" stopOpacity="0" /></linearGradient>
          <linearGradient id={`calc-line-${id}`} x1="0" x2="1"><stop offset="0" stopColor="#BF5AF2" /><stop offset=".6" stopColor="#FF375F" /><stop offset="1" stopColor="#F59E0B" /></linearGradient>
          <pattern id={`calc-hatch-${id}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#FF375F" strokeOpacity=".22" strokeWidth="1.2" /></pattern>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="#17131D" strokeOpacity=".07" />)}
        <motion.path initial={false} animate={{ d: area }} transition={t} fill={`url(#calc-area-${id})`} />
        <motion.path initial={false} animate={{ d: gap }} transition={t} fill={`url(#calc-hatch-${id})`} />
        <motion.path initial={false} animate={{ d: line('c') }} transition={t} fill="none" stroke="#17131D" strokeOpacity=".45" strokeWidth="1.2" strokeDasharray="4 4" />
        <motion.path initial={false} animate={{ d: line('v') }} transition={t} fill="none" stroke={`url(#calc-line-${id})`} strokeWidth="2.4" strokeLinecap="round" />
        <motion.circle initial={false} animate={{ cy: pts[N].v }} transition={t} cx={W} r="4.5" fill="#F59E0B" />
        <motion.circle initial={false} animate={{ cy: pts[N].v }} transition={t} cx={W} r="11" fill="#FF375F" opacity=".2" />
        <text x="0" y={H + 18} fill="#17131D" fillOpacity=".9" fontSize="11">Year 0</text>
        <text x={W} y={H + 18} fill="#17131D" fillOpacity=".9" fontSize="11" textAnchor="end">Year {years}</text>
      </svg>
      <div className="calc-chart-legend">
        <span><i className="calc-key-line" />Illustrated value</span>
        <span><i className="calc-key-dash" />Contributions</span>
        <span><i className="calc-key-hatch" />Growth</span>
      </div>
    </div>
  );
}
