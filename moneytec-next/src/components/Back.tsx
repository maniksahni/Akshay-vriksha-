import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { FormEvent, useState } from 'react';
import { DISCLAIMER, FACTS, NAV, wa } from '../data';
import { Wordmark } from './Front';
import { Folio, Lines, Riso, Stamp } from './print';
import { EASE } from './ui';

/* ------------------------------------------------------------ 3 steps as ticket stubs */
const STEPS = [
  { t: 'Say hi', d: 'WhatsApp or call. Tell Gulshan what you’re saving for, even if it’s just “I should start something”.', c: 'bg-pink' },
  { t: 'Quick call', d: 'Your goal, your timeline, and how much risk you’re okay with. Real talk, no sales script.', c: 'bg-sun' },
  { t: 'SIP goes live', d: 'KYC and paperwork done online. Your SIP starts, and he checks in as life changes.', c: 'bg-blue text-paper' },
];

export function Tickets() {
  return (
    <section id="steps" className="relative py-12 sm:py-20">
      <div className="wrap">
        <Folio no="07" title="How it goes down" color="bg-sun" />
        <Lines className="mt-6 text-[clamp(2.6rem,6.4vw,5.6rem)]" lines={['Three stops.', <Riso amount={4}>Zero stress.</Riso>]} />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.t}
              className="flex border-2 border-ink bg-[#FBF8F1]"
              style={{ boxShadow: '5px 5px 0 0 #141413' }}
              initial={{ opacity: 0, y: 30, rotate: i % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 0.6 : -0.6 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
            >
              {/* stub */}
              <div className={`flex w-16 shrink-0 flex-col items-center justify-between border-r-2 border-dashed border-ink py-3 ${s.c}`}>
                <span className="font-mono text-[10px] font-bold uppercase [writing-mode:vertical-rl]">stop</span>
                <span className="headline text-4xl">{i + 1}</span>
              </div>
              <div className="p-4">
                <p className="headline text-2xl sm:text-3xl">{s.t}</p>
                <p className="mt-1.5 text-[15px] leading-snug text-ink/70">{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[12px] text-ink/60">No pressure, no obligation. You decide every step.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ FAQ as an advice column */
const LETTERS = [
  { q: 'How much do I need to start?', from: 'Broke-ish in Bengaluru', a: 'Many schemes take SIPs from ₹500 a month. The amount can grow with your income. Starting, and staying consistent, matters most.' },
  { q: 'Where does my money actually go?', from: 'Suspicious in Surat', a: 'Straight from your bank account to the fund house (AMC) or the insurer. Units and policies are in your name. It never passes through moneytec.' },
  { q: 'Can I stop or pause my SIP?', from: 'Commitment-shy in Chennai', a: 'Yes. Most SIPs can be paused, changed or stopped any time. Tax-saving (ELSS) funds lock each instalment for 3 years, and Gulshan flags that upfront.' },
  { q: 'What documents do I need?', from: 'Paperwork-phobic in Pune', a: 'Usually PAN, Aadhaar (or passport for NRIs), a bank account and a photo. KYC is done once and works across fund houses, mostly online.' },
  { q: 'I live abroad. Can I still invest?', from: 'Homesick in Dubai', a: 'Yes, through NRE or NRO accounts. Residents of the US and Canada can invest with select fund houses only, and he’ll tell you which.' },
  { q: 'How do you get paid?', from: 'Curious in Kolkata', a: `As an AMFI-registered distributor (${FACTS.arn}) and Kotak Life advisor, moneytec earns commission from fund houses and the insurer, as regulated by SEBI, AMFI and IRDAI. No separate advisory fee, and he tells you upfront.` },
];

export function Column() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-12 sm:py-20">
      <div className="wrap">
        <Folio no="08" title="Advice column" color="bg-pink" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <Lines className="text-[clamp(2.6rem,6.4vw,5.6rem)]" lines={['Dear', <Riso amount={4}>Gulshan,</Riso>]} />
            <p className="mt-4 max-w-sm font-serif text-xl leading-snug">Real questions from real readers. Got one that isn’t here? Send it in.</p>
            <a href={wa('Dear Gulshan, I have a question:')} target="_blank" rel="noreferrer" className="btn-paper mt-5">Write in on WhatsApp ✉</a>
          </div>
          <div className="border-t-2 border-ink">
            {LETTERS.map((l, i) => {
              const on = open === i;
              return (
                <div key={l.q} className="border-b-2 border-ink">
                  <button className="flex w-full items-start justify-between gap-4 py-4 text-left" aria-expanded={on} onClick={() => setOpen(on ? null : i)}>
                    <span>
                      <span className="headline block text-xl sm:text-2xl">{l.q}</span>
                      <span className="font-serif text-[15px] italic text-ink/55">— {l.from}</span>
                    </span>
                    <span className={`mt-1 grid h-8 w-8 shrink-0 place-items-center border-2 border-ink font-mono text-lg transition-transform duration-300 ${on ? 'rotate-45 bg-sun' : ''}`}>+</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                        <p className="pb-4 pl-4 font-serif text-[1.1rem] leading-relaxed text-ink/80 [border-left:3px_solid_#2B50FF]">
                          <span className="font-display font-bold not-italic text-blue">Dear reader, </span>
                          {l.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ ADMIT ONE ticket */
const WHO = ['Student', 'Working', 'Business owner', 'NRI'];
const WANT = ['Start a SIP', 'Save tax', 'Life cover', 'Health cover', 'Check my portfolio'];
const BUDGET = ['₹500–2k', '₹2k–10k', '₹10k–50k', '₹50k+'];

export function AdmitOne() {
  const [who, setWho] = useState('Working');
  const [want, setWant] = useState<string[]>(['Start a SIP']);
  const [budget, setBudget] = useState('₹2k–10k');
  const [name, setName] = useState('');
  const [torn, setTorn] = useState(false);
  const toggle = (g: string) => setWant((s) => (s.includes(g) ? s.filter((x) => x !== g) : [...s, g]));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    // open WhatsApp inside the click so browsers don't treat it as a pop-up, then tear the stub
    window.open(wa(`Hey Gulshan! I'm ${name || 'interested'} (${who}). I want help with: ${want.join(', ') || 'getting started'}. Monthly budget: ${budget}.`), '_blank', 'noopener');
    setTorn(true);
  };
  const chip = (on: boolean) => `border-2 border-ink px-3 py-1.5 text-[14px] font-semibold transition-colors ${on ? 'bg-ink text-paper' : 'bg-paper hover:bg-newsprint'}`;

  return (
    <section id="start" className="relative overflow-hidden py-12 sm:py-20">
      <div className="wrap">
        <Folio no="09" title="Your move" color="bg-blue text-paper" />
        <Lines className="mt-6 text-[clamp(2.8rem,7.6vw,7rem)]" lines={['Start before', <>you’re <Riso amount={5}>“ready”.</Riso></>]} />

        <motion.form
          onSubmit={submit}
          className="relative mt-8 flex flex-col border-[3px] border-ink bg-sun lg:flex-row"
          style={{ boxShadow: '10px 10px 0 0 #141413' }}
          initial={{ rotate: 1.2, y: 30, opacity: 0 }}
          whileInView={{ rotate: 0, y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="flex-1 p-5 sm:p-7">
            <div className="flex items-baseline justify-between border-b-[3px] border-ink pb-2">
              <p className="headline text-[2.4rem] leading-none sm:text-6xl">ADMIT ONE</p>
              <p className="hidden font-mono text-[11px] uppercase sm:block">valid: whenever you’re ready</p>
            </div>
            <p className="mt-2 font-serif text-lg italic">to: your first SIP, with Gulshan Kohli</p>

            <p className="label mt-4">I am</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {WHO.map((w) => <button key={w} type="button" aria-pressed={who === w} onClick={() => setWho(w)} className={chip(who === w)}>{w}</button>)}
            </div>
            <p className="label mt-4">I want to</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {WANT.map((w) => <button key={w} type="button" aria-pressed={want.includes(w)} onClick={() => toggle(w)} className={chip(want.includes(w))}>{w}</button>)}
            </div>
            <p className="label mt-4">Monthly budget</p>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {BUDGET.map((b) => <button key={b} type="button" aria-pressed={budget === b} onClick={() => setBudget(b)} className={chip(budget === b)}>{b}</button>)}
            </div>
            <label className="mt-4 block">
              <span className="label">Name on ticket</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="your name" autoComplete="name" className="mt-1.5 h-12 w-full border-b-[3px] border-ink bg-transparent font-display text-2xl font-bold placeholder:text-ink/35 focus:outline-none" />
            </label>
          </div>

          {/* the tear-off stub */}
          <motion.div
            className="relative flex items-center justify-center border-t-[3px] border-dashed border-ink bg-pink p-5 lg:w-56 lg:border-l-[3px] lg:border-t-0"
            animate={torn ? { rotate: 14, x: 40, y: 80, opacity: 0 } : { rotate: 0, x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.5, 0, 0.5, 1] }}
          >
            <div className="flex w-full flex-col items-center gap-3 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em]">No. {String(Date.now()).slice(-6)}</p>
              <button type="submit" className="btn-paper w-full text-base">Tear & send →</button>
              <p className="font-mono text-[10px] leading-snug">opens WhatsApp with this ticket filled in</p>
            </div>
          </motion.div>
          <AnimatePresence>
            {torn && (
              <motion.div className="absolute inset-0 grid place-items-center bg-sun/90 p-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.4 }}>
                <div>
                  <Stamp className="text-3xl sm:text-5xl" rotate={-8}>Sent to WhatsApp</Stamp>
                  <p className="mt-4 font-serif text-xl">Hit send there, and Gulshan replies personally.</p>
                  <button type="button" onClick={() => setTorn(false)} className="mt-3 font-mono text-sm underline">print another ticket</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
        <p className="mt-4 font-mono text-[11px] text-ink/55">No obligation. Nothing is booked or invested from this website. Or reach him directly: <a className="underline" href={`tel:+${FACTS.phoneIntl}`}>{FACTS.phone}</a> · <a className="underline" href={`mailto:${FACTS.email}`}>{FACTS.email}</a> · {FACTS.city}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ footer: the back page */
export function BackPage() {
  return (
    <footer className="relative border-t-[3px] border-ink pb-28 pt-10 lg:pb-12">
      <div className="wrap">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <p className="headline text-[clamp(4rem,17vw,15rem)] leading-[0.78] tracking-[-0.07em]">
            <Riso amount={8}>money</Riso>tec
          </p>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-1 pb-3 font-mono text-[12px] uppercase">
            {NAV.map((n) => <a key={n.href} href={n.href} className="hover:underline">{n.label}</a>)}
            <a href={wa('Hey!')} target="_blank" rel="noreferrer" className="hover:underline">WhatsApp ↗</a>
          </nav>
        </div>
        <div className="mt-6 grid gap-4 border-t-2 border-ink pt-4 font-mono text-[10.5px] leading-relaxed text-ink/60 sm:grid-cols-[1fr_auto]">
          <p>
            Fine print: {FACTS.name} is an AMFI-registered mutual fund distributor ({FACTS.arn}) and a Kotak Life Insurance advisor ({FACTS.kotak}). {DISCLAIMER}
          </p>
          <p className="whitespace-nowrap">© {new Date().getFullYear()} moneytec · {FACTS.city}</p>
        </div>
        <div className="mt-4 flex justify-start"><Wordmark /></div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------ phone action bar */
export function MobileBar() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => {
    const end = document.getElementById('start');
    const atEnd = end ? end.getBoundingClientRect().top < window.innerHeight * 0.75 : false;
    setShow(y > window.innerHeight * 0.7 && !atEnd);
  });
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 lg:hidden" initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <div className="flex gap-2">
            <a href="#start" className="btn-pink h-11 flex-1">Start my SIP →</a>
            <a href="#glow-up" className="btn-paper h-11 px-4 text-sm">Calculator</a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
