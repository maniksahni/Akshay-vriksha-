import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { wa } from '../data';
import { Folio, Lines, Riso, Stamp } from './print';
import { EASE } from './ui';

const ITEMS = [
  { name: 'The Starter SIP', note: 'goal-based, risk-profiled, reviewed', price: 'from ₹500/mo', tag: 'bestseller' },
  { name: 'Tax-Saver (ELSS)', note: '80C, old regime · 3-yr lock-in', price: 'up to ₹1.5L/yr' },
  { name: 'Life Cover, Term', note: 'via Kotak Life · family sorted', price: 'quote on call' },
  { name: 'Health Cover', note: 'so one bill doesn’t eat your savings', price: 'quote on call' },
  { name: 'NRI Special', note: 'NRE/NRO, mostly online, your time zone', price: 'on the house*' },
  { name: 'Portfolio Check-up', note: 'overlap, idle cash, forgotten SIPs', price: 'on the house*' },
];

function LocalTimes() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const z = [['DEL', 'Asia/Kolkata'], ['DXB', 'Asia/Dubai'], ['LON', 'Europe/London'], ['NYC', 'America/New_York']];
  return (
    <div className="grid grid-cols-4 border-t-2 border-ink">
      {z.map(([c, tz], i) => (
        <div key={c} className={`px-2 py-2 text-center ${i ? 'border-l-2 border-ink' : ''}`}>
          <p className="font-mono text-[10px] text-ink/60">{c}</p>
          <p className="headline text-xl tabular-nums">{new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(now)}</p>
        </div>
      ))}
    </div>
  );
}

export function MenuBoard() {
  return (
    <section id="menu" className="relative py-12 sm:py-20">
      <div className="wrap">
        <Folio no="03" title="What we serve" color="bg-sun" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <Lines className="text-[clamp(2.6rem,6.4vw,5.6rem)]" lines={['Today’s', <Riso amount={4}>menu.</Riso>]} />
            <p className="mt-4 max-w-sm font-serif text-xl leading-snug">No 40-page brochures. Pick what you’re hungry for, and Gulshan walks you through it. Order as little or as much as you like.</p>
            <div className="relative mt-6 inline-block">
              <a href={wa('Hey Gulshan! I’d like to order from the moneytec menu.')} target="_blank" rel="noreferrer" className="btn-sun">Place an order on WhatsApp →</a>
            </div>
          </div>

          {/* chalk-free menu board: black frame, cream card, dotted price leaders */}
          <motion.div
            className="relative border-[3px] border-ink bg-[#FBF8F1]"
            style={{ boxShadow: '10px 10px 0 0 #FF3EA5' }}
            initial={{ rotate: -1.5, y: 30, opacity: 0 }}
            whileInView={{ rotate: -0.6, y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" aria-hidden />
            <div className="flex items-end justify-between border-b-[3px] border-ink px-4 pb-2 pt-5 sm:px-6">
              <p className="headline text-3xl sm:text-4xl">MENU</p>
              <p className="font-mono text-[11px] uppercase text-ink/60">served all day · India + abroad</p>
            </div>
            <ul className="px-4 py-2 sm:px-6">
              {ITEMS.map((it, i) => (
                <motion.li
                  key={it.name}
                  className="group relative border-b-2 border-dashed border-ink/25 py-3 last:border-0"
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.07, ease: EASE }}
                >
                  <a href={wa(`Hey Gulshan! I’d like to know about: ${it.name}.`)} target="_blank" rel="noreferrer" className="block">
                    <div className="flex items-baseline gap-2">
                      <span className="headline text-[1.35rem] decoration-pink decoration-[3px] underline-offset-4 group-hover:underline sm:text-2xl">{it.name}</span>
                      {it.tag && (
                        <Stamp className="shrink-0 px-1.5 py-0 text-[9px] sm:text-[10px]" color="#2B50FF" rotate={-6}>
                          {it.tag}
                        </Stamp>
                      )}
                      <span className="mb-1.5 flex-1 border-b-2 border-dotted border-ink/40" />
                      <span className="whitespace-nowrap font-mono text-[12px] font-bold sm:text-sm">{it.price}</span>
                    </div>
                    <p className="mt-0.5 font-serif text-[15px] italic text-ink/65">{it.note}</p>
                  </a>
                </motion.li>
              ))}
            </ul>
            <LocalTimes />
            <p className="border-t-2 border-ink px-4 py-2 font-mono text-[10px] text-ink/55 sm:px-6">
              *No separate advisory fee: as a mutual fund distributor and insurance advisor we’re paid commission by fund houses and the insurer, and we tell you upfront.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
