import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';
import { EASE, reduced } from './ui';

/**
 * Shared "misregistration" offset: the pink and blue ink layers drift apart a few pixels
 * as the pointer moves, like a riso print whose plates didn't line up.
 */
const mx = { x: 0, y: 0, subs: new Set<() => void>() };
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      mx.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mx.y = (e.clientY / window.innerHeight - 0.5) * 2;
      mx.subs.forEach((f) => f());
    },
    { passive: true },
  );
}

/** Text printed twice, pink over blue, that slips out of register with the pointer. */
export function Riso({ children, className = '', amount = 5, as: Tag = 'span' }: { children: ReactNode; className?: string; amount?: number; as?: 'span' | 'h1' | 'h2' | 'p' }) {
  const x = useMotionValue(amount * 0.6);
  const y = useMotionValue(amount * 0.3);
  const sx = useSpring(x, { stiffness: 90, damping: 14 });
  const sy = useSpring(y, { stiffness: 90, damping: 14 });
  useEffect(() => {
    if (reduced()) return;
    const f = () => {
      x.set(amount * 0.6 + mx.x * amount);
      y.set(amount * 0.3 + mx.y * amount * 0.6);
    };
    mx.subs.add(f);
    return () => {
      mx.subs.delete(f);
    };
  }, [amount, x, y]);
  return (
    <Tag className={`relative inline-block ${className}`}>
      <span aria-hidden className="absolute inset-0 select-none text-blue" style={{ mixBlendMode: 'multiply' }}>
        {children}
      </span>
      <motion.span className="relative block text-pink" style={{ x: sx, y: sy, mixBlendMode: 'multiply' }}>
        {children}
      </motion.span>
    </Tag>
  );
}

/** A hand-drawn pen line (circle, underline, arrow) that draws itself when it scrolls into view. */
export function Scribble({ kind, className = '', color = '#2B50FF', delay = 0.4 }: { kind: 'circle' | 'underline' | 'arrow' | 'zigzag' | 'star'; className?: string; color?: string; delay?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const paths: Record<string, { vb: string; d: string[] }> = {
    circle: { vb: '0 0 300 120', d: ['M30 64c6-34 82-52 150-48 70 4 116 26 112 50-5 30-86 46-160 42C60 104 14 88 22 60 30 34 96 16 168 18'] },
    underline: { vb: '0 0 300 30', d: ['M6 20c40-8 90-12 140-10 50 2 96 6 148 2', 'M30 26c50-4 120-6 220-2'] },
    arrow: { vb: '0 0 120 90', d: ['M8 12c30 6 58 22 74 48', 'M66 54l18 10 2-20'] },
    zigzag: { vb: '0 0 200 24', d: ['M4 16l14-10 14 12 14-12 14 12 14-12 14 12 14-12 14 12 14-12 14 12 14-12 14 12'] },
    star: { vb: '0 0 60 60', d: ['M30 4l6 18h19l-15 11 6 19-16-12-16 12 6-19-15-11h19z'] },
  };
  const p = paths[kind];
  return (
    <svg ref={ref} viewBox={p.vb} className={`pointer-events-none ${className}`} fill="none" aria-hidden>
      {p.d.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={kind === 'star' ? 3 : 4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: kind === 'circle' ? 1.1 : 0.6, ease: 'easeInOut', delay: delay + i * 0.35 }}
        />
      ))}
    </svg>
  );
}

/** A rubber stamp that slams onto the page. */
export function Stamp({ children, className = '', color = '#FF3EA5', rotate = -12, show = true }: { children: ReactNode; className?: string; color?: string; rotate?: number; show?: boolean }) {
  return (
    <motion.div
      className={`pointer-events-none inline-flex select-none items-center justify-center border-[3px] px-3 py-1 font-display font-extrabold uppercase tracking-tight ${className}`}
      style={{ color, borderColor: color, mixBlendMode: 'multiply' }}
      initial={false}
      animate={show ? { scale: [2.2, 0.92, 1], opacity: [0, 1, 1], rotate } : { scale: 2.2, opacity: 0, rotate }}
      transition={{ duration: 0.45, ease: [0.2, 0.9, 0.3, 1.2] }}
    >
      {children}
    </motion.div>
  );
}

/** Big headline whose lines slide up from a cut, one after another. */
export function Lines({ lines, className = '' }: { lines: ReactNode[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  return (
    <h2 ref={ref} className={`headline ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span className="block" initial={{ y: '100%' }} animate={inView ? { y: 0 } : undefined} transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}>
            {l}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/** The section's page header: "Section 02 —— title" in a newspaper rule. */
export function Folio({ no, title, color = 'bg-pink' }: { no: string; title: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 border-t-2 border-ink pt-2">
      <span className={`label ${color} px-1.5 py-0.5 text-ink`}>Sec. {no}</span>
      <span className="label">{title}</span>
      <span className="ml-auto hidden h-px flex-1 bg-ink/30 sm:block" />
      <span className="label hidden text-ink/50 sm:inline">The Moneytec Times</span>
    </div>
  );
}
