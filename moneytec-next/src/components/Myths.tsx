import { motion, PanInfo } from 'framer-motion';
import { useRef, useState } from 'react';
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
  // a swipe must never also count as a tap-to-flip
  const dragged = useRef(false);

  const go = (d: number) => {
    setDir(d);
    setFlipped(false);
    setI((n) => (n + d + MYTHS.length) % MYTHS.length);
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 450) go(info.offset.x < 0 ? 1 : -1);
    // let the click that follows a drag pass without flipping
    setTimeout(() => (dragged.current = false), 0);
  };
  const card = MYTHS[i];
  const color = COLORS[i % COLORS.length];

  return (
    <section id="myths" className="relative py-14 sm:py-24">
      <div className="wrap grid items-center gap-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="kicker text-sky">04 · myth vs fact</p>
          <Rise className="h-display mt-3 text-[clamp(1.9rem,4.4vw,3.9rem)]">{'Your uncle said what? / Let’s *fact-check.*'}</Rise>
          <FadeIn delay={0.1}>
            <p className="mt-3 max-w-md text-chalk/60">Tap to flip, swipe for the next one. Money myths, busted in one line each.</p>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <div className="mx-auto w-full max-w-[440px]">
            <div className="relative h-[250px] sm:h-[310px]" style={{ perspective: 1200 }}>
              {/* the next two cards peek out behind (static: no animation cost) */}
              {[2, 1].map((k) => (
                <div
                  key={k}
                  aria-hidden
                  className={`absolute inset-0 rounded-[28px] ${COLORS[(i + k) % COLORS.length]} opacity-50`}
                  style={{ transform: `translateY(${k * 12}px) scale(${1 - k * 0.05}) rotate(${k % 2 ? 3 : -3}deg)` }}
                />
              ))}

              {/* the live card: slides in on change, drags to swipe, flips in 3D on tap */}
              <motion.div
                key={i}
                className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragStart={() => (dragged.current = true)}
                onDragEnd={onDragEnd}
                initial={{ x: dir * 80, opacity: 0, rotate: dir * 6 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              >
                <button
                  type="button"
                  onClick={() => !dragged.current && setFlipped((f) => !f)}
                  className="relative block h-full w-full text-left"
                  style={{ transformStyle: 'preserve-3d', transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1)', transform: `rotateY(${flipped ? 180 : 0}deg)` }}
                  aria-label={flipped ? `Fact: ${card.f}. Tap to see the myth.` : `Myth: ${card.m}. Tap for the fact.`}
                >
                  {/* front: the myth */}
                  <span className={`absolute inset-0 flex flex-col rounded-[28px] p-5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)] sm:p-7 ${color}`} style={{ backfaceVisibility: 'hidden' }}>
                    <span className="flex items-center justify-between">
                      <span className="rounded-full bg-void/90 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-chalk">✗ myth</span>
                      <span className="font-display text-sm font-bold opacity-60">{String(i + 1).padStart(2, '0')}/{String(MYTHS.length).padStart(2, '0')}</span>
                    </span>
                    <span className="mt-auto font-display text-[1.65rem] font-extrabold leading-[1.05] tracking-tight sm:text-[2.2rem]">“{card.m}”</span>
                    <span className="mt-4 text-[12px] font-semibold opacity-60">tap to flip ↻</span>
                  </span>
                  {/* back: the fact */}
                  <span
                    className="absolute inset-0 flex flex-col rounded-[28px] bg-void p-5 text-chalk ring-2 ring-inset ring-lime/70 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.7)] sm:p-7"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <span className="flex items-center justify-between">
                      <span className="rounded-full bg-lime px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-void">✓ fact</span>
                      <span className="font-display text-sm font-bold text-chalk/50">{String(i + 1).padStart(2, '0')}/{String(MYTHS.length).padStart(2, '0')}</span>
                    </span>
                    <span className="mt-auto font-display text-lg font-bold leading-snug tracking-tight sm:text-2xl">{card.f}</span>
                    <span className="mt-4 text-[12px] font-semibold text-lime/80">swipe or tap → for the next one</span>
                  </span>
                </button>
              </motion.div>
            </div>

            {/* controls: work the same on phone and laptop */}
            <div className="mt-8 flex items-center justify-between gap-3 sm:mt-10">
              <div className="flex gap-1.5" aria-hidden>
                {MYTHS.map((_, k) => (
                  <span key={k} className={`h-1.5 rounded-full transition-all duration-300 ${k === i ? 'w-6 bg-lime' : 'w-1.5 bg-white/20'}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => go(-1)} className="btn-ghost h-11 w-11 px-0" aria-label="Previous myth">←</button>
                <button onClick={() => setFlipped((f) => !f)} className="btn-ghost h-11 px-4 text-sm" aria-pressed={flipped}>{flipped ? 'Myth' : 'Flip'} ↻</button>
                <button onClick={() => go(1)} className="btn-lime h-11 w-11 px-0" aria-label="Next myth">→</button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
