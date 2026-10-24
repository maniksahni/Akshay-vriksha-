import { motion, MotionValue, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FACTS } from '../data';
import { EASE, reduced } from './ui';

/** A brushed-titanium ₹ coin, built from stacked CSS discs; its spin is driven from outside. */
function TitaniumCoin({ size, spin, tiltX, tiltY }: { size: number; spin: MotionValue<number>; tiltX: MotionValue<number>; tiltY: MotionValue<number> }) {
  const thickness = Math.round(size * 0.085);
  const layers = 16;
  const rotateY = useTransform([spin, tiltY], ([s, t]: number[]) => s + t);
  return (
    <div style={{ width: size, height: size, perspective: 1600 }} className="relative">
      <motion.div className="absolute inset-0" style={{ rotateX: tiltX, rotateY, transformStyle: 'preserve-3d' }}>
        {Array.from({ length: layers }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              transform: `translateZ(${-thickness / 2 + (i * thickness) / (layers - 1)}px)`,
              background: `repeating-linear-gradient(90deg, #8e8e93 0 2px, #b8b8bd 2px 4px)`,
              filter: `brightness(${0.75 + (i % 3) * 0.08})`,
            }}
          />
        ))}
        {/* face: brushed metal with an engraved rupee */}
        <div
          className="absolute inset-0 grid place-items-center rounded-full"
          style={{
            transform: `translateZ(${thickness / 2 + 0.5}px)`,
            background:
              'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95), rgba(255,255,255,0) 42%), conic-gradient(from 210deg, #d9d9de, #9a9aa0, #f2f2f5, #8a8a90, #e4e4e8, #a7a7ad, #d9d9de)',
            boxShadow: 'inset 0 0 0 6px rgba(255,255,255,0.55), inset 0 0 0 12px rgba(0,0,0,0.12), inset 0 -24px 60px rgba(0,0,0,0.25)',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="absolute inset-[10%] rounded-full border border-black/10" />
          <span className="grad select-none font-extrabold leading-none" style={{ fontSize: size * 0.5, filter: 'drop-shadow(0 2px 1px rgba(255,255,255,0.7)) drop-shadow(0 -1px 0 rgba(0,0,0,0.25))' }}>
            ₹
          </span>
        </div>
        {/* back: engraved wordmark */}
        <div
          className="absolute inset-0 grid place-items-center rounded-full"
          style={{
            transform: `rotateY(180deg) translateZ(${thickness / 2 + 0.5}px)`,
            background: 'conic-gradient(from 40deg, #2c2c2e, #636366, #1c1c1e, #48484a, #2c2c2e)',
            boxShadow: 'inset 0 0 0 6px rgba(255,255,255,0.12), inset 0 0 0 12px rgba(0,0,0,0.4)',
            backfaceVisibility: 'hidden',
          }}
        >
          <span className="font-semibold tracking-[-0.03em] text-white/85" style={{ fontSize: size * 0.11 }}>moneytec</span>
        </div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [size, setSize] = useState(360);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const set = () => { setMobile(window.innerWidth < 640); setSize(window.innerWidth < 640 ? 174 : window.innerWidth < 1024 ? 320 : 380); };
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  // scroll choreography: the coin turns a full revolution and lifts; copy hands over to the second line
  const spinRaw = useTransform(p, [0, 1], [-18, 342]);
  const spin = useSpring(spinRaw, { stiffness: 80, damping: 22 });
  const scale = useTransform(p, [0, 0.55, 1], [1, 1.12, 0.92]);
  const coinY = useTransform(p, [0, 1], ['0%', '-6%']);
  const titleOpacity = useTransform(p, [0, 0.32], [1, 0]);
  const titleY = useTransform(p, [0, 0.32], [0, -40]);
  const line2Opacity = useTransform(p, [0.45, 0.65, 0.95, 1], [0, 1, 1, 0.9]);
  const line2Y = useTransform(p, [0.45, 0.65], [40, 0]);
  const glow = useTransform(p, [0, 0.6], [0.35, 0.75]);

  // gentle pointer tilt
  const tx = useMotionValue(10);
  const ty = useMotionValue(0);
  const tiltX = useSpring(tx, { stiffness: 60, damping: 14 });
  const tiltY = useSpring(ty, { stiffness: 60, damping: 14 });
  useEffect(() => {
    if (reduced() || !window.matchMedia('(pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      tx.set(10 - (e.clientY / window.innerHeight - 0.5) * 16);
      ty.set((e.clientX / window.innerWidth - 0.5) * 24);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [tx, ty]);

  return (
    <section id="top" data-dark ref={ref} className="moneytec-hero relative -mt-[52px] h-[200svh] bg-night text-white">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center overflow-hidden pt-[52px]">
        {/* soft studio light */}
        <motion.div className="pointer-events-none absolute left-1/2 top-[38%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,55,95,0.35),rgba(191,90,242,0.18)_40%,transparent_70%)] blur-2xl" style={{ opacity: glow }} />

        <motion.div className="relative z-10 mt-[6vh] px-5 text-center sm:mt-[7vh]" style={{ opacity: mobile ? 1 : titleOpacity, y: mobile ? 0 : titleY }}>
          <motion.p className="eyebrow text-white/80" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
            moneytec
          </motion.p>
          <motion.h1
            className="display mt-2 text-[clamp(2.6rem,7.2vw,5.6rem)]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          >
            Your ambitions.
            <br />
            <span className="grad">A smarter money journey.</span>
          </motion.h1>
          <p className="hero-mobile-intro">Goal-based SIPs, insurance and NRI investing with Gulshan Kohli.</p>
          <motion.div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
            <a href="#start" className="pill-blue">Get started</a>
            <a href="#calculator" className="textlink-dark">Try the calculator ›</a>
          </motion.div>
        </motion.div>

        <motion.div className="hero-coin relative z-0 mt-auto mb-[9vh] sm:mb-[7vh]" style={{ scale: mobile ? 1 : scale, y: mobile ? 0 : coinY }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}>
          <div className="coin-halo" aria-hidden="true" /><TitaniumCoin size={size} spin={spin} tiltX={tiltX} tiltY={tiltY} />
          {/* floor reflection */}
          <div className="absolute -bottom-10 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[50%] bg-white/10 blur-xl" />
        </motion.div>

        <motion.div className="hero-second-copy absolute inset-x-0 top-[16vh] z-10 px-5 text-center" style={{ opacity: mobile ? 1 : line2Opacity, y: mobile ? 0 : line2Y }}>
          <p className="display text-[clamp(2rem,5.2vw,4rem)]">
            Tools that bring clarity.
            <br />
            <span className="grad-mint">A person who understands.</span>
          </p>
          <p className="body-lg mx-auto mt-3 max-w-xl text-white/65">
            Goal-based SIPs, insurance and NRI investing, set up with {FACTS.name}, a real person who picks up the phone.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
