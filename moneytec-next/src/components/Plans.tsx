import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { wa } from '../data';
import { EASE } from './ui';

const PLANS = [
  { name: 'Chill Saver', tag: 'Stability first', horizon: 'Under 3 years', drops: 'Prefers to avoid them', goals: 'Emergency fund, short-term goals', mix: [25, 65, 10], ring: 'from-[#64D2FF] to-[#0A84FF]' },
  { name: 'Steady Grinder', tag: 'Balanced growth', horizon: '3 to 7 years', drops: 'Can sit through some', goals: 'Car, wedding, a home down-payment', mix: [55, 35, 10], ring: 'from-[#30D158] to-[#64D2FF]' },
  { name: 'Long-Game Legend', tag: 'Let it compound', horizon: '7+ years', drops: 'Sees them as sales', goals: 'Retirement, kids’ education, wealth', mix: [75, 15, 10], ring: 'from-[#FF9F0A] via-[#FF375F] to-[#BF5AF2]' },
];
const MIX = [['Equity', 'bg-coal'], ['Debt', 'bg-graphite'], ['Gold', 'bg-[#FFD60A]']];
const QS = [
  { q: 'When will you need the money?', a: ['Under 3 years', '3–7 years', '7+ years'] },
  { q: 'Markets fall 20%. You…', a: ['Want out', 'Wait it out', 'Invest more'] },
  { q: 'Your investing so far?', a: ['New to it', 'Some funds', 'Years in equity'] },
];

export function Plans() {
  const [quiz, setQuiz] = useState(false);
  const [ans, setAns] = useState<number[]>([]);
  const done = ans.length === QS.length;
  const pick = done ? Math.round(ans.reduce((a, b) => a + b, 0) / QS.length) : -1;

  return (
    <section id="plans" className="bg-snow py-16 sm:py-24">
      <div className="wrap-wide text-center">
        <h2 className="display text-[clamp(2rem,4.6vw,3.5rem)]">Which approach is right for you?</h2>
        <button onClick={() => { setQuiz(true); setAns([]); }} className="textlink mt-3">Not sure? Answer 3 quick questions ›</button>

        <AnimatePresence>
          {quiz && !done && (
            <motion.div className="mx-auto mt-6 max-w-xl rounded-[24px] bg-white p-6 text-left shadow-[0_8px_30px_rgba(0,0,0,0.06)]" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: EASE }}>
              <p className="text-[13px] font-medium text-graphite">Question {ans.length + 1} of {QS.length}</p>
              <p className="mt-1 text-[21px] font-semibold tracking-[-0.02em]">{QS[ans.length].q}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {QS[ans.length].a.map((a, i) => (
                  <button key={a} onClick={() => setAns((s) => [...s, i])} className="h-12 rounded-xl border-2 border-mist text-[15px] font-semibold hover:border-link">{a}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {done && (
          <p className="mt-4 text-[17px]">
            Looks like you’re a <span className="font-semibold">{PLANS[pick].name}</span>.{' '}
            <button onClick={() => { setAns([]); setQuiz(true); }} className="text-link hover:underline">Retake</button>
          </p>
        )}

        <div className="mt-10 grid gap-5 text-left md:grid-cols-3">
          {PLANS.map((p, i) => {
            const best = i === pick;
            return (
              <motion.div
                key={p.name}
                className={`relative flex flex-col rounded-[28px] bg-white p-6 transition-shadow sm:p-8 ${best ? 'shadow-[0_0_0_2px_#0071E3,0_20px_50px_-20px_rgba(0,113,227,0.45)]' : ''}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
              >
                {best && <span className="absolute -top-3 left-6 rounded-full bg-link px-3 py-1 text-[12px] font-semibold text-white">Your match</span>}
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${p.ring} p-[3px]`}><div className="h-full w-full rounded-full bg-white" /></div>
                <p className="mt-5 text-[28px] font-semibold tracking-[-0.03em]">{p.name}</p>
                <p className="text-[17px] text-slate">{p.tag}</p>
                <dl className="mt-6 space-y-4 border-t border-mist pt-5 text-[15px]">
                  <div><dt className="text-graphite">Time horizon</dt><dd className="font-semibold">{p.horizon}</dd></div>
                  <div><dt className="text-graphite">Market drops</dt><dd className="font-semibold">{p.drops}</dd></div>
                  <div><dt className="text-graphite">Typical goals</dt><dd className="font-semibold">{p.goals}</dd></div>
                  <div>
                    <dt className="text-graphite">A sample mix</dt>
                    <dd className="mt-2 flex h-2.5 overflow-hidden rounded-full">{p.mix.map((v, k) => <span key={k} className={MIX[k][1]} style={{ width: `${v}%` }} />)}</dd>
                    <dd className="mt-1.5 text-[13px] text-slate">{MIX.map(([m], k) => `${m} ${p.mix[k]}%`).join(' · ')}</dd>
                  </div>
                </dl>
                <a href={wa(`Hi Gulshan! I think I'm a "${p.name}". Can we plan around that?`)} target="_blank" rel="noreferrer" className="textlink mt-6 text-[17px]">Plan as a {p.name} ›</a>
              </motion.div>
            );
          })}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-[12px] text-graphite">Sample mixes are for illustration, not advice. Your actual plan comes from a proper risk profiling with Gulshan.</p>
      </div>
    </section>
  );
}
