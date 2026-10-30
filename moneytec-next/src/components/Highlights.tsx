import { TrendingUp, ShieldCheck, Globe2, BookOpen, ScanLine } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { motion } from 'framer-motion';
import { wa } from '../data';
import { EASE, Title } from './ui';

/** Each service gets a small living illustration: lines draw, nodes pulse, nothing loud. */
const ART = {
  build: (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs><linearGradient id="a1" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stopColor="#E8CFA0" /><stop offset="1" stopColor="#8E6A43" /></linearGradient></defs>
      {[22, 34, 48, 66, 88, 116, 140].map((h, i) => (
        <motion.rect key={i} x={12 + i * 32} width="20" rx="6" fill="url(#a1)" initial={{ height: 0, y: 156 }} whileInView={{ height: h, y: 156 - h }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE, delay: 0.1 + i * 0.07 }} opacity={0.35 + i * 0.1} />
      ))}
      <path d="M22 130 C 80 120, 140 80, 226 14" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" className="dash-flow" />
    </svg>
  ),
  protect: (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs><linearGradient id="a2" x1="0" x2="1"><stop offset="0" stopColor="#A8B4C2" /><stop offset="1" stopColor="#8E6A43" /></linearGradient></defs>
      {[70, 52, 34].map((r, i) => <circle key={r} cx="120" cy="82" r={r} fill="none" stroke="url(#a2)" strokeOpacity={0.15 + i * 0.15} strokeDasharray="3 6" className={i === 0 ? 'spin-slow origin-center' : ''} style={{ transformBox: 'fill-box' }} />)}
      <motion.path d="M120 30 158 44v30c0 24-17 40-38 50-21-10-38-26-38-50V44Z" fill="rgba(168,180,194,0.08)" stroke="url(#a2)" strokeWidth="3" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} />
      <motion.path d="m104 78 12 12 22-26" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE, delay: 0.9 }} />
    </svg>
  ),
  connect: (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs><linearGradient id="a3" x1="0" x2="1"><stop offset="0" stopColor="#B8C4A2" /><stop offset="1" stopColor="#A8B4C2" /></linearGradient></defs>
      <circle cx="120" cy="80" r="62" fill="none" stroke="url(#a3)" strokeWidth="2" />
      <ellipse cx="120" cy="80" rx="26" ry="62" fill="none" stroke="url(#a3)" strokeOpacity=".6" />
      <path d="M58 80h124M66 52h108M66 108h108" stroke="url(#a3)" strokeOpacity=".45" />
      <path d="M30 40 Q 120 -10 210 46" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" className="dash-flow" />
      <circle cx="30" cy="40" r="4" fill="#B8C4A2" /><circle cx="210" cy="46" r="4" fill="#A8B4C2" />
    </svg>
  ),
  understand: (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs><linearGradient id="a4" x1="0" x2="1"><stop offset="0" stopColor="#E8CFA0" /><stop offset="1" stopColor="#E8CFA0" /></linearGradient></defs>
      <motion.path d="M56 34h52l12 9 12-9h52v92h-52l-12 9-12-9H56Z M120 43v92" fill="none" stroke="url(#a4)" strokeWidth="2.5" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }} />
      {[56, 72, 88, 104].map((y, i) => <motion.path key={y} d={`M70 ${y}h34 M136 ${y}h34`} stroke="#fff" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.8 + i * 0.12 }} />)}
    </svg>
  ),
  review: (
    <svg viewBox="0 0 240 160" className="h-full w-full" aria-hidden>
      <defs><linearGradient id="a5" x1="0" x2="1"><stop offset="0" stopColor="#8E6A43" /><stop offset="1" stopColor="#C9A06A" /></linearGradient></defs>
      {[40, 80, 120].map((y) => <path key={y} d={`M10 ${y}H230`} stroke="#fff" strokeOpacity=".06" />)}
      <motion.path d="M10 104h40l16-40 24 78 20-60 14 20h40l16-30 40 0" fill="none" stroke="url(#a5)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: EASE }} />
      <circle cx="220" cy="72" r="6" fill="#C9A06A" className="pulse-dot" />
    </svg>
  ),
};

