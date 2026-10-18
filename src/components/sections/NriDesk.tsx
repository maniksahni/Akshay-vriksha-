import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CITIES, NRI_STEPS, whatsappLink } from '../../data/site';
import { FadeUp, MaskLines } from '../ui/motion';

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function Clock({ city, tz, now }: { city: string; tz: string; now: Date }) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const h = get('hour'), m = get('minute'), s = get('second');
  const awake = h >= 8 && h < 21;
  return (
    <div className="group flex items-center gap-3 border-b border-ink/10 py-3 sm:gap-4 sm:py-4">
      <svg viewBox="0 0 40 40" className="hidden h-10 w-10 shrink-0 sm:block">
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeOpacity="0.2" />
        <line x1="20" y1="20" x2={20 + 9 * Math.sin(((h % 12) + m / 60) * (Math.PI / 6))} y2={20 - 9 * Math.cos(((h % 12) + m / 60) * (Math.PI / 6))} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="20" x2={20 + 13 * Math.sin(m * (Math.PI / 30))} y2={20 - 13 * Math.cos(m * (Math.PI / 30))} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="20" y1="20" x2={20 + 15 * Math.sin(s * (Math.PI / 30))} y2={20 - 15 * Math.cos(s * (Math.PI / 30))} stroke="#C4622D" strokeWidth="1" strokeLinecap="round" />
      </svg>
      <div className="flex-1">
        <p className="font-display text-xl leading-none sm:text-2xl">{city}</p>
        <p className="mt-1 text-[11px] text-ink/50 sm:text-xs">{awake ? 'Good time for a call' : 'Resting hours'}</p>
      </div>
      <p className="font-display text-2xl tabular-nums sm:text-3xl">
        {String(h).padStart(2, '0')}
        <span className="animate-pulse">:</span>
        {String(m).padStart(2, '0')}
      </p>
    </div>
  );
}

export function NriDesk() {
  const now = useNow();
  const stepsRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ['start 75%', 'end 55%'] });
  const lineH = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="nri" className="relative overflow-hidden bg-bone py-24 text-ink sm:py-32">
      <div className="pointer-events-none absolute -top-10 left-0 select-none whitespace-nowrap font-display text-[22vw] italic leading-none text-ink/[0.035]">abroad · videsh</div>
      <div className="container-x relative grid gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <FadeUp>
            <p className="eyebrow mb-4 text-ember">Global NRI Desk</p>
          </FadeUp>
          <MaskLines
            lines={['Far from home.', <span className="italic text-ember">Close to your roots.</span>]}
            className="font-display text-[clamp(2.6rem,5.6vw,5.2rem)] leading-[0.95] tracking-[-0.02em]"
          />
          <FadeUp delay={0.1}>
            <p className="mt-6 max-w-md leading-relaxed text-ink/60">
              Mutual fund investments for NRIs all over the world, and online insurance plans to protect the family back home. Wherever you wake up, we are a message away.
            </p>
          </FadeUp>
          <FadeUp delay={0.2} className="mt-10 grid max-w-md grid-cols-2 gap-x-5 sm:block">
            {CITIES.map((c) => (
              <Clock key={c.city} {...c} now={now} />
            ))}
          </FadeUp>
        </div>

        <div>
          <ol ref={stepsRef} className="relative ml-4 border-l border-ink/10 sm:ml-6">
            <motion.span style={{ height: lineH }} className="absolute -left-px top-0 w-px bg-ember" />
            {NRI_STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                className="relative pb-16 pl-10 last:pb-0 sm:pl-14"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="absolute -left-[18px] top-0 grid h-9 w-9 place-items-center rounded-full border border-ink/15 bg-bone font-display text-lg">{i + 1}</span>
                <p className="eyebrow text-ink/40">Step 0{i + 1}</p>
                <h3 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{s.title}</h3>
                <p className="mt-4 max-w-lg leading-relaxed text-ink/60">{s.body}</p>
              </motion.li>
            ))}
          </ol>
          <FadeUp className="ml-4 mt-14 sm:ml-6">
            <a
              href={whatsappLink("Namaste! I'm an NRI and would like to invest in India.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-ink pl-7 pr-2 text-[15px] font-semibold text-bone transition-colors hover:bg-moss"
            >
              Talk to the NRI desk
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ember text-bone">→</span>
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
