import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { whatsappLink } from '../../data/site';
import { scrollToHash } from '../../lib/smooth';
import { formatINR } from '../../utils/formatters';
import { Scramble, Spotlight } from '../ui/effects';
import { EASE, FadeUp, MaskLines, useTween } from '../ui/motion';

/* ---------------------------------------------------------------- risk quiz */

const QUESTIONS = [
  { q: 'When will you need most of this money?', a: ['Within 3 years', 'In 3 to 7 years', 'After 7 years or more'] },
  { q: 'Your portfolio falls 20% in a month. You…', a: ['Sell, to stop the loss', 'Wait it out', 'Invest a little more'] },
  { q: 'How steady is your income?', a: ['Uncertain', 'Stable', 'Stable and growing'] },
  { q: 'Your investing experience so far?', a: ['Mostly FDs and savings', 'Some mutual funds', 'Years in equity'] },
  { q: 'What matters most to you?', a: ['Protecting what I have', 'Balanced, steady growth', 'Maximum long-term growth'] },
];

type Profile = { name: string; hindi: string; line: string; mix: [number, number, number] };
const PROFILES: Profile[] = [
  { name: 'Conservative', hindi: 'स्थिर', line: 'Stability first. Growth is welcome, but never at the cost of sleep.', mix: [25, 65, 10] },
  { name: 'Balanced', hindi: 'संतुलित', line: 'A steady climber: you accept some swings for meaningfully better growth.', mix: [55, 35, 10] },
  { name: 'Growth', hindi: 'विकास', line: 'Long horizon, steady nerves. You let compounding do the heavy lifting.', mix: [75, 15, 10] },
];
const MIX = [
  { k: 'Equity', c: '#D9AE5B' },
  { k: 'Debt', c: '#8FA89A' },
  { k: 'Gold', c: '#C4622D' },
];

function Donut({ mix }: { mix: [number, number, number] }) {
  const r = 52;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox="0 0 140 140" className="h-32 w-32 shrink-0 -rotate-90 lg:h-44 lg:w-44" aria-hidden>
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(243,238,229,0.08)" strokeWidth="16" />
      {mix.map((v, i) => {
        const len = (v / 100) * C;
        const el = (
          <motion.circle
            key={i}
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={MIX[i].c}
            strokeWidth="16"
            initial={{ strokeDasharray: `0 ${C}`, strokeDashoffset: -acc }}
            animate={{ strokeDasharray: `${len - 2} ${C}`, strokeDashoffset: -acc }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.15 }}
          />
        );
        acc += len;
        return el;
      })}
    </svg>
  );
}

