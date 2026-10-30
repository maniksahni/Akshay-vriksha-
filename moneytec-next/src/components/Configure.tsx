import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { wa } from '../data';
import { GoalPlanner } from './GoalPlanner';
import { EASE, inr, Scene, sipValue, spotlight, Title, useMobile, useTween } from './ui';

const AMOUNTS = [1000, 3000, 5000, 10000, 25000, 50000];
const DURATIONS = [5, 10, 15, 20, 25, 30];
const RATES = [6, 10, 12, 14, 15, 16];

function Segmented<T extends number>({ options, value, onChange, label, fmt }: { options: T[]; value: T; onChange: (v: T) => void; label: string; fmt: (v: T) => string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-2">
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={o === value} tabIndex={o === value ? 0 : -1} onClick={() => onChange(o)} onKeyDown={e => {
          const index = options.indexOf(value);
          const next = e.key === 'Home' ? 0 : e.key === 'End' ? options.length - 1 : ['ArrowRight', 'ArrowDown'].includes(e.key) ? (index + 1) % options.length : ['ArrowLeft', 'ArrowUp'].includes(e.key) ? (index - 1 + options.length) % options.length : -1;
          if (next < 0) return;
          e.preventDefault(); onChange(options[next]);
          (e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
        }} className="seg">
          {fmt(o)}
        </button>
      ))}
    </div>
  );
}

/** A dial of light: the ring fills with the share of the final value that came from growth. */
function GrowthRing({ share }: { share: number }) {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="calc-ring h-24 w-24 shrink-0 -rotate-90 sm:h-28 sm:w-28" aria-hidden>
      <defs><linearGradient id="ring" x1="0" x2="1"><stop offset="0" stopColor="#E8CFA0" /><stop offset="0.5" stopColor="#C9A06A" /><stop offset="1" stopColor="#8E6A43" /></linearGradient></defs>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      <motion.circle cx="60" cy="60" r={r} fill="none" stroke="url(#ring)" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} animate={{ strokeDashoffset: c * (1 - share) }} transition={{ duration: 0.7, ease: EASE }} />
    </svg>
  );
}

/**
 * The illustration as a living chart: the gold curve is the illustrated value, the dashed line what you put
 * in, and the gap between them is growth. It redraws whenever the amount, horizon or return changes.
 */
