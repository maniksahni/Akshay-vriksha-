import { Instagram, Facebook, ArrowUpRight } from 'lucide-react';
import { SOCIALS } from '../data';

export function InstagramReels() {
  return (
    <section id="instagram" className="social-section bg-white py-14 sm:py-20" aria-labelledby="social-title">
      <div className="wrap-wide">
        <p className="eyebrow text-link">Stay connected</p>
        <h2 id="social-title" className="display mt-1 text-[clamp(2rem,4.6vw,3.3rem)]">More conversations. More clarity.</h2>
        <p className="mt-3 text-sm text-slate">Follow Gulshan on your favourite platform.</p>
        <div className="social-grid mt-7 grid gap-3 sm:grid-cols-3">
          {SOCIALS.map(s => <a key={s.name} className="social-card" href={s.href} target="_blank" rel="noreferrer">
            <span className="social-icon" aria-hidden="true">{s.icon === 'instagram' ? <Instagram /> : s.icon === 'facebook' ? <Facebook /> : <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.9 2h3.3L15 10.3 23.5 22h-6.7l-5.2-7.1L5.4 22H2l7.9-9L1.5 2h6.9l4.7 6.5L18.9 2ZM17.7 20h1.8L7.4 3.9H5.5L17.7 20Z" /></svg>}</span>
            <span><strong>{s.name}</strong><small>{s.handle}</small></span><ArrowUpRight size={19} aria-hidden="true" />
          </a>)}
        </div>
      </div>
    </section>
  );
}
