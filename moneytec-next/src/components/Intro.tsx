import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { RUPEE_PATH } from './rupeePath';
import { EASE, reduced } from './ui';

const KEY = 'moneytec:intro-seen';
const seen = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; } };

/** True once the opening curtain has lifted (immediately when there is no curtain). */
export function useIntroDone() {
  const [done, setDone] = useState(() => typeof window === 'undefined' || (window as Window & { __mtIntroDone?: boolean }).__mtIntroDone === true);
  useEffect(() => {
    if (done) return;
    const on = () => setDone(true);
    if ((window as Window & { __mtIntroDone?: boolean }).__mtIntroDone) on(); // the curtain lifted before we listened
    window.addEventListener('moneytec:intro-done', on);
    return () => window.removeEventListener('moneytec:intro-done', on);
  }, [done]);
  return done;
}

const finish = () => {
  (window as Window & { __mtIntroDone?: boolean }).__mtIntroDone = true;
  window.dispatchEvent(new Event('moneytec:intro-done'));
};

/** A short opening: the ₹ draws itself while a counter runs, then the curtain lifts. Once per visit, skippable. */
export function Intro() {
  const [show, setShow] = useState(() => !seen() && !reduced());
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!show) { finish(); return; }
    try { sessionStorage.setItem(KEY, '1'); } catch { /* private mode */ }
    document.documentElement.style.overflow = 'hidden';
    const t0 = performance.now(), D = 1500;
    let raf = requestAnimationFrame(function tick(now) {
      const k = Math.min(1, (now - t0) / D);
      setN(Math.round((1 - Math.pow(1 - k, 3)) * 100));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setShow(false), 280);
    });
    const skip = () => setShow(false);
    window.addEventListener('keydown', skip);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', skip); };
  }, [show]);

  return (
    <AnimatePresence onExitComplete={() => { document.documentElement.style.overflow = ''; finish(); }}>
      {show && (
        <motion.div
          key="intro"
          aria-hidden
          onClick={() => setShow(false)}
          className="intro fixed inset-0 z-[90] grid cursor-pointer place-items-center bg-ink"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="aurora opacity-25" />
          <div className="relative flex flex-col items-center">
            <svg viewBox="118 68 186 275" className="h-[22vh] min-h-[140px] overflow-visible">
              <defs>
                <linearGradient id="intro-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFD688" /><stop offset=".45" stopColor="#FF375F" /><stop offset="1" stopColor="#BF5AF2" /></linearGradient>
              </defs>
              <motion.path d={RUPEE_PATH} fill="none" stroke="url(#intro-g)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3, ease: EASE }} />
              <motion.path d={RUPEE_PATH} fill="url(#intro-g)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.05 }} />
            </svg>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.4em] text-dim">Moneytec — Money, with meaning</p>
          </div>
          <p className="intro-count absolute bottom-6 right-6 font-semibold tabular-nums tracking-[-0.06em] text-paper sm:bottom-8 sm:right-10">{String(n).padStart(3, '0')}</p>
          <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber via-rose to-violet" style={{ width: `${n}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
