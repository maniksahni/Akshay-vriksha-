import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { sipValue } from '../../utils/calculations';
import { formatINR } from '../../utils/formatters';
import { TreeCanvas } from '../TreeCanvas';
import { EASE } from '../ui/motion';

const MONTHLY = 10000;
const RATE = 12;
const YEARS = 25;

const CHAPTERS = [
  { year: 0, title: 'The seed', hindi: 'बीज', body: 'It starts as something you could hold in your palm: ₹10,000 a month, set aside before life can spend it.' },
  { year: 5, title: 'The roots', hindi: 'मूल', body: 'Nothing much shows above the ground. Markets fall, and you keep going. Every dip is monsoon rain; the roots go deeper.' },
  { year: 15, title: 'The branches', hindi: 'शाखा', body: 'Compounding takes over. Growth begins to grow on growth, and the tree starts adding more each year than you put in.' },
  { year: 25, title: 'The shade', hindi: 'छाया', body: 'Your family rests beneath what you planted. A home, an education, a retirement on your own terms.' },
];

export function GrowthStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // tree reaches full size a little before the section ends, so the last chapter can breathe
  const growth = useTransform(scrollYProgress, [0.02, 0.88], [0.02, 1]);
  const [year, setYear] = useState(0);
  const [chapter, setChapter] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const y = Math.round(Math.min(1, Math.max(0, (p - 0.02) / 0.86)) * YEARS);
    setYear(y);
    const c = CHAPTERS.reduce((acc, ch, i) => (y >= ch.year ? i : acc), 0);
    setChapter(c);
  });

  const value = sipValue(MONTHLY, RATE, year * 12);
  const invested = MONTHLY * year * 12;
  const ch = CHAPTERS[chapter];
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={ref} className="relative h-[420vh] bg-night" aria-label="How a SIP grows, from seed to shade">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_70%_80%,rgba(217,174,91,0.12),transparent_70%)]" />
        <div className="absolute inset-0 md:left-[30%]">
          <TreeCanvas progress={growth} rootX={0.55} seed={2025} className="opacity-50 md:opacity-100" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,13,0.95)_0%,rgba(6,17,13,0.6)_35%,transparent_60%)] max-md:bg-[linear-gradient(0deg,rgba(6,17,13,0.95)_10%,transparent_70%)]" />

        <div className="container-x relative flex h-full flex-col justify-between pb-10 pt-28">
          <div className="flex items-center gap-4">
            <span className="eyebrow text-gold">From seed to shade</span>
            <span className="relative h-px w-40 bg-white/10">
              <motion.span style={{ width: bar }} className="absolute inset-y-0 left-0 bg-gold" />
            </span>
          </div>

          <div className="max-w-xl">
            <div className="flex items-baseline gap-4">
              <span className="eyebrow text-bone/40">Year</span>
              <span className="font-display text-[clamp(5rem,13vw,12rem)] leading-[0.8] tabular-nums text-foil">{String(year).padStart(2, '0')}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={chapter}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mt-6"
              >
                <p className="font-deva text-2xl text-gold/80">{ch.hindi}</p>
                <h2 className="mt-1 font-display text-[clamp(2.6rem,5vw,4.8rem)] leading-none tracking-[-0.02em]">{ch.title}</h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-bone/65 sm:text-lg">{ch.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="grid max-w-xl grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div>
              <p className="eyebrow text-bone/40">Invested</p>
              <p className="mt-2 font-display text-3xl tabular-nums">{formatINR(invested, true)}</p>
            </div>
            <div>
              <p className="eyebrow text-bone/40">Tree is worth</p>
              <p className="mt-2 font-display text-3xl tabular-nums text-gold">{formatINR(value, true)}</p>
            </div>
            <div className="hidden sm:block">
              <p className="eyebrow text-bone/40">Chapter</p>
              <div className="mt-4 flex gap-1.5">
                {CHAPTERS.map((c, i) => (
                  <span key={c.title} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= chapter ? 'bg-gold' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
            <p className="col-span-full text-[10px] text-bone/30">
              Illustration: ₹10,000/month at an assumed {RATE}% p.a. Mutual fund investments are subject to market risks; returns are not guaranteed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
