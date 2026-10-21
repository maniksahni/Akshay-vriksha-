import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { whatsappLink } from '../../data/site';
import { formatINR } from '../../utils/formatters';
import { Scramble, Spotlight } from '../ui/effects';
import { EASE, FadeUp, MaskLines, useTween } from '../ui/motion';

const INFLATION = 6;
const RETURN = 12;

type Goal = { id: string; name: string; hindi: string; cost: number; years: number; icon: JSX.Element };

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const GOALS: Goal[] = [
  {
    id: 'home', name: 'Dream home', hindi: 'गृह', cost: 6000000, years: 10,
    icon: <svg viewBox="0 0 32 32" {...stroke}><path d="M4 15 16 5l12 10" /><path d="M7 13v14h18V13" /><path d="M13 27v-8h6v8" /></svg>,
  },
  {
    id: 'education', name: 'Child’s education', hindi: 'विद्या', cost: 2500000, years: 15,
    icon: <svg viewBox="0 0 32 32" {...stroke}><path d="M2 12 16 6l14 6-14 6z" /><path d="M8 15v6c0 2 4 4 8 4s8-2 8-4v-6" /><path d="M30 12v8" /></svg>,
  },
  {
    id: 'wedding', name: 'Child’s wedding', hindi: 'विवाह', cost: 3000000, years: 18,
    icon: <svg viewBox="0 0 32 32" {...stroke}><circle cx="12" cy="19" r="7" /><circle cx="20" cy="19" r="7" /><path d="m13 8 3-4 3 4-3 3z" /></svg>,
  },
  {
    id: 'retirement', name: 'Retirement', hindi: 'विश्राम', cost: 15000000, years: 25,
    icon: <svg viewBox="0 0 32 32" {...stroke}><path d="M16 4v24" /><path d="M16 9c-5 0-9 3-9 7h18c0-4-4-7-9-7z" /><path d="M6 28h20" /></svg>,
  },
  {
    id: 'milestone', name: 'Personal milestone', hindi: 'संकल्प', cost: 500000, years: 3,
    icon: <svg viewBox="0 0 32 32" {...stroke}><circle cx="16" cy="16" r="11" /><circle cx="16" cy="16" r="5" /><path d="m16 16 10-10M22 6h4v4" /></svg>,
  },
];

/** Short rupee label for tight slider headers: ₹60 L, ₹1.5 Cr. */
const shortINR = (n: number) =>
  n >= 10000000 ? `₹${+(n / 10000000).toFixed(2)} Cr` : `₹${+(n / 100000).toFixed(1)} L`;

function monthlyFor(target: number, years: number) {
  const i = RETURN / 12 / 100;
  const n = years * 12;
  return target / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
}

function Slider({ label, value, min, max, step, onChange, display }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  return (
    <label className="block min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] text-ink/55 lg:text-sm">{label}</span>
        <span className="font-display text-lg tabular-nums lg:text-2xl">{display}</span>
      </div>
      <input
        type="range"
        className="range range-ink"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--fill' as string]: `${((value - min) / (max - min)) * 100}%` }}
      />
    </label>
  );
}

