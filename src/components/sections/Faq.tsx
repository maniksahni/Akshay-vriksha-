import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { whatsappLink } from '../../data/site';
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
  const [open, setOpen] = useState<string | null>(FAQS[0].q);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');
  const topics = ['All', 'SIP', 'NRI', 'Insurance', 'Costs'];
  const matches = FAQS.filter(f => {
    const text = `${f.q} ${f.a}`.toLowerCase();
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const category = topic === 'All' || (topic === 'NRI' ? /nri|abroad|nre|nro/.test(text) : topic === 'Insurance' ? /insurance|insurer|claim/.test(f.q.toLowerCase()) : topic === 'Costs' ? /cost|paid|commission/.test(f.q.toLowerCase()) : /sip/.test(f.q.toLowerCase()));
    return category && words.every(word => text.includes(word));
  });
  return (
    <section id="faq" className="bg-bone py-24 text-ink sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <FadeUp>
            <Scramble text="Questions" className="eyebrow mb-4 text-ember" />
          </FadeUp>
          <MaskLines lines={['Clear answers,', <span className="italic text-ember">no fine print.</span>]} className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.02em]" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/60">Find answers about getting started, investment costs and ongoing support.</p>
          <a href={whatsappLink('Namaste! I have a question that I could not find in your FAQs.')} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-ember hover:underline">Ask Gulshan a question ↗</a>
        </div>
        <div>
          <div className="relative mb-4"><Search aria-hidden className="absolute left-4 top-4 h-5 w-5 text-ink/40" /><label className="sr-only" htmlFor="faq-search">Search questions and answers</label><input id="faq-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search SIP, documents, costs…" className="min-h-14 w-full rounded-2xl border border-ink/20 bg-paper py-3 pl-12 pr-12 text-base placeholder:text-ink/45" />{query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5"><X size={17} /></button>}</div>
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Question topics">{topics.map(t => <button type="button" key={t} aria-pressed={topic === t} onClick={() => setTopic(t)} className={`min-h-10 rounded-full border px-4 text-xs transition-colors ${topic === t ? 'border-ink bg-ink text-bone' : 'border-ink/15 text-ink/65 hover:border-ember'}`}>{t}</button>)}</div>
          <p role="status" aria-live="polite" className="mb-3 text-xs text-ink/50">{matches.length} {matches.length === 1 ? 'answer' : 'answers'}{query ? ` for “${query}”` : ''}</p>
          <div className="border-t border-ink/15">
          {matches.map((f) => {
            const isOpen = open === f.q;
            const i = FAQS.indexOf(f);
            return (
              <div key={f.q} className="border-b border-ink/15">
                <button
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                  onClick={() => setOpen(isOpen ? null : f.q)}
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
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 leading-relaxed text-ink/65">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {matches.length === 0 && <div className="rounded-2xl bg-paper p-6"><p className="font-display text-2xl">Let’s find that answer.</p><p className="mt-2 text-sm text-ink/60">Try another word or clear the filters to see every question.</p><button type="button" onClick={() => { setQuery(''); setTopic('All'); }} className="mt-4 min-h-11 rounded-full bg-ink px-5 text-sm text-bone">Show all answers</button></div>}
          </div>
        </div>
      </div>
    </section>
  );
}
