import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CONTACT, NAV } from '../data/site';
import { lockScroll, scrollToHash } from '../lib/smooth';
import { EASE, Magnetic } from './ui/motion';

/** The Akshaya Vriksha mark: a temple arch sheltering the inexhaustible tree, its leaves doubling as coins.
 *  Same geometry as brand-kit/svg/akshaya-vriksha-mark.svg; the trunk follows currentColor. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M11 57V31a21 21 0 0 1 42 0v26" fill="none" stroke="#D9AE5B" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M7 57h50" stroke="#D9AE5B" strokeWidth="2.4" strokeLinecap="round" />
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <path d="M32 57V27" />
        <path d="M32 45c-3.5-3.2-7-5-10.5-9.6" />
        <path d="M32 39c3.6-3.2 6.8-5.6 9.8-10.2" />
        <path d="M32 50.5c3-2.2 5.6-3.4 8.6-4.6" />
        <path d="M32 57c-2.6-2.4-6-3.4-9.4-3.4M32 57c2.6-2.4 6-3.4 9.4-3.4" strokeWidth="2" />
      </g>
      <circle cx="21" cy="33.4" r="4.1" fill="#D9AE5B" />
      <circle cx="42.4" cy="27.6" r="4.1" fill="#D9AE5B" />
      <circle cx="32" cy="23.2" r="4.6" fill="#E9CD8F" />
      <circle cx="41.6" cy="45.4" r="2.9" fill="#D9AE5B" />
    </svg>
  );
}

export function Nav({ ready }: { ready: boolean }) {
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setSolid(y > 40);
  });

  useEffect(() => {
    const unlock = lockScroll(open);
    if (open) requestAnimationFrame(() => menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') { setOpen(false); menuButton.current?.focus(); }
      if (e.key === 'Tab') {
        const links = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a, button') ?? []);
        const first = links[0];
        const last = links[links.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === menuButton.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); menuButton.current?.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); unlock(); };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => scrollToHash(href), open ? 180 : 0);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: ready ? 0 : -100 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div
          className={`transition-colors duration-500 ${solid && !open ? 'bg-night/95 border-b border-white/5' : 'bg-transparent'}`}
        >
          <div className="container-x flex h-[72px] items-center justify-between">
            <a href="#top" onClick={(e) => { e.preventDefault(); go('#top'); }} className="flex items-center gap-2.5 text-bone" aria-label="AkshayVriksha home">
              <Logo className="h-8 w-8" />
              <span className="flex flex-col gap-1"><span className="font-deva text-lg leading-none">अक्षयवृक्षः</span><span className="font-display text-lg leading-none tracking-tight">AkshayVriksha</span></span>
            </a>
            <div className="flex items-center gap-3">
              <nav aria-label="Quick navigation" className="hidden items-center gap-6 text-sm text-bone/70 xl:flex">
                {[{label: 'Start here', href: '#start'}, {label: 'Calculators', href: '#compounding'}, {label: 'FAQs', href: '#faq'}].map(item => <a key={item.href} href={item.href} onClick={event => { event.preventDefault(); go(item.href); }} className="py-3 hover:text-gold">{item.label}</a>)}
              </nav>
              <Magnetic className="hidden sm:inline-block">
                <button
                  onClick={() => go('#contact')}
                  className="inline-flex h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-night transition-colors hover:bg-gold-soft"
                >
                  Book a call
                </button>
              </Magnetic>
              <button
                ref={menuButton}
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="site-menu"
                className="group inline-flex h-11 items-center gap-3 rounded-full border border-white/15 pl-5 pr-4 text-sm font-medium text-bone transition-colors hover:border-gold/60"
              >
                <span>{open ? 'Close' : 'Menu'}</span>
                <span className="relative block h-3 w-5">
                  <span className={`absolute left-0 h-px w-5 bg-current transition-all duration-500 ${open ? 'top-1.5 rotate-45' : 'top-0.5'}`} />
                  <span className={`absolute left-0 h-px w-5 bg-current transition-all duration-500 ${open ? 'top-1.5 -rotate-45' : 'top-2.5 group-hover:w-3'}`} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            ref={menuRef}
            id="site-menu"
            aria-label="Site"
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-forest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.15 }}
          >
            <div className="pointer-events-none absolute -bottom-10 right-0 select-none font-deva text-[38vw] leading-none text-white/[0.03]">वृक्ष</div>
            <div className="container-x grid min-h-full gap-12 pb-12 pt-28 lg:grid-cols-[1.4fr_1fr] lg:pt-36">
              <div>
              <p className="eyebrow mb-5 text-gold">Explore AkshayVriksha</p>
              <a href="#start" onClick={event => { event.preventDefault(); go('#start'); }} className="mb-6 flex items-center justify-between rounded-2xl border border-gold/30 bg-gold/10 p-5 text-gold max-lg:hidden"><span><span className="block font-display text-2xl">Not sure where to start?</span><span className="mt-1 block text-xs text-bone/60">Find your next step in one tap.</span></span><span aria-hidden>↗</span></a>
              <ul className="grid grid-cols-2 gap-x-5 gap-y-1">
                {NAV.map((item, i) => (
                  <li key={item.href} className={`overflow-hidden ${"deskOnly" in item && item.deskOnly ? "max-lg:hidden" : ""}`}>
                    <motion.a
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); go(item.href); }}
                      className="group flex min-h-14 items-center gap-3 border-b border-white/10 py-3 font-display text-xl leading-tight text-bone transition-colors hover:text-gold sm:text-3xl"
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.025 }}
                    >
                      <span className="font-sans text-xs tabular-nums text-bone/30 group-hover:text-gold">{String(i + 1).padStart(2, '0')}</span>
                      <span className="transition-transform duration-500 group-hover:translate-x-3 group-hover:italic">{item.label}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
              </div>
              <motion.div
                className="flex flex-col justify-end gap-8 text-bone/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
              >
                <div>
                  <p className="eyebrow mb-3 text-gold">Talk to Gulshan</p>
                  <a href={`tel:+${CONTACT.phoneIntl}`} className="block font-display text-4xl text-bone hover:text-gold">+91 {CONTACT.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</a>
                  <a href={`mailto:${CONTACT.email}`} className="mt-1 block text-lg hover:text-gold">{CONTACT.email}</a>
                </div>
                <div>
                  <p className="eyebrow mb-3 text-gold">Visit</p>
                  <p className="text-lg">{CONTACT.address}, भारत</p>
                </div>
                <p className="font-deva text-2xl text-gold/80">अद्यैव निवेशय, श्रेयसे श्वः।</p>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
