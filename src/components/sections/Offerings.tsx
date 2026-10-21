import { motion } from 'framer-motion';
import { OFFERINGS, Offering, whatsappLink } from '../../data/site';
import { FadeUp, MaskLines } from '../ui/motion';
import { Scramble, Spotlight } from '../ui/effects';

const THEMES = [
  { bg: 'bg-forest', text: 'text-bone', sub: 'text-bone/60', line: 'border-white/10', accent: 'text-gold', btn: 'bg-gold text-night hover:bg-gold-soft', stroke: '#D9AE5B' },
  { bg: 'bg-bone', text: 'text-ink', sub: 'text-ink/60', line: 'border-ink/10', accent: 'text-ember', btn: 'bg-ink text-bone hover:bg-moss', stroke: '#C4622D' },
  { bg: 'bg-[#2A140C]', text: 'text-bone', sub: 'text-bone/60', line: 'border-white/10', accent: 'text-gold-soft', btn: 'bg-gold-soft text-night hover:bg-gold', stroke: '#E9CD8F' },
];

function Motif({ kind, stroke }: { kind: Offering['motif']; stroke: string }) {
  const draw = {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: '0px 0px -20% 0px' },
  };
  if (kind === 'roots') {
    const paths = [
      'M150 20 V120',
      'M150 120 C150 160 110 170 80 210 S40 270 30 290',
      'M150 120 C150 170 190 180 210 220 S250 270 270 290',
      'M150 120 C148 180 150 230 150 290',
      'M110 175 C90 190 70 190 50 200',
      'M195 190 C220 195 240 200 262 214',
      'M150 210 C130 235 120 260 105 288',
      'M150 210 C170 235 182 262 195 288',
    ];
    return (
      <svg viewBox="0 0 300 300" className="h-full w-full" fill="none">
        {paths.map((d, i) => (
          <motion.path key={i} d={d} stroke={stroke} strokeWidth={i === 0 ? 3 : 1.4} strokeLinecap="round" {...draw} transition={{ duration: 2, delay: 0.2 + i * 0.12, ease: 'easeInOut' }} />
        ))}
        <motion.circle cx="150" cy="20" r="10" fill={stroke} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1, type: 'spring' }} />
      </svg>
    );
  }
  if (kind === 'shield') {
    return (
      <svg viewBox="0 0 300 300" className="h-full w-full" fill="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.path
            key={i}
            d={`M${150 - (130 - i * 24)} ${260 - i * 6} A ${130 - i * 24} ${130 - i * 24} 0 0 1 ${150 + (130 - i * 24)} ${260 - i * 6}`}
            stroke={stroke}
            strokeWidth={1.4}
            {...draw}
            transition={{ duration: 1.6, delay: 0.2 + i * 0.15, ease: 'easeInOut' }}
          />
        ))}
        <motion.g initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1 }}>
          <circle cx="135" cy="222" r="9" fill={stroke} />
          <circle cx="165" cy="222" r="9" fill={stroke} />
          <circle cx="150" cy="238" r="6" fill={stroke} />
          <path d="M120 260c2-18 28-18 30 0M150 260c2-18 28-18 30 0" stroke={stroke} strokeWidth="1.4" />
        </motion.g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" fill="none">
      <motion.circle cx="150" cy="120" r="46" stroke={stroke} strokeWidth="1.4" {...draw} transition={{ duration: 1.6 }} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <motion.line
            key={i}
            x1={150 + Math.cos(a) * 58}
            y1={120 + Math.sin(a) * 58}
            x2={150 + Math.cos(a) * 76}
            y2={120 + Math.sin(a) * 76}
            stroke={stroke}
            strokeWidth="1.4"
            strokeLinecap="round"
            {...draw}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.05 }}
          />
        );
      })}
      <motion.path
        d="M60 290 V250 H90 V220 L110 200 L125 150 L150 95 L175 150 L190 200 L210 220 V250 H240 V290 Z"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
        {...draw}
        transition={{ duration: 2.2, delay: 0.3, ease: 'easeInOut' }}
      />
      <motion.path d="M135 290 V255 a15 15 0 0 1 30 0 V290" stroke={stroke} strokeWidth="1.4" {...draw} transition={{ duration: 1, delay: 1.6 }} />
      <motion.path d="M150 95 V80 M150 80 l12 6 -12 6" stroke={stroke} strokeWidth="1.4" {...draw} transition={{ duration: 0.6, delay: 2.2 }} />
    </svg>
  );
}

