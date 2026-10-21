import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CONTACT } from '../../data/site';
import { scrollToHash } from '../../lib/smooth';
import { Bokeh } from '../Bokeh';
import { GoldSilk } from '../GoldSilk';
import { TreeCanvas } from '../TreeCanvas';
import { EASE, Magnetic } from '../ui/motion';

const LINES: { text: string; className?: string; letters?: boolean }[] = [
  { text: 'Plant a SIP today.', letters: true },
  { text: 'Rest in its shade', className: 'italic text-foil pr-[0.08em]' },
  { text: 'tomorrow.', letters: true },
];

/** Each letter lifts and turns gold under the pointer, then settles slowly, so a sweep leaves a wave. */
function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {word.split('').map((ch, i) => (
            <span
              key={i}
              className="inline-block transition-[transform,color] duration-[900ms] ease-out hover:-translate-y-[0.12em] hover:text-gold hover:duration-150"
            >
              {ch}
            </span>
          ))}
          {w < text.split(' ').length - 1 && '\u00a0'}
        </span>
      ))}
    </>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%']);
  const textO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const treeScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const treeY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-night">
      {/* atmosphere */}
      <div className="absolute inset-0 opacity-70">
        <GoldSilk intensity={0.45} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_68%_70%,rgba(217,174,91,0.13),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night to-transparent z-[1]" />

      <div className="absolute inset-0 opacity-80"><Bokeh /></div>
      <motion.div className="absolute inset-0 origin-bottom" style={{ scale: treeScale, y: treeY }}>
        <TreeCanvas grow={ready} rootX={0.5} className="md:hidden opacity-40" />
        <div className="absolute inset-0 hidden md:block">
          <TreeCanvas grow={ready} rootX={0.74} />
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(6,17,13,0.85)_0%,rgba(6,17,13,0.55)_38%,transparent_62%)] max-md:bg-[linear-gradient(0deg,rgba(6,17,13,0.95)_0%,rgba(6,17,13,0.6)_55%,transparent_80%)]" />
      <motion.div style={{ y: textY, opacity: textO }} className="container-x relative z-[2] flex min-h-[100svh] flex-col justify-center pb-28 pt-28 sm:pb-32 lg:pb-28 lg:pt-32">
        <motion.p
          className="font-deva text-lg text-gold/90 sm:text-xl"
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        >
          अद्यैव निवेशय, श्रेयसे श्वः।
          <span className="ml-3 font-sans text-xs uppercase tracking-eyebrow text-bone/40">Invest today, for a better tomorrow</span>
        </motion.p>

        <h1 className="mt-6 font-display text-[clamp(2.65rem,8.4vw,7rem)] leading-[0.92] tracking-[-0.02em] text-bone">
          {LINES.map((l, i) => (
            <span key={i} className="-mt-[0.16em] block overflow-hidden pb-[0.06em] pt-[0.16em]">
              <motion.span
                className={`block ${l.className ?? ''}`}
                initial={{ y: '110%', rotate: 2 }}
                animate={ready ? { y: '0%', rotate: 0 } : undefined}
                transition={{ duration: 1.3, ease: EASE, delay: 0.1 + i * 0.12 }}
              >
                {l.letters ? <Letters text={l.text} /> : l.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="mt-8 flex max-w-xl flex-col gap-7 sm:mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: EASE, delay: 0.7 }}
        >
          <p className="text-base leading-relaxed text-bone/70 sm:text-lg">
            Goal-based SIPs and life &amp; health insurance, for families in India and NRIs across the world. Facilitated personally by {CONTACT.founder}.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <button
                onClick={() => scrollToHash('#contact')}
                className="inline-flex h-14 items-center gap-3 rounded-full bg-gold pl-7 pr-2 text-[15px] font-semibold text-night transition-colors hover:bg-gold-soft"
              >
                Book a consultation
                <span className="grid h-10 w-10 place-items-center rounded-full bg-night text-gold">→</span>
              </button>
            </Magnetic>
            <button
              onClick={() => scrollToHash('#goals')}
              className="inline-flex h-14 items-center rounded-full border border-white/15 px-7 text-[15px] font-medium text-bone transition-colors hover:border-gold hover:text-gold"
            >
              Plan my goal
            </button>
          </div>
          <button onClick={() => scrollToHash('#essentials')} className="self-start text-sm text-gold underline decoration-gold/30 underline-offset-4 hover:decoration-gold">New to investing? Start with the essentials ↗</button>
          <ul className="-mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-bone/55">
            {['No-obligation consultation', `AMFI Registered Mutual Fund Distributor · ${CONTACT.arn}`, 'NRIs welcome'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m3 8.5 3 3 7-7" /></svg>
                {t}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-x-0 bottom-0 z-[3] border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <div className="container-x flex h-16 items-center justify-between gap-6 text-[11px] uppercase tracking-[0.18em] text-bone/50">
          <div className="flex gap-6 overflow-hidden whitespace-nowrap sm:gap-10">
            <span><span className="text-gold">AMFI</span> {CONTACT.arn}</span>
            <span className="hidden sm:inline"><span className="text-gold">Kotak Life</span> {CONTACT.kotak}</span>
            <span className="hidden md:inline"><span className="text-gold">{CONTACT.years}+</span> years of trust</span>
          </div>
          <button onClick={() => scrollToHash('#philosophy')} className="flex items-center gap-3 hover:text-gold">
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-white/15">
              <span className="absolute left-0 top-0 h-3 w-px animate-[float_1.6s_ease-in-out_infinite] bg-gold" />
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
