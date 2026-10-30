import { BrandLogo } from './BrandLogo';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { FormEvent, useRef, useState } from 'react';
import { DISCLAIMER, FACTS, NAV, SOCIALS, wa } from '../data';
import { CountUp, EASE, FadeIn, Scene, spotlight, Title, untilt, useMobile } from './ui';

/* ---------------------------------------------------------------- meet Gulshan */
const BIO = `${FACTS.name} is an electronics engineer turned mutual fund distributor. For ${FACTS.years}+ years, he has helped people start SIPs and explore protection for their families. From your first question to your next review, you can speak with him personally.`;

function MentorDetails() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
      <div>
        <p className="kicker">Your money. A personal connection.</p>
        <Title className="display mt-4 text-[clamp(2.4rem,5.4vw,4.8rem)]" text="A real person. / *On your side.*" />
        <p className="lede mt-5 max-w-lg">Behind every financial goal is a life worth understanding. Your plans deserve someone who listens.</p>
      </div>
      <FadeIn>
        <p className="text-[15px] leading-relaxed text-haze sm:text-[17px]">{BIO}</p>
        <div className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-6">
          <div><p className="display text-[clamp(2.2rem,4vw,3.4rem)]"><CountUp to={FACTS.years} suffix="+" className="grad" /></p><p className="text-[12px] text-dim">Years of experience</p></div>
          <div><p className="display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.25]">One-to-one</p><p className="text-[12px] text-dim">Personal conversations</p></div>
        </div>
        <a href={FACTS.amfiLocator} target="_blank" rel="noopener noreferrer" className="group mt-6 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white/[0.03] px-5 py-4 transition-colors hover:border-white/25">
          <span className="mentor-amfi-credential flex items-center gap-3"><BrandLogo brand="amfi" /><span><span className="block text-[12px] text-dim">AMFI Registered Mutual Fund Distributor</span><b className="text-[17px] tracking-[-0.01em]">{FACTS.arn}</b></span></span>
          <span aria-hidden className="text-haze transition-transform group-hover:translate-x-1">↗</span>
        </a>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={wa('Hi Gulshan! I would like to talk about my financial goals.')} target="_blank" rel="noreferrer" className="btn-light pr-2"><img src="./brand/partners/whatsapp.svg" alt="" width="17" height="17" />Talk to Gulshan <span className="arrow">↗</span></a>
          <a href={`tel:+${FACTS.phoneIntl}`} className="btn-ghost">Call directly ↗</a>
        </div>
        <a href="https://www.kotaklife.com/" target="_blank" rel="noopener noreferrer" className="mentor-kotak-credential"><BrandLogo brand="kotak" /><span>Kotak Life advisor<b>{FACTS.kotak}</b></span><span aria-hidden="true">↗</span></a>
      </FadeIn>
    </div>
  );
}

export function Gulshan() {
  const mobile = useMobile();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const clip = useTransform(p, [0, 0.6], ['inset(18% 34% 18% 34% round 40px)', 'inset(5% 7% 5% 7% round 32px)']);
  const scale = useTransform(p, [0, 0.7], [1.25, 1]);
  const nameY = useTransform(p, [0, 0.7], ['30%', '0%']);
  const nameOpacity = useTransform(p, [0.25, 0.6], [0, 1]);
  const introOpacity = useTransform(p, [0, 0.2], [1, 0]);

  const img = <img src="./images/gulshan-kohli.webp" alt="Gulshan Kohli, your personal point of contact at Moneytec" width="900" height="1037" loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_22%]" />;

  return (
    <section id="gulshan" data-dark aria-labelledby="mentor-title" className="relative">
      <h2 id="mentor-title" className="sr-only">Meet Gulshan Kohli</h2>
      {mobile ? (
        <div className="wrap pt-16">
          <FadeIn>
            <div className="relative mx-auto aspect-[4/5] max-h-[440px] overflow-hidden rounded-[28px]">
              {img}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-haze">The person behind moneytec</p>
                <p className="serif mt-1 text-[40px] leading-none">Gulshan Kohli</p>
                <p className="mt-1 text-[13px] text-haze">{FACTS.city}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      ) : (
        <div ref={ref} className="relative h-[220svh]">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <motion.p className="absolute inset-x-0 top-[9vh] z-10 text-center text-[11px] uppercase tracking-[0.3em] text-dim" style={{ opacity: introOpacity }}>The person behind moneytec</motion.p>
            <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
              <motion.div className="h-full w-full" style={{ scale }}>{img}</motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/30" />
            </motion.div>
            <motion.div className="absolute inset-x-0 bottom-[10vh] text-center" style={{ y: nameY, opacity: nameOpacity }}>
              <p className="serif text-[clamp(4rem,12vw,11rem)] leading-[0.9] tracking-[-0.03em]">Gulshan Kohli</p>
              <p className="mt-4 text-[13px] uppercase tracking-[0.3em] text-haze">{FACTS.city} · {FACTS.arn}</p>
            </motion.div>
          </div>
        </div>
      )}
      <div className="wrap-wide py-10 sm:py-28"><MentorDetails /></div>
    </section>
  );
}

