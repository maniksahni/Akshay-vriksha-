import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { NAV, wa } from '../data';
import { Logo } from './Logo';
import { EASE } from './ui';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 24));

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <div className={`mx-auto flex h-14 max-w-[1280px] items-center justify-between rounded-full border px-3 pl-4 transition-all duration-500 ${solid || open ? 'border-line bg-void/85 backdrop-blur-xl' : 'border-transparent bg-transparent'}`}>
          <a href="#top" aria-label="moneytec home" onClick={() => setOpen(false)}>
            <Logo />
          </a>
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="rounded-full px-4 py-2 text-sm text-chalk/70 transition-colors hover:bg-white/5 hover:text-chalk">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#start" className="btn-lime hidden h-10 px-5 text-sm sm:inline-flex">Let’s talk →</a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-[2px] w-4 bg-chalk transition-all ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-[2px] w-4 bg-chalk transition-all ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="fixed inset-0 z-40 flex flex-col bg-void px-5 pb-8 pt-24 lg:hidden"
            initial={{ clipPath: 'circle(0% at 92% 6%)' }}
            animate={{ clipPath: 'circle(150% at 92% 6%)' }}
            exit={{ clipPath: 'circle(0% at 92% 6%)' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {NAV.map((n, i) => (
              <motion.a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-line py-4 font-display text-3xl font-extrabold tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, ease: EASE }}
              >
                {n.label} <span className="text-lg text-lime">↗</span>
              </motion.a>
            ))}
            <a href={wa('Hey! I want to start a SIP.')} target="_blank" rel="noreferrer" className="btn-lime mt-auto w-full">
              Slide into WhatsApp →
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

/** Phones: a sticky action bar once the hero has scrolled away. */
export function MobileBar() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => {
    const contact = document.getElementById('start');
    const atContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.7 && contact.getBoundingClientRect().bottom > 0 : false;
    setShow(y > window.innerHeight * 0.7 && !atContact);
  });
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        >
          <div className="flex gap-2 rounded-full border border-line bg-void/90 p-1.5 backdrop-blur-xl">
            <a href="#start" className="btn-lime h-12 flex-1">Start my SIP →</a>
            <a href="#glow-up" className="btn-ghost h-12 px-4 text-sm">Calculator</a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
