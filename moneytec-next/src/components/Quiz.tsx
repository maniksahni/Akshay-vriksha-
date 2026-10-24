import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { wa } from '../data';
import { Folio, Lines, Riso, Scribble, Stamp } from './print';
import { EASE } from './ui';

const QS = [
  { q: 'When do you need this money?', a: ['Within 3 years', 'In 3 to 7 years', '7+ years, no rush'] },
  { q: 'The market drops 20% in a month. You…', a: ['Sell everything', 'Do nothing, wait', 'Buy the dip'] },
  { q: 'Your income is…', a: ['Kinda unpredictable', 'A steady salary', 'Steady and growing'] },
  { q: 'Investing so far?', a: ['Total beginner', 'Some FDs and funds', 'Years in equity'] },
];
const RESULTS = [
  { letter: 'A', name: 'The Chill Saver', line: 'Stability first. You’d rather sleep well than chase the moon.', mix: [25, 65, 10] },
  { letter: 'B', name: 'The Steady Grinder', line: 'You can ride some swings for better long-term growth.', mix: [55, 35, 10] },
  { letter: 'C', name: 'The Long-Game Legend', line: 'Long horizon, steady nerves. You let compounding cook.', mix: [75, 15, 10] },
];
const MIX = [['Equity', 'bg-pink'], ['Debt', 'bg-blue'], ['Gold', 'bg-sun']];

export function Quiz() {
  const [ans, setAns] = useState<(number | null)[]>([null, null, null, null]);
  const done = ans.every((a) => a !== null);
  const score = ans.reduce<number>((s, a) => s + (a ?? 0), 0);
  const r = RESULTS[score <= 2 ? 0 : score <= 5 ? 1 : 2];
  const pick = (qi: number, ai: number) => setAns((s) => s.map((v, i) => (i === qi ? ai : v)));

  return (
    <section id="vibe" className="relative py-12 sm:py-20">
      <div className="wrap">
        <Folio no="04" title="Quiz of the week" color="bg-blue text-paper" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <Lines className="text-[clamp(2.6rem,6.4vw,5.6rem)]" lines={['What kind', 'of money', <Riso amount={4}>person</Riso>, 'are you?']} />
            <p className="mt-4 max-w-sm font-serif text-xl leading-snug">Four questions. Circle your answers. Count your letters. You know the drill.</p>
          </div>

          <div className="boxed relative p-4 sm:p-7">
            <span className="tape -right-3 -top-3 rotate-12" aria-hidden />
            <ol className="grid gap-5">
              {QS.map((q, qi) => (
                <li key={q.q}>
                  <p className="headline text-xl sm:text-2xl">
                    <span className="mr-2 font-mono text-sm text-ink/50">{qi + 1}.</span>
                    {q.q}
                  </p>
                  <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                    {q.a.map((a, ai) => {
                      const on = ans[qi] === ai;
                      return (
                        <button key={a} onClick={() => pick(qi, ai)} aria-pressed={on} className="relative flex items-center gap-2 px-2 py-1.5 text-left text-[15px] transition-colors hover:bg-newsprint">
                          <span className="font-mono text-sm font-bold">{'ABC'[ai]})</span>
                          <span>{a}</span>
                          {on && <Scribble kind="circle" className="absolute -inset-x-1 -inset-y-1.5 h-[calc(100%+12px)] w-[calc(100%+8px)]" color="#FF3EA5" delay={0} />}
                        </button>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ol>

            <AnimatePresence>
              {done && (
                <motion.div
                  key={r.name}
                  className="relative mt-6 border-t-2 border-ink pt-5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <p className="label text-ink/60">Mostly {r.letter}’s? You’re…</p>
                  <p className="headline mt-1 text-[clamp(2rem,5vw,3.2rem)]">
                    <Riso amount={3}>{r.name}</Riso>
                  </p>
                  <p className="mt-1 font-serif text-lg">{r.line}</p>
                  <div className="mt-3 flex h-6 border-2 border-ink">
                    {r.mix.map((v, i) => (
                      <motion.span key={i} className={`${MIX[i][1]} ${i ? 'border-l-2 border-ink' : ''}`} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.1 }} />
                    ))}
                  </div>
                  <p className="mt-1.5 font-mono text-[11px]">{MIX.map(([k], i) => `${k} ${r.mix[i]}%`).join('  ·  ')}  (a sample mix for this vibe)</p>
                  <Stamp className="absolute right-0 top-4 text-sm sm:text-base" rotate={-14}>Certified</Stamp>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={wa(`Hey Gulshan! The moneytec quiz says I'm "${r.name}". Can we build a plan around that?`)} target="_blank" rel="noreferrer" className="btn-pink">Build my plan →</a>
                    <button onClick={() => setAns([null, null, null, null])} className="btn-paper">Erase & retake</button>
                  </div>
                  <p className="mt-3 font-mono text-[10px] text-ink/50">For fun and a starting point, not investment advice. Your real allocation comes from a proper risk profiling.</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!done && <p className="mt-5 font-hand text-2xl text-blue">answer all 4 to get your result ↑</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
