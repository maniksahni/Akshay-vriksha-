import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/smooth';

/**
 * Wraps a section so it arrives as an inset, rounded panel and opens to full bleed
 * as it reaches the top of the screen, like a curtain drawing apart.
 */
export function Curtain({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const inset = useTransform(scrollYProgress, [0, 1], [7, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [56, 0]);
  const clipPath = useTransform([inset, radius], ([i, r]) => `inset(0% ${i}% 0% ${i}% round ${r}px ${r}px 0 0)`);

  if (prefersReducedMotion()) return <>{children}</>;
  return (
    <motion.div ref={ref} style={{ clipPath }} className="relative">
      {children}
    </motion.div>
  );
}
