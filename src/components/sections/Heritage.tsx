import { motion, MotionValue, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { MouseEvent, useRef, useState } from 'react';
import { JOURNEYS, Journey, whatsappLink } from '../../data/site';
import { Scramble } from '../ui/effects';
import { FadeUp, MaskLines } from '../ui/motion';

const SIL = '#1A0B07';

/** Shift an SVG layer with the pointer; deeper layers move less. */
const depth = (d: number) => ({
  transform: `translate(calc(var(--px, 0) * ${d}px), calc(var(--py, 0) * ${d * 0.6}px))`,
  transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)',
});

function Scene({ j }: { j: Journey }) {
  const id = `sky-${j.name}`;
  return (
    <svg viewBox="0 0 200 280" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor={j.sky[0]} />
          <stop offset="1" stopColor={j.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="200" height="280" fill={`url(#${id})`} />
      <g style={depth(-4)}>
      <g className="transition-transform duration-[1.4s] ease-out group-hover:-translate-y-6">
        <circle cx={j.scene === 'peaks' ? 140 : 100} cy={j.scene === 'sun' ? 120 : 150} r={j.scene === 'sun' ? 44 : 26} fill="#FFE7B0" opacity="0.9" />
      </g>
      </g>
      <g style={depth(8)}>
      {j.scene === 'ghats' && (
        <g fill={SIL}>
          <path d="M0 200 L0 170 L18 170 L18 150 L26 132 L34 150 L34 170 L60 170 L60 160 L72 160 L72 140 L80 112 L88 140 L88 160 L110 160 L110 175 L140 175 L140 150 L148 128 L156 150 L156 175 L200 175 L200 200 Z" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x="0" y={200 + i * 4} width="200" height="2" opacity={0.9 - i * 0.12} />
          ))}
          <rect y="224" width="200" height="56" fill="#2B1410" />
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={20 + i * 18} y={232 + (i % 3) * 10} width={10 + (i % 4) * 4} height="1.2" fill="#FFE7B0" opacity="0.35" />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <circle key={i} cx={30 + i * 22} cy="236" r="1.6" fill="#FFB347" className="animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </g>
      )}
      {j.scene === 'ruins' && (
        <g fill={SIL}>
          <ellipse cx="30" cy="230" rx="60" ry="40" />
          <ellipse cx="170" cy="220" rx="50" ry="46" />
          <ellipse cx="150" cy="180" rx="22" ry="18" />
          <path d="M60 230 V190 H70 V168 H130 V190 H140 V230 Z" />
          <path d="M78 168 V140 L86 140 L90 120 L100 96 L110 120 L114 140 L122 140 V168 Z" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={76 + i * 14} y="196" width="5" height="34" fill={j.sky[0]} opacity="0.25" />
          ))}
          <rect y="230" width="200" height="50" />
        </g>
      )}
      {j.scene === 'peaks' && (
        <g>
          <path d="M-10 230 L50 120 L80 170 L120 80 L170 160 L210 120 L210 280 L-10 280 Z" fill="#2C4A6B" />
          <path d="M50 120 L62 142 L54 140 L46 148 Z M120 80 L136 108 L126 104 L118 114 L110 100 Z" fill="#F3EEE5" opacity="0.9" />
          <path d="M-10 250 L40 200 L90 236 L140 196 L210 240 L210 280 L-10 280 Z" fill={SIL} />
          <path d="M92 236 V214 L96 214 L100 196 L104 214 L108 214 V236 Z" fill="#0A0503" />
        </g>
      )}
      {j.scene === 'sun' && (
        <g>
          <g fill="none" stroke={SIL} strokeWidth="3">
            <circle cx="100" cy="200" r="34" />
            <circle cx="100" cy="200" r="8" fill={SIL} />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return <line key={i} x1={100 + Math.cos(a) * 8} y1={200 + Math.sin(a) * 8} x2={100 + Math.cos(a) * 34} y2={200 + Math.sin(a) * 34} strokeWidth="2" />;
            })}
          </g>
          <rect y="236" width="200" height="44" fill={SIL} />
          {Array.from({ length: 5 }).map((_, i) => (
            <path key={i} d={`M0 ${246 + i * 7} q 25 -4 50 0 t 50 0 t 50 0 t 50 0`} stroke="#FFE7B0" strokeOpacity="0.25" fill="none" />
          ))}
        </g>
      )}
      </g>
    </svg>
  );
}