function VaultRings() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rot = useTransform(p, [0, 1], [-60, 60]);
  const rot2 = useTransform(p, [0, 1], [40, -80]);
  const scale = useTransform(p, [0, 0.5], [0.6, 1.15]);
  const o = useTransform(p, [0, 0.35, 0.8, 1], [0, 1, 1, 0.2]);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex h-[110vmin] max-h-[1100px] justify-center">
      <motion.svg viewBox="0 0 600 600" className="h-full w-auto" style={{ scale, opacity: o }}>
        <motion.g style={{ rotate: rot, transformOrigin: '300px 300px' }}>
          <circle cx="300" cy="300" r="280" fill="none" stroke="#5BF0B5" strokeOpacity="0.14" strokeDasharray="2 10" />
          {Array.from({ length: 24 }).map((_, i) => <rect key={i} x="298" y="18" width="4" height="18" rx="2" fill="#5BF0B5" opacity={i % 3 ? 0.12 : 0.35} transform={`rotate(${i * 15} 300 300)`} />)}
        </motion.g>
        <motion.g style={{ rotate: rot2, transformOrigin: '300px 300px' }}>
          <circle cx="300" cy="300" r="220" fill="none" stroke="#64D2FF" strokeOpacity="0.16" />
          <circle cx="300" cy="300" r="220" fill="none" stroke="#64D2FF" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="60 1322" />
        </motion.g>
        <circle cx="300" cy="300" r="160" fill="none" stroke="#5BF0B5" strokeOpacity="0.1" strokeDasharray="1 6" />
      </motion.svg>
    </div>
  );
}

