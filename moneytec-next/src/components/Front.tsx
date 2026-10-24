import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FACTS, NAV, wa } from '../data';
import { Halftone } from './Halftone';
import { Riso, Scribble, Stamp } from './print';
import { EASE } from './ui';

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`headline inline-flex items-baseline text-[24px] leading-none tracking-[-0.06em] ${className}`}>
      <Riso amount={2}>money</Riso>
      <span>tec</span>
      <span className="ml-0.5 inline-block h-2 w-2 translate-y-[-1px] rounded-full bg-sun ring-2 ring-ink" />
    </span>
  );
}

const today = () => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()).toUpperCase();

export function Masthead() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40));
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-sm transition-shadow ${scrolled ? 'shadow-[0_4px_0_0_rgba(20,20,19,0.08)]' : ''}`}>
        <div className="wrap flex h-14 items-center justify-between gap-4">
          <a href="#top" aria-label="moneytec home" onClick={() => setOpen(false)}>
            <Wordmark />
          </a>
          <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="font-mono text-[12px] uppercase tracking-[0.12em] underline-offset-[6px] hover:underline">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#start" className="btn-pink hidden h-10 px-4 text-sm sm:inline-flex">Start a SIP →</a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-10 w-10 place-items-center border-2 border-ink bg-sun lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-[2px] w-4 bg-ink transition-all ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-[2px] w-4 bg-ink transition-all ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
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
            className="fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col overflow-y-auto border-t-2 border-ink bg-paper px-4 pb-6 pt-4 lg:hidden"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <p className="label text-ink/50">Contents</p>
            {NAV.map((n, i) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between border-b-2 border-ink py-3">
                <span className="headline text-[2.1rem]">{n.label}</span>
                <span className="font-mono text-sm">p.{String(i + 2).padStart(2, '0')}</span>
              </a>
            ))}
            <a href={wa('Hey Gulshan! I want to start a SIP.')} target="_blank" rel="noreferrer" className="btn-pink mt-auto w-full">WhatsApp Gulshan →</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export function FrontPage() {
  return (
    <section id="top" className="relative pt-14">
      {/* dateline, like the top of a newspaper */}
      <div className="border-b-2 border-ink bg-ink text-paper">
        <div className="wrap flex h-8 items-center justify-between gap-4 overflow-hidden font-mono text-[10px] uppercase tracking-[0.14em] sm:text-[11px]">
          <span className="whitespace-nowrap">Vol. 01 · No. 01</span>
          <span className="hidden whitespace-nowrap sm:inline">New Delhi · {today()}</span>
          <span className="whitespace-nowrap">{FACTS.arn} · AMFI-registered</span>
        </div>
      </div>

      <div className="wrap grid gap-6 pb-8 pt-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10 lg:pb-12 lg:pt-10">
        <div className="relative">
          <motion.p className="label text-ink/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            Today’s top story ↓
          </motion.p>
          <h1 className="headline mt-3 text-[clamp(3rem,7.6vw,7.4rem)]">
            {['You chill.', 'Your money', 'does the'].map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.06em]">
                <motion.span className="block" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.85, ease: EASE, delay: 0.1 + i * 0.09 }}>
                  {l}
                </motion.span>
              </span>
            ))}
            <span className="relative block overflow-visible pb-[0.06em]">
              <motion.span className="relative inline-block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: EASE, delay: 0.4 }}>
                <Riso amount={6}>grind.</Riso>
                <Scribble kind="circle" className="absolute -inset-x-[8%] -inset-y-[18%] h-[136%] w-[116%]" delay={1} />
                <motion.span
                  className="absolute left-[calc(100%+0.5em)] top-[0.35em] hidden whitespace-nowrap font-hand text-[0.3em] font-bold leading-none tracking-normal text-blue sm:block"
                  initial={{ opacity: 0, rotate: -8, x: -10 }}
                  animate={{ opacity: 1, rotate: -8, x: 0 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                >
                  ← literally
                  <br />
                  the whole plan
                </motion.span>
              </motion.span>
            </span>
          </h1>

          <motion.div
            className="mt-5 grid gap-4 border-t-2 border-ink pt-4 sm:grid-cols-[1.4fr_1fr]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          >
            <p className="font-serif text-[1.3rem] leading-snug sm:text-[1.5rem]">
              Goal-based SIPs, insurance that actually has your back, and investing from abroad without the headache. <span className="italic">With {FACTS.name}, a real human.</span>
            </p>
            <div className="flex flex-col gap-3 sm:items-start">
              <a href="#glow-up" className="btn-pink w-full sm:w-auto">Print my SIP receipt ↓</a>
              <a href={wa('Hey Gulshan! I want to start a SIP. Can we talk?')} target="_blank" rel="noreferrer" className="btn-paper w-full sm:w-auto">WhatsApp Gulshan ↗</a>
            </div>
          </motion.div>
        </div>

        {/* "photo" box: the halftone rupee with a caption and a stamp */}
        <motion.figure
          className="relative order-first lg:order-none"
          initial={{ opacity: 0, rotate: 2, y: 20 }}
          animate={{ opacity: 1, rotate: 1.2, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        >
          <span className="tape -left-4 -top-3 -rotate-12" aria-hidden />
          <span className="tape -right-4 -top-2 rotate-6" aria-hidden />
          <div className="boxed relative aspect-[5/4] overflow-hidden bg-paper sm:aspect-square">
            <Halftone />
            <Stamp className="absolute bottom-3 right-3 text-[11px] sm:text-[13px]" color="#141413" rotate={-9}>
              AMFI-registered · {FACTS.arn}
            </Stamp>
          </div>
          <figcaption className="mt-2 font-mono text-[11px] leading-snug text-ink/70">
            <span className="font-bold text-ink">Fig. 1</span> — ₹500 a month, seen from twenty years away. Move your cursor over it.
          </figcaption>
        </motion.figure>
      </div>

      {/* ticker tape */}
      <div className="overflow-hidden border-y-2 border-ink bg-ink py-2.5 text-sun">
        <div className="flex w-max animate-marquee font-mono text-[13px] font-bold uppercase tracking-[0.12em] sm:text-sm">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0" aria-hidden={k === 1}>
              {['SIPs from ₹500/month', 'Life + health cover', 'NRI desk open across time zones', `${FACTS.years}+ years in the game`, 'Your money stays in your name', 'Talk to a real human'].map((t) => (
                <span key={t} className="flex items-center whitespace-nowrap px-6">
                  ▲ {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
