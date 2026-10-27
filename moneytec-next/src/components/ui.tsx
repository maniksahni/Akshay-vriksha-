import { animate, motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';

export const EASE = [0.22, 1, 0.36, 1] as const;
export const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Words rise one by one from behind a mask the first time they enter view. */
export function Rise({ children, className = '', delay = 0, as: Tag = 'h2' }: { children: string; className?: string; delay?: number; as?: 'h1' | 'h2' | 'h3' | 'p' }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  // "*word*" marks an accent word
  const words = children.split(' ');
  return (
    <Tag ref={ref} className={className} aria-label={children.replace(/\*/g, '')}>
      {words.map((w, i) => {
        const accent = w.startsWith('*');
        const clean = w.replace(/\*/g, '');
        return w === '/' ? (
          <br key={i} />
        ) : (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.1em] align-top">
            <motion.span
              className={`inline-block ${accent ? 'font-serif font-normal italic tracking-normal text-lime' : ''}`}
              initial={{ y: '105%' }}
              animate={inView ? { y: 0 } : undefined}
              transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.045 }}
            >
              {clean}
              {' '}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}

export function FadeIn({ children, className = '', delay = 0, y = 24 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Follows the pointer a little while hovered. */
export function Magnetic({ children, className = '', strength = 0.3 }: { children: ReactNode; className?: string; strength?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  return (
    <motion.div className={`inline-block ${className}`} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}

/** Smoothly tweens to a changing number. */
export function useTween(value: number, duration = 0.5) {
  const [v, setV] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (reduced()) { prev.current = value; setV(value); return; }
    const c = animate(prev.current, value, { duration, ease: EASE, onUpdate: (n) => { prev.current = n; setV(n); } });
    return () => c.stop();
  }, [value, duration]);
  return v;
}

export function Marquee({ items, className = '', reverse = false }: { items: ReactNode[]; className?: string; reverse?: boolean }) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center whitespace-nowrap px-5">
          {it}
          <span className="ml-10 text-[0.7em]">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex w-max animate-marquee" style={{ animationDirection: reverse ? 'reverse' : 'normal' }}>
        {row}
        <div aria-hidden className="flex">{row}</div>
      </div>
    </div>
  );
}

/** Indian-style short money: ₹4.2 L, ₹1.9 Cr. */
export function inr(n: number, short = true) {
  if (!short || n < 100000) return '₹' + Math.round(n).toLocaleString('en-IN');
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(n >= 100000000 ? 1 : 2)} Cr`;
  return `₹${(n / 100000).toFixed(1)} L`;
}

/** SIP future value with contributions at the start of each month. */
export function sipValue(monthly: number, annualPct: number, months: number) {
  if (months <= 0) return 0;
  const i = Math.pow(1 + annualPct / 100, 1 / 12) - 1;
  return i === 0 ? monthly * months : monthly * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
}

/** Goal funding using effective monthly compounding and start-of-month contributions. */
export function goalProjection(cost: number, savings: number, years: number, inflation: number, annualReturn: number) {
  const target = cost * Math.pow(1 + inflation / 100, years);
  const futureSavings = savings * Math.pow(1 + annualReturn / 100, years);
  const gap = Math.max(0, target - futureSavings);
  const monthly = gap / sipValue(1, annualReturn, years * 12);
  return { target, futureSavings, gap, monthly };
}
