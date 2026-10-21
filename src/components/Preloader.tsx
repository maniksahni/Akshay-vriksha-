import { motion, AnimatePresence, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/smooth';
import { EASE } from './ui/motion';

/** Seed-to-sapling intro: a counter runs while a Sanskrit wordmark writes itself, then the curtain lifts. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShow(false);
      onDone();
      return;
    }
    const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve();
    const c = animate(0, 100, { duration: 2.1, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => setCount(Math.round(v)) });
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setShow(false);
      setTimeout(onDone, 350);
    };
    Promise.all([c.then(() => undefined), fontsReady]).then(finish);
    // never hold the page hostage: a throttled tab or a slow font must not keep the curtain down
    const failsafe = setTimeout(finish, 4500);
    return () => {
      c.stop();
      clearTimeout(failsafe);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <div className="relative overflow-hidden">
            <motion.p
              className="font-deva text-gold text-[clamp(3rem,10vw,7.5rem)] leading-none"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 1.8, ease: EASE, delay: 0.15 }}
            >
              अक्षयवृक्षः
            </motion.p>
          </div>
          <motion.p
            className="eyebrow mt-6 text-bone/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            AkshayVriksha · The inexhaustible tree
          </motion.p>
          <div className="absolute bottom-8 left-5 right-5 flex items-end justify-between sm:left-10 sm:right-10">
            <span className="eyebrow text-bone/40">Planting a seed</span>
            <span className="font-display text-6xl tabular-nums text-bone sm:text-8xl">{count}</span>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-gold"
            style={{ width: `${count}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