export function Safety() {
  const mobile = useMobile();
  return (
    <section id="safety" data-dark className="relative overflow-hidden py-14 sm:py-32">
      {!mobile && <VaultRings />}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[50vmin] w-[80vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,240,181,0.16),transparent)]" />
      <div className="wrap relative">
        <div className="text-center">
          <div className="relative mx-auto grid h-24 w-24 place-items-center">
            <div className="spin-slow absolute inset-0 rounded-full border border-dashed border-mint/40" />
            <div className="absolute inset-3 rounded-full bg-mint/20 blur-xl" />
            <svg viewBox="0 0 64 64" className="float-y relative h-12 w-12" aria-hidden>
              <defs><linearGradient id="lock" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#64D2FF" /><stop offset="1" stopColor="#5BF0B5" /></linearGradient></defs>
              <rect x="12" y="28" width="40" height="30" rx="8" fill="url(#lock)" />
              <path d="M20 28v-7a12 12 0 0 1 24 0v7" fill="none" stroke="url(#lock)" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="display mt-6 text-[clamp(2.4rem,6vw,5.2rem)]">Your money never<br /><span className="serif grad-mint">touches us.</span></h2>
          <p className="lede mx-auto mt-5 max-w-xl">This website never collects your investment or premium payment. If you choose a product, payment follows the fund house or insurer’s process.</p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-5">
          {[
            ['You stay in control.', 'Product decisions and payments are made by you through the relevant fund house or insurer.'],
            ['Your holdings are yours.', 'Mutual fund units and insurance policies are in your name, subject to the product terms.'],
            ['Check us yourself.', `AMFI-registered distributor ${FACTS.arn}. Kotak Life advisor ${FACTS.kotak}.`],
          ].map(([t, d], i) => (
            <FadeIn key={t} delay={i * 0.08} className="h-full">
              <div onPointerMove={spotlight} onPointerLeave={untilt} className="glass spot tilt h-full p-5 sm:p-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-mint">0{i + 1}</p>
                <p className="mt-2 text-[19px] font-semibold tracking-[-0.02em]">{t}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-haze">{d}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <div className="safety-brand-links"><a href={FACTS.amfiLocator} target="_blank" rel="noreferrer" aria-label="AMFI official distributor lookup"><BrandLogo brand="amfi" /></a><a href="https://www.kotaklife.com/" target="_blank" rel="noreferrer" aria-label="Kotak Life official website"><BrandLogo brand="kotak" /></a></div>
        <p className="mt-6 text-center"><a href={FACTS.amfiLocator} target="_blank" rel="noreferrer" className="link">Verify {FACTS.arn} on AMFI ↗</a></p>
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
    <section id="faq" data-dark className="py-14 sm:py-32">
      <Scene className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Title className="display mt-4 text-[clamp(2.2rem,4.6vw,4rem)]" text="A little clarity / *goes a long way.*" />
        </div>
        <div className="border-t border-line">
          {FAQ.map(([q, a], i) => {
            const on = open === i;
            return (
              <div key={q} className="border-b border-line">
                <button type="button" className="group flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6" aria-expanded={on} onClick={() => setOpen(on ? null : i)}>
                  <span className="flex items-baseline gap-4"><span className="text-[11px] tabular-nums text-dim">0{i + 1}</span><span className={`text-[17px] font-semibold tracking-[-0.02em] transition-colors sm:text-[21px] ${on ? 'text-paper' : 'text-paper/85 group-hover:text-paper'}`}>{q}</span></span>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-[18px] transition-all duration-500 ${on ? 'rotate-45 border-transparent bg-paper text-ink' : 'border-white/15 text-paper'}`} aria-hidden>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
                      <p className="max-w-2xl pb-6 pl-8 text-[15px] leading-relaxed text-haze sm:text-[16px]">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Scene>
    </section>
  );
}

/* ---------------------------------------------------------------- finale + starter form */
const WHO = ['Student', 'Working', 'Business owner', 'NRI'];
const WANT = ['Start a SIP', 'Save tax', 'Life cover', 'Health cover', 'Portfolio check-up'];

export function Finale() {
  const zoomRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: zp } = useScroll({ target: zoomRef, offset: ['start end', 'center center'] });
  const zScale = useTransform(zp, [0, 1], [1.5, 1]);
  const zBlur = useTransform(zp, [0, 0.8], ['blur(18px)', 'blur(0px)']);
  const zOpacity = useTransform(zp, [0, 0.7], [0, 1]);
  const glow = useTransform(zp, [0, 1], [0.2, 1]);
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

  return (
    <section id="start" data-dark className="relative overflow-hidden py-16 sm:py-36">
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: glow }}><div className="aurora" /></motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      <div className="wrap relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div ref={zoomRef} className="text-center lg:text-left" style={{ scale: zScale, filter: zBlur, opacity: zOpacity, transformOrigin: '30% 50%' }}>
          <Title className="display mt-5 text-[clamp(2.8rem,7vw,6.4rem)]" text="Your next chapter / *starts here.*" />
          <p className="lede mx-auto mt-5 max-w-md lg:mx-0">Tell us a little. It opens WhatsApp with everything filled in, and Gulshan replies personally.</p>
        </motion.div>
        <FadeIn>
          <form onSubmit={submit} className="glass ring-grad p-5 text-left sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
                  <p className="text-[28px] font-semibold tracking-[-0.03em]">Your draft is ready.</p>
                  <p className="mt-2 text-haze">Send your message in WhatsApp to start the conversation. Nothing has been submitted here.</p>
                  <button type="button" onClick={() => setSent(false)} className="link mt-5">Change something ›</button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-[12px] uppercase tracking-[0.18em] text-dim">I am</p>
                  <div className="mt-3 flex flex-wrap gap-2">{WHO.map((w) => <button key={w} type="button" aria-pressed={who === w} onClick={() => setWho(w)} className="chip">{w}</button>)}</div>
                  <p className="mt-6 text-[12px] uppercase tracking-[0.18em] text-dim">I’d like to</p>
                  <div className="mt-3 flex flex-wrap gap-2">{WANT.map((w) => <button key={w} type="button" aria-pressed={want.includes(w)} onClick={() => toggle(w)} className="chip">{w}</button>)}</div>
                  <label className="mt-6 block">
                    <span className="sr-only">Your name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className="field" />
                  </label>
                  <button type="submit" className="btn-glow mt-5 h-14 w-full text-[16px]"><img src="./brand/partners/whatsapp.svg" alt="" width="19" height="19" className="platform-action-logo" />Continue on WhatsApp</button>
                  <p className="mt-3 text-center text-[12px] text-dim">No obligation. Nothing is booked or invested from this website.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- footer */
function Letter({ ch, i, p }: { ch: string; i: number; p: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const start = 0.05 + i * 0.06;
  const y = useTransform(p, [start, start + 0.4], ['105%', '0%']);
  const rotate = useTransform(p, [start, start + 0.4], [12, 0]);
  return <motion.span className="grad inline-block" style={{ y, rotate, transformOrigin: '0% 100%', backgroundSize: '800% 100%', backgroundPosition: `${(i / 7) * 100}% 0` }}>{ch}</motion.span>;
}
function FooterMark() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  return (
    <p ref={ref} aria-hidden className="mt-12 select-none overflow-hidden pb-[0.06em] text-center text-[23vw] font-semibold leading-[0.84] tracking-[-0.07em]">
      {'moneytec'.split('').map((ch, i) => <Letter key={i} ch={ch} i={i} p={p} />)}
    </p>
  );
}
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-14 text-[12px] leading-relaxed text-dim">
      <div className="wrap-wide">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div className="col-span-2 sm:col-span-1">
            <img src="./brand/moneytec-logo-dark.svg" alt="Moneytec" width="200" height="39" className="h-8 w-auto" />
            <div className="footer-credential-logos"><a href={FACTS.amfiLocator} target="_blank" rel="noreferrer" aria-label="Verify registration on AMFI"><BrandLogo brand="amfi" /></a><a href="https://www.kotaklife.com/" target="_blank" rel="noreferrer" aria-label="Kotak Life official website"><BrandLogo brand="kotak" /></a></div>
            <p className="mt-4 max-w-md">{FACTS.name} is an AMFI-registered mutual fund distributor ({FACTS.arn}) and a Kotak Life Insurance advisor ({FACTS.kotak}). {DISCLAIMER}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-1.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-haze">Explore</p>
            {NAV.map((n) => <a key={n.href} href={n.href} className="w-fit hover:text-paper">{n.label}</a>)}
          </nav>
          <div className="flex flex-col gap-1.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-haze">Connect</p>
            <a href={wa('Hi!')} target="_blank" rel="noreferrer" className="footer-platform-link w-fit hover:text-paper"><img src="./brand/partners/whatsapp.svg" alt="" width="15" height="15" />WhatsApp</a>
            <a href={`tel:+${FACTS.phoneIntl}`} className="w-fit hover:text-paper">{FACTS.phone}</a>
            <a href={`mailto:${FACTS.email}`} className="w-fit hover:text-paper">Email</a>
            {SOCIALS.map((s) => <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="footer-platform-link w-fit hover:text-paper"><img src={`./brand/partners/${s.icon}.svg`} alt="" width="15" height="15" />{s.name}</a>)}
          </div>
        </div>
      </div>
      <FooterMark />
      <div className="wrap-wide flex flex-col gap-2 border-t border-line py-5 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} moneytec · {FACTS.city}</p>
        <a href="./brand/partners/CREDITS.txt" target="_blank" rel="noreferrer" className="hover:text-paper">Logo credits</a>
      </div>
    </footer>
  );
}
