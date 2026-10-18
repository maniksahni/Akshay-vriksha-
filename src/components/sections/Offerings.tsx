import { motion, useScroll, useTransform } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { OFFERINGS, Offering, whatsappLink } from '../../data/site';
import { FadeUp, MaskLines } from '../ui/motion';

const THEMES = [
  { bg: 'bg-forest', text: 'text-bone', sub: 'text-bone/60', line: 'border-white/10', accent: 'text-gold', btn: 'bg-gold text-night hover:bg-gold-soft', stroke: '#D9AE5B' },
  { bg: 'bg-bone', text: 'text-ink', sub: 'text-ink/60', line: 'border-ink/10', accent: 'text-ember', btn: 'bg-ink text-bone hover:bg-moss', stroke: '#C4622D' },
  { bg: 'bg-[#2A140C]', text: 'text-bone', sub: 'text-bone/60', line: 'border-white/10', accent: 'text-gold-soft', btn: 'bg-gold-soft text-night hover:bg-gold', stroke: '#E9CD8F' },
];

function Motif({ kind, stroke }: { kind: Offering['motif']; stroke: string }) {
  const draw = {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: '0px 0px -20% 0px' },
  };
  if (kind === 'roots') {
    const paths = [
      'M150 20 V120',
      'M150 120 C150 160 110 170 80 210 S40 270 30 290',
      'M150 120 C150 170 190 180 210 220 S250 270 270 290',
      'M150 120 C148 180 150 230 150 290',
      'M110 175 C90 190 70 190 50 200',
      'M195 190 C220 195 240 200 262 214',
      'M150 210 C130 235 120 260 105 288',
      'M150 210 C170 235 182 262 195 288',
    ];
    return (
      <svg viewBox="0 0 300 300" className="h-full w-full" fill="none">
        {paths.map((d, i) => (
          <motion.path key={i} d={d} stroke={stroke} strokeWidth={i === 0 ? 3 : 1.4} strokeLinecap="round" {...draw} transition={{ duration: 2, delay: 0.2 + i * 0.12, ease: 'easeInOut' }} />
        ))}
        <motion.circle cx="150" cy="20" r="10" fill={stroke} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1, type: 'spring' }} />
      </svg>
    );
  }
  if (kind === 'shield') {
    return (
      <svg viewBox="0 0 300 300" className="h-full w-full" fill="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.path
            key={i}
            d={`M${150 - (130 - i * 24)} ${260 - i * 6} A ${130 - i * 24} ${130 - i * 24} 0 0 1 ${150 + (130 - i * 24)} ${260 - i * 6}`}
            stroke={stroke}
            strokeWidth={1.4}
            {...draw}
            transition={{ duration: 1.6, delay: 0.2 + i * 0.15, ease: 'easeInOut' }}
          />
        ))}
        <motion.g initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1 }}>
          <circle cx="135" cy="222" r="9" fill={stroke} />
          <circle cx="165" cy="222" r="9" fill={stroke} />
          <circle cx="150" cy="238" r="6" fill={stroke} />
          <path d="M120 260c2-18 28-18 30 0M150 260c2-18 28-18 30 0" stroke={stroke} strokeWidth="1.4" />
        </motion.g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" fill="none">
      <motion.circle cx="150" cy="120" r="46" stroke={stroke} strokeWidth="1.4" {...draw} transition={{ duration: 1.6 }} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <motion.line
            key={i}
            x1={150 + Math.cos(a) * 58}
            y1={120 + Math.sin(a) * 58}
            x2={150 + Math.cos(a) * 76}
            y2={120 + Math.sin(a) * 76}
            stroke={stroke}
            strokeWidth="1.4"
            strokeLinecap="round"
            {...draw}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.05 }}
          />
        );
      })}
      <motion.path
        d="M60 290 V250 H90 V220 L110 200 L125 150 L150 95 L175 150 L190 200 L210 220 V250 H240 V290 Z"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
        {...draw}
        transition={{ duration: 2.2, delay: 0.3, ease: 'easeInOut' }}
      />
      <motion.path d="M135 290 V255 a15 15 0 0 1 30 0 V290" stroke={stroke} strokeWidth="1.4" {...draw} transition={{ duration: 1, delay: 1.6 }} />
      <motion.path d="M150 95 V80 M150 80 l12 6 -12 6" stroke={stroke} strokeWidth="1.4" {...draw} transition={{ duration: 0.6, delay: 2.2 }} />
    </svg>
  );
}

