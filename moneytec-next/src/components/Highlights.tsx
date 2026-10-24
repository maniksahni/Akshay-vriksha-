import { useEffect, useRef, useState } from 'react';
import { wa } from '../data';

const CARDS = [
  {
    title: 'SIPs from ₹500 a month.',
    body: 'Goal-based, matched to your timeline and your comfort with risk.',
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
    body: 'Term plans via Kotak Life, so your family is sorted no matter what.',
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
    body: 'Earning in $, £ or AED? NRE/NRO investing, mostly online, on your time zone.',
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
    title: 'Save tax, the smart way.',
    body: 'ELSS funds under Section 80C (old regime), with the shortest lock-in: 3 years.',
    bg: 'from-[#3a1d0b] to-[#000]',
    art: (
      <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden>
        <defs><linearGradient id="h4" x1="0" x2="1"><stop offset="0" stopColor="#FFD60A" /><stop offset="1" stopColor="#FF9F0A" /></linearGradient></defs>
        <text x="100" y="92" textAnchor="middle" fontSize="70" fontWeight="800" fill="url(#h4)" fontFamily="Inter, sans-serif" letterSpacing="-4">80C</text>
      </svg>
    ),
  },
  {
    title: 'A check-up, every year.',
    body: 'Already investing? We look for overlap, idle money and forgotten SIPs.',
    bg: 'from-[#2a0f3a] to-[#000]',
    art: (
      <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden>
        <defs><linearGradient id="h5" x1="0" x2="1"><stop offset="0" stopColor="#BF5AF2" /><stop offset="1" stopColor="#FF375F" /></linearGradient></defs>
        <path d="M10 80h40l14-34 22 70 18-52 12 16h74" fill="none" stroke="url(#h5)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/** "Get the highlights": a snap carousel that auto-advances, with play/pause and dots. */
export function Highlights() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  const goTo = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0, dist = Infinity;
      [...el.children].forEach((c, i) => {
        const e = c as HTMLElement;
        const d = Math.abs(e.offsetLeft - el.offsetLeft + e.clientWidth / 2 - mid);
        if (d < dist) { dist = d; best = i; }
      });
      setActive(best);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // auto-advance only while the carousel is on screen
  useEffect(() => {
    if (!playing) return;
    const el = track.current;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.4 });
    if (el) io.observe(el);
    const id = setInterval(() => { if (visible) goTo((active + 1) % CARDS.length); }, 4500);
    return () => { clearInterval(id); io.disconnect(); };
  }, [playing, active]);

  return (
    <section id="highlights" className="bg-snow py-16 sm:py-24">
      <div className="wrap-wide">
        <h2 className="display text-[clamp(2rem,4.6vw,3.5rem)]">Get the highlights.</h2>
      </div>
      <div ref={track} className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:px-[max(2rem,calc((100vw-1260px)/2+2rem))]">
        {CARDS.map((c, i) => (
          <article key={c.title} className={`relative flex h-[440px] w-[82vw] max-w-[380px] shrink-0 snap-center flex-col overflow-hidden rounded-[28px] bg-gradient-to-b ${c.bg} p-7 text-white sm:h-[520px] sm:w-[60vw] sm:max-w-[680px] sm:p-10`}>
            <p className="text-[24px] font-semibold leading-tight tracking-[-0.03em] sm:text-[32px]">{c.title}</p>
            <p className="mt-2 max-w-sm text-[15px] leading-snug text-white/65 sm:text-[17px]">{c.body}</p>
            <div className="mt-auto h-[46%] w-full">{c.art}</div>
            <a href={wa(`Hi Gulshan! Tell me more: ${c.title}`)} target="_blank" rel="noreferrer" className="textlink-dark mt-4 text-[15px]">Ask about this ›</a>
            <span className="sr-only">{i + 1} of {CARDS.length}</span>
          </article>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-mist/80 px-4 py-3" role="tablist" aria-label="Highlights">
          {CARDS.map((c, i) => (
            <button key={c.title} role="tab" aria-selected={i === active} aria-label={`Show highlight ${i + 1}`} onClick={() => { setPlaying(false); goTo(i); }} className={`h-2 rounded-full transition-all duration-500 ${i === active ? 'w-8 bg-coal' : 'w-2 bg-graphite/60'}`} />
          ))}
        </div>
        <button onClick={() => setPlaying((v) => !v)} aria-label={playing ? 'Pause highlights' : 'Play highlights'} className="grid h-11 w-11 place-items-center rounded-full bg-mist/80 text-coal">
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
      </div>
    </section>
  );
}
