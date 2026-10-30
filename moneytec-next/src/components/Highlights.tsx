import { TrendingUp, ShieldCheck, Globe2, BookOpen, ScanLine } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { motion } from 'framer-motion';
import { wa } from '../data';
import { EASE, FadeIn, spotlight, Title, untilt } from './ui';

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

const SERVICE_ICONS = [<TrendingUp key="build" />, <ShieldCheck key="protect" />, <Globe2 key="connect" />, <BookOpen key="understand" />, <ScanLine key="review" />];

/** A direct next step after the landing: five services, visible together rather than a pinned carousel. */
export function Highlights() {
  return (
    <section id="highlights" data-dark className="expertise-section">
      <div className="wrap-wide">
        <div className="expertise-heading">
          <div><p className="kicker">01 / Built around your life</p><Title className="display expertise-title" text="Your priorities. / *A clearer path.*" /></div>
          <div className="expertise-heading-aside"><p>Build for tomorrow. Protect what matters today. Start with the conversation that feels right for you.</p><a href="#calculator" onClick={()=>window.dispatchEvent(new Event('moneytec:plan-goal'))}>Find my starting point <span aria-hidden="true">↗</span></a></div>
        </div>
        <div className="expertise-grid">
          {CARDS.map((c,i)=><FadeIn key={c.tag} className={`expertise-tile expertise-tile-${i}`} delay={i*.05}>
            <article className="spot" onPointerMove={spotlight} onPointerLeave={untilt}>
              <div className="expertise-topline"><span>0{i+1} / {c.tag}</span>{c.tag === 'Protect' ? <BrandLogo brand="kotak" /> : <span aria-hidden="true">↗</span>}</div>
              <div className="expertise-illustration">{c.art}</div>
              <div className="expertise-copy"><h3>{c.title}</h3><p>{c.body}</p><a href={i === 0 ? '#calculator' : wa(`Hi Gulshan! Tell me more: ${c.title}`)} onClick={i === 0 ? () => window.dispatchEvent(new Event('moneytec:plan-sip')) : undefined} {...(i === 0 ? {} : {target:'_blank', rel:'noreferrer'})}>{['Plan my SIP','Explore life cover','Discuss NRI investing','Get some clarity','Review my portfolio'][i]} <span aria-hidden="true">↗</span></a></div>
            </article>
          </FadeIn>)}
        </div>
        <div className="expertise-phone">
          {CARDS.map((c,i)=><details key={c.tag} className="expertise-disclosure">
            <summary><span className="expertise-summary-icon" aria-hidden="true">{SERVICE_ICONS[i]}</span><span><small>0{i+1} / {c.tag}</small><strong>{c.title}</strong></span><span className="expertise-summary-plus" aria-hidden="true">+</span></summary>
            <div className="expertise-disclosure-body">{c.tag==='Protect' && <BrandLogo brand="kotak" />}<p>{c.body}</p><a href={i === 0 ? '#calculator' : wa(`Hi Gulshan! Tell me more: ${c.title}`)} onClick={i === 0 ? () => window.dispatchEvent(new Event('moneytec:plan-sip')) : undefined} {...(i === 0 ? {} : {target:'_blank', rel:'noreferrer'})}>{i === 0 ? 'Explore the SIP calculator' : 'Discuss this with Gulshan'} ↗</a></div>
          </details>)}
        </div>
        <div className="expertise-bottom"><span>A conversation first. A decision when you’re ready.</span><a href="#gulshan">Meet the person behind your plan <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
  );
}
