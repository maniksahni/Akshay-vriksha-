import { HeroWisdom } from './Wisdom';
import { BrandLogo } from './BrandLogo';
import { motion, MotionValue, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FACTS } from '../data';
import { EASE, reduced, useMobile } from './ui';
import { RUPEE_PATH } from './rupeePath';
import type { RupeeHandle } from './RupeeScene';

/**
 * The hero mark: a solid ₹ in iridescent chrome (WebGL, loaded after first paint). Until it is ready, or where
 * WebGL is unavailable, a flat gradient ₹ holds the same spot so the page never looks empty.
 */
function Rupee3D({ progress, centerX, glyph }: { progress: MotionValue<number>; centerX: number; glyph: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let handle: RupeeHandle | undefined, dead = false;
    const go = () => import('./RupeeScene').then(({ mountRupee }) => {
      if (dead || !canvas.current) return;
      try {
        handle = mountRupee(canvas.current, { centerX, phone: window.innerWidth < 768, still: reduced() });
        handle.setProgress(progress.get());
        requestAnimationFrame(() => setReady(true));
      } catch { /* no WebGL: the flat mark stays */ }
    });
    // wait for the page to finish loading and go idle, so the 3D never delays the first paint
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    let timer = 0;
    const later = () => { timer = idle ? idle(go, { timeout: 1500 }) : window.setTimeout(go, 300); };
    if (document.readyState === 'complete') later(); else window.addEventListener('load', later, { once: true });
    const off = progress.on('change', (v) => handle?.setProgress(v));
    const fine = window.matchMedia('(pointer: fine)').matches;
    const move = (e: PointerEvent) => handle?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    if (fine) window.addEventListener('pointermove', move, { passive: true });
    return () => {
      dead = true; off();
      window.removeEventListener('load', later);
      if (!idle) window.clearTimeout(timer);
      window.removeEventListener('pointermove', move);
      handle?.dispose();
    };
  }, [progress, centerX]);
  return (
    <>
      <svg viewBox="118 68 186 275" aria-hidden className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000" style={{ left: `${centerX * 100}%`, height: glyph, opacity: ready ? 0 : 0.9 }}>
        <defs><linearGradient id="flat-rupee" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd688" /><stop offset=".45" stopColor="#ff387d" /><stop offset="1" stopColor="#d15dff" /></linearGradient></defs>
        <path d={RUPEE_PATH} fill="url(#flat-rupee)" />
      </svg>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full transition-opacity duration-1000" style={{ opacity: ready ? 1 : 0 }} />
    </>
  );
}

/** The ₹'s own facts, set like an engraving under the coin. */
function FactLine({ className }: { className: string }) {
  return (
    <p aria-hidden className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.24em] text-paper/55 sm:text-[11px] ${className}`}>
      U+20B9 <span className="text-rose">·</span> INR <span className="text-rose">·</span> ISO 4217 <span className="text-rose">·</span> 356 <span className="text-rose">·</span> 15·07·2010
    </p>
  );
}

function HeroCopy({ mobile, inactive = false }: { mobile: boolean; inactive?: boolean }) {
  return (
    <>
      <motion.p className="kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
        Moneytec — Money, with meaning
      </motion.p>
      <h1 className="display mt-5 text-[clamp(3rem,8.4vw,8.6rem)]" aria-label="Small steps. Lasting growth.">
        {['Small steps.', '*Lasting growth.*'].map((line, i) => (
          <span key={line} aria-hidden className="block overflow-hidden pb-[0.06em]">
            <motion.span className="block" initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.35 + i * 0.1 }}>
              {line.startsWith('*') ? <span className="serif grad pr-[0.05em] text-[1.08em]">{line.slice(1, -1)}</span> : line}
            </motion.span>
          </span>
        ))}
      </h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}>
        <HeroWisdom />
        <p className="hero-services-line">Goal-based investing, family protection and NRI guidance with {FACTS.name}.</p>
      </motion.div>
      <motion.div className="mt-7 flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}>
        <a href="#start" tabIndex={inactive ? -1 : undefined} className="btn-light pr-2">Start a conversation <span className="arrow">↗</span></a>
        <a href="#calculator" tabIndex={inactive ? -1 : undefined} onClick={() => window.dispatchEvent(new Event('moneytec:plan-goal'))} className="btn-ghost">{mobile ? 'Plan my goal' : 'Plan my goal ↓'}</a>
      </motion.div>
      <motion.div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.15 }}>
        <span className="flex items-center gap-2"><BrandLogo brand="amfi" className="hero-amfi-logo" />AMFI registered <b className="font-medium text-paper">{FACTS.arn}</b></span>
        <span className="flex items-center gap-2"><i aria-hidden className="text-amber">✳</i>Personal guidance <b className="font-medium text-paper">{FACTS.name}</b></span>
      </motion.div>
    </>
  );
}

export function Hero() {
  const mobile = useMobile();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const disperse = useTransform(p, [0.08, 0.62], [0, 1], { clamp: true });
  const copyOpacity = useTransform(p, [0, .85], [1, .15]);
  const copyY = useTransform(p, [0, 1], [0, -35]);
  const copyBlur = useTransform(p, [0, 1], ['blur(0px)', 'blur(2px)']);
  const floor = useTransform(p, [0, 1], ['0%', '-40%']);
  const still = useMotionValue(0);

  if (mobile) {
    return (
      <section id="top" data-dark className="hero-mobile relative overflow-hidden pb-12 pt-[64px]">
        <div className="pointer-events-none absolute inset-0"><div className="aurora opacity-40" /></div>
        <div className="mobile-rupee-stage absolute inset-x-0 top-[40px] h-[340px]">
          <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,55,95,0.40),transparent)]" />
          <Rupee3D progress={still} centerX={0.5} glyph="160px" />
        </div>
        <div className="hero-mobile-copy wrap relative pt-[334px]"><HeroCopy mobile /></div>
      </section>
    );
  }

  return (
    <section id="top" data-dark ref={ref} className="hero-with-wisdom relative h-[100svh]">
      <div className="relative h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0"><div className="aurora opacity-35" /></div>
        <motion.div className="grid-floor pointer-events-none absolute inset-x-[-20%] bottom-[-30%] h-[70%] origin-bottom opacity-60" style={{ transform: 'perspective(600px) rotateX(68deg)', backgroundPositionY: floor }} />
        <motion.div className="pointer-events-none absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: copyOpacity }}>
          <div className="absolute left-1/2 top-1/2 h-[46vh] w-[46vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,55,95,0.32),transparent)]" />
          <FactLine className="top-[39vh]" />
        </motion.div>
        <Rupee3D progress={disperse} centerX={0.7} glyph="35vh" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_25%_55%,rgba(7,6,11,0.75),transparent_70%)]" />

        <motion.div className="wrap-wide relative flex h-full flex-col justify-center pt-10" style={{ opacity: copyOpacity, y: copyY, filter: copyBlur }}>
          <div className="hero-intro-column max-w-[44rem]"><HeroCopy mobile={false} /></div>
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
