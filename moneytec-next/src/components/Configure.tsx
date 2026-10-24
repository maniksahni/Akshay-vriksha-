import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { wa } from '../data';
import { EASE, inr, sipValue, useTween } from './ui';

const AMOUNTS = [1000, 3000, 5000, 10000, 25000];
const DURATIONS = [5, 10, 15, 20, 25, 30];
const RATES = [0, 6, 8, 10, 12, 14];

function Segmented<T extends number>({ options, value, onChange, label, fmt }: { options: T[]; value: T; onChange: (v: T) => void; label: string; fmt: (v: T) => string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(options.length, 3)}, minmax(0,1fr))` }}>
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={o}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o)}
            className={`h-14 rounded-xl border-2 text-[15px] font-semibold tracking-[-0.02em] transition-colors sm:text-[17px] ${on ? 'border-link text-coal' : 'border-mist text-coal/80 hover:border-graphite/50'}`}
          >
            {fmt(o)}
          </button>
        );
      })}
    </div>
  );
}

export function Configure() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(12);

  const total = useMemo(() => sipValue(monthly, rate, years * 12), [monthly, rate, years]);
  const late = useMemo(() => sipValue(monthly, rate, Math.max(0, years - 5) * 12), [monthly, rate, years]);
  const invested = monthly * years * 12;
  const tTotal = useTween(total);
  const tLate = useTween(late);

  return (
    <section id="calculator" className="bg-white py-16 sm:py-24">
      <div className="wrap-wide">
        <p className="eyebrow text-[#BF5AF2]">Calculator</p>
        <h2 className="display mt-1 text-[clamp(2rem,4.6vw,3.5rem)]">Configure your SIP.</h2>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-14">
          <div className="space-y-10">
            <div>
              <p className="text-[21px] font-semibold tracking-[-0.02em]">Monthly amount. <span className="text-graphite">Pick what feels easy.</span></p>
              <div className="mt-4"><Segmented label="Monthly amount" options={AMOUNTS} value={monthly} onChange={setMonthly} fmt={(v) => inr(v, false)} /></div>
              <label className="mt-4 block">
                <span className="flex items-baseline justify-between text-[14px] text-slate">
                  <span>Or fine-tune it</span>
                  <span className="font-semibold tabular-nums text-coal">{inr(monthly, false)}</span>
                </span>
                <input type="range" className="slider" min={500} max={100000} step={500} value={monthly} aria-label="Monthly amount" onChange={(e) => setMonthly(Number(e.target.value))} style={{ ['--fill' as string]: `${((monthly - 500) / 99500) * 100}%` }} />
              </label>
            </div>
            <div>
              <p className="text-[21px] font-semibold tracking-[-0.02em]">How long. <span className="text-graphite">Longer is kinder.</span></p>
              <div className="mt-4"><Segmented label="Years" options={DURATIONS} value={years} onChange={setYears} fmt={(v) => `${v} years`} /></div>
            </div>
            <div>
              <p className="text-[21px] font-semibold tracking-[-0.02em]">Assumed return. <span className="text-graphite">For illustration.</span></p>
              <div className="mt-4"><Segmented label="Assumed return" options={RATES} value={rate} onChange={setRate} fmt={(v) => `${v}% a year`} /></div>
            </div>
          </div>

          {/* summary, sticky on desktop like a buy-page sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="calculator-summary rounded-[28px] bg-cloud p-6 sm:p-8">
              <p className="text-[14px] font-medium text-slate">Illustrated value after {years} years</p>
              <p className="display grad mt-1 text-[clamp(2.6rem,6vw,3.6rem)] tabular-nums">{inr(tTotal)}</p>
              <div className="mt-5 space-y-2 border-t border-mist pt-4 text-[15px]">
                <div className="flex justify-between"><span className="text-slate">You put in</span><span className="font-semibold tabular-nums">{inr(invested)}</span></div>
                <div className="flex justify-between"><span className="text-slate">Growth</span><span className="font-semibold tabular-nums text-[#248A3D]">+{inr(Math.max(0, total - invested))}</span></div>
              </div>

              <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-mist" role="img" aria-label={`Contributions ${inr(invested)}, illustrated growth ${inr(Math.max(0, total - invested))}`}><span className="bg-link transition-[width] duration-300" style={{ width: `${total ? invested / total * 100 : 100}%` }} /><span className="flex-1 bg-gradient-to-r from-[#FF375F] to-[#BF5AF2]" /></div>
              <div className="mt-6">
                <p className="text-[14px] font-medium text-slate">Start now vs. start in 5 years</p>
                <div className="mt-3 space-y-2.5">
                  <div>
                    <div className="h-3 overflow-hidden rounded-full bg-mist"><motion.div className="h-full rounded-full bg-gradient-to-r from-[#FF9F0A] via-[#FF375F] to-[#BF5AF2]" initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }} /></div>
                    <p className="mt-1 flex justify-between text-[13px]"><span>Start now</span><span className="font-semibold tabular-nums">{inr(tTotal)}</span></p>
                  </div>
                  <div>
                    <div className="h-3 overflow-hidden rounded-full bg-mist"><motion.div className="h-full rounded-full bg-graphite/60" animate={{ width: `${total ? (late / total) * 100 : 0}%` }} transition={{ duration: 0.5, ease: EASE }} /></div>
                    <p className="mt-1 flex justify-between text-[13px] text-slate"><span>Start in 5 years</span><span className="font-semibold tabular-nums">{inr(tLate)}</span></p>
                  </div>
                </div>
                <p className="mt-3 text-[14px] font-semibold text-[#D70015]">Illustrated difference: {inr(total - late)}.</p>
              </div>

              <a href={wa(`Hi Gulshan! I'd like to discuss a SIP illustration: ${inr(monthly, false)} monthly for ${years} years, assuming ${rate}% annually. Illustrated value ${inr(total)}; contributions ${inr(invested)}. I understand returns are not guaranteed.`)} target="_blank" rel="noreferrer" className="pill-blue mt-6 w-full">Discuss this illustration</a>
              <p className="mt-3 text-[11px] leading-snug text-graphite">Contributions at the start of each month, constant {rate}% a year. Illustration only; mutual fund investments are subject to market risks.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
