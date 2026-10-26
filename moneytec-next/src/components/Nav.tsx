import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NAV, wa } from '../data';

export function Wordmark({ dark = true }: { dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[19px] font-semibold tracking-[-0.03em] ${dark ? 'text-white' : 'text-coal'}`}>
      <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-gradient-to-br from-[#FF9F0A] via-[#FF375F] to-[#BF5AF2] text-[13px] font-bold text-white">₹</span>
      moneytec
    </span>
  );
}

/**
 * Two bars, Apple-style: a thin global bar, then a sticky "product" bar with the page's
 * sections and the one action. The product bar turns frosted once you scroll.
 */
export function Nav() {
  const [frosted, setFrosted] = useState(false);
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    setFrosted(y > 44);
    // match the bar to whatever section is passing underneath it (sections marked data-dark)
    const under = [...document.querySelectorAll<HTMLElement>('[data-dark]')].some((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= 52 && r.bottom > 52;
    });
    setDark(under);
  });
  useEffect(() => {
    // Keep page scrolling available so menu anchors work on mobile browsers.
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const resize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('keydown', close);
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('keydown', close); window.removeEventListener('resize', resize); };
  }, [open]);

  return (
    <>
      <div className="site-utility relative z-50 h-11 bg-[#161617]/95 text-[12px] text-white/80">
        <div className="wrap-wide flex h-full items-center justify-between">
          <span>Goal-based SIPs, insurance and NRI investing · with Gulshan Kohli</span>
          <a href={wa('Hi Gulshan! I have a question.')} target="_blank" rel="noreferrer" className="hover:text-white">Chat ↗</a>
        </div>
      </div>
      <div
        className={`sticky top-0 z-40 transition-colors duration-500 ${
          !frosted ? 'bg-transparent' : dark ? 'border-b border-white/10 bg-black/70 backdrop-blur-xl backdrop-saturate-150' : 'border-b border-black/10 bg-white/75 backdrop-blur-xl backdrop-saturate-150'
        }`}
      >
        <div className={`wrap-wide flex h-[52px] items-center justify-between transition-colors duration-500 ${!frosted || dark ? 'text-white' : 'text-coal'}`}>
          <a href="#top" className="text-[21px] font-semibold tracking-[-0.03em]"><Wordmark dark={!frosted || dark} /></a>
          <div className="flex items-center gap-5">
            <nav aria-label="Sections" className="hidden items-center gap-6 text-[12px] md:flex">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className="opacity-80 transition-opacity hover:opacity-100">{n.label}</a>
              ))}
            </nav>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close sections menu' : 'Open sections menu'} aria-expanded={open} aria-controls="local-menu" className="min-h-11 px-2 text-[12px] opacity-80 md:hidden">
              {open ? 'Close' : 'Sections'}
            </button>
            <a href="#start" onClick={() => setOpen(false)} className="inline-flex h-7 items-center rounded-full bg-link px-3 text-[12px] font-normal text-white hover:bg-[#0077ED]">Get started</a>
          </div>
        </div>
          {open && createPortal(<>
            <button type="button" className="menu-backdrop" aria-label="Close sections menu" onClick={() => setOpen(false)} />
            <nav
              id="local-menu"
              aria-label="Sections"
              className="mobile-section-menu border-b border-black/10 bg-white text-coal md:hidden"
            >
              <div className="wrap-wide flex flex-col py-2">
                {NAV.map((n) => (
                  <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-black/5 py-3 text-[17px] text-coal last:border-0">{n.label}</a>
                ))}
              </div>
            </nav>
            </>, document.body)}
      </div>
    </>
  );
}
