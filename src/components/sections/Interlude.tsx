import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * A scroll-driven zoom-through. The word TIME grows until its letters swallow the
 * screen; the gold behind them becomes the next scene. Pure transforms, no canvas.
 */
export function Interlude() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const scale = useTransform(p, [0.12, 0.45, 0.7, 0.88], [1, 2.2, 9, 80], { clamp: true });
  // zoom toward the gap inside the "M" so we fly through the letterform, not into a stroke
  const lead = useTransform(p, [0, 0.25], [0, 1]);
  const lineOpacity = useTransform(p, [0, 0.12, 0.3], [0, 1, 0]);
  const subOpacity = useTransform(p, [0.05, 0.15, 0.32], [0, 1, 0]);
  const goldFill = useTransform(p, [0.7, 0.92], [0, 1]);
  const endOpacity = useTransform(p, [0.86, 0.98], [0, 1]);
  const endY = useTransform(p, [0.86, 1], [40, 0]);

  return (
    <section ref={ref} className="relative h-[300vh] bg-night" aria-label="Time in the market">
      <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden">
        <motion.div style={{ opacity: goldFill }} className="absolute inset-0 bg-gold" />
        <motion.p style={{ opacity: lineOpacity }} className="eyebrow absolute top-[22%] text-gold">
          The one ingredient you can’t buy back
        </motion.p>
        <motion.div
          style={{ scale, opacity: lead, transformOrigin: '58% 52%' }}
          className="relative select-none whitespace-nowrap font-display text-[26vw] leading-none tracking-[-0.04em] text-foil will-change-transform"
          aria-hidden
        >
          TIME
        </motion.div>
        <motion.p style={{ opacity: subOpacity }} className="absolute bottom-[20%] font-deva text-2xl text-bone/70 sm:text-3xl">
          समय · काल
        </motion.p>
        <motion.div style={{ opacity: endOpacity, y: endY }} className="absolute inset-0 grid place-items-center px-6 text-center text-night">
          <div>
            <p className="font-display text-[clamp(2.4rem,7vw,7rem)] leading-[0.95] tracking-[-0.02em]">
              Not timing.
              <br />
              <span className="italic">Time.</span>
            </p>
            <p className="eyebrow mt-6 text-night/60">That’s the whole secret</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
