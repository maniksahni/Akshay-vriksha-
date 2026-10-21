import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { CSSProperties, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../lib/smooth';

/**
 * Card surface with a soft light that follows the pointer and a gentle 3D tilt.
 * The light is a radial gradient driven by CSS variables, so it costs no re-renders.
 */
export function Spotlight({
  children,
  className = '',
  color = 'rgba(217,174,91,0.16)',
  tilt = 6,
  style,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  tilt?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.style.setProperty('--px', `${(x - 0.5) * 2}`);
    el.style.setProperty('--py', `${(y - 0.5) * 2}`);
    if (!prefersReducedMotion()) {
      ry.set((x - 0.5) * tilt);
      rx.set(-(y - 0.5) * tilt);
    }
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    ref.current?.style.setProperty('--px', '0');
    ref.current?.style.setProperty('--py', '0');
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1100, ...style }}
      className={`group/spot relative ${className}`}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: `radial-gradient(480px circle at var(--mx,50%) var(--my,50%), ${color}, transparent 45%)` }}
      />
    </motion.div>
  );
}

const GLYPHS = 'अकखगघचछजझटठडढतथदधनपफबभमयरलवशसह✦◆●';

/** Text that resolves out of shuffling Devanagari glyphs the first time it enters view. */
export function Scramble({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    let frame = 0;
    const total = 22;
    const id = setInterval(() => {
      frame++;
      const reveal = Math.floor((frame / total) * text.length);
      setOut(
        text
          .split('')
          .map((ch, i) => (ch === ' ' || i < reveal ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join(''),
      );
      if (frame >= total) {
        clearInterval(id);
        setOut(text);
      }
    }, 38);
    return () => clearInterval(id);
  }, [inView, text]);

  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </p>
  );
}
