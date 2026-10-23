import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { wa } from '../data';
import { EASE, FadeIn, Rise, inr, sipValue, useTween } from './ui';

function Slider({ label, value, min, max, step, onChange, display }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] text-chalk/60">{label}</span>
        <span className="font-display text-xl font-bold tabular-nums sm:text-2xl">{display}</span>
      </div>
      <input
        type="range"
        className="slider mt-1"
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

const RATES = [10, 12, 14];

export function GlowUp() {
  const [monthly, setMonthly] = useState(3000);
  const [age, setAge] = useState(24);
  const [until, setUntil] = useState(45);
  const [rate, setRate] = useState(12);

  const years = Math.max(1, until - age);
  const now = useMemo(() => sipValue(monthly, rate, years * 12), [monthly, rate, years]);
  const late = useMemo(() => sipValue(monthly, rate, Math.max(0, years - 5) * 12), [monthly, rate, years]);
  const invested = monthly * years * 12;
  const gap = now - late;

  const tNow = useTween(now);
  const tLate = useTween(late);
  const tGap = useTween(gap);
  const lateH = now > 0 ? Math.max(4, (late / now) * 100) : 0;
  const investedShare = now > 0 ? Math.min(100, (invested / now) * 100) : 0;

  return (
    <section id="glow-up" className="relative py-16 sm:py-24">
      <div className="wrap">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="kicker text-lime">01 · the glow-up calculator</p>
            <Rise className="h-display mt-3 text-[clamp(1.9rem,4.4vw,3.9rem)]">{'Small SIP. / *Big* main-character energy.'}</Rise>
          </div>
          <FadeIn delay={0.1}>
            <p className="max-w-md text-chalk/60 lg:ml-auto">Slide it around. Then watch what “I’ll start next year” actually costs you. Spoiler: a lot.</p>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="card mt-8 grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          {/* inputs */}
          <div className="space-y-4 border-b border-line p-5 sm:p-8 lg:border-b-0 lg:border-r">
            <Slider label="I can SIP every month" value={monthly} min={500} max={100000} step={500} onChange={setMonthly} display={inr(monthly, false)} />
            <Slider label="My age right now" value={age} min={18} max={50} step={1} onChange={(v) => { setAge(v); if (until <= v) setUntil(v + 1); }} display={`${age}`} />
            <Slider label="Grow it until age" value={until} min={Math.min(age + 1, 65)} max={65} step={1} onChange={setUntil} display={`${until}`} />
            <div>
              <p className="text-[13px] text-chalk/60">Assumed return per year</p>
              <div className="mt-2 flex gap-2">
                {RATES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRate(r)}
                    aria-pressed={rate === r}
                    className={`h-10 flex-1 rounded-full border text-sm font-semibold transition-colors ${rate === r ? 'border-lime bg-lime text-void' : 'border-line text-chalk/70 hover:border-lime/60'}`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-ash p-4">
              <p className="text-[12px] text-chalk/50">You put in</p>
              <p className="font-display text-2xl font-bold tabular-nums">{inr(invested)}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-chalk/70" animate={{ width: `${investedShare}%` }} transition={{ duration: 0.5, ease: EASE }} />
              </div>
              <p className="mt-2 text-[12px] text-chalk/50">
                The rest, <span className="text-lime">{inr(Math.max(0, now - invested))}</span>, is time doing its thing.
              </p>
            </div>
          </div>

          {/* output: start now vs start 5 years later */}
          <div className="relative p-5 sm:p-8">
            <p className="text-[13px] text-chalk/60">Start today, and by {until} you could have</p>
            <p className="font-display text-[clamp(2.6rem,9vw,5.2rem)] font-black leading-none tracking-[-0.04em] text-lime tabular-nums">{inr(tNow)}</p>

            <div className="mt-6 grid h-[200px] grid-cols-2 items-end gap-4 sm:h-[240px] sm:gap-6">
              <div className="flex h-full flex-col justify-end">
                <motion.div
                  className="relative w-full rounded-t-[22px] bg-lime shadow-[0_0_60px_-10px_rgba(212,255,58,0.7)]"
                  initial={{ height: 0 }}
                  whileInView={{ height: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: EASE }}
                >
                  <span className="absolute bottom-3 left-3 rounded-full bg-void px-2.5 py-1 text-[11px] font-semibold text-lime">start at {age}</span>
                </motion.div>
              </div>
              <div className="flex h-full flex-col justify-end">
                <motion.div
                  className="relative w-full rounded-t-[22px] bg-white/15"
                  animate={{ height: `${lateH}%` }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <span className="absolute -top-8 left-0 font-display text-sm font-bold tabular-nums text-chalk/70">{inr(tLate)}</span>
                  <span className="absolute bottom-3 left-3 whitespace-nowrap rounded-full bg-void px-2.5 py-1 text-[11px] font-semibold text-chalk/70">start at {age + 5}</span>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="sticker mt-5 inline-block bg-coral text-void"
              initial={{ rotate: -3 }}
              whileInView={{ rotate: [-3, 2, -2] }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              waiting 5 yrs = −{inr(tGap)} 😬
            </motion.div>

            <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-[10.5px] leading-snug text-chalk/40">
                Illustration only: {inr(monthly, false)}/month, contributions at the start of each month, constant {rate}% a year. Real markets go up and down; mutual funds are subject to market risks.
              </p>
              <a href={wa(`Hey! The glow-up calculator says ${inr(monthly, false)}/month from age ${age} to ${until}. Help me start this SIP?`)} target="_blank" rel="noreferrer" className="btn-lime shrink-0">
                Lock in this plan →
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
