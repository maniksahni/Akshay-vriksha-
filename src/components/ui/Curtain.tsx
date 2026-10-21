import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

/** Scroll-linked entrance using composited transforms, without clipping content. */
export function Curtain({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 95%', 'start 50%'] });
  const y = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.65, 1]);
  return <motion.div ref={ref} className="relative" style={reduced ? undefined : { y, scale, opacity }}>{children}</motion.div>;
}
