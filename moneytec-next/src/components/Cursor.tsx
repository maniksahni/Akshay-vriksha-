import { useEffect, useRef } from 'react';
import { reduced } from './ui';

const INTERACTIVE = 'a, button, summary, label, input, select, [role="button"]';

/**
 * Laptop-only cursor: a dot that tracks exactly and a ring that trails, growing over anything you can press.
 * Buttons (.btn, [data-magnetic]) lean toward the pointer. Touch screens and reduced motion keep the native cursor.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    let magnet: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement;
      const hit = t.closest?.<HTMLElement>(INTERACTIVE);
      const text = t.closest?.('input, textarea, select');
      const r = ring.current!;
      r.classList.toggle('is-hover', !!hit && !text);
      r.classList.toggle('is-text', !!text);
      const lab = hit?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? '';
      label.current!.textContent = lab;
      r.classList.toggle('has-label', !!lab);

      const m = t.closest?.<HTMLElement>('.btn, [data-magnetic]') ?? null;
      if (magnet && magnet !== m) { magnet.style.translate = ''; }
      magnet = m;
      if (m) {
        const b = m.getBoundingClientRect();
        m.style.translate = `${(x - b.left - b.width / 2) * 0.22}px ${(y - b.top - b.height / 2) * 0.3}px`;
      }
    };
    const leave = () => { x = y = -100; if (magnet) magnet.style.translate = ''; };
    const down = () => ring.current?.classList.add('is-down');
    const up = () => ring.current?.classList.remove('is-down');

    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      dot.current!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.current!.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  return (
    <div aria-hidden className="cursor-layer">
      <div ref={ring} className="cursor-ring"><span ref={label} className="cursor-label" /></div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