function Panel({ o, i }: { o: Offering; i: number }) {
  const t = THEMES[i % THEMES.length];
  return (
    <article className={`relative flex min-h-[86svh] w-full shrink-0 flex-col overflow-hidden rounded-[28px] ${t.bg} ${t.text} p-7 sm:p-10 lg:h-[78vh] lg:min-h-0 lg:w-[78vw] lg:max-w-[1180px] lg:p-14`}>
      <div className={`pointer-events-none absolute -bottom-[6vw] -right-[2vw] select-none font-deva text-[clamp(8rem,22vw,20rem)] leading-none opacity-[0.06]`}>{o.hindi}</div>
      <div className="flex items-start justify-between">
        <span className={`font-display text-7xl leading-none sm:text-8xl ${t.accent}`}>{o.no}</span>
        <span className={`eyebrow ${t.sub}`}>Offering {o.no} / 03</span>
      </div>
      <div className="relative mt-auto grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
        <div>
          <h3 className="font-display text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.95] tracking-[-0.02em]">{o.title}</h3>
          <p className={`mt-4 font-display text-2xl italic sm:text-3xl ${t.accent}`}>{o.line}</p>
          <p className={`mt-6 max-w-xl leading-relaxed ${t.sub}`}>{o.body}</p>
          <ul className={`mt-8 grid max-w-xl grid-cols-1 border-t sm:grid-cols-2 ${t.line}`}>
            {o.points.map((p) => (
              <li key={p} className={`flex items-center gap-3 border-b py-3 text-sm ${t.line}`}>
                <span className={`h-1.5 w-1.5 rounded-full bg-current ${t.accent}`} />
                {p}
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink(`Namaste! I'm interested in ${o.title}.`)}
            target="_blank"
            rel="noreferrer"
            className={`mt-8 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors ${t.btn}`}
          >
            {o.cta} →
          </a>
        </div>
        <div className="mx-auto hidden aspect-square w-full max-w-[360px] sm:block">
          <Motif kind={o.motif} stroke={t.stroke} />
        </div>
      </div>
    </article>
  );
}

export function Offerings() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%']);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const wide = window.matchMedia('(min-width: 1024px)').matches;
      setDistance(wide ? Math.max(0, track.scrollWidth - window.innerWidth) : 0);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const pinned = distance > 0;

  return (
    <section id="offerings" ref={ref} className="relative bg-night" style={{ height: pinned ? `calc(100vh + ${distance}px)` : undefined }}>
      <div className={pinned ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden' : 'py-24'}>
        <div className="container-x mb-8 flex items-end justify-between gap-6 lg:mb-10">
          <div>
            <FadeUp>
              <p className="eyebrow mb-4 text-gold">What we offer</p>
            </FadeUp>
            <MaskLines lines={['Three branches,', <span className="italic text-gold">one tree.</span>]} className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.02em] text-bone" />
          </div>
          {pinned && (
            <div className="hidden w-56 lg:block">
              <div className="h-px w-full bg-white/10">
                <motion.div style={{ width: progress }} className="h-px bg-gold" />
              </div>
              <p className="eyebrow mt-3 text-bone/40">Keep scrolling</p>
            </div>
          )}
        </div>
        <motion.div ref={trackRef} style={{ x: pinned ? x : 0 }} className="flex flex-col gap-5 px-5 sm:px-8 lg:w-max lg:flex-row lg:gap-8 lg:px-14">
          {OFFERINGS.map((o, i) => (
            <Panel key={o.no} o={o} i={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
