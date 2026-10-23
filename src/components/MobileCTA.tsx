import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { whatsappLink } from '../data/site';
import { scrollToHash } from '../lib/smooth';

/**
 * Phones and tablets: a booking bar pinned to the bottom once the hero is behind you.
 * It steps aside while the contact section itself is on screen.
 */
export function MobileCTA({ ready }: { ready: boolean }) {
  const { scrollY } = useScroll();
  const [past, setPast] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setPast(y > window.innerHeight * 0.8));

  useEffect(() => {
    const el = document.getElementById('contact');
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = ready && past && !atContact;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="mobile-actions fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        >
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-night p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <button
              onClick={() => scrollToHash('#contact')}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gold text-sm font-semibold text-night active:scale-[0.98]"
            >
              Book a call
              <span aria-hidden>→</span>
            </button>
            <button type="button" onClick={() => scrollToHash('#compounding')} className="h-12 rounded-full border border-white/15 px-4 text-xs font-medium text-bone hover:border-gold">SIP calculator</button>
            <a
              href={whatsappLink('Namaste! I have a question for AkshayVriksha.')}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
              className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                <path d="M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.38 9.38 0 0 1 9.43 9.44c0 5.2-4.24 9.43-9.44 9.43M20.08 3.9A11.3 11.3 0 0 0 12.05.58C5.8.58.7 5.67.7 11.93c0 2 .52 3.95 1.52 5.67L.6 23.5l6.04-1.58a11.3 11.3 0 0 0 5.4 1.38h.01c6.26 0 11.35-5.1 11.35-11.36 0-3.03-1.18-5.88-3.32-8.03M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35" />
              </svg>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
