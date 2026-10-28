import { ArrowUpRight, Facebook, Instagram, Youtube } from 'lucide-react';
import { SOCIALS } from '../data';
import { spotlight } from './ui';

const X = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden><path d="M18.9 2h3.3L15 10.3 23.5 22h-6.7l-5.2-7.1L5.4 22H2l7.9-9L1.5 2h6.9l4.7 6.5L18.9 2ZM17.7 20h1.8L7.4 3.9H5.5L17.7 20Z" /></svg>;
const ICON = { instagram: <Instagram size={22} />, facebook: <Facebook size={22} />, youtube: <Youtube size={22} />, x: <X /> } as const;

export function InstagramReels() {
  return (
    <section id="instagram" data-dark className="py-16 sm:py-24" aria-labelledby="social-title">
      <div className="wrap-wide">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">Stay connected</p>
            <h2 id="social-title" className="display mt-4 text-[clamp(2rem,4.4vw,3.6rem)]">More conversations. <span className="serif grad">More clarity.</span></h2>
          </div>
          <p className="text-[14px] text-haze">Follow Gulshan on your favourite platform.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {SOCIALS.map((s) => (
            <a key={s.name} onPointerMove={spotlight} className="glass spot group flex flex-col gap-6 p-4 sm:p-6" href={s.href} target="_blank" rel="noreferrer">
              <span className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber/30 via-rose/25 to-violet/30 text-paper">{ICON[s.icon as keyof typeof ICON]}</span>
                <ArrowUpRight size={18} className="text-dim transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" aria-hidden />
              </span>
              <span>
                <strong className="block text-[16px] font-semibold tracking-[-0.02em] sm:text-[18px]">{s.name}</strong>
                <small className="block truncate text-[12px] text-dim">{s.handle}</small>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
