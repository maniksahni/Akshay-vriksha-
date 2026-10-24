import { useState } from 'react';
import { wa } from '../data';

const ROUTES = [
  { title: 'Build wealth', detail: 'Give your monthly savings a purpose.', items: ['Choose the goal and when you need the money.', 'Explore a monthly amount in the SIP calculator.', 'Discuss suitability and scheme details with Gulshan.'], cta: 'Explore the calculator', href: '#calculator' },
  { title: 'Protect family', detail: 'Make room for the unexpected.', items: ['List existing life and health policies.', 'Note dependants, commitments and outstanding loans.', 'Discuss cover, exclusions and affordability before choosing.'], cta: 'Discuss protection', href: wa('Hi Gulshan, I would like to review my family’s insurance needs and existing cover.') },
  { title: 'Invest from abroad', detail: 'An Indian goal. A global life.', items: ['Share your country of residence and investment goal.', 'Discuss eligibility, KYC and NRE/NRO requirements.', 'Review available options before starting an investment.'], cta: 'Talk about NRI investing', href: wa('Hi Gulshan, I live abroad and would like to discuss my eligibility and the process for investing in India.') },
];

export function NextSteps() {
  const [active, setActive] = useState(0);
  const route = ROUTES[active];
  return (
    <section className="next-steps bg-snow py-16 sm:py-24" id="next-steps">
      <div className="wrap-wide">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-link">Your next move</p>
            <h2 className="display mt-2 text-[clamp(2rem,4.6vw,3.5rem)]">Clarity first.<br /><span className="grad">Then, a plan.</span></h2>
            <p className="body-lg mt-5 max-w-md text-slate">Useful tools to explore your options. Personal guidance to help you take the next step.</p>
            <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Choose your next step">
              {ROUTES.map((r, i) => <button key={r.title} type="button" aria-pressed={active === i} onClick={() => setActive(i)} className={`route-choice rounded-full border px-4 py-3 text-sm font-medium ${active === i ? 'border-link bg-link text-white' : 'border-mist bg-white text-coal'}`}>{r.title}</button>)}
            </div>
          </div>
          <div className="route-panel rounded-[28px] bg-white p-6 sm:p-9" aria-live="polite">
            <p className="text-xs font-semibold uppercase tracking-widest text-graphite">{route.title}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">{route.detail}</h3>
            <ol className="my-7 space-y-5">{route.items.map((item, i) => <li key={item} className="flex items-start gap-4 text-[15px] leading-relaxed text-slate"><span className="step-number flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-link">0{i + 1}</span><span className="pt-1">{item}</span></li>)}</ol>
            <a className="textlink" href={route.href} {...(active ? { target: '_blank', rel: 'noreferrer' } : {})}>{route.cta} <span aria-hidden>↗</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
