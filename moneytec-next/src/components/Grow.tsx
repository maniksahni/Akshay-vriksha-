import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { inr, sipValue, useMobile } from './ui';

const MONTHLY = 5000;
const RATE = 12;
const YEARS = 30;
const MILESTONES = [
  { at: 0, line: 'It starts small.', sub: 'A regular contribution, built around your budget.' },
  { at: 10, line: 'Then it starts to show.', sub: 'A decade in, growth is doing a real share of the work.' },
  { at: 20, line: 'See the longer view.', sub: 'Explore how the assumed return changes the illustration.' },
  { at: 30, line: 'Keep the goal in view.', sub: 'Review progress and suitability as your circumstances change.' },
];
const W = 1000, H = 520;
const MAX = sipValue(MONTHLY, RATE, YEARS * 12);
const pt = (y: number) => [(y / YEARS) * W, H - (sipValue(MONTHLY, RATE, y * 12) / MAX) * (H - 24)] as const;
const ptInvested = (y: number) => [(y / YEARS) * W, H - ((MONTHLY * 12 * y) / MAX) * (H - 24)] as const;

/** Pinned on laptop: scroll through thirty years of one SIP. On phone, a slider drives the same scene. */
export function Grow() {
  const mobile = useMobile();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [scrollYear, setScrollYear] = useState(0);
  const [slideYear, setSlideYear] = useState(10);
  useMotionValueEvent(p, 'change', (v) => setScrollYear(Math.min(YEARS, Math.max(0, ((v - 0.06) / 0.84) * YEARS))));
  const year = mobile ? slideYear : scrollYear;
  const whole = Math.round(year);

  const value = sipValue(MONTHLY, RATE, year * 12);
  const invested = MONTHLY * 12 * year;
  const ms = MILESTONES.reduce((a, m) => (whole >= m.at ? m : a), MILESTONES[0]);

  const curve = useMemo(() => Array.from({ length: YEARS * 4 + 1 }, (_, i) => pt(i / 4)), []);
  const upto = curve.filter(([x]) => x <= (year / YEARS) * W + 0.01);
  const line = upto.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = upto.length > 1 ? `${line} L${upto[upto.length - 1][0]},${H} L0,${H} Z` : '';
  const [tx, ty] = pt(year);
  const [ix, iy] = ptInvested(year);
  const ghost = curve.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  const scene = (
    <div className="wrap-wide relative w-full">
      <p aria-hidden className="pointer-events-none absolute -top-[6vh] right-0 select-none text-[clamp(10rem,30vw,28rem)] font-semibold leading-none tracking-[-0.08em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.07)]">{String(whole).padStart(2, '0')}</p>
      <div className="relative grid gap-8 md:grid-cols-[0.75fr_1.6fr] md:items-center md:gap-12">
        <div>
          <p className="kicker">One SIP. {YEARS} years.</p>
          <div className="relative mt-4 h-[2.3em] text-[clamp(2rem,4.6vw,4rem)] md:h-[2.2em]">
            <AnimatePresence mode="wait">
              <motion.p key={ms.line} className="display absolute inset-0" initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }} transition={{ duration: 0.45 }}>
                {ms.line}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="lede mt-2 max-w-sm">{ms.sub}</p>
          <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-6">
            <div><dt className="text-[11px] uppercase tracking-[0.16em] text-dim">Year</dt><dd className="display mt-1 text-[clamp(1.8rem,3.6vw,3rem)] tabular-nums">{whole}</dd></div>
            <div><dt className="text-[11px] uppercase tracking-[0.16em] text-dim">You put in</dt><dd className="display mt-1 whitespace-nowrap text-[clamp(1.2rem,2.4vw,2rem)] tabular-nums text-haze">{inr(invested)}</dd></div>
            <div><dt className="text-[11px] uppercase tracking-[0.16em] text-dim">It could be</dt><dd className="display grad mt-1 whitespace-nowrap text-[clamp(1.2rem,2.4vw,2rem)] tabular-nums">{inr(value)}</dd></div>
          </dl>
          {mobile && (
            <label className="mt-6 block text-[13px] text-haze">
              Explore the timeline · <b className="text-paper">{slideYear} years</b>
              <input className="slider" type="range" min="1" max="30" value={slideYear} onChange={(e) => setSlideYear(Number(e.target.value))} aria-label="Illustration timeline in years" style={{ ['--fill' as string]: `${((slideYear - 1) / 29) * 100}%` }} />
            </label>
          )}
        </div>

        <div className="glass relative overflow-hidden p-3 sm:p-6">
          <svg viewBox={`-10 -10 ${W + 20} ${H + 40}`} className="h-auto w-full" aria-hidden>
            <defs>
              <linearGradient id="g-line" x1="0" x2="1"><stop offset="0" stopColor="#E8CFA0" /><stop offset="0.5" stopColor="#C9A06A" /><stop offset="1" stopColor="#8E6A43" /></linearGradient>
              <linearGradient id="g-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#C9A06A" stopOpacity="0.45" /><stop offset="1" stopColor="#8E6A43" stopOpacity="0" /></linearGradient>
              <filter id="g-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8" /></filter>
            </defs>
            {[0, 10, 20, 30].map((y) => (
              <g key={y}>
                <line x1={(y / YEARS) * W} x2={(y / YEARS) * W} y1="0" y2={H} stroke="#fff" strokeOpacity={whole >= y ? 0.14 : 0.05} strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
                <text x={(y / YEARS) * W} y={H + 26} fill="#fff" fillOpacity={whole >= y ? 0.6 : 0.25} fontSize="18" textAnchor={y === 0 ? 'start' : y === 30 ? 'end' : 'middle'}>Year {y}</text>
              </g>
            ))}
            <path d={ghost} fill="none" stroke="#fff" strokeOpacity="0.08" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            {area && <path d={area} fill="url(#g-area)" />}
            <line x1="0" y1={H} x2={ix} y2={iy} stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
            <path d={line} fill="none" stroke="url(#g-line)" strokeWidth="10" strokeLinecap="round" filter="url(#g-glow)" opacity="0.6" vectorEffect="non-scaling-stroke" />
            <path d={line} fill="none" stroke="url(#g-line)" strokeWidth="3.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {[10, 20, 30].map((my) => {
              const [mx, mY] = pt(my);
              const on = year >= my;
              return (
                <motion.g key={my} initial={false} animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.4 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: `${mx}px ${mY}px` }}>
                  <circle cx={mx} cy={mY} r="22" fill="none" stroke="#E8CFA0" strokeOpacity="0.35" />
                  <circle cx={mx} cy={mY} r="7" fill="#E8CFA0" />
                  <rect x={mx - (my === 30 ? 180 : 75)} y={mY + (my === 30 ? 4 : -64)} width="150" height="36" rx="18" fill="rgba(11,10,9,0.85)" stroke="rgba(255,255,255,0.15)" />
                  <text x={mx - (my === 30 ? 105 : 0)} y={mY + (my === 30 ? 28 : -40)} textAnchor="middle" fill="#F4F1F8" fontSize="17" fontWeight="600">{inr(sipValue(MONTHLY, RATE, my * 12))}</text>
                </motion.g>
              );
            })}
            <circle cx={tx} cy={ty} r="14" fill="#C9A06A" opacity="0.25" />
            <circle cx={tx} cy={ty} r="6" fill="#fff" />
          </svg>
          <div className="pointer-events-none mt-2 flex gap-4 text-[11px] text-dim sm:absolute sm:left-8 sm:top-7 sm:mt-0">
            <span className="flex items-center gap-1.5"><i className="h-0.5 w-4 bg-gradient-to-r from-amber to-violet" />Illustrated value</span>
            <span className="flex items-center gap-1.5"><i className="h-0 w-4 border-t border-dashed border-white/50" />Contributions</span>
          </div>
        </div>
      </div>
      <p className="mt-6 text-center text-[11px] leading-relaxed text-dim">₹5,000 per month, assuming CAGR of 12% per year. Illustration only. Returns are not guaranteed. Mutual fund investments are subject to market risks.</p>
    </div>
  );

  const warm = <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_60%,rgba(201,160,106,0.22),rgba(142,106,67,0.12)_45%,transparent_75%)] transition-opacity duration-300" style={{ opacity: Math.min(1, year / YEARS + 0.1) }} />;
  if (mobile) return <section id="grow" data-dark className="relative overflow-hidden py-14">{warm}{scene}</section>;
  return (
    <section id="grow" data-dark ref={ref} className="relative h-[300svh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden pt-14">{warm}{scene}</div>
    </section>
  );
}
