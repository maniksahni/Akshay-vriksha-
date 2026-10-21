import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Scramble } from '../ui/effects';
import { MaskLines } from '../ui/motion';

// The four steps come straight from AkshayVriksha's own "Nurturing your financial journey" poster.
const STEPS = [
  {
    title: 'Facilitating investment solutions',
    body: 'A shield over the family and a plant that keeps growing. We bring mutual funds and insurance under one roof, so growth and protection are planned together.',
    tags: ['Mutual funds', 'Life & health cover'],
    theme: 'bg-forest text-bone',
    accent: 'text-gold',
    icon: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M60 100V58" />
        <path d="M60 70c-14 0-22-9-22-22 14 0 22 9 22 22zM60 62c0-14 8-24 24-24 0 14-8 24-24 24z" />
        <path d="M20 54C20 34 38 18 60 18s40 16 40 36" strokeDasharray="3 5" />
        <path d="M30 100h60" />
      </svg>
    ),
  },
  {
    title: 'Aligning with your personal goals',
    body: 'Your aspirations come first: a home, your children’s future, a retirement on your terms. The plan is built around them, not around a product.',
    tags: ['Risk profiling', 'Goal mapping'],
    theme: 'bg-bone text-ink',
    accent: 'text-ember',
    icon: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <circle cx="60" cy="60" r="40" />
        <circle cx="60" cy="60" r="26" />
        <circle cx="60" cy="60" r="12" />
        <path d="M60 60 96 24M86 24h10v10" />
      </svg>
    ),
  },
  {
    title: 'Working closely with you',
    body: 'A real relationship, not a call centre. Reviews when life changes, answers when markets wobble, and someone who knows your family’s story.',
    tags: ['Personal guidance', 'Regular reviews'],
    theme: 'bg-[#2A140C] text-bone',
    accent: 'text-gold-soft',
    icon: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 58 34 38l18 8 10-6 14 4 30 14" />
        <path d="M14 58l22 22 10 2 26 14c4 2 8-2 6-6l-14-12" />
        <path d="M52 46 40 60c-3 3 1 8 5 6l17-10" />
      </svg>
    ),
  },
  {
    title: 'Helping you select suitable products',
    body: 'From a ₹500 SIP to a family’s full protection, we help you choose what actually fits, and explain why.',
    tags: ['SIP', 'STP', 'SWP', 'Lumpsum', 'Term', 'ULIP', 'Guaranteed plans', 'Health'],
    theme: 'bg-gold text-night',
    accent: 'text-night',
    icon: (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="18" y="40" width="84" height="60" rx="10" />
        <path d="M42 40V30a8 8 0 0 1 8-8h20a8 8 0 0 1 8 8v10M18 64h84" />
        <path d="M54 64v8h12v-8" />
      </svg>
    ),
  },
];

function Card({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const s = STEPS[i];
  const n = STEPS.length;
  // each card shrinks a touch as the cards after it slide over
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.05]);
  const dim = useTransform(progress, [i / n, 1], [0, (n - 1 - i) * 0.12]);
  return (
    <div className="process-stage sticky min-h-[560px] h-[68svh] last:h-[88svh] lg:h-screen lg:last:h-screen" style={{ top: 0 }}>
      <div className="flex h-full items-start justify-center pt-[calc(76px+var(--i)*14px)] lg:items-center lg:pt-[calc(var(--i)*22px)]" style={{ ['--i' as string]: i }}>
        <motion.article
          style={{ scale }}
          className={`process-panel relative w-full max-w-[1180px] origin-top overflow-hidden rounded-[22px] ${s.theme} p-6 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.6)] lg:rounded-[28px] lg:p-14`}
        >
          <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />
          <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <span className={`font-display text-5xl leading-none lg:text-8xl ${s.accent}`}>0{i + 1}</span>
                <span className="h-px flex-1 bg-current opacity-20" />
                <span className={`h-12 w-12 lg:hidden ${s.accent}`}>{s.icon}</span>
              </div>
              <h3 className="mt-4 font-display text-[1.9rem] leading-[1] tracking-[-0.02em] lg:mt-8 lg:text-6xl">{s.title}</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed opacity-70 lg:mt-6 lg:text-lg">{s.body}</p>
              <ul className="mt-4 flex flex-wrap gap-2 lg:mt-8">
                {s.tags.map((t) => (
                  <li key={t} className="rounded-full border px-3 py-1 text-xs opacity-80 [border-color:color-mix(in_srgb,currentColor_25%,transparent)] lg:text-sm">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`hidden h-56 w-56 lg:block ${s.accent}`}>{s.icon}</div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section id="process" className="relative bg-night">
      <div className="container-x pb-2 pt-12 lg:pb-0 lg:pt-32">
        <Scramble text="How we work" className="eyebrow mb-2 text-[10px] text-gold lg:mb-4 lg:text-[11px]" />
        <MaskLines
          lines={[<>Nurturing your <span className="italic text-gold">financial journey.</span></>]}
          className="max-w-4xl font-display text-[clamp(1.9rem,5vw,5.2rem)] leading-[0.98] tracking-[-0.02em]"
        />
      </div>
      <div ref={ref} className="container-x relative">
        {STEPS.map((_, i) => (
          <Card key={i} i={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