function RiskQuiz() {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step === QUESTIONS.length;
  const score = answers.reduce((s, a) => s + a + 1, 0);
  const profile = PROFILES[score <= 8 ? 0 : score <= 12 ? 1 : 2];

  return (
    <div className="min-h-[340px] lg:min-h-[380px]">
      <AnimatePresence mode="wait" initial={false}>
        {!done ? (
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease: EASE }}>
            <div className="flex items-center gap-3">
              <span className="font-display text-3xl text-gold lg:text-4xl">0{step + 1}</span>
              <span className="flex flex-1 gap-1">
                {QUESTIONS.map((_, i) => (
                  <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-gold' : 'bg-white/10'}`} />
                ))}
              </span>
            </div>
            <p className="mt-4 font-display text-[1.7rem] leading-tight lg:text-4xl">{QUESTIONS[step].q}</p>
            <div className="mt-5 grid gap-2 lg:mt-7 lg:gap-3">
              {QUESTIONS[step].a.map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => setAnswers((a) => [...a, i])}
                  className="group flex items-center justify-between rounded-2xl border border-white/15 px-4 py-3.5 text-left text-[15px] transition-colors hover:border-gold hover:bg-gold/10 lg:px-6 lg:py-4 lg:text-lg"
                >
                  {opt}
                  <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100">→</span>
                </button>
              ))}
            </div>
            {step > 0 && (
              <button onClick={() => setAnswers((a) => a.slice(0, -1))} className="mt-4 text-xs text-bone/50 hover:text-gold">
                ← Previous question
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }}>
            <p className="eyebrow text-[10px] text-bone/40">Your investor DNA</p>
            <div className="mt-2 flex items-center gap-5 lg:gap-8">
              <Donut mix={profile.mix} />
              <div>
                <p className="font-deva text-xl text-gold/80">{profile.hindi}</p>
                <p className="font-display text-4xl leading-none text-foil lg:text-6xl">{profile.name}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {MIX.map((m, i) => (
                    <li key={m.k} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.c }} />
                      <span className="w-14 text-bone/60">{m.k}</span>
                      <span className="tabular-nums">{profile.mix[i]}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4 max-w-lg text-sm text-bone/70 lg:text-base">{profile.line}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <a
                href={whatsappLink(`Namaste! I took the risk-profile quiz on your website and came out "${profile.name}". Can we discuss a plan that fits?`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-night hover:bg-gold-soft"
              >
                Discuss my profile →
              </a>
              <button onClick={() => setAnswers([])} className="h-11 rounded-full border border-white/15 px-5 text-sm text-bone/70 hover:border-gold/60">
                Retake
              </button>
            </div>
            <p className="mt-3 text-[10px] text-bone/35">Indicative only, not investment advice. Your actual allocation is set after a full risk profiling.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------- life cover calc */

const shortINR = (n: number) => (n >= 10000000 ? `₹${+(n / 10000000).toFixed(2)} Cr` : `₹${+(n / 100000).toFixed(1)} L`);

function Row({ label, value, min, max, step, onChange, display }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  return (
    <label className="block min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[11px] text-bone/60 lg:text-sm">{label}</span>
        <span className="shrink-0 font-display text-lg tabular-nums lg:text-2xl">{display}</span>
      </div>
      <input
        type="range"
        className="range"
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

function CoverCalc() {
  const [age, setAge] = useState(32);
  const [income, setIncome] = useState(1200000);
  const [loans, setLoans] = useState(2500000);
  const [existing, setExisting] = useState(1000000);

  // Income replacement: the share of income the family relies on (70%), for the working years left,
  // plus debts the family would inherit, minus cover and savings already in place.
  const years = Math.max(0, 60 - age);
  const replacement = income * 0.7 * years;
  const need = useMemo(() => Math.max(0, replacement + loans - existing), [replacement, loans, existing]);
  const tNeed = useTween(need);

  return (
    <div className="grid gap-5 lg:min-h-[380px] lg:grid-cols-[1fr_1fr] lg:gap-10">
      <div className="grid grid-cols-2 content-start gap-x-5 gap-y-2 lg:grid-cols-1 lg:gap-y-6">
        <Row label="Your age" value={age} min={20} max={58} step={1} onChange={setAge} display={`${age}`} />
        <Row label="Annual income" value={income} min={300000} max={10000000} step={100000} onChange={setIncome} display={shortINR(income)} />
        <Row label="Loans outstanding" value={loans} min={0} max={20000000} step={100000} onChange={setLoans} display={loans ? shortINR(loans) : '₹0'} />
        <Row label="Existing cover + savings" value={existing} min={0} max={30000000} step={100000} onChange={setExisting} display={existing ? shortINR(existing) : '₹0'} />
      </div>
      <div className="flex flex-col justify-between rounded-2xl border border-gold/25 bg-gold/[0.07] p-4 lg:p-7">
        <div>
          <p className="text-[11px] text-bone/50 lg:text-sm">Your family may need life cover of about</p>
          <p className="mt-1 font-display text-[clamp(2.6rem,8vw,5rem)] leading-none tabular-nums text-foil">{formatINR(tNeed, true)}</p>
          <ul className="mt-4 space-y-1.5 text-[12px] text-bone/60 lg:text-sm">
            <li className="flex justify-between gap-3"><span>Income support, {years} working years</span><span className="tabular-nums text-bone/85">+ {shortINR(replacement)}</span></li>
            <li className="flex justify-between gap-3"><span>Loans to clear</span><span className="tabular-nums text-bone/85">+ {loans ? shortINR(loans) : '₹0'}</span></li>
            <li className="flex justify-between gap-3"><span>Already in place</span><span className="tabular-nums text-bone/85">− {existing ? shortINR(existing) : '₹0'}</span></li>
          </ul>
        </div>
        <div className="mt-5">
          <a
            href={whatsappLink(`Namaste! Your cover calculator suggests I may need about ${formatINR(need, true)} of life cover (age ${age}). Can you help me compare Kotak Life term plans?`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-night hover:bg-gold-soft"
          >
            Get a term-plan quote →
          </a>
          <p className="mt-3 text-[10px] leading-snug text-bone/35">
            A rule-of-thumb estimate (70% of income until 60, plus loans, minus what’s in place). Actual cover depends on underwriting. Insurance is the subject matter of solicitation.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- shell */

const TABS = [
  { id: 'risk', label: 'Investor DNA', sub: '5 questions · 30 seconds' },
  { id: 'cover', label: 'Life cover check', sub: 'How much is enough?' },
] as const;

export function Toolkit() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('risk');
  return (
    <section id="toolkit" className="relative overflow-hidden bg-night py-14 lg:py-32">
      <div className="pointer-events-none absolute -right-32 top-10 h-[480px] w-[480px] rounded-full bg-gold/10 blur-[130px]" />
      <div className="container-x relative">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Scramble text="The toolkit" className="eyebrow mb-2 text-[10px] text-gold lg:mb-4 lg:text-[11px]" />
            <MaskLines
              lines={[<>Know yourself <span className="italic text-gold">before you invest.</span></>]}
              className="max-w-3xl font-display text-[clamp(1.9rem,5vw,5rem)] leading-[0.98] tracking-[-0.02em]"
            />
          </div>
          <FadeUp delay={0.1} className="hidden lg:block">
            <p className="ml-auto max-w-md text-bone/60">
              Two quick tools we use in our own first conversations. Your answers stay on your device until you choose to share them.
            </p>
          </FadeUp>
        </div>

        <div className="mt-5 flex gap-2 lg:mt-12" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex-1 rounded-2xl border px-4 py-3 text-left transition-colors lg:flex-none lg:px-6 lg:py-4 ${tab === t.id ? 'border-gold text-bone' : 'border-white/10 text-bone/50 hover:text-bone/80'}`}
            >
              {tab === t.id && <motion.span layoutId="tool-tab" className="absolute inset-0 -z-0 rounded-2xl bg-gold/10" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <span className="relative block font-display text-lg leading-tight lg:text-2xl">{t.label}</span>
              <span className="relative block text-[10px] text-bone/40 lg:text-xs">{t.sub}</span>
            </button>
          ))}
        </div>

        <Spotlight className="glow-edge mt-3 rounded-[22px] border border-white/10 bg-forest/60 p-5 lg:mt-5 lg:rounded-[28px] lg:p-10" tilt={2}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
              {tab === 'risk' ? <RiskQuiz /> : <CoverCalc />}
            </motion.div>
          </AnimatePresence>
        </Spotlight>

        <FadeUp className="mt-4 text-center lg:mt-6">
          <button onClick={() => scrollToHash('#contact')} className="text-sm text-gold underline-offset-4 hover:underline">
            Prefer to talk it through? Book a consultation →
          </button>
        </FadeUp>
      </div>
    </section>
  );
}
