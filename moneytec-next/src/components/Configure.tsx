import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { wa } from '../data';
import { GoalPlanner } from './GoalPlanner';
import { EASE, inr, Scene, sipValue, spotlight, Title, useTween } from './ui';

const AMOUNTS = [1000, 3000, 5000, 10000, 25000, 50000];
const DURATIONS = [5, 10, 15, 20, 25, 30];
const RATES = [6, 10, 12, 14, 15, 16];

function Segmented<T extends number>({ options, value, onChange, label, fmt }: { options: T[]; value: T; onChange: (v: T) => void; label: string; fmt: (v: T) => string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-2">
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={o === value} onClick={() => onChange(o)} className="seg">
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
    <svg viewBox="0 0 120 120" className="h-24 w-24 shrink-0 -rotate-90 sm:h-28 sm:w-28" aria-hidden>
      <defs><linearGradient id="ring" x1="0" x2="1"><stop offset="0" stopColor="#FF9F0A" /><stop offset="0.5" stopColor="#FF375F" /><stop offset="1" stopColor="#BF5AF2" /></linearGradient></defs>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      <motion.circle cx="60" cy="60" r={r} fill="none" stroke="url(#ring)" strokeWidth="10" strokeLinecap="round" strokeDasharray={c} animate={{ strokeDashoffset: c * (1 - share) }} transition={{ duration: 0.7, ease: EASE }} />
    </svg>
  );
}

export function Configure() {
  const [mode, setMode] = useState<'sip' | 'goal'>('sip');
  useEffect(() => {
    const openGoal = () => setMode('goal');
    window.addEventListener('moneytec:plan-goal', openGoal);
    return () => window.removeEventListener('moneytec:plan-goal', openGoal);
  }, []);
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(12);

  const total = useMemo(() => sipValue(monthly, rate, years * 12), [monthly, rate, years]);
  const late = useMemo(() => sipValue(monthly, rate, Math.max(0, years - 5) * 12), [monthly, rate, years]);
  const invested = monthly * years * 12;
  const growth = Math.max(0, total - invested);
  const tTotal = useTween(total);
  const tLate = useTween(late);

  return (
    <section id="calculator" data-dark className="relative overflow-hidden py-14 sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-20 h-[50vmin] w-[50vmin] rounded-full bg-violet/15 blur-[120px]" />
      <Scene className="wrap-wide relative">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">Your planning studio</p>
            <Title className="display mt-4 text-[clamp(2.4rem,5.6vw,5rem)]" text="Give your ambition / *a number.*" />
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
            <div className="glass space-y-6 p-4 sm:space-y-8 sm:p-8">
              <div>
                <p className="text-[17px] font-semibold tracking-[-0.02em] sm:text-[19px]">Monthly amount. <span className="text-dim">Pick what feels easy.</span></p>
                <div className="mt-4"><Segmented label="Monthly amount" options={AMOUNTS} value={monthly} onChange={setMonthly} fmt={(v) => inr(v, false)} /></div>
                <label className="mt-5 block">
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

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div onPointerMove={spotlight} className="glass ring-grad spot overflow-hidden p-5 sm:p-8">
                <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-rose/30 blur-[80px]" />
                <div className="relative flex items-center gap-5">
                  <GrowthRing share={total ? growth / total : 0} />
                  <div className="min-w-0">
                    <p className="text-[13px] text-haze">Illustrated value after {years} years</p>
                    <p className="display grad mt-1 text-[clamp(2.2rem,5vw,3.4rem)] tabular-nums">{inr(tTotal)}</p>
                  </div>
                </div>
                <div className="relative mt-6 space-y-2.5 border-t border-line pt-5 text-[14px]">
                  <div className="flex justify-between"><span className="text-haze">You put in</span><span className="font-semibold tabular-nums">{inr(invested)}</span></div>
                  <div className="flex justify-between"><span className="text-haze">Growth</span><span className="font-semibold tabular-nums text-mint">+{inr(growth)}</span></div>
                </div>
                <div className="relative mt-6">
                  <p className="text-[13px] text-haze">Start now vs. start in 5 years</p>
                  <div className="mt-3 space-y-3">
                    <div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.08]"><motion.div className="h-full rounded-full bg-gradient-to-r from-amber via-rose to-violet" initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }} /></div>
                      <p className="mt-1.5 flex justify-between text-[12px]"><span>Start now</span><span className="font-semibold tabular-nums">{inr(tTotal)}</span></p>
                    </div>
                    <div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.08]"><motion.div className="h-full rounded-full bg-white/35" animate={{ width: `${total ? (late / total) * 100 : 0}%` }} transition={{ duration: 0.5, ease: EASE }} /></div>
                      <p className="mt-1.5 flex justify-between text-[12px] text-haze"><span>Start in 5 years</span><span className="font-semibold tabular-nums">{inr(tLate)}</span></p>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] font-semibold text-amber">Illustrated difference: {inr(total - late)}.</p>
                </div>
                <a href={wa(`Hi Gulshan! I'd like to discuss a SIP illustration: ${inr(monthly, false)} monthly for ${years} years, assuming ${rate}% annually. Illustrated value ${inr(total)}; contributions ${inr(invested)}. I understand returns are not guaranteed.`)} target="_blank" rel="noreferrer" className="btn-light relative mt-6 w-full pr-2">Discuss this illustration <span className="arrow">↗</span></a>
                <p className="relative mt-3 text-[11px] leading-snug text-dim">Contributions at the start of each month, assuming {rate}% CAGR per year. Illustration only; returns are not guaranteed. Mutual fund investments are subject to market risks.</p>
              </div>
            </aside>
          </div>
        </div>
      </Scene>
    </section>
  );
}
