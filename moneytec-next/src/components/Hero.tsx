import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FACTS, wa } from '../data';
import { Coin } from './Coin';
import { EASE, Magnetic, Marquee } from './ui';

const STICKERS = [
  { text: 'Start at ₹500', cls: 'bg-lime text-void', pos: 'left-[2%] top-[14%]', rot: -10 },
  { text: 'NRI? sorted ✈', cls: 'bg-volt text-chalk', pos: 'right-[0%] top-[6%]', rot: 8 },
  { text: 'Talk to a real human 👋', cls: 'bg-chalk text-void', pos: 'left-[0%] bottom-[0%] sm:bottom-[16%]', rot: 5 },
  { text: 'AMFI ✓ ARN-105840', cls: 'bg-coral text-void', pos: 'right-[2%] bottom-[8%]', rot: -7 },
];

const LINES = [
  { t: 'You chill.', c: 'text-chalk' },
  { t: 'Your money', c: 'text-chalk' },
  { t: 'does the grind.', c: 'text-lime' },
];

export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const [coinSize, setCoinSize] = useState(320);

  useEffect(() => {
    const set = () => setCoinSize(window.innerWidth < 640 ? 150 : window.innerWidth < 1024 ? 240 : 340);
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-[84px]">
      {/* background: soft lime + violet auras on a fine grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent)]" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-volt/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-lime/15 blur-[120px]" />

      <div className="wrap relative grid items-center gap-2 pb-8 pt-2 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10 lg:pb-16 lg:pt-14">
        <div className="relative z-10 order-2 lg:order-none">
          <motion.p
            className="kicker text-lime"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-lime" /> SIPs · insurance · NRI investing
          </motion.p>

          <h1 className="h-display mt-4 text-[clamp(2.05rem,4.7vw,4.6rem)]">
            {LINES.map((l, i) => (
              <span key={l.t} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${l.c}`}
                  initial={{ y: '105%', rotate: 3 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 0.1 + i * 0.1 }}
                >
                  {i === 2 ? (
                    <>
                      {l.t.split(' ').slice(0, -1).join(' ')}{' '}
                      {/* keep the emoji glued to the last word so it never wraps alone */}
                      <span className="whitespace-nowrap">
                        {l.t.split(' ').slice(-1)[0]}
                        <span className="ml-2 inline-block animate-floaty align-middle text-[0.5em]">💸</span>
                      </span>
                    </>
                  ) : (
                    l.t
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-5 max-w-xl text-[15px] leading-relaxed text-chalk/70 sm:text-lg"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          >
            Goal-based SIPs, insurance that actually has your back, and investing from abroad without the headache. Explained like a friend, handled like a pro, by <span className="text-chalk">{FACTS.name}</span>.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
          >
            <Magnetic>
              <a href="#glow-up" className="btn-lime">
                Calculate my glow-up <span aria-hidden>→</span>
              </a>
            </Magnetic>
            <a href={wa('Hey! I want to start a SIP. Can we talk?')} target="_blank" rel="noreferrer" className="btn-ghost">
              Slide into WhatsApp
            </a>
          </motion.div>

          <motion.ul
            className="mt-6 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {[`AMFI-registered · ${FACTS.arn}`, `${FACTS.years}+ yrs in the game`, 'India + NRIs'].map((t) => (
              <li key={t} className="chip">
                <span className="text-lime">●</span> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* coin + throwable stickers */}
        <motion.div
          ref={stage}
          className="relative order-1 mx-auto grid h-[210px] w-full max-w-[520px] place-items-center sm:h-[340px] lg:order-none lg:h-[480px]"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
        >
          <Coin size={coinSize} />
          {STICKERS.map((s, i) => (
            <motion.button
              key={s.text}
              type="button"
              drag
              dragConstraints={stage}
              dragElastic={0.2}
              whileDrag={{ scale: 1.12, rotate: 0, zIndex: 20 }}
              whileHover={{ scale: 1.06 }}
              initial={{ opacity: 0, scale: 0.4, rotate: s.rot * 2 }}
              animate={{ opacity: 1, scale: 1, rotate: s.rot }}
              transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.7 + i * 0.12 }}
              className={`sticker absolute z-10 cursor-grab text-[11px] active:cursor-grabbing sm:text-[13px] ${s.cls} ${s.pos}`}
              aria-label={`${s.text} (sticker, drag me)`}
            >
              {s.text}
            </motion.button>
          ))}
          <span className="absolute -bottom-1 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-chalk/35 sm:block">drag the coin · toss the stickers</span>
        </motion.div>
      </div>

      <div className="relative -rotate-1 border-y-2 border-void bg-lime py-3 text-void">
        <Marquee
          className="font-display text-lg font-extrabold tracking-tight sm:text-2xl"
          items={['SIP from ₹500/month', 'no jargon', 'NRI? sorted', 'insurance that has your back', 'AMFI-registered', 'goals > vibes', 'start before you’re “ready”']}
        />
      </div>
    </section>
  );
}
