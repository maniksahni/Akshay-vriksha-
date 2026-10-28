import { ArrowUpRight, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { wa } from '../data';
import { EASE, goalProjection, inr } from './ui';

const GOALS = ['Education', 'A home', 'Retirement', 'My own goal'];

function Money({ label, value, onChange, aria }: { label: string; value: string; onChange: (v: string) => void; aria: string }) {
  return (
    <label className="block">
      <span className="text-[13px] text-haze">{label}</span>
      <div className="relative mt-2">
        <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-dim">₹</span>
        <input className="field pl-9 tabular-nums" type="number" inputMode="numeric" min="0" max="1000000000" value={value} onChange={(e) => onChange(e.target.value)} aria-label={aria} aria-describedby="goal-input-help" />
      </div>
    </label>
  );
}

export function GoalPlanner() {
  const [goal, setGoal] = useState('Education');
  const [cost, setCost] = useState('2500000');
  const [saved, setSaved] = useState('0');
  const [years, setYears] = useState(15);
  const [inflation, setInflation] = useState(6);
  const [rate, setRate] = useState(12);
  const amount = Number(cost), savings = Number(saved);
  const valid = cost.trim() !== '' && saved.trim() !== '' && Number.isFinite(amount) && amount > 0 && amount <= 1000000000 && Number.isFinite(savings) && savings >= 0 && savings <= 1000000000;
  const result = goalProjection(valid ? amount : 0, valid ? savings : 0, years, inflation, rate);
  const monthly = Math.ceil(result.monthly / 100) * 100;
  const share = wa(`Hi Gulshan! I'd like to discuss my ${goal.toLowerCase()} goal. Cost today: ${inr(amount, false)}. Timeline: ${years} years. Existing savings allocated to this goal: ${inr(savings, false)}. Assumptions: ${inflation}% inflation and ${rate}% annual CAGR. Illustrated future target: ${inr(result.target, false)}. Estimated monthly SIP rounded up to the next Rs 100: ${inr(monthly, false)}. This is only an illustration; I understand returns are not guaranteed. Can we review affordability, risk and suitability?`);
  const grow = valid && result.target > 0 ? Math.min(1, amount / result.target) : 1;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_440px] lg:gap-8">
      <div className="glass space-y-5 p-4 sm:space-y-6 sm:p-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-dim">01 · Give your goal a name</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Your financial goal">
            {GOALS.map((g) => <button key={g} type="button" aria-pressed={goal === g} onClick={() => setGoal(g)} className="chip">{g}</button>)}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Money label="What would it cost today?" value={cost} onChange={setCost} aria="Goal cost today in rupees" />
          <Money label="Savings for this goal today" value={saved} onChange={setSaved} aria="Savings allocated to this goal in rupees" />
        </div>
        <p id="goal-input-help" className="-mt-2 text-[12px] text-dim">Use today’s cost and only the savings set aside for this goal.</p>
        {!valid && <p role="alert" className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-[13px] text-paper">Enter a goal cost above ₹0 and savings of ₹0 or more, up to ₹100 crore each.</p>}
        <label className="block" htmlFor="goal-years">
          <span className="flex justify-between text-[13px] text-haze">Time to your goal <b className="text-paper">{years} years</b></span>
          <input id="goal-years" className="slider" type="range" min="1" max="40" value={years} onChange={(e) => setYears(Number(e.target.value))} style={{ ['--fill' as string]: `${((years - 1) / 39) * 100}%` }} />
        </label>
        <div className="border-t border-line pt-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-dim">02 · Explore the assumptions</p>
          <label className="mt-4 block" htmlFor="goal-inflation">
            <span className="flex justify-between text-[13px] text-haze">Assumed annual inflation <b className="text-paper">{inflation}%</b></span>
            <input id="goal-inflation" className="slider" type="range" min="0" max="10" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} style={{ ['--fill' as string]: `${inflation * 10}%` }} />
          </label>
          <label className="mt-5 block" htmlFor="goal-return">
            <span className="text-[13px] text-haze">Assumed annual return (CAGR)</span>
            <select id="goal-return" className="field mt-2" value={rate} onChange={(e) => setRate(Number(e.target.value))}>
              {[0, 6, 10, 12, 14, 15, 16].map((r) => <option key={r} value={r}>{r}% per year</option>)}
            </select>
          </label>
          <p className="mt-3 text-[12px] text-dim">These are adjustable assumptions, not expected or promised returns. Existing savings are assumed to earn the same rate.</p>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Goal planning illustration">
        <div className="glass ring-grad overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-amber/25 blur-[80px]" />
          <div className="relative flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-dim"><Target size={15} aria-hidden="true" /><span>Your {goal} blueprint</span></div>
          {valid ? (
            <div className="relative">
              <p className="mt-5 text-[13px] text-haze">Illustrated monthly SIP</p>
              <p className="display grad mt-1 text-[clamp(2.4rem,5.4vw,3.6rem)] tabular-nums" aria-live="polite">{inr(monthly, false)}</p>
              <p className="text-[12px] text-dim">for {years} years · rounded up to the next ₹100</p>
              <div className="mt-6" aria-hidden>
                <div className="flex justify-between text-[11px] text-dim"><span>Cost today</span><span>Future cost</span></div>
                <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.span className="absolute inset-y-0 left-0 rounded-full bg-white/40" animate={{ width: `${grow * 100}%` }} transition={{ duration: 0.6, ease: EASE }} />
                  <motion.span className="absolute inset-y-0 rounded-full bg-gradient-to-r from-amber via-rose to-violet" animate={{ left: `${grow * 100}%`, right: 0 }} transition={{ duration: 0.6, ease: EASE }} />
                </div>
              </div>
              <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-[13px]">
                {[['Goal cost today', inr(amount)], ['Future cost with inflation', inr(result.target)], ['Illustrated value of existing savings', inr(result.futureSavings)], ['Remaining target for SIPs', inr(result.gap)]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4"><dt className="text-haze">{k}</dt><dd className="font-semibold tabular-nums">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-5 rounded-2xl bg-white/[0.04] p-4 text-[13px] leading-relaxed text-haze">
                {result.gap === 0 ? 'Under these assumptions, your allocated savings cover the target. Review the assumptions and suitability with Gulshan.' : `At ${inflation}% inflation, today’s ${inr(amount)} goal becomes approximately ${inr(result.target)} in ${years} years. Planning for that future cost keeps the target realistic.`}
              </p>
              <a href={share} target="_blank" rel="noopener noreferrer" className="btn-light mt-6 w-full">Discuss my goal with Gulshan <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
          ) : (
            <div className="relative grid place-items-center gap-3 py-12 text-center text-haze"><Target size={38} aria-hidden="true" /><p>Add your goal details to see the illustration.</p></div>
          )}
          <p className="relative mt-4 text-[11px] leading-snug text-dim">Illustration only. Contributions at the start of each month; constant inflation and annual CAGR. Taxes, costs and changing returns are not modelled. Returns are not guaranteed. Mutual fund investments are subject to market risks.</p>
        </div>
      </aside>
    </div>
  );
}
