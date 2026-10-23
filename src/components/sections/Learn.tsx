import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { whatsappLink } from '../../data/site';
import { lockScroll, scrollToHash } from '../../lib/smooth';
import { Scramble, Spotlight } from '../ui/effects';
import { EASE, FadeUp, MaskLines } from '../ui/motion';

// General, factual primers. Kept short and free of product recommendations.
const LESSONS = [
  {
    tag: 'Basics',
    title: 'SIP or lumpsum?',
    hindi: 'नियमित',
    teaser: 'How regular investing differs from investing a larger amount at once.',
    points: [
      'A SIP invests a fixed amount on a fixed date, every month, automatically.',
      'When markets fall, the same amount buys more units; when they rise, fewer. Over time this averages your cost, known as rupee-cost averaging.',
      'A lumpsum puts everything in at once. It can work well with a long horizon, but the entry point matters more.',
      'Have a large amount but nervous about timing? An STP can move it into equity gradually (see next card).',
    ],
  },
  {
    tag: 'Strategies',
    title: 'STP and SWP, simply',
    hindi: 'अंतरण',
    teaser: 'Two quiet tools: one to enter the market gradually, one to draw an income from it.',
    points: [
      'STP (Systematic Transfer Plan): park a lumpsum in a debt or liquid fund, then move a fixed amount into an equity fund every month.',
      'SWP (Systematic Withdrawal Plan): withdraw a fixed amount every month from your investments, useful as a retirement income.',
      'Both are automatic once set up, and both can be changed or stopped.',
      'Tax applies to the gains portion of each transfer or withdrawal, so we plan the amounts with that in mind.',
    ],
  },
  {
    tag: 'Protection',
    title: 'Term plan or ULIP?',
    hindi: 'सुरक्षा',
    teaser: 'Pure protection versus insurance mixed with investment, and when each makes sense.',
    points: [
      'A term plan is pure life cover: a large sum for your family if something happens to you, for a relatively low premium.',
      'A ULIP combines insurance with market-linked investment, with a five-year lock-in.',
      'Many families start with an adequate term cover first, then invest separately for growth.',
      'The right mix depends on your goals, liabilities and comfort. That is exactly what the first conversation is for.',
    ],
  },
  {
    tag: 'NRI',
    title: 'NRE vs NRO accounts',
    hindi: 'प्रवासी',
    teaser: 'Which account to invest from, and why it matters when you want money back abroad.',
    points: [
      'NRE: holds money earned abroad. Funds are freely repatriable, and the interest earned is tax-free in India.',
      'NRO: holds income earned in India, like rent or dividends. Interest is taxable, and repatriation has annual limits and paperwork.',
      'Mutual fund investments can be made from either. Where the money comes from decides how easily it goes back.',
      'Residents of the US and Canada can invest with only some fund houses, and we’ll show you which.',
    ],
  },
  {
    tag: 'Tax',
    title: 'ELSS and Section 80C',
    hindi: 'कर',
    teaser: 'The tax-saving mutual fund with the shortest lock-in among 80C options.',
    points: [
      'ELSS (Equity Linked Savings Scheme) is an equity mutual fund eligible for deduction under Section 80C.',
      'Investments up to ₹1.5 lakh a year (combined with other 80C items) can be deducted, under the old tax regime only.',
      'Each investment is locked in for three years, the shortest among common 80C options.',
      'Under the new tax regime, 80C deductions do not apply, so check which regime you file under first.',
    ],
  },
  {
    tag: 'Mindset',
    title: 'Why starting early wins',
    hindi: 'समय',
    teaser: 'The single biggest lever you control isn’t returns. It’s time.',
    points: [
      '₹10,000 a month for 25 years at an assumed 12% grows to roughly ₹1.9 crore. Start 5 years later and it’s about ₹1 crore.',
      'The money you invest in those first five years is small. Their growth is not.',
      'Increasing your SIP a little every year (a step-up) adds even more.',
      'Illustrations assume a constant return. Actual returns vary and losses are possible, even over longer periods.',
    ],
  },
];

