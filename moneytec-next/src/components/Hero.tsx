import { motion, MotionValue, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FACTS } from '../data';
import { EASE, reduced } from './ui';

/** A luminous rupee suspended in a lightweight circuit field. */
function TechRupee({ size, tiltX, tiltY, staticFacing = false }: { size: number; tiltX: MotionValue<number>; tiltY: MotionValue<number>; staticFacing?: boolean }) {
  return (
    <div className="tech-rupee" style={{ width: size, height: size, perspective: 1200 }} aria-hidden="true">
      <svg className="rupee-circuits" viewBox="0 0 400 400" fill="none">
        <defs><linearGradient id="circuit-gradient"><stop stopColor="#ff9f0a" /><stop offset=".5" stopColor="#ff375f" /><stop offset="1" stopColor="#bf5af2" /></linearGradient></defs>
        <g stroke="url(#circuit-gradient)" strokeWidth="1.2">
          <path d="M20 95h65l30 30h55 M380 80h-65l-35 35h-40 M15 270h75l35-35h45 M385 290h-65l-40-40h-40 M100 20v55l30 30 M300 380v-55l-30-30 M45 190h65 M290 190h65" />
          <path d="M60 60h45 M60 60v45 M340 60h-45 M340 60v45 M60 340h45 M60 340v-45 M340 340h-45 M340 340v-45" opacity=".5" />
        </g>
        {[ [20,95],[380,80],[15,270],[385,290],[100,20],[300,380],[45,190],[355,190] ].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="3" fill={i%2 ? '#bf5af2' : '#ff9f0a'} />)}
      </svg>
      <motion.div className="rupee-symbol" style={{ rotateX: staticFacing ? 0 : tiltX, rotateY: staticFacing ? 0 : tiltY }}><span className="grad">₹</span></motion.div>
      <div className="rupee-scan" />
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [size, setSize] = useState(360);
  const [mobile, setMobile] = useState(false);
  const [secondScene, setSecondScene] = useState(false);
  useMotionValueEvent(p, 'change', value => setSecondScene(value > 0.55));
  useEffect(() => {
    const set = () => { setMobile(window.innerWidth < 640); setSize(window.innerWidth < 640 ? 148 : window.innerWidth < 1024 ? 360 : 500); };
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  // scroll choreography: the coin turns a full revolution and lifts; copy hands over to the second line
  const scale = useTransform(p, [0, 0.55, 1], [1, 1.12, 0.92]);
  const coinY = useTransform(p, [0, 1], ['0%', '-6%']);
  const titleOpacity = useTransform(p, [0.15, 0.55], [1, 0]);
  const titleY = useTransform(p, [0.15, 0.55], [0, -40]);
  const line2Opacity = useTransform(p, [0.5, 0.72, 0.95, 1], [0, 1, 1, 0.9]);
  const line2Y = useTransform(p, [0.5, 0.72], [40, 0]);
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
    <section id="top" data-dark ref={ref} className="moneytec-hero relative -mt-[52px] h-[175svh] bg-night text-white">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center overflow-hidden pt-[52px]">
        {/* A restrained studio glow gives the metal mark depth without competing with the message. */}
        <motion.div className="hero-ambient pointer-events-none absolute rounded-full bg-[radial-gradient(circle,rgba(255,55,95,0.28),rgba(191,90,242,0.18)_40%,transparent_70%)] blur-2xl" style={{ opacity: glow }} />

        <motion.div aria-hidden={!mobile && secondScene} className="hero-stage relative z-10 mx-auto flex w-full max-w-[1320px] flex-1 items-center px-5 sm:px-8" style={{ opacity: mobile ? 1 : titleOpacity, y: mobile ? 0 : titleY, pointerEvents: !mobile && secondScene ? 'none' : 'auto' }}>
          <div className="hero-copy relative z-10 w-full">
            <motion.p className="hero-kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
              <span className="hero-kicker-mark" /> MONEYTEC <span className="hero-kicker-rule" /> MONEY, WITH MEANING
            </motion.p>
            <motion.h1
              className="display hero-title mt-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
            >
              Make your money<br />
              <span className="hero-serif">mean <span className="grad">more.</span></span>
            </motion.h1>
            <p className="hero-description">A clearer path to your goals, built around your life.</p>
            <p className="hero-mobile-intro">Goal-based mutual fund investing, insurance and NRI guidance with Gulshan Kohli.</p>
            <motion.div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
              <a href="#start" tabIndex={!mobile && secondScene ? -1 : undefined} className="hero-primary">Start a conversation <span aria-hidden="true">↗</span></a>
              <a href="#calculator" tabIndex={!mobile && secondScene ? -1 : undefined} className="hero-secondary">Explore your plan <span aria-hidden="true">↓</span></a>
            </motion.div>
            <div className="hero-credentials" aria-label="Professional credentials">
              <span><i aria-hidden="true">✳</i> AMFI registered <b>ARN-105840</b></span>
              <span><i aria-hidden="true">✳</i> Personal guidance <b>Gulshan Kohli</b></span>
            </div>
          </div>

          <motion.div className="hero-coin relative z-0" style={{ scale: mobile ? 1 : scale, y: mobile ? 0 : coinY }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}>
          <div className="coin-halo" aria-hidden="true" /><TechRupee size={size} tiltX={tiltX} tiltY={tiltY} staticFacing={mobile} />
          <div className="absolute -bottom-10 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[50%] bg-white/10 blur-xl" />
            <div className="hero-orbit-label"><span className="hero-orbit-dot" /> BUILT AROUND YOU <span>MONEYTEC</span></div>
          </motion.div>
        </motion.div>

        <motion.div aria-hidden={mobile || !secondScene} className="hero-second-copy absolute inset-x-0 top-[19vh] z-10 px-5 text-center" style={{ opacity: mobile ? 1 : line2Opacity, y: mobile ? 0 : line2Y, pointerEvents: secondScene ? 'auto' : 'none' }}>
          <p className="hero-kicker justify-center"><span className="hero-kicker-mark" /> A MORE PERSONAL APPROACH TO MONEY</p>
          <p className="display mt-6 text-[clamp(2.4rem,6vw,5.2rem)]">
            Clarity for the plan.<br />
            <span className="hero-serif grad">Confidence in the person.</span>
          </p>
          <p className="body-lg mx-auto mt-5 max-w-xl text-white/65">
            Goal-based investing, family protection and NRI guidance, with {FACTS.name} alongside you.
          </p>
          <a href="#highlights" tabIndex={secondScene && !mobile ? undefined : -1} className="hero-secondary mt-7">See how it works <span aria-hidden="true">↓</span></a>
        </motion.div>
      </div>
    </section>
  );
}
