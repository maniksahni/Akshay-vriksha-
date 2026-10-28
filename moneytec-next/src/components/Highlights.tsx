import { motion, useScroll, useTransform } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { wa } from '../data';
import { EASE, spotlight, Title, useMobile } from './ui';

/** Each service gets a small living illustration: lines draw, nodes pulse, nothing loud. */
const ART = {
  build: (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs><linearGradient id="a1" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stopColor="#FF9F0A" /><stop offset="1" stopColor="#BF5AF2" /></linearGradient></defs>
      {[22, 34, 48, 66, 88, 116, 140].map((h, i) => (
        <motion.rect key={i} x={12 + i * 32} width="20" rx="6" fill="url(#a1)" initial={{ height: 0, y: 156 }} whileInView={{ height: h, y: 156 - h }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE, delay: 0.1 + i * 0.07 }} opacity={0.35 + i * 0.1} />
      ))}
      <path d="M22 130 C 80 120, 140 80, 226 14" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" className="dash-flow" />
    </svg>
  ),
  protect: (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs><linearGradient id="a2" x1="0" x2="1"><stop offset="0" stopColor="#64D2FF" /><stop offset="1" stopColor="#BF5AF2" /></linearGradient></defs>
      {[70, 52, 34].map((r, i) => <circle key={r} cx="120" cy="82" r={r} fill="none" stroke="url(#a2)" strokeOpacity={0.15 + i * 0.15} strokeDasharray="3 6" className={i === 0 ? 'spin-slow origin-center' : ''} style={{ transformBox: 'fill-box' }} />)}
      <motion.path d="M120 30 158 44v30c0 24-17 40-38 50-21-10-38-26-38-50V44Z" fill="rgba(100,210,255,0.08)" stroke="url(#a2)" strokeWidth="3" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} />
      <motion.path d="m104 78 12 12 22-26" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE, delay: 0.9 }} />
    </svg>
  ),
  connect: (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs><linearGradient id="a3" x1="0" x2="1"><stop offset="0" stopColor="#5BF0B5" /><stop offset="1" stopColor="#64D2FF" /></linearGradient></defs>
      <circle cx="120" cy="80" r="62" fill="none" stroke="url(#a3)" strokeWidth="2" />
      <ellipse cx="120" cy="80" rx="26" ry="62" fill="none" stroke="url(#a3)" strokeOpacity=".6" />
      <path d="M58 80h124M66 52h108M66 108h108" stroke="url(#a3)" strokeOpacity=".45" />
      <path d="M30 40 Q 120 -10 210 46" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" className="dash-flow" />
      <circle cx="30" cy="40" r="4" fill="#5BF0B5" /><circle cx="210" cy="46" r="4" fill="#64D2FF" />
    </svg>
  ),
  understand: (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs><linearGradient id="a4" x1="0" x2="1"><stop offset="0" stopColor="#FFD60A" /><stop offset="1" stopColor="#FF9F0A" /></linearGradient></defs>
      <motion.path d="M56 34h52l12 9 12-9h52v92h-52l-12 9-12-9H56Z M120 43v92" fill="none" stroke="url(#a4)" strokeWidth="2.5" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }} />
      {[56, 72, 88, 104].map((y, i) => <motion.path key={y} d={`M70 ${y}h34 M136 ${y}h34`} stroke="#fff" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.8 + i * 0.12 }} />)}
    </svg>
  ),
  review: (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs><linearGradient id="a5" x1="0" x2="1"><stop offset="0" stopColor="#BF5AF2" /><stop offset="1" stopColor="#FF375F" /></linearGradient></defs>
      {[40, 80, 120].map((y) => <path key={y} d={`M10 ${y}H230`} stroke="#fff" strokeOpacity=".06" />)}
      <motion.path d="M10 104h40l16-40 24 78 20-60 14 20h40l16-30 40 0" fill="none" stroke="url(#a5)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: EASE }} />
      <circle cx="220" cy="72" r="6" fill="#FF375F" className="pulse-dot" />
    </svg>
  ),
};

