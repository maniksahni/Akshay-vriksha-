import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CONTACT } from '../../data/site';

const TEXT =
  'Building wealth is not about timing the market. It’s about time in the market. Plant a seed, water it every month, and let the years do what years do best.';
const ACCENT = new Set(['timing', 'time', 'seed,', 'years']);

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.25em] inline-block ${ACCENT.has(word) ? 'italic text-gold' : ''}`}>
      {word}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const words = TEXT.split(' ');
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="philosophy" ref={ref} className="relative h-[260vh] bg-night">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="pointer-events-none absolute -right-[5vw] top-1/2 -translate-y-1/2 select-none font-deva text-[40vw] leading-none text-white/[0.025]">काल</div>
        <div className="container-x relative">
          <div className="mb-10 flex items-center gap-4">
            <span className="eyebrow text-gold">Philosophy</span>
            <span className="relative h-px w-40 bg-white/10">
              <motion.span style={{ width: bar }} className="absolute inset-y-0 left-0 bg-gold" />
            </span>
          </div>
          <p className="max-w-[18ch] font-display text-[clamp(2.1rem,5.6vw,5.4rem)] leading-[1.04] tracking-[-0.015em] text-bone sm:max-w-[22ch]">
            {words.map((w, i) => {
              const start = (i / words.length) * 0.85;
              return <Word key={i} word={w} progress={scrollYProgress} range={[start, start + 0.12]} />;
            })}
          </p>
          <p className="mt-10 max-w-md text-sm leading-relaxed text-bone/50 sm:text-base">
            Founded by {CONTACT.founder}, an electronics engineer by training, Akshaya Vriksha has spent {CONTACT.years}+ years helping SIP investors build long-term wealth and protect it.
          </p>
        </div>
      </div>
    </section>
  );
}
