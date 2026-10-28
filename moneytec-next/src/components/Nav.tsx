import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FACTS, NAV, wa } from '../data';
import { EASE } from './ui';

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[18px] font-semibold tracking-[-0.035em] text-paper ${className}`}>
      <img src="./brand/moneytec-symbol.svg" width="26" height="24" alt="" />
      moneytec
    </span>
  );
}

/** A floating glass pill: logo, the sections, one action. It tucks away while you read and returns when you scroll back up. */
export function Nav() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 24);
    setHidden(y > 600 && y > prev + 2 && !open);
    if (y < prev - 2) setHidden(false);
    const hit = NAV.map((n) => document.querySelector<HTMLElement>(n.href)).filter(Boolean).reverse().find((s) => s!.getBoundingClientRect().top < window.innerHeight * 0.4);
    setCurrent(hit ? `#${hit.id}` : '');
  });
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const resize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener('keydown', esc);
    window.addEventListener('resize', resize);
    window.dispatchEvent(new CustomEvent('moneytec:menu', { detail: open }));
    return () => { window.removeEventListener('keydown', esc); window.removeEventListener('resize', resize); };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
        animate={{ y: hidden ? -90 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className={`mx-auto flex h-14 max-w-[1180px] items-center justify-between rounded-full border pl-4 pr-2 transition-all duration-500 sm:pl-5 ${solid || open ? 'border-white/10 bg-ink/70 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl backdrop-saturate-150' : 'border-transparent bg-transparent'}`}>
          <a href="#top" aria-label="moneytec home" onClick={() => setOpen(false)}><Wordmark /></a>
          <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className={`relative rounded-full px-3.5 py-2 text-[13px] transition-colors ${current === n.href ? 'text-paper' : 'text-haze hover:text-paper'}`}>
                {current === n.href && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/[0.08]" transition={{ duration: 0.5, ease: EASE }} />}
                <span className="relative">{n.label}</span>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <a href="#start" onClick={() => setOpen(false)} className="btn-glow h-10 px-4 text-[13px]">Get started</a>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close sections menu' : 'Open sections menu'} aria-expanded={open} aria-controls="local-menu" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden">
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 top-0 h-[1.5px] w-4 bg-paper transition-transform duration-300 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
                <span className={`absolute bottom-0 left-0 h-[1.5px] w-4 bg-paper transition-transform duration-300 ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>
      <motion.div className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-amber via-rose to-violet" style={{ scaleX: scrollYProgress }} aria-hidden />

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.nav
              id="local-menu"
              aria-label="Sections"
              className="menu-sheet fixed inset-0 z-40 flex flex-col px-6 pb-8 pt-24 lg:hidden"
              initial={{ clipPath: 'circle(0% at 92% 6%)' }}
              animate={{ clipPath: 'circle(150% at 92% 6%)' }}
              exit={{ clipPath: 'circle(0% at 92% 6%)' }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="flex flex-col">
                {NAV.map((n, i) => (
                  <motion.a
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-white/[0.07] py-3.5 text-[30px] font-semibold tracking-[-0.04em]"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.12 + i * 0.04 }}
                  >
                    <span className="text-[11px] font-medium tracking-[0.2em] text-dim">0{i + 1}</span>
                    {n.label}
                  </motion.a>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-3 pt-6">
                <a href={wa('Hi Gulshan! I have a question.')} target="_blank" rel="noreferrer" className="btn-light">Chat on WhatsApp ↗</a>
                <a href={`tel:+${FACTS.phoneIntl}`} className="btn-ghost">Call {FACTS.phone}</a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