const CARDS = [
  { tag: 'Build', art: ART.build, tint: 'from-amber/25', title: 'Start with a monthly goal.', body: 'Explore an amount and timeline. Scheme minimums vary; returns are never guaranteed.' },
  { tag: 'Protect', art: ART.protect, tint: 'from-sky/20', title: 'Life cover that has your back.', body: 'Explore life cover through Kotak Life, subject to eligibility, underwriting and policy terms.' },
  { tag: 'Connect', art: ART.connect, tint: 'from-mint/20', title: 'Invest from anywhere.', body: 'Discuss NRE/NRO requirements and available options for your country of residence.' },
  { tag: 'Understand', art: ART.understand, tint: 'from-[#FFD60A]/20', title: 'Understand before you invest.', body: 'Review the goal, time horizon, costs, risks and scheme documents with a person.' },
  { tag: 'Review', art: ART.review, tint: 'from-violet/25', title: 'Review your investments.', body: 'Organise existing SIPs and funds around your goals, timeline and comfort with risk.' },
];

function Card({ c, i, compact }: { c: (typeof CARDS)[number]; i: number; compact: boolean }) {
  return (
    <article
      onPointerMove={spotlight}
      className={`glass spot group flex shrink-0 snap-center flex-col overflow-hidden ${compact ? 'h-[290px] w-[76vw] max-w-[320px] p-5' : 'h-[min(66vh,560px)] w-[min(440px,36vw)] p-8'}`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${c.tint} to-transparent opacity-60`} />
      <div className="relative flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-dim">
        <span>0{i + 1}</span><span>{c.tag}</span>
      </div>
      <div className={`relative mx-auto w-full ${compact ? 'mt-2 h-[110px]' : 'mt-6 h-[44%]'} transition-transform duration-700 group-hover:scale-[1.04]`}>{c.art}</div>
      <div className="relative mt-auto">
        <h3 className={`font-semibold tracking-[-0.035em] ${compact ? 'text-[20px] leading-tight' : 'text-[30px] leading-[1.08]'}`}>{c.title}</h3>
        <p className={`mt-2 text-haze ${compact ? 'text-[13px] leading-snug' : 'text-[15px] leading-relaxed'}`}>{c.body}</p>
        <a href={wa(`Hi Gulshan! Tell me more: ${c.title}`)} target="_blank" rel="noreferrer" className={`link ${compact ? 'mt-3 text-[13px]' : 'mt-5'}`}>Let’s talk ↗</a>
      </div>
    </article>
  );
}

/** Laptop: the section pins and the five services glide past sideways. Phone: a swipe row. */
export function Highlights() {
  const mobile = useMobile();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useLayoutEffect(() => {
    if (mobile) return;
    const measure = () => setDist(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [mobile]);
  const { scrollYProgress: p } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(p, [0.05, 0.95], [0, -dist]);
  const bar = useTransform(p, [0.05, 0.95], [0, 1]);

  const head = (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="kicker">01 / Your financial world</p>
        <Title className="display mt-4 text-[clamp(2.4rem,5.6vw,5rem)]" text="One life. / *Many possibilities.*" />
      </div>
      <p className="lede max-w-sm">Your first SIP. Your family’s protection. Your next chapter. Start with what matters to you.</p>
    </div>
  );

  if (mobile) {
    return (
      <section id="highlights" data-dark className="py-16">
        <div className="wrap">{head}</div>
        <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
          {CARDS.map((c, i) => <Card key={c.title} c={c} i={i} compact />)}
        </div>
        <p className="wrap mt-3 text-[12px] text-dim">Swipe to explore ›</p>
      </section>
    );
  }

  return (
    <section id="highlights" data-dark ref={section} className="relative" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="wrap-wide">{head}</div>
        <motion.div ref={track} className="mt-10 flex w-max gap-5 pl-[max(2rem,calc((100vw-1320px)/2+2rem))] pr-[8vw]" style={{ x }}>
          {CARDS.map((c, i) => <Card key={c.title} c={c} i={i} compact={false} />)}
        </motion.div>
        <div className="wrap-wide mt-8 flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-dim">
          <div className="h-px flex-1 overflow-hidden bg-white/10"><motion.span className="block h-full origin-left bg-gradient-to-r from-amber via-rose to-violet" style={{ scaleX: bar }} /></div>
          <span>Keep scrolling</span>
        </div>
      </div>
    </section>
  );
}