function GrowthChart({ monthly, rate, years, compact }: { monthly: number; rate: number; years: number; compact: boolean }) {
  const W = 360, H = compact ? 84 : 150, N = 30;
  const max = sipValue(monthly, rate, years * 12) || 1;
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const y = (i / N) * years;
    return { x: (i / N) * W, v: H - (sipValue(monthly, rate, y * 12) / max) * (H - 8), c: H - ((monthly * 12 * y) / max) * (H - 8) };
  });
  const line = (k: 'v' | 'c') => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p[k].toFixed(1)}`).join(' ');
  const area = `${line('v')} L${W},${H} L0,${H} Z`;
  const gap = `${line('v')} ${pts.slice().reverse().map((p) => `L${p.x.toFixed(1)},${p.c.toFixed(1)}`).join(' ')} Z`;
  const t = { duration: 0.7, ease: EASE };
  return (
    <div className="calc-chart">
      <svg viewBox={`0 -6 ${W} ${H + 26}`} className="h-auto w-full" aria-hidden>
        <defs>
          <linearGradient id="calc-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#D9B47E" stopOpacity=".28" /><stop offset="1" stopColor="#D9B47E" stopOpacity="0" /></linearGradient>
          <linearGradient id="calc-line" x1="0" x2="1"><stop offset="0" stopColor="#8E6A43" /><stop offset=".6" stopColor="#D9B47E" /><stop offset="1" stopColor="#F3DFB6" /></linearGradient>
          <pattern id="calc-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#D9B47E" strokeOpacity=".22" strokeWidth="1.2" /></pattern>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="#E9D7B4" strokeOpacity=".07" />)}
        <motion.path initial={false} animate={{ d: area }} transition={t} fill="url(#calc-area)" />
        <motion.path initial={false} animate={{ d: gap }} transition={t} fill="url(#calc-hatch)" />
        <motion.path initial={false} animate={{ d: line('c') }} transition={t} fill="none" stroke="#EFE8DC" strokeOpacity=".45" strokeWidth="1.2" strokeDasharray="4 4" />
        <motion.path initial={false} animate={{ d: line('v') }} transition={t} fill="none" stroke="url(#calc-line)" strokeWidth="2.4" strokeLinecap="round" />
        <motion.circle initial={false} animate={{ cy: pts[N].v }} transition={t} cx={W} r="4.5" fill="#F3DFB6" />
        <motion.circle initial={false} animate={{ cy: pts[N].v }} transition={t} cx={W} r="11" fill="#D9B47E" opacity=".2" />
        <text x="0" y={H + 18} fill="#EFE8DC" fillOpacity=".4" fontSize="10">Year 0</text>
        <text x={W} y={H + 18} fill="#EFE8DC" fillOpacity=".4" fontSize="10" textAnchor="end">Year {years}</text>
      </svg>
      <div className="calc-chart-legend">
        <span><i className="calc-key-line" />Illustrated value</span>
        <span><i className="calc-key-dash" />Contributions</span>
        <span><i className="calc-key-hatch" />Growth</span>
      </div>
    </div>
  );
}

export function Configure() {
  const mobile = useMobile();
  const [mode, setMode] = useState<'sip' | 'goal'>('sip');
  useEffect(() => {
    const openGoal = () => setMode('goal');
    const openSip = () => setMode('sip');
    window.addEventListener('moneytec:plan-goal', openGoal);
    window.addEventListener('moneytec:plan-sip', openSip);
    return () => { window.removeEventListener('moneytec:plan-goal', openGoal); window.removeEventListener('moneytec:plan-sip', openSip); };
  }, []);
  const [monthly, setMonthlyRaw] = useState(5000);
  const [years, setYearsRaw] = useState(20);
  const [rate, setRateRaw] = useState(12);
  // phones: the result lives in a sheet that rises the moment any choice is made
  const [sheet, setSheet] = useState(false);
  const open = () => { if (mobile) setSheet(true); };
  const setMonthly = (v: number) => { setMonthlyRaw(v); open(); };
  const setYears = (v: number) => { setYearsRaw(v); open(); };
  const setRate = (v: number) => { setRateRaw(v); open(); };
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!mobile || !section.current) return;
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) setSheet(false); }, { threshold: 0.05 });
    io.observe(section.current);
    return () => io.disconnect();
  }, [mobile]);

  const total = useMemo(() => sipValue(monthly, rate, years * 12), [monthly, rate, years]);
  const late = useMemo(() => sipValue(monthly, rate, Math.max(0, years - 5) * 12), [monthly, rate, years]);
  const invested = monthly * years * 12;
  const growth = Math.max(0, total - invested);
  const tTotal = useTween(total);
  const tLate = useTween(late);

  const result = (
              <div onPointerMove={spotlight} className="glass ring-grad spot overflow-hidden p-5 sm:p-8">
                <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,160,106,0.48),transparent)]" />
                <div className="calc-head relative flex items-center gap-5">
                  <GrowthRing share={total ? growth / total : 0} />
                  <div className="min-w-0">
                    <p className="calc-label text-[13px] text-haze">Illustrated value after {years} years</p>
                    <p className="calc-total display grad mt-1 text-[clamp(2.2rem,5vw,3.4rem)] tabular-nums">{inr(tTotal)}</p>
                  </div>
                </div>
                <div className="calc-split relative mt-6 space-y-2.5 border-t border-line pt-5 text-[14px]">
                  <div className="flex justify-between"><span className="text-haze">You put in</span><span className="font-semibold tabular-nums">{inr(invested)}</span></div>
                  <div className="flex justify-between"><span className="text-haze">Growth</span><span className="font-semibold tabular-nums text-mint">+{inr(growth)}</span></div>
                </div>
                <div className="calc-block relative mt-6"><GrowthChart monthly={monthly} rate={rate} years={years} compact={mobile} /></div>
                <div className="calc-block relative mt-6">
                  <p className="calc-label text-[13px] text-haze">Start now vs. start in 5 years</p>
                  <div className="calc-compare mt-3 space-y-3">
                    <div>
                      <div className="calc-bar h-2.5 overflow-hidden rounded-full bg-white/[0.08]"><motion.div className="h-full rounded-full bg-gradient-to-r from-amber via-rose to-violet" initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }} /></div>
                      <p className="mt-1.5 flex justify-between text-[12px]"><span>Start now</span><span className="font-semibold tabular-nums">{inr(tTotal)}</span></p>
                    </div>
                    <div>
                      <div className="calc-bar h-2.5 overflow-hidden rounded-full bg-white/[0.08]"><motion.div className="h-full rounded-full bg-white/35" animate={{ width: `${total ? (late / total) * 100 : 0}%` }} transition={{ duration: 0.5, ease: EASE }} /></div>
                      <p className="mt-1.5 flex justify-between text-[12px] text-haze"><span>Start in 5 years</span><span className="font-semibold tabular-nums">{inr(tLate)}</span></p>
                    </div>
                  </div>
                  <p className="calc-diff mt-3 text-[13px] font-semibold text-amber">Illustrated difference: {inr(total - late)}.</p>
                </div>
                <a href={wa(`Hi Gulshan! I'd like to discuss a SIP illustration: ${inr(monthly, false)} monthly for ${years} years, assuming ${rate}% annually. Illustrated value ${inr(total)}; contributions ${inr(invested)}. I understand returns are not guaranteed.`)} target="_blank" rel="noreferrer" className="btn-light relative mt-6 w-full pr-2">Discuss this illustration <span className="arrow">↗</span></a>
                <p className="calc-note relative mt-3 text-[11px] leading-snug text-dim">Contributions at the start of each month, assuming {rate}% CAGR per year. Illustration only; returns are not guaranteed. Mutual fund investments are subject to market risks.</p>
              </div>
  );

  return (
    <section id="calculator" ref={section} data-dark className="relative overflow-hidden py-14 sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-20 h-[50vmin] w-[50vmin] rounded-full bg-[radial-gradient(closest-side,rgba(142,106,67,0.24),transparent)]" />
      <Scene className="wrap-wide relative">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">Your planning studio</p>
            <Title className="display calc-title mt-4" text="Give your ambition / *a number.*" />
          </div>
          <p className="lede max-w-sm">Explore what your SIP could become, or work backwards from the life you want to build.</p>
        </div>

        <div className="glass mt-8 inline-grid w-full grid-cols-2 gap-1 rounded-full p-1 sm:w-auto" role="group" aria-label="Calculator mode">
          {([['sip', 'Explore my SIP', 'Amount → future value'], ['goal', 'Plan my goal', 'Future goal → monthly SIP']] as const).map(([k, t, s]) => (
            <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)} className="relative rounded-full px-4 py-2.5 text-left sm:px-6">
              {mode === k && <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-full bg-paper" transition={{ duration: 0.45, ease: EASE }} />}
              <span className={`relative block text-[14px] font-semibold transition-colors ${mode === k ? 'text-ink' : 'text-paper'}`}>{t}</span>
              <span className={`relative block text-[11px] transition-colors ${mode === k ? 'text-ink/60' : 'text-dim'}`}>{s}</span>
            </button>
          ))}
        </div>

        <div hidden={mode !== 'goal'} className="mt-6"><GoalPlanner /></div>
        <div hidden={mode !== 'sip'}>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_440px] lg:gap-8">
            <div className="calc-controls glass space-y-6 p-4 sm:space-y-8 sm:p-8">
              <div>
                <p className="text-[17px] font-semibold tracking-[-0.02em] sm:text-[19px]">Monthly amount. <span className="text-dim">Pick what feels easy.</span></p>
                <div className="mt-4"><Segmented label="Monthly amount" options={AMOUNTS} value={monthly} onChange={setMonthly} fmt={(v) => inr(v, false)} /></div>
                <label className="calc-fine mt-5 block">
                  <span className="flex items-baseline justify-between text-[13px] text-haze">
                    <span>Or fine-tune it</span>
                    <span className="font-semibold tabular-nums text-paper">{inr(monthly, false)}</span>
                  </span>
                  <input type="range" className="slider" min={500} max={100000} step={500} value={monthly} aria-label="Monthly amount" onChange={(e) => setMonthly(Number(e.target.value))} style={{ ['--fill' as string]: `${((monthly - 500) / 99500) * 100}%` }} />
                </label>
              </div>
              <div>
                <p className="text-[17px] font-semibold tracking-[-0.02em] sm:text-[19px]">How long. <span className="text-dim">Longer is kinder.</span></p>
                <div className="mt-4"><Segmented label="Years" options={DURATIONS} value={years} onChange={setYears} fmt={(v) => `${v} years`} /></div>
              </div>
              <div>
                <p className="text-[17px] font-semibold tracking-[-0.02em] sm:text-[19px]">Assumed return. <span className="text-dim">For illustration.</span></p>
                <div className="mt-4"><Segmented label="Assumed return" options={RATES} value={rate} onChange={setRate} fmt={(v) => `${v}% a year`} /></div>
              </div>
            </div>

            {mobile ? (
              <button type="button" className="calc-peek" onClick={() => setSheet(true)} aria-expanded={sheet} aria-controls="calc-sheet">
                <span className="calc-label">Illustrated value after {years} years</span>
                <span className="calc-peek-value">{inr(tTotal)} <span aria-hidden>↑</span></span>
              </button>
            ) : (
              <aside className="calc-result lg:sticky lg:top-24 lg:self-start">{result}</aside>
            )}
          </div>
        </div>
      </Scene>
      {mobile && createPortal(
        <AnimatePresence>
          {sheet && mode === 'sip' && (
            <motion.div
              id="calc-sheet"
              role="dialog"
              aria-label={`Illustrated value after ${years} years`}
              className="calc-sheet calc-result"
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              exit={{ y: '105%' }}
              transition={{ duration: 0.5, ease: EASE }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, i) => { if (i.offset.y > 80 || i.velocity.y > 500) setSheet(false); }}
            >
              <button type="button" className="calc-sheet-handle" onClick={() => setSheet(false)} aria-label="Close"><span /></button>
              {result}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}
