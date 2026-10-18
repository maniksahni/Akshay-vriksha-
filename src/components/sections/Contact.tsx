import { useInView } from 'framer-motion';
import { FormEvent, useRef, useState } from 'react';
import { CONTACT, NAV, whatsappLink } from '../../data/site';
import { scrollToHash } from '../../lib/smooth';
import { GoldSilk } from '../GoldSilk';
import { Logo } from '../Nav';
import { FadeUp, Magnetic, MaskLines } from '../ui/motion';

const INTERESTS = ['Mutual Funds / SIP', 'Life Insurance', 'Health Insurance', 'Heritage Travel'];

export function Contact() {
  const [who, setWho] = useState<'Resident Indian' | 'NRI'>('Resident Indian');
  const [interests, setInterests] = useState<string[]>(['Mutual Funds / SIP']);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [note, setNote] = useState('');

  const toggle = (t: string) => setInterests((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const msg = [
      `Namaste! My name is ${name || '—'}.`,
      `I'm a ${who}${city ? ` based in ${city}` : ''}.`,
      `I'm interested in: ${interests.join(', ') || 'a general consultation'}.`,
      note && `\n${note}`,
    ]
      .filter(Boolean)
      .join(' ');
    window.open(whatsappLink(msg), '_blank', 'noopener');
  };

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2.5 text-sm transition-colors ${active ? 'border-gold bg-gold text-night' : 'border-white/15 text-bone/70 hover:border-gold/60 hover:text-bone'}`;
  const input = 'w-full border-b border-white/15 bg-transparent py-3 text-lg text-bone placeholder:text-bone/30 focus:border-gold focus:outline-none';

  return (
    <section id="contact" className="relative overflow-hidden bg-forest py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[140px]" />
      <div className="container-x relative grid gap-16 lg:grid-cols-[1fr_1fr]">
        <div>
          <FadeUp>
            <p className="eyebrow mb-4 text-gold">Begin</p>
          </FadeUp>
          <MaskLines
            lines={['The best time to plant', 'a tree was 20 years ago.', <span className="italic text-gold">The next best is today.</span>]}
            className="font-display text-[clamp(2.4rem,4.8vw,4.6rem)] leading-[0.98] tracking-[-0.02em]"
          />
          <FadeUp delay={0.1} className="mt-12 space-y-6">
            <a href={`tel:+${CONTACT.phoneIntl}`} className="group block">
              <span className="eyebrow text-bone/40">Call</span>
              <span className="mt-1 block font-display text-4xl transition-colors group-hover:text-gold sm:text-5xl">+91 {CONTACT.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</span>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="group block">
              <span className="eyebrow text-bone/40">Write</span>
              <span className="mt-1 block break-all font-display text-3xl transition-colors group-hover:text-gold sm:text-4xl">{CONTACT.email}</span>
            </a>
            <div>
              <span className="eyebrow text-bone/40">Visit</span>
              <span className="mt-1 block font-display text-3xl sm:text-4xl">{CONTACT.address}</span>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.15}>
          <form onSubmit={submit} className="rounded-[28px] border border-white/10 bg-night/50 p-7 backdrop-blur sm:p-10">
            <p className="font-display text-3xl">Book a free consultation</p>
            <p className="mt-2 text-sm text-bone/50">Fill this in and we’ll continue the conversation on WhatsApp.</p>

            <fieldset className="mt-8">
              <legend className="eyebrow mb-3 text-bone/40">I am a</legend>
              <div className="flex flex-wrap gap-2">
                {(['Resident Indian', 'NRI'] as const).map((w) => (
                  <button type="button" key={w} className={chip(who === w)} onClick={() => setWho(w)} aria-pressed={who === w}>
                    {w}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-6">
              <legend className="eyebrow mb-3 text-bone/40">Interested in</legend>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((t) => (
                  <button type="button" key={t} className={chip(interests.includes(t))} onClick={() => toggle(t)} aria-pressed={interests.includes(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label>
                <span className="sr-only">Your name</span>
                <input className={input} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              </label>
              <label>
                <span className="sr-only">City / country</span>
                <input className={input} placeholder="City / country" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
              </label>
            </div>
            <label className="mt-5 block">
              <span className="sr-only">Anything else</span>
              <textarea className={`${input} min-h-[90px] resize-none`} placeholder="Your goal: a house, retirement, a child’s education…" value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
            <div className="mt-8">
              <Magnetic>
                <button type="submit" className="inline-flex h-14 items-center gap-3 rounded-full bg-gold pl-7 pr-2 text-[15px] font-semibold text-night transition-colors hover:bg-gold-soft">
                  Continue on WhatsApp
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-night text-gold">→</span>
                </button>
              </Magnetic>
            </div>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}

/** Curtain footer: it sits fixed beneath the page and is uncovered as the last section scrolls away. */
export function Footer() {
  // the footer is position:fixed, so watch its in-flow wrapper to know when it is actually uncovered
  const ref = useRef<HTMLDivElement>(null);
  const uncovered = useInView(ref, { margin: '100px' });
  return (
    <div ref={ref} className="relative h-[100svh] min-h-[680px]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
      <footer className="fixed bottom-0 flex h-[100svh] min-h-[680px] w-full flex-col justify-between overflow-hidden bg-night pt-24">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          {uncovered && <GoldSilk intensity={0.35} />}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night via-night/70 to-transparent" />
        <div className="container-x relative grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10 text-bone" />
              <span className="font-display text-3xl">Akshaya Vriksha</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-bone/55">
              Investments for your long-term goals. Plant a SIP today to aim for a brighter tomorrow in the shade of your own अक्षयवृक्षः.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-4 text-bone/40">Explore</p>
            <ul className="grid grid-cols-2 gap-y-2 text-sm text-bone/75">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} onClick={(e) => { e.preventDefault(); scrollToHash(n.href); }} className="hover:text-gold">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-sm text-bone/75">
            <p className="eyebrow mb-4 text-bone/40">Connect</p>
            <a className="block hover:text-gold" href={whatsappLink('Namaste!')} target="_blank" rel="noreferrer">WhatsApp</a>
            <a className="block hover:text-gold" href={CONTACT.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a className="block hover:text-gold" href={`mailto:${CONTACT.email}`}>Email</a>
            <a className="block hover:text-gold" href={`tel:+${CONTACT.phoneIntl}`}>+91 {CONTACT.phone}</a>
          </div>
        </div>
        <div className="relative">
          <div className="container-x pb-6 text-[11px] leading-relaxed text-bone/40">
            <p className="max-w-4xl">
              Akshaya Vriksha is an AMFI-registered mutual fund distributor ({CONTACT.arn}) and a Kotak Life Insurance advisor ({CONTACT.kotak}). Mutual fund investments are subject to market risks; read all scheme-related documents carefully. Insurance is the subject matter of solicitation. Past performance is not indicative of future returns.
            </p>
            <p className="mt-3">© {new Date().getFullYear()} Akshaya Vriksha · {CONTACT.address}</p>
          </div>
          <div className="select-none text-center font-deva text-[23vw] leading-[0.82] text-foil" aria-hidden>
            अक्षयवृक्षः
          </div>
        </div>
      </footer>
    </div>
  );
}
