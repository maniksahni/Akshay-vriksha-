import { motion } from 'framer-motion';
import { useState } from 'react';
import { CONTACT } from '../../data/site';
import { Scramble, Spotlight } from '../ui/effects';
import { FadeUp, MaskLines } from '../ui/motion';

const AMFI_LOCATOR = 'https://www.amfiindia.com/locate-distributor';

function CopyCode({ code }: { code: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(code).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        });
      }}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-bone/70 transition-colors hover:border-gold/60 hover:text-bone"
    >
      {done ? 'Copied ✓' : 'Copy code'}
    </button>
  );
}

/** You → fund house / insurer, with Akshaya Vriksha alongside as guide, never in the money path. */
function MoneyFlow() {
  return (
    <svg viewBox="0 0 560 220" className="h-auto w-full" fill="none" role="img" aria-label="Your money goes from your bank account straight to the fund house or insurer. Akshaya Vriksha guides you but never holds your money.">
      <defs>
        <linearGradient id="flow" x1="0" x2="1">
          <stop offset="0" stopColor="#D9AE5B" stopOpacity="0.2" />
          <stop offset="1" stopColor="#D9AE5B" />
        </linearGradient>
      </defs>
      {/* nodes */}
      <rect x="10" y="70" width="150" height="80" rx="18" stroke="#D9AE5B" strokeOpacity="0.5" />
      <text x="85" y="104" textAnchor="middle" fill="#F3EEE5" fontSize="17" fontFamily="Instrument Serif">You</text>
      <text x="85" y="126" textAnchor="middle" fill="#F3EEE5" fillOpacity="0.5" fontSize="11" fontFamily="Manrope">your bank account</text>

      <rect x="400" y="70" width="150" height="80" rx="18" fill="#D9AE5B" fillOpacity="0.12" stroke="#D9AE5B" />
      <text x="475" y="104" textAnchor="middle" fill="#F3EEE5" fontSize="17" fontFamily="Instrument Serif">Fund house / insurer</text>
      <text x="475" y="126" textAnchor="middle" fill="#F3EEE5" fillOpacity="0.5" fontSize="11" fontFamily="Manrope">units &amp; policy in your name</text>

      {/* the money path */}
      <path id="money" d="M160 110 H400" stroke="url(#flow)" strokeWidth="2" />
      <path d="M392 104 l8 6 -8 6" stroke="#D9AE5B" strokeWidth="2" strokeLinecap="round" />
      <circle r="5" fill="#E9CD8F">
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M160 110 H400" />
      </circle>
      <text x="280" y="98" textAnchor="middle" fill="#D9AE5B" fontSize="11" fontFamily="Manrope" letterSpacing="2">DIRECT</text>

      {/* the guide, off to the side */}
      <rect x="205" y="160" width="150" height="50" rx="25" stroke="#F3EEE5" strokeOpacity="0.25" strokeDasharray="4 5" />
      <text x="280" y="190" textAnchor="middle" fill="#F3EEE5" fillOpacity="0.8" fontSize="14" fontFamily="Instrument Serif">Akshaya Vriksha</text>
      <path d="M230 160 C 200 140, 160 130, 120 150" stroke="#F3EEE5" strokeOpacity="0.25" strokeDasharray="3 5" />
      <path d="M330 160 C 360 140, 400 130, 440 150" stroke="#F3EEE5" strokeOpacity="0.25" strokeDasharray="3 5" />
      <text x="280" y="40" textAnchor="middle" fill="#F3EEE5" fillOpacity="0.45" fontSize="11" fontFamily="Manrope">We guide, plan and service. We never hold your money.</text>
    </svg>
  );
}

