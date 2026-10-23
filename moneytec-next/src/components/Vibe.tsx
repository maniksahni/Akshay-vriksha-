import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { wa } from '../data';
import { EASE, FadeIn, Rise } from './ui';

const QS = [
  { q: 'When do you need this money?', a: [['⏳', 'in < 3 years'], ['📆', 'in 3–7 years'], ['🌱', '7+ years, no rush']] },
  { q: 'Markets drop 20% in a month. You…', a: [['😰', 'sell everything'], ['🫠', 'do nothing, wait'], ['🛒', 'buy the dip']] },
  { q: 'Your income situation?', a: [['🎲', 'kinda unpredictable'], ['💼', 'steady salary'], ['📈', 'steady + growing']] },
  { q: 'Investing experience?', a: [['🐣', 'total beginner'], ['🙂', 'some FDs / funds'], ['😎', 'been in equity a while']] },
];

type Persona = { name: string; emoji: string; line: string; mix: [number, number, number]; grad: string };
const PERSONAS: Persona[] = [
  { name: 'The Chill Saver', emoji: '🧊', line: 'Stability first. You’d rather sleep well than chase the moon.', mix: [25, 65, 10], grad: 'from-sky via-chalk to-volt-soft' },
  { name: 'The Steady Grinder', emoji: '⚙️', line: 'You can handle some swings for better long-term growth.', mix: [55, 35, 10], grad: 'from-lime via-chalk to-sky' },
  { name: 'The Long-Game Legend', emoji: '🚀', line: 'Long horizon, steady nerves. You let compounding cook.', mix: [75, 15, 10], grad: 'from-lime via-volt-soft to-coral' },
];
const MIX = [
  ['Equity', '#D4FF3A'],
  ['Debt', '#B9A8FF'],
  ['Gold', '#FF6B4A'],
];

export function Vibe() {
  const [ans, setAns] = useState<number[]>([]);
  const done = ans.length === QS.length;
  const score = ans.reduce((s, a) => s + a + 1, 0);
  const p = PERSONAS[score <= 6 ? 0 : score <= 9 ? 1 : 2];

  return (
    <section id="vibe" className="relative overflow-hidden py-16 sm:py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt/20 blur-[140px]" />
      <div className="wrap relative grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="kicker text-coral">03 · money vibe check</p>
          <Rise className="h-display mt-3 text-[clamp(1.9rem,4.4vw,3.9rem)]">{'What’s your / *money* personality?'}</Rise>
          <FadeIn delay={0.1}>
            <p className="mt-4 max-w-md text-chalk/60">Four questions, twenty seconds. Get your investor archetype and a sample mix, then talk it through with a human.</p>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <div className="card min-h-[400px] p-5 sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {!done ? (
                <motion.div key={ans.length} initial={{ opacity: 0, x: 40, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: 0 }} exit={{ opacity: 0, x: -40, rotate: -2 }} transition={{ duration: 0.35, ease: EASE }}>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm font-bold text-lime">{ans.length + 1}/{QS.length}</span>
                    <div className="flex flex-1 gap-1.5">
                      {QS.map((_, i) => (
                        <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= ans.length ? 'bg-lime' : 'bg-white/10'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-5 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{QS[ans.length].q}</p>
                  <div className="mt-5 grid gap-2.5">
                    {QS[ans.length].a.map(([e, t], i) => (
                      <motion.button
                        key={t}
                        whileHover={{ x: 6 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setAns((s) => [...s, i])}
                        className="flex items-center gap-4 rounded-2xl border border-line bg-white/[0.03] px-4 py-4 text-left text-[15px] transition-colors hover:border-lime hover:bg-lime/10 sm:text-base"
                      >
                        <span className="text-2xl">{e}</span>
                        <span className="font-medium">{t}</span>
                      </motion.button>
                    ))}
                  </div>
                  {ans.length > 0 && (
                    <button onClick={() => setAns((s) => s.slice(0, -1))} className="mt-4 text-xs text-chalk/50 hover:text-lime">
                      ← back
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.9, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
                  {/* collectible card with a holographic edge */}
                  <div className={`rounded-[26px] bg-gradient-to-br ${p.grad} p-[2px]`}>
                    <div className="rounded-[24px] bg-void p-5 sm:p-7">
                      <p className="kicker text-chalk/50">your money personality</p>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-5xl">{p.emoji}</span>
                        <p className={`bg-gradient-to-r ${p.grad} bg-clip-text font-display text-3xl font-black leading-none tracking-tight text-transparent sm:text-4xl`}>{p.name}</p>
                      </div>
                      <p className="mt-3 text-chalk/70">{p.line}</p>
                      <p className="mt-5 text-[12px] text-chalk/50">A sample mix for this vibe</p>
                      <div className="mt-2 flex h-4 overflow-hidden rounded-full">
                        {p.mix.map((v, i) => (
                          <motion.span key={i} style={{ background: MIX[i][1] }} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.1 }} />
                        ))}
                      </div>
                      <div className="mt-2 flex gap-4 text-[12px] text-chalk/70">
                        {MIX.map(([k, c], i) => (
                          <span key={k} className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ background: c }} />
                            {k} {p.mix[i]}%
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a href={wa(`Hey! I did the money vibe check on moneytec and got "${p.name}" ${p.emoji}. Can we build a plan around that?`)} target="_blank" rel="noreferrer" className="btn-lime">
                      Build my plan →
                    </a>
                    <button onClick={() => setAns([])} className="btn-ghost">
                      Retake
                    </button>
                  </div>
                  <p className="mt-3 text-[10.5px] text-chalk/40">Just for fun and a starting point, not investment advice. Your real allocation is set after a proper risk profiling.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