export function Learn() {
  const [open, setOpen] = useState<number | null>(null);
  const lesson = open != null ? LESSONS[open] : null;

  useEffect(() => {
    const unlock = lockScroll(open != null);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); unlock(); };
  }, [open]);

  return (
    <section id="learn" className="relative overflow-hidden bg-paper py-14 text-ink lg:py-32">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Scramble text="Learn in 2 minutes" className="eyebrow mb-2 text-[10px] text-ember lg:mb-4 lg:text-[11px]" />
            <MaskLines
              lines={[<>Clarity is the first <span className="italic text-ember">return.</span></>]}
              className="max-w-3xl font-display text-[clamp(1.9rem,5vw,5rem)] leading-[0.98] tracking-[-0.02em]"
            />
          </div>
          <FadeUp delay={0.1} className="hidden lg:block">
            <p className="ml-auto max-w-md text-ink/60">Short, plain-language primers on the questions families ask us most. No jargon, no product push.</p>
          </FadeUp>
        </div>

        <div className="-mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-14 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {LESSONS.map((l, i) => (
            <FadeUp key={l.title} delay={(i % 3) * 0.06} className="w-[78vw] max-w-[340px] shrink-0 snap-center lg:w-auto lg:max-w-none">
              <Spotlight className="h-full rounded-[22px]" color="rgba(196,98,45,0.12)" tilt={4}>
                <button
                  onClick={() => setOpen(i)}
                  className="group relative flex h-full min-h-[200px] w-full flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-bone p-5 text-left transition-colors hover:border-ember/40 lg:min-h-[260px] lg:p-7"
                >
                  <span className="pointer-events-none absolute -bottom-4 -right-2 select-none font-deva text-7xl text-ink/[0.05] lg:text-8xl">{l.hindi}</span>
                  <span className="flex items-center justify-between">
                    <span className="rounded-full border border-ember/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-ember">{l.tag}</span>
                    <span className="text-[11px] text-ink/40">0{i + 1}</span>
                  </span>
                  <span className="mt-4 block font-display text-[1.7rem] leading-tight lg:text-3xl">{l.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-ink/60">{l.teaser}</span>
                  <span className="mt-auto pt-4 text-sm font-medium text-ember">
                    Read <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </button>
              </Spotlight>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* portalled: the Curtain wrapper's clip-path would otherwise clip this fixed overlay */}
      {createPortal(
      <AnimatePresence>
        {lesson && (
          <motion.div className="fixed inset-0 z-[70] flex items-end justify-center lg:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close" className="absolute inset-0 bg-night/70 backdrop-blur-sm" onClick={() => setOpen(null)} />
            <motion.article
              role="dialog"
              aria-modal="true"
              aria-label={lesson.title}
              className="relative max-h-[86svh] w-full overflow-y-auto rounded-t-[28px] bg-bone p-6 text-ink lg:max-w-2xl lg:rounded-[28px] lg:p-10"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <span className="pointer-events-none absolute -right-2 -top-4 select-none font-deva text-[8rem] leading-none text-ink/[0.05]">{lesson.hindi}</span>
              <div className="relative flex items-center justify-between">
                <span className="rounded-full border border-ember/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-ember">{lesson.tag}</span>
                <button onClick={() => setOpen(null)} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-lg hover:border-ink/40" aria-label="Close">
                  ×
                </button>
              </div>
              <h3 className="relative mt-4 font-display text-4xl leading-tight lg:text-5xl">{lesson.title}</h3>
              <ol className="relative mt-6 space-y-4">
                {lesson.points.map((p, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.4, ease: EASE }}
                  >
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink font-display text-sm text-gold">{i + 1}</span>
                    <p className="leading-relaxed text-ink/75">{p}</p>
                  </motion.li>
                ))}
              </ol>
              <div className="relative mt-8 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-6">
                <a
                  href={whatsappLink(`Namaste! I was reading "${lesson.title}" on your website and have a question.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-bone hover:bg-moss"
                >
                  Ask about this →
                </a>
                <button
                  onClick={() => {
                    setOpen(null);
                    setTimeout(() => scrollToHash('#contact'), 350);
                  }}
                  className="h-11 rounded-full border border-ink/15 px-5 text-sm hover:border-ink/40"
                >
                  Book a consultation
                </button>
                {open != null && open < LESSONS.length - 1 && (
                  <button onClick={() => setOpen(open + 1)} className="ml-auto text-sm text-ember hover:underline">
                    Next: {LESSONS[open + 1].title} →
                  </button>
                )}
              </div>
              <p className="relative mt-4 text-[10px] text-ink/40">General information, not personal advice. Tax rules change; check the current rules for your situation.</p>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </section>
  );
}
