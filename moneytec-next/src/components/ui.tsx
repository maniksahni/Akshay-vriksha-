import { animate, motion, MotionValue, useInView, useScroll, useTransform } from 'framer-motion';
import { PointerEvent, ReactNode, useEffect, useRef, useState } from 'react';

export const EASE = [0.22, 1, 0.36, 1] as const;
export const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True below the md breakpoint; phones get lighter, unpinned versions of each scene. */
export function useMobile() {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const q = window.matchMedia('(max-width: 767px)');
    const sync = () => setM(q.matches);
    sync();
    q.addEventListener('change', sync);
    return () => q.removeEventListener('change', sync);
  }, []);
  return m;
}

export function FadeIn({ children, className = '', delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** A heading whose lines rise from behind a mask. Lines split on "/", "*word*" turns into the serif accent. */
export function Title({ text, className = '', as: Tag = 'h2', delay = 0 }: { text: string; className?: string; as?: 'h1' | 'h2' | 'p'; delay?: number }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const lines = text.split(' / ');
  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\*| \/ /g, (m) => (m === '*' ? '' : ' '))}>
      {lines.map((line, i) => (
        <span key={i} aria-hidden className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : undefined}
            transition={{ duration: 1.05, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line.split(/(\*[^*]+\*)/).map((part, k) =>
              part.startsWith('*') ? <span key={k} className="serif grad pr-[0.06em]">{part.slice(1, -1)}</span> : <span key={k}>{part}</span>,
            )}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Words light up one after another as the paragraph moves through the viewport. */
export function ScrollLit({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className} aria-label={text.replace(/\*/g, '')}>
      {words.map((w, i) => (
        <Word key={i} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={w.startsWith('*')}>
          {w.replace(/\*/g, '')}
        </Word>
      ))}
    </p>
  );
}
function Word({ children, p, range, accent }: { children: string; p: MotionValue<number>; range: [number, number]; accent: boolean }) {
  const opacity = useTransform(p, range, [0.14, 1]);
  const y = useTransform(p, range, [6, 0]);
  return (
    <motion.span aria-hidden style={{ opacity, y }} className={`inline-block pr-[0.24em] ${accent ? 'serif grad' : ''}`}>
      {children}
    </motion.span>
  );
}

/** Pointer spotlight for .spot cards; cards that also carry .tilt lean toward the pointer. */
export const spotlight = (e: PointerEvent<HTMLElement>) => {
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  el.style.setProperty('--mx', `${x}px`);
  el.style.setProperty('--my', `${y}px`);
  if (e.pointerType === 'mouse') {
    el.style.setProperty('--ry', `${((x / r.width) - 0.5) * 10}deg`);
    el.style.setProperty('--rx', `${(0.5 - y / r.height) * 8}deg`);
  }
};
export const untilt = (e: PointerEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
};

/** Each section rises out of depth as it arrives: scale, lift and a soft unblur, tied to scroll. Phones get a plain fade. */
export function Scene({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mobile = useMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.3'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.15, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  if (mobile || reduced()) return <div className={className}>{children}</div>;
  return (
    <div ref={ref} style={{ perspective: 1400 }}>
      <motion.div className={className} style={{ scale, y, opacity, rotateX, transformOrigin: '50% 0%' }}>{children}</motion.div>
    </div>
  );
}

/** Smoothly tweens to a changing number. */
export function useTween(value: number, duration = 0.6) {
  const [v, setV] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (reduced()) { prev.current = value; setV(value); return; }
    const c = animate(prev.current, value, { duration, ease: EASE, onUpdate: (n) => { prev.current = n; setV(n); } });
    return () => c.stop();
  }, [value, duration]);
  return v;
}

/** Counts up once when it scrolls into view. */
export function CountUp({ to, suffix = '', className = '' }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced()) { setN(to); return; }
    const c = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className={className}>{n}{suffix}</span>;
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
