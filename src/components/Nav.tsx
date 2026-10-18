import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CONTACT, NAV, whatsappLink } from '../data/site';
import { lockScroll, scrollToHash } from '../lib/smooth';
import { EASE, Magnetic } from './ui/motion';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M16 29V13M16 19l-6-6M16 16l6-6M16 23l5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="10" cy="12" r="2.2" fill="#D9AE5B" />
      <circle cx="22.4" cy="9.4" r="2.2" fill="#D9AE5B" />
      <circle cx="16" cy="10.2" r="2.4" fill="#E9CD8F" />
      <circle cx="21.4" cy="18.6" r="1.6" fill="#D9AE5B" />
    </svg>
  );
}

export function Nav({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400 && !open);
    setSolid(y > 40);
  });

  useEffect(() => {
    lockScroll(open);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => scrollToHash(href), open ? 450 : 0);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: ready && !hidden ? 0 : -100 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div
          className={`transition-colors duration-500 ${solid && !open ? 'bg-night/70 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}
        >
          <div className="container-x flex h-[72px] items-center justify-between">
            <a href="#top" onClick={(e) => { e.preventDefault(); go('#top'); }} className="flex items-center gap-2.5 text-bone" aria-label="Akshaya Vriksha home">
              <Logo className="h-8 w-8" />
              <span className="font-display text-[22px] leading-none tracking-tight">Akshaya Vriksha</span>
            </a>
            <div className="flex items-center gap-3">
              <span className="hidden eyebrow text-bone/40 xl:inline">AMFI-registered MFD · {CONTACT.arn}</span>
              <Magnetic className="hidden sm:inline-block">
                <a
                  href={whatsappLink('Namaste! I would like to book a consultation with Akshaya Vriksha.')}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-night transition-colors hover:bg-gold-soft"
                >
                  Book a call
                </a>
              </Magnetic>
              <button
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
            id="site-menu"
            aria-label="Site"
            className="fixed inset-0 z-40 overflow-y-auto bg-forest"
            initial={{ clipPath: 'circle(0% at calc(100% - 70px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 70px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 70px) 36px)' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="pointer-events-none absolute -bottom-10 right-0 select-none font-deva text-[38vw] leading-none text-white/[0.03]">वृक्ष</div>
            <div className="container-x grid min-h-full gap-12 pb-12 pt-28 lg:grid-cols-[1.4fr_1fr] lg:pt-36">
              <ul className="space-y-1">
                {NAV.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); go(item.href); }}
                      className="group flex items-baseline gap-5 py-1 font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.02] text-bone transition-colors hover:text-gold"
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.05 }}
                    >
                      <span className="font-sans text-xs tabular-nums text-bone/30 group-hover:text-gold">0{i + 1}</span>
                      <span className="transition-transform duration-500 group-hover:translate-x-3 group-hover:italic">{item.label}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
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
