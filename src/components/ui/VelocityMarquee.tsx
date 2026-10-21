import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/smooth';

/** A marquee that speeds up, reverses and skews with the reader's scroll. */
export function VelocityMarquee({ children, baseVelocity = -2, className = '' }: { children: ReactNode; baseVelocity?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const smooth = useSpring(v, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-2000, 0, 2000], [-5, 0, 5], { clamp: false });
  const skew = useTransform(smooth, [-3000, 0, 3000], [8, 0, -8]);
  const dir = useRef(1);
  const reduced = prefersReducedMotion();
  const pos = useTransform(x, (n) => `${wrap(-50, 0, n)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced || !visible || document.hidden) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * Math.abs(f);
    x.set(x.get() + move);
  });

  return (
    <div ref={ref} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex w-max" style={{ x: pos, skewX: skew }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
