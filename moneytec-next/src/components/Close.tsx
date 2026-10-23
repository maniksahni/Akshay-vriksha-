import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import { DISCLAIMER, FACTS, NAV, wa } from '../data';
import { Logo } from './Logo';
import { EASE, FadeIn, Marquee, Rise } from './ui';

const FAQ = [
  { q: 'How much do I need to start?', a: 'Many schemes take SIPs from ₹500 a month. The amount can grow with your income; what matters is starting and staying consistent.' },
  { q: 'Where does my money actually go?', a: 'Straight from your bank account to the fund house (AMC) or the insurer. Units and policies are in your name. It never passes through moneytec.' },
  { q: 'Can I stop or pause my SIP?', a: 'Yes. Most SIPs can be paused, changed or stopped any time. Some tax-saving (ELSS) funds lock each instalment for 3 years, and we’ll flag that upfront.' },
  { q: 'What documents do I need?', a: 'Usually PAN, Aadhaar (or passport for NRIs), a bank account and a photo. KYC is done once and works across fund houses, mostly online.' },
  { q: 'I live abroad. Can I invest?', a: 'Yes, through NRE or NRO accounts. Residents of the US and Canada can invest with select fund houses only, and we’ll tell you which.' },
  { q: 'How do you get paid?', a: `We’re an AMFI-registered mutual fund distributor (${FACTS.arn}) and a Kotak Life advisor. We earn commission from fund houses and the insurer, as regulated by SEBI, AMFI and IRDAI, and we’re upfront about it.` },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-16 sm:py-24">
      <div className="wrap grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="kicker text-volt-soft">07 · real questions</p>
          <Rise className="h-display mt-3 text-[clamp(1.9rem,4.4vw,3.9rem)]">{'Ask us / *anything.*'}</Rise>
          <FadeIn delay={0.1}>
            <a href={wa('Hey! I have a question that’s not in your FAQ.')} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-semibold text-lime underline-offset-4 hover:underline">
              Didn’t see yours? Ask on WhatsApp ↗
            </a>
          </FadeIn>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q}>
                <button className="flex w-full items-center justify-between gap-5 py-5 text-left" aria-expanded={on} onClick={() => setOpen(on ? null : i)}>
                  <span className="font-display text-lg font-bold tracking-tight sm:text-xl">{f.q}</span>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300 ${on ? 'rotate-45 border-lime bg-lime text-void' : 'border-line'}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                      <p className="max-w-2xl pb-5 text-[15px] leading-relaxed text-chalk/65">{f.a}</p>
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

const WHO = ['Student', 'Working', 'Business owner', 'NRI'];
const GOALS = ['Start a SIP', 'Save tax', 'Life cover', 'Health cover', 'Review my portfolio'];
const BUDGET = ['₹500–2k', '₹2k–10k', '₹10k–50k', '₹50k+'];

export function Cta() {
  const [who, setWho] = useState('Working');
  const [goals, setGoals] = useState<string[]>(['Start a SIP']);
  const [budget, setBudget] = useState('₹2k–10k');
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);

  const toggle = (g: string) => setGoals((s) => (s.includes(g) ? s.filter((x) => x !== g) : [...s, g]));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const msg = `Hey Gulshan! I'm ${name || 'interested'} (${who}). I want help with: ${goals.join(', ') || 'getting started'}. Monthly budget: ${budget}.`;
    window.open(wa(msg), '_blank', 'noopener');
    setSent(true);
  };
  const chip = (on: boolean) => `rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${on ? 'border-lime bg-lime text-void' : 'border-line text-chalk/75 hover:border-lime/60'}`;

  return (
    <section id="start" className="relative overflow-hidden py-16 sm:py-24">
      <div className="pointer-events-none absolute -right-40 top-0 h-[560px] w-[560px] rounded-full bg-lime/15 blur-[140px]" />
      <div className="wrap relative grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14">
        <div>
          <p className="kicker text-lime">08 · your move</p>
          <Rise className="h-display mt-3 text-[clamp(2.4rem,7.5vw,6rem)]">{'Start before / you’re *“ready”.*'}</Rise>
          <FadeIn delay={0.1}>
            <p className="mt-4 max-w-md text-chalk/60">Pick a few things, hit send, and it opens WhatsApp with everything filled in. Gulshan replies personally.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-[13px] text-chalk/60">
              <a href={`tel:+${FACTS.phoneIntl}`} className="chip hover:border-lime">📞 {FACTS.phone}</a>
              <a href={`mailto:${FACTS.email}`} className="chip hover:border-lime">✉ {FACTS.email}</a>
              <span className="chip">📍 {FACTS.city}</span>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <form onSubmit={submit} className="card p-5 sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid min-h-[340px] place-items-center text-center">
                  <div>
                    <p className="text-6xl">🎉</p>
                    <p className="mt-4 font-display text-3xl font-black tracking-tight">Sent to WhatsApp</p>
                    <p className="mt-2 text-chalk/60">Hit send there and you’re in. Gulshan will reply personally.</p>
                    <button type="button" onClick={() => setSent(false)} className="mt-5 text-sm text-lime hover:underline">Change something</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-[12px] uppercase tracking-[0.18em] text-chalk/45">I am</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {WHO.map((w) => (
                      <button key={w} type="button" className={chip(who === w)} aria-pressed={who === w} onClick={() => setWho(w)}>{w}</button>
                    ))}
                  </div>
                  <p className="mt-5 text-[12px] uppercase tracking-[0.18em] text-chalk/45">I want to</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {GOALS.map((g) => (
                      <button key={g} type="button" className={chip(goals.includes(g))} aria-pressed={goals.includes(g)} onClick={() => toggle(g)}>{g}</button>
                    ))}
                  </div>
                  <p className="mt-5 text-[12px] uppercase tracking-[0.18em] text-chalk/45">Monthly budget</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {BUDGET.map((b) => (
                      <button key={b} type="button" className={`${chip(budget === b)} px-1`} aria-pressed={budget === b} onClick={() => setBudget(b)}>{b}</button>
                    ))}
                  </div>
                  <label className="mt-5 block">
                    <span className="sr-only">Your name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className="h-12 w-full rounded-full border border-line bg-white/[0.03] px-5 text-base text-chalk placeholder:text-chalk/35 focus:border-lime focus:outline-none" />
                  </label>
                  <button type="submit" className="btn-lime mt-4 w-full">Send it on WhatsApp →</button>
                  <p className="mt-3 text-center text-[11px] text-chalk/40">No obligation. Nothing is booked or invested from this website.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pb-28 pt-12 lg:pb-10">
      <div className="wrap">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm text-chalk/55">Goal-based SIPs, insurance and NRI investing with {FACTS.name}. {FACTS.city}, serving India and NRIs worldwide.</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-chalk/70">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-lime">{n.label}</a>
            ))}
            <a href={wa('Hey!')} target="_blank" rel="noreferrer" className="hover:text-lime">WhatsApp ↗</a>
          </nav>
        </div>
        <p className="mt-10 max-w-4xl text-[11px] leading-relaxed text-chalk/40">
          {FACTS.name} is an AMFI-registered mutual fund distributor ({FACTS.arn}) and a Kotak Life Insurance advisor ({FACTS.kotak}). {DISCLAIMER}
        </p>
        <p className="mt-3 text-[11px] text-chalk/35">© {new Date().getFullYear()} moneytec</p>
      </div>
      <div aria-hidden className="mt-8 select-none text-lime/90">
        <Marquee className="font-display text-[18vw] font-black leading-[0.9] tracking-[-0.06em] lg:text-[12vw]" items={['moneytec']} />
      </div>
    </footer>
  );
}