export function Goals() {
  const [goalId, setGoalId] = useState(GOALS[0].id);
  const goal = GOALS.find((g) => g.id === goalId)!;
  const [cost, setCost] = useState(goal.cost);
  const [years, setYears] = useState(goal.years);

  const pick = (g: Goal) => {
    setGoalId(g.id);
    setCost(g.cost);
    setYears(g.years);
  };

  const future = useMemo(() => cost * Math.pow(1 + INFLATION / 100, years), [cost, years]);
  const sip = useMemo(() => monthlyFor(future, years), [future, years]);
  const tSip = useTween(sip);
  const tFuture = useTween(future);

  return (
    <section id="goals" className="relative overflow-hidden bg-paper py-10 text-ink lg:py-32">
      <div className="pointer-events-none absolute -right-10 top-0 select-none font-deva text-[30vw] leading-none text-ink/[0.04] lg:text-[22vw]">{goal.hindi}</div>
      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <Scramble text="Goal planner" className="eyebrow mb-2 text-[10px] text-ember lg:mb-4 lg:text-[11px]" />
            <MaskLines
              lines={[<>What are you <br className="hidden lg:block" /><span className="italic text-ember">planting for?</span></>]}
              className="font-display text-[clamp(1.9rem,5vw,5.2rem)] leading-[0.95] tracking-[-0.02em]"
            />
          </div>
          <FadeUp delay={0.1} className="hidden lg:block">
            <p className="ml-auto max-w-md text-ink/60">
              Pick a goal and tell us what it costs today. We’ll account for inflation and show the monthly SIP that could get you there.
            </p>
          </FadeUp>
        </div>

        <div className="mt-4 grid gap-4 lg:mt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          {/* goal picker: a swipeable chip row on phones, a stacked list on desktop */}
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:gap-3 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden" role="radiogroup" aria-label="Choose a goal">
            {GOALS.map((g) => {
              const on = g.id === goalId;
              return (
                <button
                  key={g.id}
                  role="radio"
                  aria-checked={on}
                  onClick={() => pick(g)}
                  className={`group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-full border px-4 py-2.5 text-left transition-colors duration-500 lg:rounded-2xl lg:px-5 lg:py-4 ${
                    on ? 'border-ink bg-ink text-bone' : 'border-ink/15 hover:border-ink/40'
                  }`}
                >
                  <span className={`h-5 w-5 shrink-0 transition-colors lg:h-8 lg:w-8 ${on ? 'text-gold' : 'text-ember'}`}>{g.icon}</span>
                  <span className="whitespace-nowrap text-sm font-medium lg:font-display lg:text-2xl lg:font-normal">{g.name}</span>
                  <span className={`ml-auto hidden font-deva text-xl lg:block ${on ? 'text-gold/80' : 'text-ink/25'}`}>{g.hindi}</span>
                </button>
              );
            })}
          </div>

          <Spotlight className="overflow-hidden rounded-[22px] bg-ink text-bone lg:rounded-[28px]" color="rgba(217,174,91,0.18)" tilt={4}>
            <div className="p-5 lg:p-10">
              <AnimatePresence mode="wait">
                <motion.p
                  key={goal.id}
                  className="text-[11px] text-bone/50 lg:text-sm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {goal.name} in {years} years will cost about <span className="text-bone">{formatINR(tFuture, true)}</span>
                </motion.p>
              </AnimatePresence>
              <div className="mt-2 flex items-end gap-3">
                <p className="font-display text-[clamp(2.6rem,9vw,6.5rem)] leading-none tabular-nums text-foil">{formatINR(Math.round(tSip / 100) * 100)}</p>
                <p className="pb-1 text-sm text-bone/60 lg:pb-3 lg:text-lg">/ month</p>
              </div>
              <p className="mt-1 text-[11px] text-bone/50 lg:text-sm">is the SIP that could get you there.</p>

              <div className="mt-4 grid grid-cols-2 gap-x-5 rounded-2xl bg-bone px-4 py-3 text-ink lg:mt-8 lg:gap-x-8 lg:px-6 lg:py-5">
                <Slider label="Cost today" value={cost} min={100000} max={30000000} step={100000} onChange={setCost} display={shortINR(cost)} />
                <Slider label="In" value={years} min={1} max={30} step={1} onChange={setYears} display={`${years} yrs`} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 lg:mt-8">
                <p className="max-w-xs text-[9px] leading-snug text-bone/40 lg:text-[11px]">
                  Assumes {INFLATION}% inflation and a {RETURN}% p.a. return, for illustration only. Mutual funds are subject to market risks.
                </p>
                <a
                  href={whatsappLink(`Namaste! I'm planning for: ${goal.name} (about ${formatINR(cost, true)} today, in ${years} years). Can you help me plan a SIP?`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 shrink-0 items-center rounded-full bg-gold px-4 text-xs font-semibold text-night transition-colors hover:bg-gold-soft lg:h-12 lg:px-6 lg:text-sm"
                >
                  Plan this goal →
                </a>
              </div>
            </div>
          </Spotlight>
        </div>
      </div>
    </section>
  );
}
