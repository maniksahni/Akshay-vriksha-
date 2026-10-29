import { motion, MotionValue, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FACTS } from '../data';
import { EASE, reduced, useMobile } from './ui';

const STOPS = [[255, 179, 64], [255, 55, 95], [191, 90, 242]];
const BUCKETS = 18;
const mix = (t: number) => {
  const s = t < 0.5 ? 0 : 1;
  const k = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  const [a, b] = [STOPS[s], STOPS[s + 1]];
  return a.map((v, i) => Math.round(v + (b[i] - v) * k));
};

type P = { hx: number; hy: number; hz: number; sx: number; sy: number; sz: number; x: number; y: number; vx: number; vy: number; r: number; ph: number; g: boolean };

/**
 * The hero mark: a ₹ made of a few thousand points of light, with an orbit ring for the coin's edge.
 * Points drift with the pointer, part around it, and scatter into a starfield as `disperse` goes 0 → 1.
 */
function RupeeField({ disperse, cx, cy, scale }: { disperse: MotionValue<number>; cx: number; cy: number; scale: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext('2d')!;
    const still = reduced();
    let w = 0, h = 0, S = 0, dpr = 1, raf = 0, running = false, visible = true;
    let buckets: P[][] = [];
    let links: P[] = [];
    let phone = false;
    let step = 3;
    const colors: string[] = [];
    const pointer = { x: -9999, y: -9999, tx: 0, ty: 0, sx: 0, sy: 0 };

    const build = () => {
      const box = el.parentElement!.getBoundingClientRect();
      w = box.width; h = box.height;
      phone = w < 768;
      // canvas pixels are the main cost: cap the density, phones lower still
      dpr = Math.min(window.devicePixelRatio || 1, phone ? 1.25 : 1.5);
      el.width = w * dpr; el.height = h * dpr;
      el.style.width = `${w}px`; el.style.height = `${h}px`;
      S = Math.min(w, h) * scale;

      // sample the glyph from an offscreen canvas
      const off = document.createElement('canvas');
      const G = Math.ceil(S * 1.1);
      off.width = off.height = G;
      const o = off.getContext('2d')!;
      o.fillStyle = '#fff';
      o.textAlign = 'center';
      o.textBaseline = 'middle';
      o.font = `800 ${S * 0.86}px Inter, system-ui, sans-serif`;
      o.fillText('₹', G / 2, G / 2 + S * 0.04);
      const data = o.getImageData(0, 0, G, G).data;
      step = Math.max(2.5, S / (phone ? 68 : 118));
      const pts: [number, number, number][] = [];
      for (let y = 0; y < G; y += step) for (let x = 0; x < G; x += step) {
        if (data[(Math.floor(y) * G + Math.floor(x)) * 4 + 3] > 128) pts.push([x - G / 2 + (Math.random() - 0.5) * step * 0.6, y - G / 2 + (Math.random() - 0.5) * step * 0.6, (Math.random() - 0.5) * S * 0.12]);
      }
      const glyphCount = pts.length;
      // the coin's edge: two thin rings, tilted, so rotation reads as depth
      const R = S * 0.62;
      const ringCount = Math.round(pts.length * 0.22);
      for (let i = 0; i < ringCount; i++) {
        const t = (i / ringCount) * Math.PI * 2;
        const rr = R * (i % 2 ? 1 : 1.035);
        pts.push([Math.cos(t) * rr, Math.sin(t) * rr, (i % 2 ? 1 : -1) * S * 0.05]);
      }
      // a sprinkle of dust around it
      const dust = phone ? 50 : 240;
      for (let i = 0; i < dust; i++) {
        const t = Math.random() * Math.PI * 2;
        const rr = R * (1.15 + Math.random() * 1.1);
        pts.push([Math.cos(t) * rr, Math.sin(t) * rr * 0.75, (Math.random() - 0.5) * S]);
      }

      buckets = Array.from({ length: BUCKETS }, () => []);
      const far = Math.max(w, h);
      const glyph: P[] = [];
      for (const [n, [hx, hy, hz]] of pts.entries()) {
        const tcol = Math.min(0.999, Math.max(0, ((hx + hy) / (S * 1.3)) + 0.5));
        const a = Math.random() * Math.PI * 2, b = Math.acos(Math.random() * 2 - 1), dist = far * (0.35 + Math.random() * 0.9);
        buckets[Math.floor(tcol * BUCKETS)].push({
          hx, hy, hz,
          sx: Math.cos(a) * Math.sin(b) * dist * 1.3, sy: Math.sin(a) * Math.sin(b) * dist * 0.8, sz: Math.cos(b) * dist * 0.6,
          x: cx * w + (Math.random() - 0.5) * w, y: cy * h + (Math.random() - 0.5) * h, vx: 0, vy: 0,
          r: Math.random() < 0.06 ? 2.4 : 0.9 + Math.random() * 0.8, ph: Math.random() * 6.28, g: n < glyphCount,
        });
        const made = buckets[Math.floor(tcol * BUCKETS)];
        if (n < glyphCount) glyph.push(made[made.length - 1]);
      }
      // wire each glyph point to a near neighbour, so the ₹ reads as a living mesh
      const cell = step * 1.6, grid = new Map<string, P[]>();
      const key = (x: number, y: number) => `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
      for (const q of glyph) { const k = key(q.hx, q.hy); (grid.get(k) ?? grid.set(k, []).get(k)!).push(q); }
      links = [];
      for (const q of glyph) {
        if (Math.random() > (phone ? 0.35 : 0.5)) continue;
        const gx = Math.floor(q.hx / cell), gy = Math.floor(q.hy / cell);
        let best: P | null = null, bd = (step * 2.3) ** 2;
        for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const o of grid.get(`${gx + i},${gy + j}`) ?? []) {
          if (o === q) continue;
          const dd = (o.hx - q.hx) ** 2 + (o.hy - q.hy) ** 2;
          if (dd < bd && dd > step * step * 0.5) { bd = dd; best = o; }
        }
        if (best) links.push(q, best);
      }
      colors.length = 0;
      for (let i = 0; i < BUCKETS; i++) colors.push(`rgb(${mix((i + 0.5) / BUCKETS).join(',')})`);
    };

    const frame = (time: number) => {
      const t = time / 1000;
      const d = disperse.get();
      const e = d * d * (3 - 2 * d);
      pointer.sx += (pointer.tx - pointer.sx) * 0.05;
      pointer.sy += (pointer.ty - pointer.sy) * 0.05;
      const ay = still ? 0.2 : phone ? Math.sin(t * 0.4) * 0.16 : Math.sin(t * 0.35) * 0.42 + pointer.sx * 0.5 + e * 1.2;
      const ax = still ? -0.12 : phone ? -0.06 : Math.sin(t * 0.27) * 0.12 - 0.1 + pointer.sy * 0.25;
      const cyA = Math.cos(ay), syA = Math.sin(ay), cxA = Math.cos(ax), sxA = Math.sin(ax);
      const ox = cx * w, oy = cy * h, F = 900;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      const rep = Math.max(90, S * 0.22);
      const scanY = ((t * 0.2) % 1.6 - 0.3) * S * 1.1 - S * 0.55;
      const band = S * 0.03;
      const hot: P[] = [];
      for (let b = 0; b < BUCKETS; b++) {
        ctx.fillStyle = colors[b];
        for (const p of buckets[b]) {
          const breathe = still ? 0 : Math.sin(t * 1.4 + p.ph) * 3;
          const x0 = p.hx + (p.sx - p.hx) * e;
          const y0 = p.hy + (p.sy - p.hy) * e + breathe;
          const z0 = p.hz + (p.sz - p.hz) * e;
          const x1 = x0 * cyA + z0 * syA;
          const z1 = -x0 * syA + z0 * cyA;
          const y1 = y0 * cxA - z1 * sxA;
          const z2 = y0 * sxA + z1 * cxA;
          const k = F / (F + Math.max(-420, z2));
          const tx = ox + x1 * k, ty = oy + y1 * k;
          p.vx += (tx - p.x) * 0.07; p.vy += (ty - p.y) * 0.07;
          const dx = p.x - pointer.x, dy = p.y - pointer.y, dd = dx * dx + dy * dy;
          if (dd < rep * rep) { const f = (1 - Math.sqrt(dd) / rep) * 7; const inv = 1 / (Math.sqrt(dd) + 0.01); p.vx += dx * inv * f; p.vy += dy * inv * f; }
          p.vx *= 0.8; p.vy *= 0.8;
          p.x += p.vx; p.y += p.vy;
          const s = Math.min(3.2, p.r * k * (1 + e * 0.35));
          if (!still && p.g && e < 0.5 && Math.abs(p.hy - scanY) < band) hot.push(p);
          ctx.globalAlpha = Math.max(0.12, Math.min(1, 0.95 * k - e * 0.25 + (p.r > 2 ? 0.1 : 0)));
          if (p.r > 2) {
            ctx.beginPath(); ctx.arc(p.x, p.y, s * 0.6, 0, 6.283); ctx.fill();
            ctx.globalAlpha *= 0.14; ctx.beginPath(); ctx.arc(p.x, p.y, s * 2.6, 0, 6.283); ctx.fill();
          } else ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
        }
      }
      const fade = (1 - e) * (1 - e);
      if (fade > 0.02) {
        // mesh
        ctx.globalAlpha = 0.2 * fade;
        ctx.strokeStyle = '#ff6fa8';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        for (let i = 0; i < links.length; i += 2) { ctx.moveTo(links[i].x, links[i].y); ctx.lineTo(links[i + 1].x, links[i + 1].y); }
        ctx.stroke();
        // scan beam
        if (!still) {
          ctx.fillStyle = '#fff';
          ctx.globalAlpha = 0.75 * fade;
          for (const p of hot) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.1, 0, 6.283); ctx.fill(); }
          const ly = oy + scanY;
          const lg = ctx.createLinearGradient(ox - S * 0.6, 0, ox + S * 0.6, 0);
          lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.5, 'rgba(255,220,240,0.55)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.globalAlpha = fade * (Math.abs(scanY) < S * 0.5 ? 1 : 0);
          ctx.fillStyle = lg;
          ctx.fillRect(ox - S * 0.6, ly - 0.75, S * 1.2, 1.5);
          const glow = ctx.createLinearGradient(0, ly - band * 3, 0, ly + band * 3);
          glow.addColorStop(0, 'rgba(255,55,95,0)'); glow.addColorStop(0.5, 'rgba(255,55,95,0.10)'); glow.addColorStop(1, 'rgba(255,55,95,0)');
          ctx.fillStyle = glow;
          ctx.fillRect(ox - S * 0.45, ly - band * 3, S * 0.9, band * 6);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      if (running) raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const toLocal = (x: number, y: number) => {
      const r = el.getBoundingClientRect();
      pointer.x = x - r.left; pointer.y = y - r.top;
      pointer.tx = (pointer.x / w - 0.5) * 2; pointer.ty = (pointer.y / h - 0.5) * 2;
    };
    const onMove = (e: PointerEvent) => toLocal(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) toLocal(t.clientX, t.clientY); };
    const onLeave = () => { pointer.x = pointer.y = -9999; pointer.tx = pointer.ty = 0; };
    const onResize = () => { build(); };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); });
    const onVis = () => (document.hidden ? stop() : start());

    build();
    io.observe(el);
    start();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onLeave, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stop(); io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onLeave);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [disperse, cx, cy, scale]);
  return <canvas ref={canvas} aria-hidden className="absolute inset-0" />;
}

/** A heads-up frame around the coin: corner brackets, circuit traces feeding in, and the ₹'s own facts. */
function Hud({ size }: { size: string }) {
  const tag = 'fill-[rgba(244,241,248,0.55)] font-mono';
  const fs = size.endsWith('px') ? 10 : 7.5;
  return (
    <svg viewBox="0 0 400 400" aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: size, height: size }}>
      <defs><linearGradient id="hud" x1="0" x2="1"><stop offset="0" stopColor="#FF9F0A" /><stop offset="0.5" stopColor="#FF375F" /><stop offset="1" stopColor="#BF5AF2" /></linearGradient></defs>
      <g stroke="rgba(244,241,248,0.35)" strokeWidth="0.8" fill="none">
        <path d="M70 92V70h22 M308 70h22v22 M330 308v22h-22 M92 330H70v-22" />
      </g>
      <g stroke="url(#hud)" strokeWidth="0.8" fill="none" opacity="0.55">
        <path d="M0 150h40l18 18h24 M400 120h-46l-16 16h-22 M0 270h34l22-22h20 M400 290h-40l-20-20h-18" />
      </g>
      <g stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" className="dash-flow" style={{ strokeDasharray: '3 60', animationDuration: '2.6s' }}>
        <path d="M0 150h40l18 18h24 M400 120h-46l-16 16h-22 M0 270h34l22-22h20 M400 290h-40l-20-20h-18" />
      </g>
      {[[82, 168], [314, 136], [76, 248], [322, 270]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" fill={i % 2 ? '#BF5AF2' : '#FF9F0A'} className="pulse-dot" />)}
      <text x="74" y="62" fontSize={fs} letterSpacing="1.4" className={tag}>U+20B9</text>
      <text x="326" y="62" fontSize={fs} letterSpacing="1.4" textAnchor="end" className={tag}>INR · ISO 4217 · 356</text>
      <text x="74" y="344" fontSize={fs} letterSpacing="1.4" className={tag}>ADOPTED 15·07·2010</text>
      <text x="326" y="344" fontSize={fs} letterSpacing="1.4" textAnchor="end" className={tag}>MONEYTEC</text>
    </svg>
  );
}

/** A slow ring of type around the coin, like the milled edge of a medal. */
function OrbitText({ size, vh }: { size: number; vh?: number }) {
  const label = 'MONEYTEC · MONEY, WITH MEANING · GOAL-BASED SIPS · LIFE COVER · NRI INVESTING · ';
  const dim = vh ? `${vh}vh` : `${size}px`;
  return (
    <svg viewBox="0 0 400 400" aria-hidden className="spin-slow pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" style={{ width: dim, height: dim, animationDuration: '60s' }}>
      <defs><path id={`orbit-${size}`} d="M200 200 m-182 0 a182 182 0 1 1 364 0 a182 182 0 1 1 -364 0" /></defs>
      <text fill="rgba(244,241,248,0.55)" fontSize="11" letterSpacing="5.2" fontFamily="Inter, sans-serif">
        <textPath href={`#orbit-${size}`}>{label}</textPath>
      </text>
    </svg>
  );
}

function HeroCopy({ mobile }: { mobile: boolean }) {
  return (
    <>
      <motion.p className="kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
        Moneytec — Money, with meaning
      </motion.p>
      <h1 className="display mt-5 text-[clamp(3rem,8.4vw,8.6rem)]" aria-label="Make your money mean more.">
        {['Make your', 'money', '*mean more.*'].map((line, i) => (
          <span key={line} aria-hidden className="block overflow-hidden pb-[0.06em]">
            <motion.span className="block" initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.35 + i * 0.1 }}>
              {line.startsWith('*') ? <span className="serif grad pr-[0.05em] text-[1.08em]">{line.slice(1, -1)}</span> : line}
            </motion.span>
          </span>
        ))}
      </h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}>
        <p className="mt-5 max-w-[30rem] text-[18px] leading-snug text-paper sm:text-[22px]">A clearer path to your goals, built around your life.</p>
        {mobile && <p className="lede mt-2 max-w-[30rem]">Goal-based mutual fund investing, insurance and NRI guidance with {FACTS.name}.</p>}
      </motion.div>
      <motion.div className="mt-7 flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}>
        <a href="#start" className="btn-light pr-2">Start a conversation <span className="arrow">↗</span></a>
        <a href="#calculator" onClick={() => window.dispatchEvent(new Event('moneytec:plan-goal'))} className="btn-ghost">{mobile ? 'Plan my goal' : 'Plan my goal ↓'}</a>
      </motion.div>
      <motion.div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.15 }}>
        <span className="flex items-center gap-2"><i className="pulse-dot h-1.5 w-1.5 rounded-full bg-mint" />AMFI registered <b className="font-medium text-paper">{FACTS.arn}</b></span>
        <span className="flex items-center gap-2"><i aria-hidden className="text-amber">✳</i>Personal guidance <b className="font-medium text-paper">{FACTS.name}</b></span>
      </motion.div>
    </>
  );
}

