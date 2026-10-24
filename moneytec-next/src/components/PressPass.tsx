import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { PointerEvent, useState } from 'react';
import { FACTS, wa } from '../data';
import { Folio, Lines, Riso, Scribble, Stamp } from './print';
import { reduced } from './ui';

/** Gulshan's press pass hangs on a lanyard and swings when you push it. */
function Pass() {
  const swing = useMotionValue(0);
  const rotate = useSpring(swing, { stiffness: 60, damping: 6, mass: 1.2 });
  const strapSkew = useTransform(rotate, (r) => r * 0.35);
  const push = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const side = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    swing.set(-side * 14);
    setTimeout(() => swing.set(0), 120);
  };
  return (
    <div className="relative mx-auto flex w-full max-w-[340px] flex-col items-center" style={{ perspective: 900 }}>
      {/* lanyard */}
      <motion.div className="h-24 w-6 origin-top sm:h-32" style={{ skewX: strapSkew }} aria-hidden>
        <div className="mx-auto h-full w-6 border-x-2 border-ink bg-pink [background-image:repeating-linear-gradient(0deg,transparent_0_10px,rgba(20,20,19,0.18)_10px_12px)]" />
      </motion.div>
      <div className="z-10 -mt-1 h-5 w-10 border-2 border-ink bg-sun" aria-hidden />
      <motion.div className="relative -mt-1 w-full origin-top" style={{ rotate }} onPointerEnter={push} onPointerDown={push}>
        <div className="border-[3px] border-ink bg-[#FBF8F1]" style={{ boxShadow: '8px 8px 0 0 #2B50FF' }}>
          <div className="flex items-center justify-between bg-ink px-4 py-2 text-paper">
            <span className="headline text-xl tracking-[-0.02em]">PRESS</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em]">moneytec · all access</span>
          </div>
          <div className="grid grid-cols-[96px_1fr] gap-4 p-4">
            <div className="halftone-blue relative grid aspect-[3/4] place-items-center border-2 border-ink">
              <span className="headline bg-paper px-1 text-3xl">GK</span>
            </div>
            <div className="min-w-0">
              <p className="label text-ink/55">Name</p>
              <p className="headline text-2xl leading-none">{FACTS.name}</p>
              <p className="label mt-2 text-ink/55">Role</p>
              <p className="font-serif text-[17px] italic leading-tight">Your money guy, IRL</p>
            </div>
          </div>
          <div className="grid grid-cols-2 border-t-2 border-ink font-mono text-[11px]">
            <div className="p-3">
              <p className="text-ink/55">AMFI ARN</p>
              <p className="font-bold">{FACTS.arn}</p>
            </div>
            <div className="border-l-2 border-ink p-3">
              <p className="text-ink/55">KOTAK LIFE</p>
              <p className="font-bold">{FACTS.kotak}</p>
            </div>
          </div>
          <div className="halftone-ink h-6 border-t-2 border-ink opacity-80" aria-hidden />
        </div>
        <span className="absolute bottom-2 right-3">
          <Stamp className="text-base" color="#16B57F" rotate={-10}>Verified ✓</Stamp>
        </span>
      </motion.div>
      <p className="mt-3 font-hand text-xl text-blue">give it a push ↑</p>
    </div>
  );
}

export function PressPass() {
  const [copied, setCopied] = useState(false);
  return (
    <section id="gulshan" className="relative py-12 sm:py-20">
      <div className="wrap">
        <Folio no="06" title="Meet the guy" color="bg-mint" />
        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Pass />
          <div>
            <div className="relative inline-block">
              <Lines className="text-[clamp(2.6rem,6.4vw,5.6rem)]" lines={['Your money', <>guy, <Riso amount={4}>IRL.</Riso></>]} />
              <Scribble kind="star" className="absolute -right-12 -top-2 h-12 w-12" color="#FF3EA5" delay={0.8} />
            </div>
            {/* two-column newspaper body text on wider screens */}
            <div className="mt-5 gap-6 font-serif text-[1.15rem] leading-relaxed sm:columns-2">
              <p>
                <span className="float-left mr-2 mt-1 font-display text-[3.4rem] font-extrabold leading-[0.8]">G</span>
                ulshan Kohli is an electronics engineer turned mutual fund distributor. For {FACTS.years}+ years he has helped people start SIPs, stick with them, and protect their families with the right cover.
              </p>
              <p className="mt-3">No call centres, no bots, no product-of-the-month. You message him, he replies. Your money goes straight from your bank to the fund house or insurer, in your name, and never passes through moneytec.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={wa('Hey Gulshan! Found you on moneytec. Can we talk about my money plans?')} target="_blank" rel="noreferrer" className="btn-pink">Say hi on WhatsApp →</a>
              <a href={`tel:+${FACTS.phoneIntl}`} className="btn-paper">Call {FACTS.phone}</a>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12px]">
              <a href={FACTS.amfiLocator} target="_blank" rel="noreferrer" className="underline decoration-2 underline-offset-4 hover:text-blue">Verify {FACTS.arn} on AMFI ↗</a>
              <button onClick={() => navigator.clipboard?.writeText(FACTS.kotak).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })} className="underline decoration-2 underline-offset-4 hover:text-blue">
                {copied ? 'Copied ✓' : `Copy Kotak code ${FACTS.kotak}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
