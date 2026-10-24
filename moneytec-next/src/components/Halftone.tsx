import { useEffect, useRef } from 'react';
import { reduced } from './ui';

/**
 * A giant ₹ rendered as a two-ink halftone: blue dots with pink dots printed slightly off-register on top.
 * Dots swell and scatter around the pointer (or a slow wave on touch screens). Pure 2D canvas.
 */
export function Halftone({ glyph = '₹', className = '' }: { glyph?: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const still = reduced();
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    let dots: { x: number; y: number; r: number }[] = [];
    const pointer = { x: -999, y: -999, tx: -999, ty: -999 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // draw the glyph into an offscreen buffer and sample it on a dot grid
      const off = document.createElement('canvas');
      off.width = Math.round(w);
      off.height = Math.round(h);
      const o = off.getContext('2d')!;
      o.fillStyle = '#fff';
      o.fillRect(0, 0, off.width, off.height);
      o.fillStyle = '#000';
      o.textAlign = 'center';
      o.textBaseline = 'middle';
      o.font = `800 ${Math.min(w, h) * 1.02}px "Bricolage Grotesque", Arial, sans-serif`;
      o.fillText(glyph, off.width / 2, off.height * 0.54);
      const data = o.getImageData(0, 0, off.width, off.height).data;
      const step = w < 420 ? 8 : 10;
      dots = [];
      for (let y = step / 2; y < off.height; y += step) {
        for (let x = step / 2; x < off.width; x += step) {
          const v = data[(Math.floor(y) * off.width + Math.floor(x)) * 4];
          const dark = 1 - v / 255;
          // faint dot screen in the background too, so it reads as a printed photo
          dots.push({ x, y, r: (step / 2) * (0.12 + dark * 0.88) });
        }
      }
    };

    const draw = (t: number) => {
      raf = 0;
      pointer.x += (pointer.tx - pointer.x) * 0.15;
      pointer.y += (pointer.ty - pointer.y) * 0.15;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const wave = coarse && !still ? t * 0.0012 : 0;
      for (const [color, ox, oy] of [['#2B50FF', 0, 0], ['#FF3EA5', 3.5, 2]] as const) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = color;
        ctx.beginPath();
        for (const d of dots) {
          let { x, y, r } = d;
          const dx = x - pointer.x, dy = y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            const f = 1 - dist / 110;
            r *= 1 + f * 0.9;
            x += (dx / (dist || 1)) * f * 14;
            y += (dy / (dist || 1)) * f * 14;
          }
          if (wave) r *= 0.85 + 0.3 * Math.sin(wave + (x + y) * 0.02);
          ctx.moveTo(x + ox + r, y + oy);
          ctx.arc(x + ox, y + oy, Math.max(0.4, r), 0, Math.PI * 2);
        }
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (visible && !document.hidden && !(still && pointer.tx < -900)) raf = requestAnimationFrame(draw);
    };

    const start = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
      start();
    };
    const onLeave = () => { pointer.tx = -999; pointer.ty = -999; };

    // wait for the display font so the glyph samples correctly
    (document.fonts?.ready ?? Promise.resolve()).then(() => { build(); start(); });
    const ro = new ResizeObserver(() => { build(); start(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [glyph]);

  return <canvas ref={ref} aria-hidden className={`block h-full w-full ${className}`} />;
}
