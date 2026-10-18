import { motion, useMotionValue, useSpring, useInView, animate } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState, MouseEvent } from 'react';
import { prefersReducedMotion } from '../../lib/smooth';

const ease = [0.22, 1, 0.36, 1] as const;

/** Slides each line up from behind a mask. Pass lines as an array to control the breaks. */
export function MaskLines({
  lines,
  className = '',
  delay = 0,
  as: Tag = 'h2',
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p';
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            animate={inView ? { y: '0%' } : undefined}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function FadeUp({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Pulls its child toward the pointer while hovered. */
export function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Counts up to `to` the first time it scrolls into view. */
export function CountUp({ to, format = (n: number) => Math.round(n).toString(), className = '' }: { to: number; format?: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(prefersReducedMotion() ? to : 0);
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const c = animate(0, to, { duration: 2, ease, onUpdate: setVal });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className={className}>
      {format(val)}
    </span>
  );
}

/** Smoothly tweens to a changing number (for live calculator output). */
export function useTween(value: number, duration = 0.6) {
  const [v, setV] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const c = animate(prev.current, value, { duration, ease, onUpdate: (n) => { prev.current = n; setV(n); } });
    return () => c.stop();
  }, [value, duration]);
  return v;
}

export const EASE = ease;
