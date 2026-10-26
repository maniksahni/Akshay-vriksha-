import { motion, MotionValue, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FACTS } from '../data';
import { EASE, reduced } from './ui';

/** Vector-built holographic rupee: crisp at every size, without canvas or WebGL. */
function TechRupee({ size, tiltX, tiltY, progress, staticFacing = false }: { size: number; tiltX: MotionValue<number>; tiltY: MotionValue<number>; progress: MotionValue<number>; staticFacing?: boolean }) {
  const depth = useTransform(progress, [0, .3, .65, 1], [0, 1, .35, 0]);
  const rotate = useTransform(progress, [0, .4, .75, 1], [-9, 6, -5, 0]);
  const wireDraw = useTransform(progress, [0, .3, 1], [.25, 1, 1]);
  const layerA = useTransform(depth, d => `translate(${14 + d * 27}px, ${14 + d * 14}px)`);
  const layerB = useTransform(depth, d => `translate(${11 + d * 20}px, ${11 + d * 11}px)`);
  const layerC = useTransform(depth, d => `translate(${8 + d * 13}px, ${8 + d * 8}px)`);
  const layerD = useTransform(depth, d => `translate(${5 + d * 6}px, ${5 + d * 5}px)`);
  const layerE = useTransform(depth, d => `translate(${2 + d * 2}px, ${2 + d * 2}px)`);
  const glyph = 'M128 78H294V101H235C250 113 259 127 262 145H294V168H262C255 205 228 225 185 230L286 333H246L128 211V202H166C206 202 225 190 231 168H128V145H231C226 116 205 101 166 101H128Z';
  return (
    <motion.div className="tech-rupee hologram-rupee" style={{ width: size, height: size, perspective: 1200, rotateX: staticFacing ? 0 : tiltX, rotateY: staticFacing ? 0 : tiltY, rotateZ: staticFacing ? 0 : rotate }} aria-hidden="true">
      <svg viewBox="0 0 420 420" className="hologram-art" fill="none">
        <defs>
          <linearGradient id="rupee-face" x1="120" y1="80" x2="290" y2="335" gradientUnits="userSpaceOnUse"><stop stopColor="#ffd688" /><stop offset=".22" stopColor="#ff9f2f" /><stop offset=".53" stopColor="#ff387d" /><stop offset=".8" stopColor="#d15dff" /><stop offset="1" stopColor="#f4cbff" /></linearGradient>
          <linearGradient id="rupee-edge" x1="120" y1="80" x2="300" y2="340" gradientUnits="userSpaceOnUse"><stop stopColor="#cd6618" /><stop offset=".5" stopColor="#7f1b63" /><stop offset="1" stopColor="#491d7a" /></linearGradient>
          <linearGradient id="rupee-network"><stop stopColor="#ff9f0a" /><stop offset=".5" stopColor="#ff375f" /><stop offset="1" stopColor="#bf5af2" /></linearGradient>
          <linearGradient id="rupee-sheen" x1="0" y1="0" x2="1" y2="1"><stop stopColor="white" stopOpacity="0" /><stop offset=".5" stopColor="white" stopOpacity=".6" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient>
          <pattern id="rupee-grid" width="21" height="21" patternUnits="userSpaceOnUse"><path d="M21 0H0V21" stroke="#d7b4ee" strokeOpacity=".09" strokeWidth=".5" /></pattern>
          <clipPath id="rupee-cut"><path d={glyph} /></clipPath>
        </defs>
        <path d="M210 15 379 112V307L210 405 41 307V112Z" fill="url(#rupee-grid)" stroke="url(#rupee-network)" strokeOpacity=".16" />
        <g className="holo-wire" stroke="url(#rupee-network)" strokeWidth=".8">
          <motion.path d="M210 35 360 122V296L210 383 60 296V122Z" style={{pathLength: staticFacing ? 1 : wireDraw}} />
          <path d="M15 130H79L110 160H130 M402 105H333L304 134H280 M15 280H77L115 242H144 M405 301H343L302 260H270 M80 48V89L121 129 M338 375V335L294 291 M6 210H105 M312 210H414" />
        </g>
        <g className="holo-flow" stroke="url(#rupee-network)" strokeWidth="1.7" strokeDasharray="5 135" strokeLinecap="round"><path d="M15 130H79L110 160H130 M402 105H333L304 134H280 M15 280H77L115 242H144 M405 301H343L302 260H270" /></g>
        <path className="rupee-blueprint" d={glyph} transform="translate(-17 -14)" stroke="#e3a3fd" strokeWidth=".65" strokeDasharray="2 3" opacity=".3" />
        {[layerA,layerB,layerC,layerD,layerE].map((transform,i) => <motion.path key={i} d={glyph} style={{transform:staticFacing ? `translate(${14-i*3}px,${14-i*3}px)` : transform}} fill="url(#rupee-edge)" stroke="#ff83d2" strokeOpacity=".32" strokeWidth=".8" />)}
        <path className="holo-face" d={glyph} fill="url(#rupee-face)" stroke="#ffe1e8" strokeOpacity=".65" strokeWidth=".8" />
        <g clipPath="url(#rupee-cut)"><path d="M100 114H310 M100 180H310 M100 246H310 M100 312H310" stroke="white" strokeOpacity=".14" strokeWidth=".6" /><rect className="holo-sheen" x="60" y="-150" width="300" height="100" fill="url(#rupee-sheen)" transform="rotate(-25 210 210)" /></g>
        {[[15,130],[402,105],[15,280],[405,301],[80,48],[338,375],[6,210],[414,210]].map(([cx,cy],i)=><g key={i}><circle cx={cx} cy={cy} r="4" fill="#110b18" stroke={i%2 ? '#d17af7' : '#ffad55'} /><circle className="holo-node" cx={cx} cy={cy} r="1.5" fill="#ffe2ff" style={{animationDelay:`${i*.4}s`}} /></g>)}
        <g stroke="#e4bded" strokeOpacity=".4" strokeWidth=".75"><path d="M128 59V48H166 M294 59V48H256 M128 349V361H166 M294 349V361H256" /></g>
      </svg>
      <span className="hologram-caption">MONEY <i /> TECHNOLOGY <i /> YOU</span>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [size, setSize] = useState(360);
  const [mobile, setMobile] = useState(false);
  const [secondScene, setSecondScene] = useState(false);
  const [chapter, setChapter] = useState(0);
  useMotionValueEvent(p, 'change', value => { setSecondScene(value > .55); setChapter(value < .22 ? 0 : value < .55 ? 1 : 2); });
  useEffect(() => {
    const set = () => { setMobile(window.innerWidth < 640); setSize(window.innerWidth < 640 ? 148 : window.innerWidth < 1024 ? 360 : 500); };
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  // The hologram lifts gently as the opening message hands over to the second scene.
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
    <section id="top" data-dark ref={ref} className="moneytec-hero relative -mt-[52px] h-[240svh] bg-night text-white">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center overflow-hidden pt-[52px]">
        {/* A restrained studio glow gives the metal mark depth without competing with the message. */}
        <motion.div className="hero-ambient pointer-events-none absolute rounded-full bg-[radial-gradient(circle,rgba(255,55,95,0.28),rgba(191,90,242,0.18)_40%,transparent_70%)] blur-2xl" style={{ opacity: glow }} />

        <motion.div className="hero-stage relative z-10 mx-auto flex w-full max-w-[1320px] flex-1 items-center px-5 sm:px-8" style={{ pointerEvents: !mobile && secondScene ? 'none' : 'auto' }}>
          <motion.div aria-hidden={!mobile && secondScene} className="hero-copy relative z-10 w-full" style={{ opacity: mobile ? 1 : titleOpacity, y: mobile ? 0 : titleY }}>
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
          </motion.div>

          <motion.div className="hero-coin relative z-0" style={{ scale: mobile ? 1 : scale, y: mobile ? 0 : coinY }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}>
          <div className="coin-halo" aria-hidden="true" /><TechRupee progress={p} size={size} tiltX={tiltX} tiltY={tiltY} staticFacing={mobile} />
          <div className="absolute -bottom-10 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[50%] bg-white/10 blur-xl" />
            <div className="hero-orbit-label"><span className="hero-orbit-dot" /> BUILT AROUND YOU <span>MONEYTEC</span></div>
          </motion.div>
        </motion.div>

        <div className="hero-scroll-console" aria-hidden="true">
          <div className="console-track"><motion.span style={{scaleX:p}} /></div>
          <div className="console-chapters">{['01 / THE VISION','02 / THE CONNECTION','03 / YOUR NEXT CHAPTER'].map((label,i)=><span key={label} className={chapter===i ? 'is-current' : ''}>{label}</span>)}</div>
          <span className="console-hint">SCROLL TO EXPLORE <b>↓</b></span>
        </div>
        <motion.div aria-hidden={mobile || !secondScene} className="hero-second-copy tech-second-copy absolute inset-x-0 top-[19vh] z-10 px-5 text-center" style={{ opacity: mobile ? 1 : line2Opacity, y: mobile ? 0 : line2Y, pointerEvents: secondScene ? 'auto' : 'none' }}>
          <p className="hero-kicker justify-center"><span className="hero-kicker-mark" /> A MORE PERSONAL APPROACH TO MONEY</p>
          <p className="display mt-6 text-[clamp(2.4rem,6vw,5.2rem)]">
            Your goals.<br />
            <span className="hero-serif grad">Connected by clarity.</span>
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