export function Hero() {
  const mobile = useMobile();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const disperse = useTransform(p, [0.08, 0.62], [0, 1], { clamp: true });
  const copyOpacity = useTransform(p, [0.04, 0.3], [1, 0]);
  const copyY = useTransform(p, [0, 0.3], [0, -60]);
  const copyBlur = useTransform(p, [0.04, 0.3], ['blur(0px)', 'blur(10px)']);
  const twoOpacity = useTransform(p, [0.5, 0.7, 0.94, 1], [0, 1, 1, 0]);
  const twoScale = useTransform(p, [0.5, 0.75], [0.92, 1]);
  const floor = useTransform(p, [0, 1], ['0%', '-40%']);
  const [two, setTwo] = useState(false);
  useMotionValueEvent(p, 'change', (v) => setTwo(v > 0.55));
  const still = useMotionValue(0);

  if (mobile) {
    return (
      <section id="top" data-dark className="relative overflow-hidden pb-12 pt-[64px]">
        <div className="pointer-events-none absolute inset-0"><div className="aurora opacity-40" /></div>
        <div className="absolute inset-x-0 top-[40px] h-[340px]">
          <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,55,95,0.40),transparent)]" />
          <Hud size="250px" />
          <RupeeField disperse={still} cx={0.5} cy={0.5} scale={0.72} />
        </div>
        <div className="wrap relative pt-[318px]"><HeroCopy mobile /></div>
      </section>
    );
  }

  return (
    <section id="top" data-dark ref={ref} className="relative h-[240svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0"><div className="aurora opacity-35" /></div>
        <motion.div className="grid-floor pointer-events-none absolute inset-x-[-20%] bottom-[-30%] h-[70%] origin-bottom opacity-60" style={{ transform: 'perspective(600px) rotateX(68deg)', backgroundPositionY: floor }} />
        <motion.div className="pointer-events-none absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: copyOpacity }}>
          <div className="absolute left-1/2 top-1/2 h-[46vh] w-[46vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,55,95,0.32),transparent)]" />
          <OrbitText size={0} vh={92} />
          <Hud size="80vh" />
        </motion.div>
        <RupeeField disperse={disperse} cx={0.7} cy={0.5} scale={0.74} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_25%_55%,rgba(7,6,11,0.75),transparent_70%)]" />

        <motion.div className="wrap-wide relative flex h-full flex-col justify-center pt-10" style={{ opacity: copyOpacity, y: copyY, filter: copyBlur, pointerEvents: two ? 'none' : 'auto' }} aria-hidden={two}>
          <div className="max-w-[44rem]"><HeroCopy mobile={false} /></div>
        </motion.div>

        <motion.div className="absolute inset-0 grid place-items-center px-6 text-center" style={{ opacity: twoOpacity, scale: twoScale, pointerEvents: two ? 'auto' : 'none' }} aria-hidden={!two}>
          <div>
            <p className="kicker justify-center">A more personal approach to money</p>
            <p className="display mt-6 text-[clamp(2.6rem,6.4vw,6rem)]">Your goals.<br /><span className="serif grad">Connected by clarity.</span></p>
            <p className="lede mx-auto mt-5 max-w-xl">Goal-based investing, family protection and NRI guidance, with {FACTS.name} alongside you.</p>
            <a href="#highlights" tabIndex={two ? undefined : -1} className="link mt-8">See how it works ↓</a>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6">
          <div className="wrap-wide flex items-end justify-between text-[11px] uppercase tracking-[0.2em] text-dim">
            <span>Scroll to explore</span>
            <div className="h-px w-40 overflow-hidden bg-white/10"><motion.span className="block h-full origin-left bg-gradient-to-r from-amber via-rose to-violet" style={{ scaleX: p }} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
