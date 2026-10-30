import { HeroWisdom } from './Wisdom';
import { BrandLogo } from './BrandLogo';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FACTS } from '../data';
import { EASE, useMobile } from './ui';
import { useIntroDone } from './Intro';

/** The ₹'s own facts, set like an engraving under the coin. */
function FactLine({ className = '' }: { className?: string }) {
  return (
    <p aria-hidden className={`pointer-events-none whitespace-nowrap font-mono text-[10px] tracking-[0.32em] text-paper/45 ${className}`}>
      U+20B9 <span className="text-rose">·</span> INR <span className="text-rose">·</span> ISO 4217 <span className="text-rose">·</span> 356 <span className="text-rose">·</span> 15·07·2010
    </p>
  );
}

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
 * The opening, composed like a jeweller's window: the gold ₹ (drawn by the Stage behind this section) sits in
 * the centre with "Small steps." to its left and "Lasting growth." to its right, its engraving beneath. Along the
 * floor, behind a hairline: the verse, the promise and the next step.
 */
export function Hero() {
  const mobile = useMobile();
  const play = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const leftX = useTransform(p, [0, 1], ['0%', '-18%']);
  const rightX = useTransform(p, [0, 1], ['0%', '18%']);
  const fade = useTransform(p, [0, 0.7], [1, 0]);

  if (mobile) {
    return (
      <section id="top" className="lux-hero-mobile relative overflow-hidden">
        <div className="wrap relative text-center">
          <motion.p className="lux-eyebrow justify-center" {...rise(play, 0.1)}>Moneytec — Money, with meaning</motion.p>
          <h1 className="lux-title mt-5" aria-label="Small steps. Lasting growth.">
            <SplitLine text="Small steps." play={play} delay={0.2} />
            <SplitLine text="Lasting growth." play={play} delay={0.45} accent />
          </h1>
          <motion.div className="mt-7" {...rise(play, 0.9)}>
            <HeroWisdom />
            <p className="lux-promise">Goal-based investing, family protection and NRI guidance with {FACTS.name}.</p>
          </motion.div>
          <motion.div className="mt-7" {...rise(play, 1.05)}><Actions mobile /></motion.div>
          <motion.div className="mt-7" {...rise(play, 1.2, 0)}><Credentials /></motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="top" ref={ref} className="lux-hero relative">
      <div className="lux-hero-grid wrap-wide">
        <motion.div style={{ opacity: fade }}>
          <motion.p className="lux-eyebrow justify-center" {...rise(play, 0.1)}>Moneytec — Money, with meaning</motion.p>
        </motion.div>

        <h1 className="lux-title lux-hero-title" aria-label="Small steps. Lasting growth.">
          <motion.span className="lux-hero-left" style={{ x: leftX, opacity: fade }}><SplitLine text="Small steps." play={play} delay={0.3} /></motion.span>
          <span className="lux-hero-coin" aria-hidden />
          <motion.span className="lux-hero-right" style={{ x: rightX, opacity: fade }}><SplitLine text="Lasting growth." play={play} delay={0.6} accent /></motion.span>
        </h1>
        <motion.div style={{ opacity: fade }}>
          <motion.div {...rise(play, 1.3, 0)}><FactLine className="text-center" /></motion.div>
        </motion.div>

        <motion.div className="lux-hero-floor" style={{ opacity: fade }}>
          <motion.div {...rise(play, 1.0)}><HeroWisdom /></motion.div>
          <motion.div {...rise(play, 1.15)}><p className="lux-promise">Goal-based investing, family protection and NRI guidance with {FACTS.name}.</p></motion.div>
          <motion.div className="lux-hero-cta" {...rise(play, 1.3)}><Actions mobile={false} /><Credentials /></motion.div>
        </motion.div>
      </div>
    </section>
  );
}
