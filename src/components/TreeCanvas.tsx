import { MotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/smooth';

/**
 * The AkshayVriksha (the inexhaustible tree), drawn procedurally.
 * Branches grow in once `grow` turns true, sway in a soft wind that follows the
 * pointer, and shed glowing leaves, a quiet picture of compounding.
 */

type Node = {
  parent: number;
  angle: number; // relative to parent
  len: number;
  depth: number;
  phase: number;
  t0: number; // growth start in 0..1
  // per-frame
  x: number;
  y: number;
  a: number;
  ex: number;
  ey: number;
};

type Leaf = { node: number; ox: number; oy: number; r: number; phase: number; hue: number };
type Fall = { x: number; y: number; vx: number; vy: number; r: number; life: number; phase: number };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildTree(maxDepth: number, seed = 108) {
  const rand = mulberry32(seed);
  const nodes: Node[] = [];
  const leaves: Leaf[] = [];
  const span = 0.86;

  const grow = (parent: number, depth: number, len: number, angle: number) => {
    const idx = nodes.length;
    const start = (depth / (maxDepth + 1)) * span;
    nodes.push({ parent, angle, len, depth, phase: rand() * Math.PI * 2, t0: start + rand() * 0.04, x: 0, y: 0, a: 0, ex: 0, ey: 0 });
    if (depth >= maxDepth - 2) {
      const dense = maxDepth >= 10;
      const count = depth === maxDepth ? (dense ? 2 : 4) : dense ? 1 : 2;
      for (let k = 0; k < count; k++) {
        leaves.push({
          node: idx,
          ox: (rand() - 0.5) * len * 0.9,
          oy: (rand() - 0.5) * len * 0.9,
          r: 1.2 + rand() * 2.6,
          phase: rand() * Math.PI * 2,
          hue: rand(),
        });
      }
    }
    if (depth >= maxDepth) return;
    const n = depth < 2 ? 2 : rand() < 0.28 ? 3 : 2;
    const spread = depth === 0 ? 0.5 : 0.36 + rand() * 0.22;
    for (let k = 0; k < n; k++) {
      const base = spread * (k / (n - 1) - 0.5) * 2;
      const childAngle = base + (rand() - 0.5) * 0.32;
      grow(idx, depth + 1, len * (0.7 + rand() * 0.14), childAngle);
    }
  };
  grow(-1, 0, 1, 0);
  return { nodes, leaves };
}

function makeGlow(color: string, size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, color);
  grad.addColorStop(0.25, color.replace(/[\d.]+\)$/, '0.55)'));
  grad.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function TreeCanvas({
  grow = false,
  progress,
  rootX = 0.5,
  seed = 108,
  className = '',
}: {
  grow?: boolean;
  /** When given, growth follows this value (0..1) instead of playing on its own. */
  progress?: MotionValue<number>;
  rootX?: number;
  seed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const growRef = useRef(grow);
  growRef.current = grow;
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = prefersReducedMotion();
    const small = window.innerWidth < 768;
    const { nodes, leaves } = buildTree(small ? 8 : 10, seed);
    const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0);
    const glowGold = makeGlow('rgba(233,205,143,1)');
    const glowEmber = makeGlow('rgba(214,120,62,1)');

    let w = 0, h = 0, dpr = 1;
    let growth = reduced ? 1 : 0;
    let growStart = -1;
    let visible = true;
    let raf = 0;
    const pointer = { x: -9999, y: -9999, tx: 0, wind: 0 };
    const falls: Fall[] = [];
    let lastSpawn = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.tx = (pointer.x / Math.max(w, 1) - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    function layout(time: number) {
      const trunk = h * (small ? 0.2 : 0.205);
      const rx = w * rootX;
      const ry = h + 4;
      pointer.wind += (pointer.tx - pointer.wind) * 0.03;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const sway = reduced ? 0 : Math.sin(time * 0.0007 + n.phase + n.depth * 0.5) * 0.014 * n.depth + pointer.wind * 0.012 * n.depth;
        if (n.parent < 0) {
          n.x = rx;
          n.y = ry;
          n.a = -Math.PI / 2 + sway * 0.3;
        } else {
          const p = nodes[n.parent];
          n.x = p.ex;
          n.y = p.ey;
          n.a = p.a + n.angle + sway;
        }
        const local = ease(clamp((growth - n.t0) / 0.16));
        const L = n.len * trunk * local;
        n.ex = n.x + Math.cos(n.a) * L;
        n.ey = n.y + Math.sin(n.a) * L;
      }
    }

    function draw(time: number) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';
      ctx.globalCompositeOperation = 'source-over';

      // Branches, batched by depth so each depth is a single stroke.
      const baseW = Math.max(10, w * 0.012) * (small ? 0.9 : 1.15);
      for (let d = 0; d <= maxDepth; d++) {
        const t = d / maxDepth;
        ctx.beginPath();
        let any = false;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          if (n.depth !== d || growth < n.t0) continue;
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n.ex, n.ey);
          any = true;
        }
        if (!any) continue;
        ctx.lineWidth = Math.max(0.6, baseW * Math.pow(0.66, d));
        const r = Math.round(120 + 113 * t), g = Math.round(88 + 117 * t), b = Math.round(45 + 98 * t);
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.55 + 0.35 * t})`;
        ctx.stroke();
      }

      // Leaves: additive glow sprites.
      ctx.globalCompositeOperation = 'lighter';
      const now = time * 0.0015;
      for (let i = 0; i < leaves.length; i++) {
        const lf = leaves[i];
        const n = nodes[lf.node];
        const appear = clamp((growth - (n.t0 + 0.12)) / 0.12);
        if (appear <= 0) continue;
        let x = n.ex + lf.ox * h * 0.012;
        let y = n.ey + lf.oy * h * 0.012;
        const dx = x - pointer.x, dy = y - pointer.y;
        const dist = Math.hypot(dx, dy);
        const near = dist < 140 ? 1 - dist / 140 : 0;
        if (near) {
          x += (dx / (dist || 1)) * near * 10;
          y += (dy / (dist || 1)) * near * 10;
        }
        const tw = reduced ? 0.8 : 0.55 + 0.45 * Math.sin(now + lf.phase);
        const size = lf.r * (3.2 + near * 3) * appear;
        ctx.globalAlpha = Math.min(1, (0.22 + tw * 0.38 + near * 0.6) * appear);
        ctx.drawImage(lf.hue > 0.86 ? glowEmber : glowGold, x - size, y - size, size * 2, size * 2);
      }

      // Falling leaves once the tree is grown.
      if (!reduced && growth > 0.95 && !progressRef.current) {
        if (time - lastSpawn > (small ? 520 : 300) && falls.length < 40) {
          lastSpawn = time;
          const lf = leaves[(Math.random() * leaves.length) | 0];
          const n = nodes[lf.node];
          falls.push({ x: n.ex, y: n.ey, vx: (Math.random() - 0.5) * 0.3, vy: 0.25 + Math.random() * 0.5, r: 1.5 + Math.random() * 2.5, life: 1, phase: Math.random() * 6 });
        }
        for (let i = falls.length - 1; i >= 0; i--) {
          const f = falls[i];
          f.phase += 0.02;
          f.x += f.vx + Math.sin(f.phase) * 0.6 + pointer.wind * 0.4;
          f.y += f.vy;
          f.life -= 0.0022;
          if (f.y > h || f.life <= 0) {
            falls.splice(i, 1);
            continue;
          }
          const s = f.r * 3;
          ctx.globalAlpha = f.life * 0.8;
          ctx.drawImage(glowGold, f.x - s, f.y - s, s * 2, s * 2);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    function frame(time: number) {
      raf = 0;
      if (progressRef.current) {
        growth = Math.min(1, Math.max(0, progressRef.current.get()));
      } else if (growRef.current && growth < 1) {
        if (growStart < 0) growStart = time;
        growth = Math.min(1, (time - growStart) / 3600);
      }
      layout(time);
      draw(time);
      if (visible && !document.hidden && !(reduced && growth >= 1 && !progressRef.current)) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      if (!document.hidden && visible && !raf) raf = requestAnimationFrame(frame);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [rootX, seed]);

  return <canvas ref={ref} aria-hidden className={`block h-full w-full ${className}`} />;
}
