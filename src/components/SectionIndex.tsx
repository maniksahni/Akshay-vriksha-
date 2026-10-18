import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { NAV } from '../data/site';
import { scrollToHash } from '../lib/smooth';

/** Fixed chapter rail on the right edge: shows where you are and jumps anywhere. */
export function SectionIndex({ show }: { show: boolean }) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const els = NAV.map((n) => document.querySelector(n.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <motion.nav
      aria-label="Sections"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 mix-blend-difference xl:block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: show ? 1 : 0, x: show ? 0 : 20 }}
      transition={{ duration: 0.8 }}
    >
      <ul className="flex flex-col items-end gap-3">
        {NAV.map((n, i) => {
          const on = active === n.href;
          return (
            <li key={n.href}>
              <a
                href={n.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash(n.href);
                }}
                className="group flex items-center gap-3 text-bone"
                aria-current={on ? 'true' : undefined}
              >
                <span className={`text-[10px] uppercase tracking-[0.2em] transition-all duration-500 translate-x-2 opacity-0 group-hover:translate-x-0 ${on ? 'group-hover:opacity-100' : 'group-hover:opacity-70'}`}>
                  {String(i + 1).padStart(2, '0')} {n.label}
                </span>
                <span className={`block h-px transition-all duration-500 ${on ? 'w-10 bg-bone' : 'w-4 bg-bone/40 group-hover:w-6'}`} />
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
