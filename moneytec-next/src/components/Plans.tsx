import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { wa } from '../data';
import { EASE } from './ui';

const PLANS = [
  { name: 'Near-term needs', tag: 'Keep liquidity in view', horizon: '3–5 years', drops: 'Prefers to avoid them', goals: 'Emergency fund, short-term goals', ring: 'from-[#64D2FF] to-[#0A84FF]' },
  { name: 'Life milestones', tag: 'Plan around a date', horizon: '5–10 years', drops: 'Can sit through some', goals: 'Car, wedding, a home down-payment', ring: 'from-[#30D158] to-[#64D2FF]' },
  { name: 'Wealth for Generations', tag: 'Plan for changing markets', horizon: '10–30+ years', drops: 'Can affect your plan', goals: 'Retirement, kids’ education, wealth', ring: 'from-[#FF9F0A] via-[#FF375F] to-[#BF5AF2]' },
];
const QS = [
  { q: 'When will you need the money?', a: ['3–5 years', '5–10 years', '10–30+ years'] },
  { q: 'Markets fall 20%. You…', a: ['Want out', 'Wait it out', 'Invest more'] },
  { q: 'Your investing so far?', a: ['New to it', 'Some funds', 'Years in equity'] },
];

export function Plans() {
  const [quiz, setQuiz] = useState(false);
  const [mobilePlan, setMobilePlan] = useState(0);
  const [ans, setAns] = useState<number[]>([]);
  const done = ans.length === QS.length;
  const pick = done ? ans[0] : -1;
  const track = useRef<HTMLDivElement>(null);
  // on phone the cards are a swipe row: bring the matched one into view
  useEffect(() => {
    if (pick >= 0) setMobilePlan(pick);
    const t = track.current;
    const card = t?.children[pick] as HTMLElement | undefined;
    if (!t || !card || t.scrollWidth <= t.clientWidth) return;
    t.scrollTo({ left: card.offsetLeft - (t.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
  }, [pick]);

  return (
    <section id="plans" className="overflow-hidden bg-snow py-14 sm:py-24">
      <div className="wrap-wide text-center">
        <h2 className="display text-[clamp(2rem,4.6vw,3.5rem)]">What are you planning for?</h2>
        <button onClick={() => { setQuiz(true); setAns([]); }} className="textlink mt-3">Prepare for your conversation ›</button>

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
            Your timeline points to <span className="font-semibold">{PLANS[pick].name.toLowerCase()}</span>. Discuss your other answers with Gulshan.{' '}
            <button onClick={() => { setAns([]); setQuiz(true); }} className="text-link hover:underline">Retake</button>
          </p>
        )}

        <div className="mobile-plan-tabs" role="group" aria-label="Choose a planning timeline">
          {PLANS.map((p,i)=><button key={p.name} type="button" aria-pressed={mobilePlan===i} onClick={()=>setMobilePlan(i)}>{p.horizon}</button>)}
        </div>
        <motion.div
          ref={track}
          className="plans-track no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 pt-4 text-left md:mx-0 md:mt-8 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {PLANS.map((p, i) => {
            const best = i === pick;
            return (
              <div
                key={p.name}
                className={`plan-card ${mobilePlan === i ? 'plan-active' : ''} relative flex w-[80vw] max-w-[330px] shrink-0 snap-center flex-col rounded-[24px] bg-white p-5 transition-shadow md:w-auto md:max-w-none md:rounded-[28px] md:p-8 ${best ? 'shadow-[0_0_0_2px_#0071E3,0_20px_50px_-20px_rgba(0,113,227,0.45)]' : ''}`}
              >
                {best && <span className="absolute -top-3 left-5 rounded-full bg-link px-3 py-1 text-[12px] font-semibold text-white md:left-6">Your timeline</span>}
                <div className="flex items-center gap-3 md:block">
                  <div className={`h-9 w-9 shrink-0 rounded-full bg-gradient-to-br ${p.ring} p-[3px] md:h-12 md:w-12`}><div className="h-full w-full rounded-full bg-white" /></div>
                  <div className="md:mt-5">
                    <p className="text-[21px] font-semibold leading-tight tracking-[-0.03em] md:text-[28px]">{p.name}</p>
                    <p className="text-[14px] text-slate md:text-[17px]">{p.tag}</p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-mist pt-4 text-[13px] md:mt-6 md:block md:space-y-4 md:pt-5 md:text-[15px]">
                  <div><dt className="text-graphite">Time horizon</dt><dd className="font-semibold">{p.horizon}</dd></div>
                  <div><dt className="text-graphite">Market drops</dt><dd className="font-semibold">{p.drops}</dd></div>
                  <div className="col-span-2"><dt className="text-graphite">Typical goals</dt><dd className="font-semibold">{p.goals}</dd></div>
                  <div className="col-span-2"><dt className="text-graphite">Before you choose</dt><dd className="mt-1 leading-relaxed">{i === 0 ? 'Check access to your money, exit conditions and capital risk.' : i === 1 ? 'Estimate your target, timeline and a comfortable monthly amount.' : 'Review affordability, inflation and your ability to stay invested.'}</dd></div>
                </dl>
                <a href={wa(`Hi Gulshan! I would like to discuss ${p.name.toLowerCase()} with a ${p.horizon} timeline. Can we review my goals and risk comfort?${done ? ` My answers: ${QS.map((q, n) => `${q.q} ${q.a[ans[n]]}`).join("; ")}` : ""}`)} target="_blank" rel="noreferrer" className="textlink mt-4 text-[15px] md:mt-6 md:text-[17px]">Discuss this goal ›</a>
              </div>
            );
          })}
        </motion.div>
        <p className="plans-swipe mt-1 text-[12px] text-graphite md:hidden">Swipe to compare ›</p>
        <p className="plans-disclosure mx-auto mt-6 max-w-2xl text-[12px] text-graphite">These are starting points for a conversation, not product recommendations. Suitability depends on your full financial circumstances and risk assessment.</p>
      </div>
    </section>
  );
}