const CARDS = [
  { tag: 'Build', art: ART.build, tint: 'from-amber/25', title: 'Start with a monthly goal.', body: 'Explore an amount and timeline. Scheme minimums vary; returns are never guaranteed.' },
  { tag: 'Protect', art: ART.protect, tint: 'from-sky/20', title: 'Life cover that has your back.', body: 'Explore life cover through Kotak Life, subject to eligibility, underwriting and policy terms.' },
  { tag: 'Connect', art: ART.connect, tint: 'from-mint/20', title: 'Invest from anywhere.', body: 'Discuss NRE/NRO requirements and available options for your country of residence.' },
  { tag: 'Understand', art: ART.understand, tint: 'from-[#E8CFA0]/20', title: 'Understand before you invest.', body: 'Review the goal, time horizon, costs, risks and scheme documents with a person.' },
  { tag: 'Review', art: ART.review, tint: 'from-violet/25', title: 'Review your investments.', body: 'Organise existing SIPs and funds around your goals, timeline and comfort with risk.' },
];

const SERVICE_ICONS = [<TrendingUp key="build" />, <ShieldCheck key="protect" />, <Globe2 key="connect" />, <BookOpen key="understand" />, <ScanLine key="review" />];

const LINKS = ['Plan my SIP', 'Explore life cover', 'Discuss NRI investing', 'Get some clarity', 'Review my portfolio'];

/** One service as a full-width row: number, title, detail, action. Its illustration surfaces on hover. */
function Row({ c, i }: { c: (typeof CARDS)[number]; i: number }) {
  const first = i === 0;
  return (
    <motion.li
      className="lux-row"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease: EASE, delay: i * 0.06 }}
    >
      <a
        href={first ? '#calculator' : wa(`Hi Gulshan! Tell me more: ${c.title}`)}
        onClick={first ? () => window.dispatchEvent(new Event('moneytec:plan-sip')) : undefined}
        {...(first ? {} : { target: '_blank', rel: 'noreferrer' })}
        className="lux-row-link"
        data-cursor={LINKS[i]}
      >
        <span className="lux-row-num">0{i + 1}</span>
        <span className="lux-row-tag"><span className="lux-row-icon" aria-hidden>{SERVICE_ICONS[i]}</span>{c.tag}{c.tag === 'Protect' && <BrandLogo brand="kotak" />}</span>
        <span className="lux-row-title">{c.title}</span>
        <span className="lux-row-body">{c.body}</span>
        <span className="lux-row-cta">{LINKS[i]} <span aria-hidden>↗</span></span>
        <span className="lux-row-art" aria-hidden>{c.art}</span>
      </a>
    </motion.li>
  );
}

/** Five services as an editorial index: one ruled row each, quiet until you point at it. */
export function Highlights() {
  return (
    <section id="highlights" className="lux-section lux-services">
      <div className="wrap-wide">
        <div className="lux-head">
          <div>
            <p className="kicker">01 / Built around your life</p>
            <Title className="display lux-h2" text="Your priorities. / *A clearer path.*" />
          </div>
          <div className="lux-head-aside">
            <p>Build for tomorrow. Protect what matters today. Start with the conversation that feels right for you.</p>
            <a href="#calculator" className="link" onClick={() => window.dispatchEvent(new Event('moneytec:plan-goal'))}>Find my starting point <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <ol className="lux-rows">
          {CARDS.map((c, i) => <Row key={c.tag} c={c} i={i} />)}
        </ol>
        <div className="lux-foot"><span>A conversation first. A decision when you’re ready.</span><a href="#gulshan" className="link">Meet the person behind your plan <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
  );
}