/** Phones: the same story as MoneyFlow, stacked vertically so the labels stay readable. */
function MoneyFlowStacked() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 lg:hidden" aria-hidden>
      <div className="rounded-2xl border border-gold/40 px-3 py-3 text-center">
        <p className="font-display text-lg leading-none">You</p>
        <p className="mt-1 text-[10px] text-bone/50">your bank account</p>
      </div>
      <div className="relative flex w-14 flex-col items-center">
        <span className="text-[9px] uppercase tracking-[0.18em] text-gold">Direct</span>
        <span className="relative mt-1 block h-px w-full bg-gradient-to-r from-gold/20 to-gold">
          <motion.span
            className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-gold-soft"
            animate={{ left: ['0%', '92%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </span>
      </div>
      <div className="rounded-2xl border border-gold bg-gold/10 px-3 py-3 text-center">
        <p className="font-display text-lg leading-none">Fund house / insurer</p>
        <p className="mt-1 text-[10px] text-bone/50">in your name</p>
      </div>
      <p className="col-span-3 mt-2 rounded-full border border-dashed border-white/20 px-3 py-2 text-center text-[11px] text-bone/60">
        Akshaya Vriksha guides and services, and never holds your money.
      </p>
    </div>
  );
}

export function Trust() {
  return (
    <section id="trust" className="relative overflow-hidden bg-night py-14 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(243,238,229,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(243,238,229,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="container-x relative">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Scramble text="Trust, verified" className="eyebrow mb-2 text-[10px] text-gold lg:mb-4 lg:text-[11px]" />
            <MaskLines
              lines={[<>Don’t take our word for it. <span className="italic text-gold">Check it.</span></>]}
              className="max-w-3xl font-display text-[clamp(1.9rem,5vw,5rem)] leading-[0.98] tracking-[-0.02em]"
            />
          </div>
          <FadeUp delay={0.1} className="hidden lg:block">
            <p className="ml-auto max-w-md text-bone/60">
              Every credential on this page is public and checkable. And your money only ever moves between you and the regulated fund house or insurer.
            </p>
          </FadeUp>
        </div>

        <div className="mt-6 grid gap-3 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          <Spotlight className="rounded-[22px] border border-white/10 bg-forest/70 p-5 lg:p-8" tilt={4}>
            <p className="eyebrow text-[10px] text-bone/40">Mutual funds</p>
            <p className="mt-2 font-display text-2xl lg:text-3xl">AMFI-registered distributor</p>
            <p className="mt-3 font-display text-4xl tracking-wide text-gold lg:text-5xl">{CONTACT.arn}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a href={AMFI_LOCATOR} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gold px-3.5 py-1.5 text-xs font-semibold text-night hover:bg-gold-soft">
                Verify on AMFI ↗
              </a>
              <CopyCode code={CONTACT.arn} />
            </div>
          </Spotlight>
          <Spotlight className="rounded-[22px] border border-white/10 bg-forest/70 p-5 lg:p-8" tilt={4}>
            <p className="eyebrow text-[10px] text-bone/40">Insurance</p>
            <p className="mt-2 font-display text-2xl lg:text-3xl">Kotak Life Insurance advisor</p>
            <p className="mt-3 font-display text-4xl tracking-wide text-gold lg:text-5xl">{CONTACT.kotak}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CopyCode code={CONTACT.kotak} />
              <span className="text-[11px] text-bone/40">Quote this code to Kotak Life to confirm.</span>
            </div>
          </Spotlight>
          <Spotlight className="rounded-[22px] border border-white/10 bg-forest/70 p-5 lg:p-8" tilt={4}>
            <p className="eyebrow text-[10px] text-bone/40">Regulated end to end</p>
            <ul className="mt-3 space-y-3">
              {[
                ['SEBI', 'regulates mutual funds'],
                ['AMFI', 'registers fund distributors'],
                ['IRDAI', 'regulates insurance'],
              ].map(([k, v]) => (
                <li key={k} className="flex items-baseline gap-3 border-b border-white/10 pb-3 last:border-0">
                  <span className="w-16 font-display text-2xl text-gold">{k}</span>
                  <span className="text-sm text-bone/60">{v}</span>
                </li>
              ))}
            </ul>
          </Spotlight>
        </div>

        <motion.div
          className="mt-3 rounded-[22px] border border-white/10 bg-forest/40 p-4 lg:mt-6 lg:p-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid items-center gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
            <div>
              <p className="font-display text-2xl lg:text-4xl">Where does your money go?</p>
              <p className="mt-2 text-sm text-bone/55 lg:text-base">
                Straight from your bank to the fund house or the insurer. Units and policies are held in your name, never ours.
              </p>
            </div>
            <div className="hidden lg:block">
              <MoneyFlow />
            </div>
            <MoneyFlowStacked />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