function Panel({ o, i }: { o: Offering; i: number }) {
  const t = THEMES[i % THEMES.length];
  return (
    <Spotlight className="w-full rounded-[24px] lg:rounded-[28px]" tilt={3} color={i === 1 ? 'rgba(196,98,45,0.14)' : 'rgba(233,205,143,0.14)'}>
    <article
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-[24px] ${t.bg} ${t.text} p-6 sm:p-8 lg:min-h-[560px] lg:rounded-[28px] lg:p-14`}
    >
      <div className="pointer-events-none absolute -bottom-6 -right-2 select-none font-deva text-[7rem] leading-none opacity-[0.06] lg:-bottom-[6vw] lg:-right-[2vw] lg:text-[clamp(8rem,22vw,20rem)]">{o.hindi}</div>
      <div className="flex items-start justify-between">
        <span className={`font-display text-5xl leading-none lg:text-8xl ${t.accent}`}>{o.no}</span>
        <span className={`eyebrow text-[10px] ${t.sub}`}>{o.no} / {String(OFFERINGS.length).padStart(2, '0')}</span>
      </div>
      <div className="relative mt-6 grid gap-10 lg:mt-auto lg:grid-cols-[1.25fr_1fr] lg:items-end">
        <div>
          <h3 className="font-display text-[2.3rem] leading-[0.95] tracking-[-0.02em] lg:text-[clamp(2.6rem,6vw,5.6rem)]">{o.title}</h3>
          <p className={`mt-2 font-display text-xl italic leading-snug lg:mt-4 lg:text-3xl ${t.accent}`}>{o.line}</p>
          <p className={`mt-4 max-w-xl text-sm leading-relaxed lg:mt-6 lg:text-base ${t.sub}`}>{o.body}</p>
          {/* phones: compact chips; desktop: ruled list */}
          <ul className="mt-5 flex flex-wrap gap-2 lg:hidden">
            {o.points.map((p) => (
              <li key={p} className={`rounded-full border px-3 py-1.5 text-xs ${t.line}`}>{p}</li>
            ))}
          </ul>
          <ul className={`mt-8 hidden max-w-xl grid-cols-2 border-t lg:grid ${t.line}`}>
            {o.points.map((p) => (
              <li key={p} className={`flex items-center gap-3 border-b py-3 text-sm ${t.line}`}>
                <span className={`h-1.5 w-1.5 rounded-full bg-current ${t.accent}`} />
                {p}
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink(`Namaste! I'm interested in ${o.title}.`)}
            target="_blank"
            rel="noreferrer"
            className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors lg:mt-8 lg:h-12 lg:px-6 ${t.btn}`}
          >
            {o.cta} →
          </a>
        </div>
        <div className="mx-auto hidden aspect-square w-full max-w-[360px] lg:block">
          <Motif kind={o.motif} stroke={t.stroke} />
        </div>
      </div>
    </article>
    </Spotlight>
  );
}

export function Offerings() {
  return <section id="offerings" className="bg-night py-16 lg:py-24"><div className="container-x">
    <FadeUp><Scramble text="What we offer" className="eyebrow mb-4 text-gold" /><MaskLines lines={['Two branches,', <span className="italic text-gold">one tree.</span>]} className="font-display text-[clamp(2.2rem,5vw,4.6rem)] leading-tight" /></FadeUp>
    <div className="mt-8 space-y-5 lg:mt-12 lg:space-y-8">{OFFERINGS.map((o,i) => <Panel key={o.no} o={o} i={i} />)}</div>
  </div></section>;
}
