import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { useState } from 'react';
import { FadeIn, Rise } from './ui';

const MYTHS = [
  { m: 'Investing is for rich people.', f: 'Many SIPs start at ₹500 a month. Starting early matters way more than starting big.' },
  { m: 'I need to time the market.', f: 'Time in the market beats timing it. A SIP buys through the ups and downs and averages your cost.' },
  { m: 'Mutual funds are basically gambling.', f: 'They’re regulated by SEBI and spread across many holdings. Risk depends on the type of fund you choose.' },
  { m: 'Insurance is an investment.', f: 'Insurance protects, investing grows. Planning each for its own job usually gets you more of both.' },
  { m: 'I’m too young to plan.', f: 'Being young is the cheat code. Time is the one thing compounding needs most.' },
  { m: 'NRIs can’t invest back home easily.', f: 'NRIs can invest through NRE/NRO accounts, mostly online. US and Canada residents can too, with select fund houses.' },
];

const COLORS = ['bg-lime text-void', 'bg-volt text-chalk', 'bg-coral text-void', 'bg-sky text-void', 'bg-chalk text-void', 'bg-lime text-void'];

export function Myths() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dir, setDir] = useState(1);

  const go = (d: number) => {
    setDir(d);
    setFlipped(false);
    setI((n) => (n + d + MYTHS.length) % MYTHS.length);
  };
  const onEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500) go(info.offset.x < 0 ? 1 : -1);
  };
  const card = MYTHS[i];

  return (
    <section id="myths" className="relative py-16 sm:py-24">
      <div className="wrap grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="kicker text-sky">04 · myth vs fact</p>
          <Rise className="h-display mt-3 text-[clamp(1.9rem,4.4vw,3.9rem)]">{'Your uncle said what? / Let’s *fact-check.*'}</Rise>
          <FadeIn delay={0.1}>
            <p className="mt-4 max-w-md text-chalk/60">Tap a card to flip it. Swipe for the next one. Money myths, busted in one line each.</p>
          </FadeIn>
          <div className="mt-5 hidden gap-2 lg:flex">
            <button onClick={() => go(-1)} className="btn-ghost h-11 w-11 px-0" aria-label="Previous myth">←</button>
            <button onClick={() => go(1)} className="btn-ghost h-11 w-11 px-0" aria-label="Next myth">→</button>
          </div>
        </div>

        <FadeIn delay={0.1}>
          <div className="relative mx-auto h-[320px] w-full max-w-[440px] sm:h-[360px]">
            {/* the next two cards peek out behind */}
            {[2, 1].map((k) => (
              <div
                key={k}
                className={`absolute inset-0 rounded-[30px] ${COLORS[(i + k) % COLORS.length]} opacity-60`}
                style={{ transform: `translateY(${k * 14}px) scale(${1 - k * 0.05}) rotate(${k % 2 ? 3 : -3}deg)` }}
              />
            ))}
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.button
                key={i}
                type="button"
                drag="x"
                dragSnapToOrigin
                onDragEnd={onEnd}
                onClick={() => setFlipped((f) => !f)}
                className={`absolute inset-0 flex cursor-grab flex-col rounded-[30px] p-6 text-left shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] active:cursor-grabbing sm:p-8 ${COLORS[i % COLORS.length]}`}
                initial={{ x: dir * 220, opacity: 0, rotate: dir * 12 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                exit={{ x: dir * -260, opacity: 0, rotate: dir * -14 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                aria-label={flipped ? `Fact: ${card.f}` : `Myth: ${card.m}. Tap for the fact.`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-void/90 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-chalk">{flipped ? '✓ fact' : '✗ myth'}</span>
                  <span className="font-display text-sm font-bold opacity-60">{String(i + 1).padStart(2, '0')}/{String(MYTHS.length).padStart(2, '0')}</span>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={flipped ? 'f' : 'm'}
                    initial={{ opacity: 0, y: 12, rotateX: -50 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -12, rotateX: 50 }}
                    transition={{ duration: 0.3 }}
                    className={`mt-auto font-display font-extrabold leading-[1.05] tracking-tight ${flipped ? 'text-xl sm:text-2xl' : 'text-[1.9rem] sm:text-[2.4rem]'}`}
                  >
                    {flipped ? card.f : `“${card.m}”`}
                  </motion.p>
                </AnimatePresence>
                <span className="mt-5 text-[12px] font-semibold opacity-60">{flipped ? 'swipe for the next one →' : 'tap to flip ↻'}</span>
              </motion.button>
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
