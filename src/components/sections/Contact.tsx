import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { CONTACT, NAV, whatsappLink } from '../../data/site';
import { scrollToHash } from '../../lib/smooth';
import { Booking } from '../Booking';
import { GoldSilk } from '../GoldSilk';
import { Logo } from '../Nav';
import { FadeUp, MaskLines } from '../ui/motion';
import { Scramble } from '../ui/effects';

const NEXT = [
  { t: 'You pick a slot', d: 'Choose a day and time that suits you. NRIs see it in their own timezone.' },
  { t: 'Gulshan confirms', d: 'He confirms personally on WhatsApp, usually with a couple of questions about your goals.' },
  { t: 'A calm conversation', d: 'Your goals, your risk comfort and a clear next step. No pressure, no obligation.' },
];

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-forest py-14 lg:py-32">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[140px]" />
      <div className="container-x relative grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0">
        <div className="lg:col-start-1 lg:row-start-1">
          <FadeUp>
            <Scramble text="Begin" className="eyebrow mb-3 text-gold lg:mb-4" />
          </FadeUp>
          <MaskLines
            lines={['The best time to plant', 'a tree was 20 years ago.', <span className="italic text-gold">The next best is today.</span>]}
            className="font-display text-[clamp(2rem,4.8vw,4.6rem)] leading-[0.98] tracking-[-0.02em]"
          />

          <ol className="mt-8 hidden space-y-5 lg:block">
            {NEXT.map((n, i) => (
              <FadeUp key={n.t} delay={0.1 + i * 0.08}>
                <li className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/40 font-display text-lg text-gold">{i + 1}</span>
                  <div>
                    <p className="font-display text-2xl">{n.t}</p>
                    <p className="mt-1 max-w-sm text-sm text-bone/55">{n.d}</p>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ol>
        </div>

        <FadeUp delay={0.15} className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Booking />
        </FadeUp>
        <FadeUp delay={0.1} className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-6 lg:col-start-1 lg:row-start-2 lg:mt-12 lg:self-start">
          <a href={`tel:+${CONTACT.phoneIntl}`} className="group block">
            <span className="eyebrow text-[10px] text-bone/40">Call</span>
            <span className="mt-1 block font-display text-xl transition-colors group-hover:text-gold lg:text-3xl">+91 {CONTACT.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</span>
          </a>
          <a href={whatsappLink('Namaste!')} target="_blank" rel="noreferrer" className="group block">
            <span className="eyebrow text-[10px] text-bone/40">WhatsApp</span>
            <span className="mt-1 block font-display text-xl transition-colors group-hover:text-gold lg:text-3xl">Message us</span>
          </a>
          <a href={`mailto:${CONTACT.email}`} className="group col-span-2 block sm:col-span-1">
            <span className="eyebrow text-[10px] text-bone/40">Write</span>
            <span className="mt-1 block break-all font-display text-xl transition-colors group-hover:text-gold lg:text-2xl">{CONTACT.email}</span>
          </a>
          <div className="col-span-2 sm:col-span-1">
            <span className="eyebrow text-[10px] text-bone/40">Visit</span>
            <span className="mt-1 block font-display text-xl lg:text-2xl">{CONTACT.address}</span>
          </div>
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
              <span><span className="block font-deva text-2xl">अक्षयवृक्षः</span><span className="font-display text-3xl">AkshayVriksha</span></span>
            </div>
            <p className="mt-4 text-sm text-gold">AMFI Registered Mutual Fund Distributor · {CONTACT.arn}</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-bone/55">
              Investments for your long-term goals. Plant a SIP today to aim for a brighter tomorrow in the shade of your own अक्षयवृक्षः.
            </p>
          </div>
          <nav aria-label="Footer">
            <Scramble text="Explore" className="eyebrow mb-4 text-bone/40" />
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
          <div className="space-y-2 text-sm text-bone/75 md:space-y-0">
            <Scramble text="Connect" className="eyebrow mb-4 text-bone/40" />
            <a className="block hover:text-gold" href={whatsappLink('Namaste!')} target="_blank" rel="noreferrer">WhatsApp</a>
            <a className="block hover:text-gold" href={CONTACT.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a className="block hover:text-gold" href={CONTACT.facebook} target="_blank" rel="noreferrer">Facebook</a>
            <a className="block hover:text-gold" href={`mailto:${CONTACT.email}`}>Email</a>
            <a className="block hover:text-gold" href={`tel:+${CONTACT.phoneIntl}`}>+91 {CONTACT.phone}</a>
            <div className="pt-4">
              <p className="eyebrow mb-2 text-bone/40">Travel socials</p>
              <a className="block hover:text-gold" href={CONTACT.travelTwitter} target="_blank" rel="noreferrer">GulshanOnWheels · X (Twitter) ↗</a>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="container-x pb-6 text-[11px] leading-relaxed text-bone/40">
            <p className="max-w-4xl">
              AkshayVriksha is an AMFI-registered mutual fund distributor ({CONTACT.arn}) and a Kotak Life Insurance advisor ({CONTACT.kotak}). Mutual fund investments are subject to market risks; read all scheme-related documents carefully. Insurance is the subject matter of solicitation. Past performance is not indicative of future returns.
            </p>
            <p className="mt-3">© {new Date().getFullYear()} AkshayVriksha · {CONTACT.address}</p>
          </div>
          <div className="select-none text-center whitespace-nowrap font-deva text-[19vw] leading-[0.82] text-foil sm:text-[23vw]" aria-hidden>
            अक्षयवृक्षः
          </div>
        </div>
      </footer>
    </div>
  );
}
