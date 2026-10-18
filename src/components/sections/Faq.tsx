import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { CONTACT, FAQS } from '../../data/site';
import { FadeUp, MaskLines } from '../ui/motion';
import { VelocityMarquee } from '../ui/VelocityMarquee';
import { Scramble } from '../ui/effects';

export function Marquee() {
  const items = [
    'AMFI-registered mutual fund distributor',
    CONTACT.arn,
    'Kotak Life Insurance advisor',
    CONTACT.kotak,
    'India & NRIs worldwide',
    `${CONTACT.years}+ years`,
  ];
  const dot = <svg viewBox="0 0 10 10" className="mx-10 h-2.5 w-2.5 shrink-0"><circle cx="5" cy="5" r="5" fill="currentColor" /></svg>;
  return (
    <div className="relative z-10 -my-px overflow-hidden bg-night py-10" aria-label="Credentials">
      <div className="-rotate-2 scale-105 bg-gold py-5 text-night">
        <VelocityMarquee baseVelocity={-1.5}>
          {items.map((t, i) => (
            <span key={i} className="flex items-center font-display text-3xl sm:text-4xl">{t}{dot}</span>
          ))}
        </VelocityMarquee>
      </div>
      <div className="mt-6 rotate-1 scale-105 border-y border-gold/30 py-4">
        <VelocityMarquee baseVelocity={1.2}>
          {['अक्षयवृक्षः', 'Plant', 'Nurture', 'Protect', 'Grow', 'Rest in the shade'].map((t, i) => (
            <span key={i} className={`flex items-center text-4xl sm:text-6xl ${i === 0 ? 'font-deva text-gold' : 'font-display italic text-transparent [-webkit-text-stroke:1px_rgba(217,174,91,0.7)]'}`}>
              {t}
              <span className="mx-10 text-gold">✦</span>
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-bone py-24 text-ink sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <FadeUp>
            <Scramble text="Questions" className="eyebrow mb-4 text-ember" />
          </FadeUp>
          <MaskLines lines={['Clear answers,', <span className="italic text-ember">no fine print.</span>]} className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.02em]" />
        </div>
        <div className="border-t border-ink/15">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-ink/15">
                <button
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-display text-2xl leading-tight sm:text-3xl">{f.q}</span>
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/20 transition-all duration-500 ${isOpen ? 'rotate-45 bg-ink text-bone' : ''}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 leading-relaxed text-ink/65">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
