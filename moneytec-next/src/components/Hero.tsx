import { HeroWisdom } from './Wisdom';
import { BrandLogo } from './BrandLogo';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FACTS } from '../data';
import { EASE, reduced, useMobile } from './ui';

/** Each character rises out of its own mask, one after another. */
function SplitLine({ text, play, delay, accent }: { text: string; play: boolean; delay: number; accent?: boolean }) {
  const chars = text.split('');
  return (
    <span aria-hidden className="block overflow-hidden pb-[0.12em]">
      <span className={`block ${accent ? 'italic' : ''}`}>
        {chars.map((ch, i) => (
          <motion.span
            key={i}
            className={`inline-block ${accent ? 'gold-text' : ''}`}
            initial={{ y: '110%', opacity: 0 }}
            animate={play ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 1.3, ease: EASE, delay: delay + i * 0.035 }}
            // one gradient spread across the whole line, each letter showing its own slice
            style={accent ? { backgroundSize: `${chars.length * 100}% 100%`, backgroundPosition: `${(i / (chars.length - 1)) * 100}% 0` } : undefined}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

/** Goals the site already plans for; the headline's last word cycles through them. */
const GOALS = ['freedom.', 'home.', 'education.', 'retirement.'];

/** "Tomorrow's" stays put while the goal after it rolls over, one every few seconds. */
function GoalLine({ play, delay }: { play: boolean; delay: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!play || reduced()) return;
    const start = window.setTimeout(() => {
      const t = window.setInterval(() => setI((n) => (n + 1) % GOALS.length), 2600);
      cleanup = () => window.clearInterval(t);
    }, (delay + 1.8) * 1000);
    let cleanup = () => {};
    return () => { window.clearTimeout(start); cleanup(); };
  }, [play, delay]);
  return (
    <span aria-hidden className="goal-line block overflow-hidden pb-[0.12em]">
      <motion.span className="inline-block italic" initial={{ y: '110%', opacity: 0 }} animate={play ? { y: 0, opacity: 1 } : undefined} transition={{ duration: 1.3, ease: EASE, delay }}>
        Tomorrow’s{'\u00A0'}
      </motion.span>
      <span className="goal-slot">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={GOALS[i]}
            className="goal-word gold-text inline-block italic"
            initial={{ y: '110%', opacity: 0 }}
            animate={play ? { y: 0, opacity: 1 } : undefined}
            exit={{ y: '-110%', opacity: 0 }}
            transition={{ duration: i ? 0.8 : 1.3, ease: EASE, delay: i ? 0 : delay + 0.15 }}
          >
            {GOALS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

const rise = (play: boolean, d: number, y = 16) => ({ initial: { opacity: 0, y }, animate: play ? { opacity: 1, y: 0 } : undefined, transition: { duration: 1.2, ease: EASE, delay: d } });

function Actions({ mobile }: { mobile: boolean }) {
  return (
    <div className="lux-actions">
      <a href="#start" className="btn-light pr-2" data-cursor="Let’s talk">Start a conversation <span className="arrow">↗</span></a>
      <a href="#calculator" onClick={() => window.dispatchEvent(new Event('moneytec:plan-goal'))} className="btn-ghost">{mobile ? 'Plan my goal' : 'Plan my goal ↓'}</a>
    </div>
  );
}
function Credentials() {
  return (
    <div className="lux-credentials">
      <span><BrandLogo brand="amfi" className="hero-amfi-logo" />AMFI registered <b>{FACTS.arn}</b></span>
      <span><i aria-hidden>✳</i>Personal guidance <b>{FACTS.name}</b></span>
    </div>
  );
}

/**
 * The opening: the chrome ₹ (drawn by the Stage behind this section) fills the screen like a coin held up to the
 * light, the headline rests across its lower half, and the next step sits just beneath. Along the floor, behind
 * a hairline: the verse, the promise and the credentials. Scrolling carries you into the coin.
 */
export function Hero() {
  const mobile = useMobile();
  const play = true; // the headline plays as soon as the page appears
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const fade = useTransform(p, [0, 0.55], [1, 0]);
  const lift = useTransform(p, [0, 1], [0, -120]);
  const grow = useTransform(p, [0, 1], [1, 1.12]);

  if (mobile) {
    return (
      <section id="top" className="lux-hero-mobile lux-hero-full-mobile relative overflow-hidden">
        <div className="coin-slot" aria-hidden />
        <div className="wrap relative text-center">
          <h1 className="lux-title lux-full-title mt-[250px]" aria-label="Today’s rupee. Tomorrow’s freedom.">
            <SplitLine text="Today’s rupee." play={play} delay={0.2} />
            <GoalLine play={play} delay={0.45} />
          </h1>
          <motion.div className="mt-7" {...rise(play, 0.9)}><Actions mobile /></motion.div>
          <motion.div className="mt-10" {...rise(play, 1.05)}>
            <p className="lux-eyebrow mb-8 justify-center">Moneytec — Money, with meaning</p>
            <HeroWisdom />
            <p className="lux-promise">Goal-based investing, family protection and NRI guidance with {FACTS.name}.</p>
          </motion.div>
          <motion.div className="mt-7" {...rise(play, 1.2, 0)}><Credentials /></motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="top" ref={ref} className="lux-hero lux-hero-full relative">
      <div className="lux-full-scrim" aria-hidden />
      <div className="wrap-wide relative h-full">
        <motion.div className="lux-full-center" style={{ opacity: fade, y: lift, scale: grow }}>
          <h1 className="lux-title lux-full-title" aria-label="Today’s rupee. Tomorrow’s freedom.">
            <SplitLine text="Today’s rupee." play={play} delay={0.35} />
            <GoalLine play={play} delay={0.65} />
          </h1>
          <motion.div className="mt-8 flex justify-center" {...rise(play, 1.15)}><Actions mobile={false} /></motion.div>
        </motion.div>

        <motion.div className="lux-full-floor" style={{ opacity: fade }}>
          <motion.div {...rise(play, 1.3)}><HeroWisdom /></motion.div>
          <motion.div className="text-center" {...rise(play, 1.4)}>
            <p className="lux-eyebrow justify-center">Moneytec — Money, with meaning</p>
            <p className="lux-promise mt-3">Goal-based investing, family protection and NRI guidance with {FACTS.name}.</p>
          </motion.div>
          <motion.div className="flex justify-end" {...rise(play, 1.5)}><Credentials /></motion.div>
        </motion.div>
      </div>
    </section>
  );
}
