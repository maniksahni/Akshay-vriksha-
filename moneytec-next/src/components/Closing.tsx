import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import { DISCLAIMER, FACTS, NAV, wa } from '../data';
import { EASE } from './ui';

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 0.9, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- privacy-style trust */
export function Safety() {
  return (
    <section id="safety" data-dark className="bg-night py-20 text-white sm:py-32">
      <div className="wrap text-center">
        <Reveal>
          <svg viewBox="0 0 64 64" className="mx-auto h-16 w-16" aria-hidden>
            <defs><linearGradient id="lock" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#64D2FF" /><stop offset="1" stopColor="#30D158" /></linearGradient></defs>
            <rect x="12" y="28" width="40" height="30" rx="8" fill="url(#lock)" />
            <path d="M20 28v-7a12 12 0 0 1 24 0v7" fill="none" stroke="url(#lock)" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <h2 className="display mt-6 text-[clamp(2.2rem,5.6vw,4.4rem)]">
            Your money never
            <br />
            <span className="grad-mint">touches us.</span>
          </h2>
          <p className="body-lg mx-auto mt-4 max-w-xl text-white/65">It goes straight from your bank to the fund house or insurer, in your name. That’s how it should be.</p>
        </Reveal>
        <div className="mt-12 grid gap-8 text-left sm:grid-cols-3">
          {[
            ['Straight to the source.', 'Payments go directly to the AMC or Kotak Life. Never to a middleman’s account.'],
            ['Always in your name.', 'Your units and policies are held by you. You can see them any time.'],
            ['Check us yourself.', `AMFI-registered distributor ${FACTS.arn}. Kotak Life advisor ${FACTS.kotak}.`],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08}>
              <p className="text-[21px] font-semibold tracking-[-0.02em]">{t}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/60">{d}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="mt-10">
          <a href={FACTS.amfiLocator} target="_blank" rel="noreferrer" className="textlink-dark">Verify {FACTS.arn} on AMFI ↗</a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- meet Gulshan */
export function Gulshan() {
  return (
    <section id="gulshan" className="bg-white py-16 sm:py-28">
      <div className="wrap-wide grid items-center gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-[28px] sm:max-w-[440px] sm:rounded-[36px] bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed]">
            <div className="absolute inset-[12%] rounded-full bg-gradient-to-br from-[#FF9F0A] via-[#FF375F] to-[#BF5AF2] p-[6px]">
              <div className="grid h-full w-full place-items-center rounded-full bg-white">
                <span className="text-[3.2rem] font-semibold sm:text-[clamp(4rem,12vw,7rem)] tracking-[-0.06em]">GK</span>
              </div>
            </div>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1.5 text-[11px] sm:bottom-5 sm:px-4 sm:py-2 sm:text-[13px] font-semibold shadow-sm">{FACTS.years}+ years · {FACTS.city}</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow text-[#FF375F]">Meet Gulshan</p>
          <h2 className="display mt-1 text-[clamp(2.2rem,5vw,3.8rem)]">A real person. On your side.</h2>
          <p className="body-lg mt-4 text-slate">
            {FACTS.name} is an electronics engineer turned mutual fund distributor. For {FACTS.years}+ years he’s helped people start SIPs, stick with them, and protect their families with the right cover. No call centres. No bots. You message him, he replies.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-mist pt-5">
            <div><p className="text-[13px] text-graphite">AMFI-registered</p><p className="text-[19px] font-semibold tracking-[-0.02em]">{FACTS.arn}</p></div>
            <div><p className="text-[13px] text-graphite">Kotak Life advisor</p><p className="text-[19px] font-semibold tracking-[-0.02em]">{FACTS.kotak}</p></div>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={wa('Hi Gulshan! Found you on moneytec. Can we talk about my money plans?')} target="_blank" rel="noreferrer" className="pill-blue">Message Gulshan</a>
            <a href={`tel:+${FACTS.phoneIntl}`} className="textlink">Call {FACTS.phone} ›</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- FAQ */
const FAQ = [
  ['How much do I need to start?', 'Many schemes take SIPs from ₹500 a month. The amount can grow with your income; starting and staying consistent matter most.'],
  ['Where does my money actually go?', 'Straight from your bank account to the fund house (AMC) or the insurer. Units and policies are in your name, and it never passes through moneytec.'],
  ['Can I stop or pause my SIP?', 'Yes. Most SIPs can be paused, changed or stopped any time. Tax-saving (ELSS) funds lock each instalment for 3 years, and Gulshan flags that upfront.'],
  ['What documents do I need?', 'Usually PAN, Aadhaar (or passport for NRIs), a bank account and a photo. KYC is done once and works across fund houses, mostly online.'],
  ['I live abroad. Can I invest?', 'Yes, through NRE or NRO accounts. Residents of the US and Canada can invest with select fund houses only, and he’ll tell you which.'],
  ['How do you get paid?', `As an AMFI-registered distributor (${FACTS.arn}) and Kotak Life advisor, moneytec earns commission from fund houses and the insurer, as regulated by SEBI, AMFI and IRDAI. No separate advisory fee, and he tells you upfront.`],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="bg-snow py-16 sm:py-24">
      <div className="wrap">
        <h2 className="display text-[clamp(2rem,4.6vw,3.5rem)]">Questions? Answers.</h2>
        <div className="mt-8 border-t border-mist">
          {FAQ.map(([q, a], i) => {
            const on = open === i;
            return (
              <div key={q} className="border-b border-mist">
                <button className="flex w-full items-center justify-between gap-6 py-5 text-left" aria-expanded={on} onClick={() => setOpen(on ? null : i)}>
                  <span className="text-[19px] font-semibold tracking-[-0.02em] sm:text-[24px]">{q}</span>
                  <span className={`text-[28px] font-light text-link transition-transform duration-300 ${on ? 'rotate-45' : ''}`} aria-hidden>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                      <p className="max-w-2xl pb-6 text-[17px] leading-relaxed text-slate">{a}</p>
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

/* ---------------------------------------------------------------- finale + starter form */
const WHO = ['Student', 'Working', 'Business owner', 'NRI'];
const WANT = ['Start a SIP', 'Save tax', 'Life cover', 'Health cover', 'Portfolio check-up'];

export function Finale() {
  const [who, setWho] = useState('Working');
  const [want, setWant] = useState<string[]>(['Start a SIP']);
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);
  const toggle = (g: string) => setWant((s) => (s.includes(g) ? s.filter((x) => x !== g) : [...s, g]));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    window.open(wa(`Hi Gulshan! I'm ${name || 'interested'} (${who}). I'd like help with: ${want.join(', ') || 'getting started'}.`), '_blank', 'noopener');
    setSent(true);
  };
  const chip = (on: boolean) => `h-11 rounded-full border px-4 text-[15px] transition-colors ${on ? 'border-white bg-white text-black' : 'border-white/25 text-white/85 hover:border-white/60'}`;

  return (
    <section id="start" data-dark className="relative overflow-hidden bg-night py-20 text-white sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[60vmin] w-[90vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(191,90,242,0.25),transparent_65%)] blur-2xl" />
      <div className="wrap relative text-center">
        <Reveal>
          <h2 className="display text-[clamp(2.6rem,7vw,5.6rem)]">
            Start your SIP <span className="grad">today.</span>
          </h2>
          <p className="body-lg mx-auto mt-4 max-w-lg text-white/65">Tell us a little. It opens WhatsApp with everything filled in, and Gulshan replies personally.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={submit} className="mx-auto mt-10 max-w-2xl rounded-[28px] bg-white/[0.06] p-6 text-left ring-1 ring-white/10 sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
                  <p className="text-[28px] font-semibold tracking-[-0.03em]">Your draft is ready.</p>
                  <p className="mt-2 text-white/65">Send your message in WhatsApp to start the conversation. Nothing has been submitted here.</p>
                  <button type="button" onClick={() => setSent(false)} className="textlink-dark mt-4">Change something ›</button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-[13px] font-medium text-white/50">I am</p>
                  <div className="mt-2 flex flex-wrap gap-2">{WHO.map((w) => <button key={w} type="button" aria-pressed={who === w} onClick={() => setWho(w)} className={chip(who === w)}>{w}</button>)}</div>
                  <p className="mt-5 text-[13px] font-medium text-white/50">I’d like to</p>
                  <div className="mt-2 flex flex-wrap gap-2">{WANT.map((w) => <button key={w} type="button" aria-pressed={want.includes(w)} onClick={() => toggle(w)} className={chip(want.includes(w))}>{w}</button>)}</div>
                  <label className="mt-5 block">
                    <span className="sr-only">Your name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className="h-14 w-full rounded-xl border border-white/20 bg-transparent px-4 text-[17px] placeholder:text-white/40 focus:border-linkdark focus:outline-none" />
                  </label>
                  <button type="submit" className="pill-blue mt-5 h-12 w-full text-[17px]">Continue on WhatsApp</button>
                  <p className="mt-3 text-center text-[12px] text-white/45">No obligation. Nothing is booked or invested from this website.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- footer */
export function Footer() {
  return (
    <footer className="bg-cloud pb-10 pt-8 text-[12px] leading-relaxed text-slate">
      <div className="wrap-wide">
        <p className="border-b border-mist pb-4">
          {FACTS.name} is an AMFI-registered mutual fund distributor ({FACTS.arn}) and a Kotak Life Insurance advisor ({FACTS.kotak}). {DISCLAIMER}
        </p>
        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-1">
            {NAV.map((n) => <a key={n.href} href={n.href} className="hover:underline">{n.label}</a>)}
            <a href={wa('Hi!')} target="_blank" rel="noreferrer" className="hover:underline">WhatsApp</a>
            <a href="https://www.instagram.com/akshayavriksha/" target="_blank" rel="noreferrer" className="hover:underline">Instagram</a>
            <a href="https://www.facebook.com/gulshankohli13" target="_blank" rel="noreferrer" className="hover:underline">Facebook</a>
            <a href={`mailto:${FACTS.email}`} className="hover:underline">Email</a>
          </nav>
          <p>© {new Date().getFullYear()} moneytec · {FACTS.city}</p>
        </div>
      </div>
    </footer>
  );
}
