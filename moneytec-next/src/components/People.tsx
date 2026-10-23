import { motion } from 'framer-motion';
import { useState } from 'react';
import { FACTS, wa } from '../data';
import { EASE, FadeIn, Rise } from './ui';

export function Gulshan() {
  const [copied, setCopied] = useState(false);
  return (
    <section id="gulshan" className="relative py-16 sm:py-24">
      <div className="wrap">
        <div className="card grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
          {/* portrait panel: a monogram sticker, no stock photos */}
          <div className="relative grid min-h-[260px] place-items-center overflow-hidden border-b border-line bg-gradient-to-br from-volt to-[#4B2FD0] p-8 lg:min-h-[460px] lg:border-b-0 lg:border-r">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
            <motion.div
              className="relative grid h-40 w-40 place-items-center rounded-full bg-lime font-display text-6xl font-black tracking-tighter text-void sm:h-52 sm:w-52 sm:text-7xl"
              style={{ boxShadow: '0 0 0 6px #F4F2EC, 14px 18px 0 0 rgba(0,0,0,0.35)' }}
              initial={{ rotate: -14, scale: 0.8 }}
              whileInView={{ rotate: -6, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 160, damping: 12 }}
            >
              GK
            </motion.div>
            <span className="sticker absolute bottom-6 right-6 rotate-6 bg-chalk text-void">real human ✋</span>
            <span className="sticker absolute left-6 top-6 -rotate-6 bg-void text-lime">{FACTS.years}+ yrs</span>
          </div>

          <div className="p-5 sm:p-10">
            <p className="kicker text-lime">05 · who’s behind moneytec</p>
            <Rise className="h-display mt-3 text-[clamp(2rem,5vw,3.8rem)]">{'Your money guy, / *IRL.*'}</Rise>
            <FadeIn delay={0.1}>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-chalk/70 sm:text-base">
                Hi, I’m {FACTS.name}. Electronics engineer turned mutual fund distributor. For {FACTS.years}+ years I’ve helped people start SIPs, stick with them, and protect their families with the right cover. No call centres, no bots. You talk to me.
              </p>
            </FadeIn>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-white/[0.03] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-chalk/45">AMFI-registered MFD</p>
                <p className="mt-1 font-display text-2xl font-black tracking-tight text-lime">{FACTS.arn}</p>
                <a href={FACTS.amfiLocator} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-[13px] font-semibold text-chalk underline-offset-4 hover:text-lime hover:underline">
                  Verify on AMFI ↗
                </a>
              </div>
              <div className="rounded-2xl border border-line bg-white/[0.03] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-chalk/45">Kotak Life advisor</p>
                <p className="mt-1 font-display text-2xl font-black tracking-tight text-volt-soft">{FACTS.kotak}</p>
                <button
                  onClick={() => navigator.clipboard?.writeText(FACTS.kotak).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })}
                  className="mt-2 inline-flex text-[13px] font-semibold text-chalk underline-offset-4 hover:text-volt-soft hover:underline"
                >
                  {copied ? 'Copied ✓' : 'Copy code'}
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a href={`tel:+${FACTS.phoneIntl}`} className="btn-ghost">📞 {FACTS.phone}</a>
              <a href={wa('Hey Gulshan! Found you on moneytec. Can we talk about my money plans?')} target="_blank" rel="noreferrer" className="btn-lime">Say hi on WhatsApp →</a>
            </div>
            <p className="mt-4 text-[12px] text-chalk/45">Your money goes straight from your bank to the fund house or insurer, in your name. It never passes through us.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: '01', t: 'Say hi', d: 'WhatsApp or call. Tell us what you’re saving for, even if it’s just “I should start something”.', e: '👋' },
  { n: '02', t: 'Quick call', d: 'We map your goal, your timeline and how much risk you’re okay with. Real talk, no sales script.', e: '☕' },
  { n: '03', t: 'SIP goes live', d: 'KYC and paperwork done online. Your SIP starts, and we check in as life changes.', e: '🚀' },
];

export function Steps() {
  return (
    <section id="steps" className="relative py-16 sm:py-24">
      <div className="wrap">
        <p className="kicker text-coral">06 · how it goes down</p>
        <Rise className="h-display mt-3 text-[clamp(1.9rem,4.4vw,3.9rem)]">{'Three steps. / *Zero* stress.'}</Rise>
        <div className="relative mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {/* a lime line that draws across the steps */}
          <motion.span
            aria-hidden
            className="absolute left-8 right-8 top-[46px] hidden h-[3px] origin-left rounded-full bg-lime sm:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          />
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={0.15 + i * 0.12}>
              <div className="card relative h-full p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-lime font-display text-base font-black text-void">{s.n}</span>
                  <span className="text-3xl">{s.e}</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-chalk/60">{s.d}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.3}>
          <p className="mt-4 text-sm text-chalk/50">No pressure, no obligation. You decide every step.</p>
        </FadeIn>
      </div>
    </section>
  );
}
