import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { wa } from '../data';
import { EASE, spotlight, Title } from './ui';

const PLANS = [
  { name: 'Near-term needs', tag: 'Keep liquidity in view', horizon: '3–5 years', drops: 'Prefers to avoid them', goals: 'Emergency fund, short-term goals', before: 'Check access to your money, exit conditions and capital risk.', orbit: 1, hue: '#64D2FF' },
  { name: 'Life milestones', tag: 'Plan around a date', horizon: '5–10 years', drops: 'Can sit through some', goals: 'Car, wedding, a home down-payment', before: 'Estimate your target, timeline and a comfortable monthly amount.', orbit: 2, hue: '#5BF0B5' },
  { name: 'Wealth for Generations', tag: 'Plan for changing markets', horizon: '10–30+ years', drops: 'Can affect your plan', goals: 'Retirement, kids’ education, wealth', before: 'Review affordability, inflation and your ability to stay invested.', orbit: 3, hue: '#FF375F' },
];
const QS = [
  { q: 'When will you need the money?', a: ['3–5 years', '5–10 years', '10–30+ years'] },
  { q: 'Markets fall 20%. You…', a: ['Want out', 'Wait it out', 'Invest more'] },
  { q: 'Your investing so far?', a: ['New to it', 'Some funds', 'Years in equity'] },
];

/** Concentric orbits: one ring per step of time horizon, so the longer plan literally reaches further. */
function Orbits({ n, hue }: { n: number; hue: string }) {
  return (
    <svg viewBox="0 0 120 120" className="h-16 w-16" aria-hidden>
      {[20, 36, 52].map((r, i) => (
        <circle key={r} cx="60" cy="60" r={r} fill="none" stroke={i < n ? hue : '#fff'} strokeOpacity={i < n ? 0.8 : 0.1} strokeWidth="1.5" strokeDasharray={i < n ? 'none' : '2 5'} />
      ))}
      <circle cx="60" cy="60" r="6" fill={hue} />
      {Array.from({ length: n }).map((_, i) => (
        <g key={i} className="spin-slow" style={{ transformOrigin: '60px 60px', animationDuration: `${12 + i * 8}s` }}>
          <circle cx={60 + [20, 36, 52][i]} cy="60" r="3.5" fill="#fff" />
        </g>
      ))}
    </svg>
  );
}

export function Plans() {
  const [quiz, setQuiz] = useState(false);
  const [tab, setTab] = useState(0);
  const [ans, setAns] = useState<number[]>([]);
  const done = ans.length === QS.length;
  const pick = done ? ans[0] : -1;
  useEffect(() => { if (pick >= 0) setTab(pick); }, [pick]);

  const card = (p: (typeof PLANS)[number], i: number) => (
    <div key={p.name} onPointerMove={spotlight} className={`glass spot relative flex w-full flex-col p-5 sm:p-7 ${i === pick ? 'ring-grad' : ''}`}>
      {i === pick && <span className="absolute -top-3 left-5 rounded-full bg-paper px-3 py-1 text-[11px] font-semibold text-ink">Your timeline</span>}
      <div className="flex items-center gap-4">
        <Orbits n={p.orbit} hue={p.hue} />
        <div>
          <p className="text-[22px] font-semibold leading-tight tracking-[-0.035em] sm:text-[26px]">{p.name}</p>
          <p className="text-[13px] text-haze sm:text-[15px]">{p.tag}</p>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-5 text-[13px] sm:text-[14px]">
        <div><dt className="text-dim">Time horizon</dt><dd className="font-semibold">{p.horizon}</dd></div>
        <div><dt className="text-dim">Market drops</dt><dd className="font-semibold">{p.drops}</dd></div>
        <div className="col-span-2"><dt className="text-dim">Typical goals</dt><dd className="font-semibold">{p.goals}</dd></div>
        <div className="col-span-2"><dt className="text-dim">Before you choose</dt><dd className="mt-0.5 leading-relaxed text-haze">{p.before}</dd></div>
      </dl>
      <a href={wa(`Hi Gulshan! I would like to discuss ${p.name.toLowerCase()} with a ${p.horizon} timeline. Can we review my goals and risk comfort?${done ? ` My answers: ${QS.map((q, n) => `${q.q} ${q.a[ans[n]]}`).join('; ')}` : ''}`)} target="_blank" rel="noreferrer" className="link mt-auto pt-5">Discuss this goal ↗</a>
    </div>
  );

  return (
    <section id="plans" data-dark className="relative py-14 sm:py-32">
      <div className="wrap-wide">
        <div className="text-center">
          <Title className="display mt-4 text-[clamp(2.4rem,5.6vw,5rem)]" text="What are you / *planning for?*" />
          <button type="button" onClick={() => { setQuiz(true); setAns([]); }} className="link mt-5">Prepare for your conversation ›</button>
        </div>

        <AnimatePresence>
          {quiz && !done && (
            <motion.div key={ans.length} className="glass mx-auto mt-8 max-w-xl p-5 sm:p-6" initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
              <div className="flex items-center justify-between text-[12px] text-dim">
                <span>Question {ans.length + 1} of {QS.length}</span>
                <span className="flex gap-1">{QS.map((_, i) => <i key={i} className={`h-1 w-6 rounded-full ${i <= ans.length ? 'bg-gradient-to-r from-amber to-rose' : 'bg-white/10'}`} />)}</span>
              </div>
              <p className="mt-3 text-[20px] font-semibold tracking-[-0.02em]">{QS[ans.length].q}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {QS[ans.length].a.map((a, i) => <button key={a} type="button" onClick={() => setAns((s) => [...s, i])} className="seg">{a}</button>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {done && (
          <p className="mt-6 text-center text-[15px] text-haze">
            Your timeline points to <span className="font-semibold text-paper">{PLANS[pick].name.toLowerCase()}</span>. Discuss your other answers with Gulshan.{' '}
            <button type="button" onClick={() => { setAns([]); setQuiz(true); }} className="text-amber hover:underline">Retake</button>
          </p>
        )}

        {/* phone: pick a horizon, see one card */}
        <div className="glass mt-8 grid grid-cols-3 gap-1 rounded-full p-1 md:hidden" role="group" aria-label="Choose a planning timeline">
          {PLANS.map((p, i) => (
            <button key={p.name} type="button" aria-pressed={tab === i} onClick={() => setTab(i)} className="relative rounded-full py-2.5 text-[13px] font-medium">
              {tab === i && <motion.span layoutId="plan-pill" className="absolute inset-0 rounded-full bg-paper" transition={{ duration: 0.4, ease: EASE }} />}
              <span className={`relative ${tab === i ? 'text-ink' : 'text-haze'}`}>{p.horizon}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 md:hidden">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease: EASE }}>
              {card(PLANS[tab], tab)}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-12 hidden gap-5 md:grid md:grid-cols-3">
          {PLANS.map((p, i) => (
            <motion.div key={p.name} className="flex" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}>
              {card(p, i)}
            </motion.div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-[12px] text-dim">These are starting points for a conversation, not product recommendations. Suitability depends on your full financial circumstances and risk assessment.</p>
      </div>
    </section>
  );
}
