import { FadeIn } from './ui';
import { wa } from '../data';

const CARDS = [
  {
    title: 'Start with a monthly goal.',
    body: 'Explore an amount and timeline. Scheme minimums vary; returns are never guaranteed.',
    bg: 'from-[#1d1d1f] to-[#000]',
    art: (
      <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden>
        <defs><linearGradient id="h1" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stopColor="#FF9F0A" /><stop offset="1" stopColor="#BF5AF2" /></linearGradient></defs>
        {[18, 30, 44, 62, 84, 110].map((h, i) => <rect key={i} x={14 + i * 30} y={130 - h} width="20" height={h} rx="5" fill="url(#h1)" opacity={0.45 + i * 0.1} />)}
      </svg>
    ),
  },
  {
    title: 'Life cover that has your back.',
    body: 'Explore life cover through Kotak Life, subject to eligibility, underwriting and policy terms.',
    bg: 'from-[#0b2a4a] to-[#000]',
    art: (
      <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden>
        <defs><linearGradient id="h2" x1="0" x2="1"><stop offset="0" stopColor="#64D2FF" /><stop offset="1" stopColor="#0A84FF" /></linearGradient></defs>
        <path d="M100 12 150 30v38c0 30-22 50-50 62-28-12-50-32-50-62V30Z" fill="none" stroke="url(#h2)" strokeWidth="6" strokeLinejoin="round" />
        <path d="m78 72 16 16 30-34" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Invest from anywhere.',
    body: 'Discuss NRE/NRO requirements and available options for your country of residence.',
    bg: 'from-[#0f3a2e] to-[#000]',
    art: (
      <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden>
        <defs><linearGradient id="h3" x1="0" x2="1"><stop offset="0" stopColor="#30D158" /><stop offset="1" stopColor="#64D2FF" /></linearGradient></defs>
        <circle cx="100" cy="70" r="56" fill="none" stroke="url(#h3)" strokeWidth="5" />
        <ellipse cx="100" cy="70" rx="24" ry="56" fill="none" stroke="url(#h3)" strokeWidth="3" />
        <path d="M44 70h112M52 42h96M52 98h96" stroke="url(#h3)" strokeWidth="3" />
      </svg>
    ),
  },
  {
    title: 'Understand before you invest.',
    body: 'Review the goal, time horizon, costs, risks and scheme documents with a person.',
    bg: 'from-[#3a1d0b] to-[#000]',
    art: (
      <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden>
        <defs><linearGradient id="h4" x1="0" x2="1"><stop offset="0" stopColor="#FFD60A" /><stop offset="1" stopColor="#FF9F0A" /></linearGradient></defs>
        <path d="M45 30h45l10 8 10-8h45v80h-45l-10 8-10-8H45Z M100 38v80 M58 50h27 M58 65h27 M115 50h27 M115 65h27" fill="none" stroke="url(#h4)" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Review your investments.',
    body: 'Organise existing SIPs and funds around your goals, timeline and comfort with risk.',
    bg: 'from-[#2a0f3a] to-[#000]',
    art: (
      <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden>
        <defs><linearGradient id="h5" x1="0" x2="1"><stop offset="0" stopColor="#BF5AF2" /><stop offset="1" stopColor="#FF375F" /></linearGradient></defs>
        <path d="M10 80h40l14-34 22 70 18-52 12 16h74" fill="none" stroke="url(#h5)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/** All services stay visible in an editorial grid; motion is limited to entry and hover. */
export function Highlights() {
  return (
    <section id="highlights" data-dark className="services-editorial">
      <div className="wrap-wide">
        <div className="section-heading">
          <div><p className="section-index">01 / YOUR FINANCIAL WORLD</p><h2>One life.<br /><em>Many possibilities.</em></h2></div>
          <p>Your first SIP. Your family’s protection. Your next chapter. Start with what matters to you.</p>
        </div>
        <div className="services-grid">
          {CARDS.map((c, i) => (
            <FadeIn key={c.title} className={`service-panel service-panel-${i}`} delay={i * .05}>
              <article>
                <div className="service-topline"><span>0{i + 1}</span><span>{['BUILD','PROTECT','CONNECT','UNDERSTAND','REVIEW'][i]}</span></div>
                <div className="service-art">{c.art}</div>
                <div className="service-caption"><h3>{c.title}</h3><p>{c.body}</p><a href={wa(`Hi Gulshan! Tell me more: ${c.title}`)} target="_blank" rel="noreferrer">Let’s talk <span aria-hidden="true">↗</span></a></div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
