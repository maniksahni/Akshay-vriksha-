import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { wa } from '../data';
import { EASE, Scene, Title } from './ui';

const ROUTES = [
  { title: 'Build wealth', detail: 'Give your monthly savings a purpose.', items: ['Choose the goal and when you need the money.', 'Explore a monthly amount in the SIP calculator.', 'Discuss suitability and scheme details with Gulshan.'], cta: 'Explore the calculator', href: '#calculator' },
  { title: 'Protect family', detail: 'Make room for the unexpected.', items: ['List existing life and health policies.', 'Note dependants, commitments and outstanding loans.', 'Discuss cover, exclusions and affordability before choosing.'], cta: 'Discuss protection', href: wa('Hi Gulshan, I would like to review my family’s insurance needs and existing cover.') },
  { title: 'Invest from abroad', detail: 'An Indian goal. A global life.', items: ['Share your country of residence and investment goal.', 'Discuss eligibility, KYC and NRE/NRO requirements.', 'Review available options before starting an investment.'], cta: 'Talk about NRI investing', href: wa('Hi Gulshan, I live abroad and would like to discuss my eligibility and the process for investing in India.') },
];

export function NextSteps() {
  const [active, setActive] = useState(0);
  const route = ROUTES[active];
  return (
    <section id="next-steps" data-dark className="py-14 sm:py-32">
      <Scene className="wrap-wide grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="kicker">Your next move</p>
          <Title className="display mt-4 text-[clamp(2.4rem,5.4vw,4.8rem)]" text="Clarity first. / *Then, a plan.*" />
          <p className="lede mt-5 max-w-md">Useful tools to explore your options. Personal guidance to help you take the next step.</p>
          <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Choose your next step">
            {ROUTES.map((r, i) => <button key={r.title} type="button" aria-pressed={active === i} onClick={() => setActive(i)} className="chip">{r.title}</button>)}
          </div>
        </div>
        <div className="glass ring-grad overflow-hidden p-6 sm:p-10" aria-live="polite" style={{ perspective: 1200 }}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(191,90,242,0.40),transparent)]" />
          <AnimatePresence mode="wait">
            <motion.div key={active} className="relative" initial={{ opacity: 0, rotateY: -70, x: 40 }} animate={{ opacity: 1, rotateY: 0, x: 0 }} exit={{ opacity: 0, rotateY: 70, x: -40 }} transition={{ duration: 0.55, ease: EASE }} style={{ transformOrigin: '50% 50%' }}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-dim">{route.title}</p>
              <h3 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] sm:text-[32px]">{route.detail}</h3>
              <ol className="my-8 space-y-5">
                {route.items.map((item, i) => (
                  <li key={item} className="flex items-start gap-4 text-[15px] leading-relaxed text-haze">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-[12px] font-semibold text-paper">0{i + 1}</span>
                    <span className="pt-1.5">{item}</span>
                  </li>
                ))}
              </ol>
              <a className="link" href={route.href} {...(active ? { target: '_blank', rel: 'noreferrer' } : {})}>{route.cta} ↗</a>
            </motion.div>
          </AnimatePresence>
        </div>
      </Scene>
    </section>
  );
}
