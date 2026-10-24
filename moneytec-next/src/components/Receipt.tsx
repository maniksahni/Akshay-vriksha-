import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { wa } from '../data';
import { Folio, Lines, Riso, Scribble } from './print';
import { EASE, inr, sipValue, useTween } from './ui';

function Slider({ label, value, min, max, step, onChange, display }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-3">
        <span className="label">{label}</span>
        <span className="headline text-2xl tabular-nums sm:text-3xl">{display}</span>
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

/** Dotted-leader receipt line: LABEL ........ VALUE */
function Line({ k, v, strong = false, hot = false }: { k: string; v: string; strong?: boolean; hot?: boolean }) {
  return (
    <div className={`flex items-baseline gap-2 ${strong ? 'text-[15px] font-bold' : ''}`}>
      <span className="whitespace-nowrap">{k}</span>
      <span className="mb-1 flex-1 border-b-2 border-dotted border-ink/35" />
      <span className={`whitespace-nowrap tabular-nums ${hot ? 'bg-pink px-1 font-bold' : ''}`}>{v}</span>
    </div>
  );
}

function Barcode({ seed }: { seed: number }) {
  // deterministic stripes from the numbers on the receipt
  const bars = Array.from({ length: 46 }, (_, i) => ((Math.sin(seed * 0.001 + i * 12.9898) * 43758.5453) % 1 + 1) % 1);
  return (
    <svg viewBox="0 0 230 44" className="h-11 w-full" aria-hidden preserveAspectRatio="none">
      {bars.reduce<{ x: number; els: JSX.Element[] }>(
        (acc, b, i) => {
          const w = 1 + Math.round(b * 3);
          if (i % 2 === 0) acc.els.push(<rect key={i} x={acc.x} y={0} width={w} height={44} fill="#141413" />);
          acc.x += w + 1;
          return acc;
        },
        { x: 0, els: [] },
      ).els}
    </svg>
  );
}

const RATES = [10, 12, 14];

export function ReceiptCalc() {
  const [monthly, setMonthly] = useState(3000);
  const [age, setAge] = useState(24);
  const [until, setUntil] = useState(45);
  const [rate, setRate] = useState(12);

  const years = Math.max(1, until - age);
  const total = useMemo(() => sipValue(monthly, rate, years * 12), [monthly, rate, years]);
  const late = useMemo(() => sipValue(monthly, rate, Math.max(0, years - 5) * 12), [monthly, rate, years]);
  const invested = monthly * years * 12;
  const tTotal = useTween(total);

  // re-"print" the receipt shortly after the reader stops sliding
  const [printKey, setPrintKey] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setPrintKey((k) => k + 1), 380);
    return () => clearTimeout(t);
  }, [monthly, age, until, rate]);

  return (
    <section id="glow-up" className="relative py-12 sm:py-20">
      <div className="wrap">
        <Folio no="02" title="Your money, itemised" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
          <div>
            <div className="relative inline-block">
              <Lines className="text-[clamp(2.6rem,6.4vw,5.6rem)]" lines={['Print your', <><Riso amount={4}>future.</Riso></>, 'Literally.']} />
              <Scribble kind="underline" className="absolute -bottom-2 left-0 w-[70%]" color="#FF3EA5" delay={0.9} />
            </div>
            <p className="mt-4 max-w-md font-serif text-xl leading-snug">Slide the numbers. The printer does the maths, then tells you exactly what “I’ll start next year” costs.</p>

            <div className="boxed mt-6 space-y-4 p-4 sm:p-6">
              <Slider label="I can SIP every month" value={monthly} min={500} max={100000} step={500} onChange={setMonthly} display={inr(monthly, false)} />
              <Slider label="My age right now" value={age} min={18} max={50} step={1} onChange={(v) => { setAge(v); if (until <= v) setUntil(v + 1); }} display={`${age}`} />
              <Slider label="Keep it going until age" value={until} min={Math.min(age + 1, 65)} max={65} step={1} onChange={setUntil} display={`${until}`} />
              <div>
                <span className="label">Assumed return per year</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {RATES.map((r) => (
                    <button key={r} onClick={() => setRate(r)} aria-pressed={rate === r} className={`h-10 border-2 border-ink font-mono text-sm font-bold transition-colors ${rate === r ? 'bg-sun' : 'bg-paper hover:bg-newsprint'}`}>
                      {r}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* the printer and its receipt */}
          <div className="relative mx-auto w-full max-w-[400px]">
            <div className="relative z-10 flex h-14 items-center justify-between border-2 border-ink bg-ink px-4 text-paper" style={{ boxShadow: '6px 6px 0 0 #2B50FF' }}>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em]">moneytec · thermal printer</span>
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-mint" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/30" />
              </span>
            </div>
            <div className="relative mx-3 overflow-hidden">
              <motion.div
                key={printKey}
                className="torn-bottom bg-[#FBF8F1] px-5 pb-8 pt-5 font-mono text-[12.5px] leading-[1.75] text-ink shadow-[0_18px_30px_-18px_rgba(0,0,0,0.5)]"
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
              >
                <p className="text-center font-bold tracking-[0.2em]">*** SIP RECEIPT ***</p>
                <p className="text-center text-[11px] text-ink/60">your future, itemised · age {age} → {until}</p>
                <p className="my-2 border-t-2 border-dashed border-ink/40" />
                <Line k="MONTHLY SIP" v={inr(monthly, false)} />
                <Line k="DURATION" v={`${years} YRS`} />
                <Line k="YOU PUT IN" v={inr(invested)} />
                <Line k={`GROWTH @ ${rate}%*`} v={inr(Math.max(0, total - invested))} />
                <p className="my-2 border-t-2 border-double border-ink" />
                <div className="flex items-end justify-between">
                  <span className="font-bold">TOTAL AT {until}</span>
                  <span className="headline text-[2.3rem] leading-none tabular-nums">{inr(tTotal)}</span>
                </div>
                <p className="my-2 border-t-2 border-dashed border-ink/40" />
                <Line k="IF YOU WAIT 5 YRS" v={inr(late)} />
                <Line k="COST OF WAITING" v={`−${inr(total - late)}`} hot />
                <div className="mt-4"><Barcode seed={Math.round(total)} /></div>
                <p className="mt-1 text-center text-[10px] tracking-[0.3em]">{String(Math.round(total)).padStart(10, '0')}</p>
                <p className="mt-3 text-center font-bold">THANK YOU FOR NOT WAITING</p>
                <p className="mt-2 text-[9.5px] leading-snug text-ink/55">*Illustration: contributions at the start of each month, constant {rate}% a year. Markets go up and down. Mutual funds are subject to market risks; read all scheme documents.</p>
              </motion.div>
            </div>
            <motion.div className="mt-5 flex justify-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, ease: EASE }}>
              <a href={wa(`Hey Gulshan! My moneytec receipt: ${inr(monthly, false)}/month from age ${age} to ${until}. Help me start this SIP?`)} target="_blank" rel="noreferrer" className="btn-blue">
                Make this receipt real →
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
