import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/smooth';

/**
 * Out-of-focus gold light drifting at several depths, in front of and behind the
 * tree. Near orbs are big, soft and move most with the pointer, which reads as
 * a shallow depth of field.
 */
export function Bokeh({ className = '', count = 26 }: { className?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = prefersReducedMotion();
    const small = window.innerWidth < 768;
    const n = small ? Math.round(count * 0.55) : count;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    type Orb = { x: number; y: number; z: number; r: number; vy: number; phase: number; hue: number };
    const orbs: Orb[] = Array.from({ length: n }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(), // 0 far … 1 near
      r: 0,
      vy: 0,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random(),
    }));
    orbs.forEach((o) => {
      o.r = 4 + Math.pow(o.z, 2.2) * (small ? 40 : 70);
      o.vy = 0.00004 + o.z * 0.00012;
    });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const frame = (t: number) => {
      raf = 0;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const o of orbs) {
        if (!reduced) {
          o.y -= o.vy * 16;
          if (o.y < -0.15) {
            o.y = 1.15;
            o.x = Math.random();
          }
        }
        const x = o.x * w + pointer.x * o.z * 40 + Math.sin(t * 0.0004 + o.phase) * 12 * o.z;
        const y = o.y * h + pointer.y * o.z * 24;
        const a = (0.05 + 0.11 * (1 - Math.abs(o.z - 0.5) * 1.4)) * (0.7 + 0.3 * Math.sin(t * 0.001 + o.phase));
        const g = ctx.createRadialGradient(x, y, 0, x, y, o.r);
        const c = o.hue > 0.85 ? '224,140,80' : '233,205,143';
        g.addColorStop(0, `rgba(${c},${a})`);
        g.addColorStop(0.65, `rgba(${c},${a * 0.6})`);
        g.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, o.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible && !document.hidden && !reduced) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [count]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none block h-full w-full ${className}`} />;
}