const DRIFT = [70, -30, 110, 0];

function Card({ j, i, progress, desktop }: { j: Journey; i: number; progress: MotionValue<number>; desktop: boolean }) {
  // desktop: arches drift at different speeds as you scroll past, like a stage set
  const drift = useTransform(progress, [0, 1], [DRIFT[i % 4], -DRIFT[i % 4]]);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15 });
  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ry.set(x * 14);
    rx.set(-y * 14);
    // drives the depth layers inside <Scene>
    e.currentTarget.style.setProperty('--px', String(x * 2));
    e.currentTarget.style.setProperty('--py', String(y * 2));
  };
  return (
    <motion.a
      href={whatsappLink(`Namaste! I'd love to know more about a heritage journey to ${j.name}.`)}
      target="_blank"
      rel="noreferrer"
      className="group block w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-auto"
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900, y: desktop ? drift : 0 }}
      onMouseMove={onMove}
      onMouseLeave={(e) => { rx.set(0); ry.set(0); e.currentTarget.style.setProperty('--px', '0'); e.currentTarget.style.setProperty('--py', '0'); }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-[5/7] overflow-hidden rounded-t-full border border-gold/25">
        <div className="absolute inset-0 transition-transform duration-[1.4s] ease-out group-hover:scale-110">
          <Scene j={j} />
        </div>
        <div className="absolute inset-x-0 top-[22%] text-center font-deva text-5xl text-bone/90 drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] sm:text-6xl">{j.hindi}</div>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-3xl">{j.name}</h3>
        <span className="text-xs text-bone/40">{j.region}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-bone/55">{j.line}</p>
    </motion.a>
  );
}

export function Heritage() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bigX = useTransform(scrollYProgress, [0, 1], ['10%', '-30%']);
  const [desktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);

  return (
    <section id="heritage" ref={ref} className="relative overflow-hidden bg-gradient-to-b from-night via-[#1C0D07] to-night py-24 sm:py-32">
      <motion.div style={{ x: bigX }} className="pointer-events-none select-none whitespace-nowrap font-deva text-[26vw] leading-none text-gold/[0.06]">
        भारतवर्ष भारतवर्ष
      </motion.div>
      <div className="container-x relative -mt-[12vw]">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <FadeUp>
              <Scramble text="Heritage Travel" className="eyebrow mb-4 text-gold" />
            </FadeUp>
            <MaskLines
              lines={['Wealth is the means.', <span className="italic text-gold">Roots are the reward.</span>]}
              className="font-display text-[clamp(2.6rem,5.6vw,5.2rem)] leading-[0.95] tracking-[-0.02em]"
            />
          </div>
          <FadeUp delay={0.1}>
            <p className="max-w-md text-bone/60 lg:ml-auto">
              Curated spiritual journeys and heritage tours through the ancient civilisations of सनातन भारत. Guided tours for NRI individuals and groups, shaped around your family.
            </p>
          </FadeUp>
        </div>
      </div>
      <div className="mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 lg:container-x lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible">
        {JOURNEYS.map((j, i) => (
          <Card key={j.name} j={j} i={i} progress={scrollYProgress} desktop={desktop} />
        ))}
      </div>
      <FadeUp className="container-x mt-10">
        <p className="eyebrow mb-3 text-gold/70 lg:hidden">Swipe for more →</p>
        <p className="text-sm text-bone/40">Every itinerary is planned on request. Tell us where your roots are.</p>
      </FadeUp>
    </section>
  );
}
