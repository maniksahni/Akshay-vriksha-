import { useState } from 'react';
import { ArrowDown, ArrowUpRight, Compass, Globe2, HeartHandshake, Sprout } from 'lucide-react';
import { scrollToHash } from '../../lib/smooth';
import { whatsappLink } from '../../data/site';

const PATHS = [
  { id: 'start', label: 'Start investing', hindi: 'निवेश शुरू करें', icon: Sprout, title: 'A small beginning. A plan with purpose.', body: 'New to mutual funds? Get familiar with the basics, prepare your documents and talk through your goals before choosing a scheme.', steps: ['Understand your goal', 'Check your KYC', 'Discuss a suitable approach'], href: '#essentials', cta: 'My first-investment checklist', question: 'I am new to investing and would like to understand how to start.' },
  { id: 'plan', label: 'Plan a life goal', hindi: 'लक्ष्य की तैयारी', icon: Compass, title: 'Put a number to what matters.', body: 'Explore how time, inflation and your monthly contribution affect a goal. Use the planner to prepare for a more useful conversation.', steps: ['Choose your goal', 'Explore the assumptions', 'Discuss the next step'], href: '#goals', cta: 'Open the goal planner', question: 'I would like help planning investments for a life goal.' },
  { id: 'protect', label: 'Protect my family', hindi: 'परिवार की सुरक्षा', icon: HeartHandshake, title: 'Make protection part of the conversation.', body: 'Consider existing cover, family expenses and liabilities. Explore our life-cover tool, then discuss the details and policy terms personally.', steps: ['Review existing cover', 'Estimate your needs', 'Understand policy terms'], href: '#toolkit', cta: 'Explore the planning tools', question: 'I would like to review my family’s life and health insurance needs.' },
  { id: 'nri', label: 'Invest from abroad', hindi: 'विदेश से निवेश', icon: Globe2, title: 'Your life abroad. Your goals in India.', body: 'Start with your residency, banking and documentation questions. Onboarding requirements and fund-house acceptance depend on your circumstances.', steps: ['Discuss your residency', 'Understand the paperwork', 'Plan a call in your timezone'], href: '#nri', cta: 'Visit the NRI desk', question: 'I live abroad and would like to discuss investing in India.' },
];

export function QuickStart() {
  const [active, setActive] = useState(0);
  const path = PATHS[active];
  return (
    <section id="start" className="relative border-y border-gold/15 bg-paper py-14 text-ink lg:py-20">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div><p className="eyebrow mb-3 text-ember">A place to begin · शुरुआत यहाँ से</p><h2 className="font-display text-[clamp(2.2rem,4.2vw,4rem)] leading-tight">What brings you <span className="italic text-ember">here today?</span></h2></div>
          <p className="max-w-xs text-sm leading-relaxed text-ink/60">Choose what matters to you. We’ll help you find the right place to start.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4" role="tablist" aria-label="What would you like to do?">
          {PATHS.map((item, i) => <button key={item.id} id={`path-${item.id}`} type="button" role="tab" aria-selected={active === i} aria-controls="path-panel" tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={event => {
            const next = event.key === 'ArrowRight' ? (i + 1) % PATHS.length : event.key === 'ArrowLeft' ? (i + PATHS.length - 1) % PATHS.length : event.key === 'Home' ? 0 : event.key === 'End' ? PATHS.length - 1 : null;
            if (next !== null) { event.preventDefault(); setActive(next); document.getElementById(`path-${PATHS[next].id}`)?.focus(); }
          }} className={`group rounded-2xl border p-4 text-left transition-colors sm:p-5 ${active === i ? 'border-ink bg-ink text-bone shadow-lg' : 'border-ink/15 bg-bone hover:border-ember/50'}`}><item.icon size={23} className={active === i ? 'text-gold' : 'text-ember'} strokeWidth={1.5} /><span className="mt-4 block text-sm font-semibold sm:text-base">{item.label}</span><span className={`mt-1 block font-deva text-xs ${active === i ? 'text-bone/60' : 'text-ink/55'}`}>{item.hindi}</span></button>)}
        </div>
        <div id="path-panel" role="tabpanel" aria-labelledby={`path-${path.id}`} tabIndex={0} className="mt-5 grid gap-6 rounded-3xl border border-ink/10 bg-bone p-6 sm:p-8 lg:grid-cols-[1fr_0.85fr] lg:gap-12">
          <div><h3 className="font-display text-3xl sm:text-4xl">{path.title}</h3><p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/65">{path.body}</p></div>
          <div className="flex flex-col justify-between gap-5"><ol className="flex flex-wrap gap-x-4 gap-y-2">{path.steps.map((step, i) => <li key={step} className="flex items-center gap-2 text-xs text-ink/65"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ember/10 text-ember">{i + 1}</span>{step}</li>)}</ol><div className="flex flex-wrap items-center gap-4"><a href={path.href} onClick={event => { event.preventDefault(); scrollToHash(path.href); }} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-5 text-sm font-semibold text-bone hover:bg-moss">{path.cta}<ArrowDown size={16} /></a><a href={whatsappLink(`Namaste! ${path.question}`)} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-ember hover:underline">Ask Gulshan <ArrowUpRight size={16} /></a></div></div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-5 text-xs text-ink/60"><span>Prefer a conversation? Start with your questions.</span><div className="flex flex-wrap gap-x-5 gap-y-2"><a href="#compounding" onClick={event => { event.preventDefault(); scrollToHash('#compounding'); }} className="inline-flex min-h-10 items-center gap-2 hover:text-ember">SIP calculator <ArrowUpRight size={14} /></a><a href="#faq" onClick={event => { event.preventDefault(); scrollToHash('#faq'); }} className="inline-flex min-h-10 items-center gap-2 hover:text-ember">Find an answer <ArrowUpRight size={14} /></a></div></div>
      </div>
    </section>
  );
}
