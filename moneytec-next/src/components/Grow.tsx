import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { inr, sipValue } from './ui';

const MONTHLY = 5000;
const RATE = 12;
const YEARS = 30;
const MILESTONES = [
  { at: 0, line: 'It starts small.', sub: 'A regular contribution, built around your budget.' },
  { at: 10, line: 'Then it starts to show.', sub: 'A decade in, growth is doing a real share of the work.' },
  { at: 20, line: 'See the longer view.', sub: 'Explore how the assumed return changes the illustration.' },
  { at: 30, line: 'Keep the goal in view.', sub: 'Review progress and suitability as your circumstances change.' },
];

/** Pinned scene: scroll through thirty years of one SIP; the number and the curve grow with you. */
export function Grow() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [year, setYear] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [mobileYear, setMobileYear] = useState(10);
  useEffect(() => { const media = matchMedia("(max-width: 639px)"); const sync = () => setMobile(media.matches); sync(); media.addEventListener("change", sync); return () => media.removeEventListener("change", sync); }, []);
  const displayYear = mobile ? mobileYear : year;
  useMotionValueEvent(p, 'change', (v) => setYear(Math.round(Math.min(1, Math.max(0, (v - 0.05) / 0.85)) * YEARS)));

  const value = sipValue(MONTHLY, RATE, displayYear * 12);
  const invested = MONTHLY * 12 * displayYear;
  const ms = MILESTONES.reduce((a, m) => (displayYear >= m.at ? m : a), MILESTONES[0]);

  // the curve, precomputed; drawn up to the current scroll position
  const W = 600, H = 220;
  const path = useMemo(() => {
    const max = sipValue(MONTHLY, RATE, YEARS * 12);
    return Array.from({ length: YEARS + 1 }, (_, y) => `${y ? 'L' : 'M'}${((y / YEARS) * W).toFixed(1)},${(H - (sipValue(MONTHLY, RATE, y * 12) / max) * (H - 10)).toFixed(1)}`).join(' ');
  }, []);
  const draw = useTransform(p, [0.05, 0.9], [0, 1]);

  return (
    <section id="grow" ref={ref} className="relative h-[300svh] bg-snow">
      <div className="sticky top-[52px] flex h-[calc(100svh-52px)] flex-col justify-center overflow-hidden">
        <div className="wrap text-center">
          <p className="eyebrow text-graphite">One SIP. {YEARS} years.</p>
          <motion.p key={ms.line} className="display mt-2 text-[clamp(2.2rem,5.6vw,4.4rem)]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {ms.line}
          </motion.p>
          <p className="body-lg mx-auto mt-2 max-w-lg text-slate">{ms.sub}</p>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 items-end gap-3 sm:mt-10">
            <div>
              <p className="text-[12px] font-medium text-graphite sm:text-sm">Year</p>
              <p className="display text-[clamp(2rem,6vw,4rem)] tabular-nums">{displayYear}</p>
            </div>
            <div>
              <p className="text-[12px] font-medium text-graphite sm:text-sm">You put in</p>
              <p className="display text-[clamp(1.4rem,4vw,2.6rem)] tabular-nums text-slate">{inr(invested)}</p>
            </div>
            <div>
              <p className="text-[12px] font-medium text-graphite sm:text-sm">It could be</p>
              <p className="display grad text-[clamp(1.4rem,4.4vw,3rem)] tabular-nums">{inr(value)}</p>
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-6 h-[20vh] min-h-[120px] w-full max-w-3xl" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="grow-line" x1="0" x2="1">
                <stop offset="0" stopColor="#FF9F0A" />
                <stop offset="0.5" stopColor="#FF375F" />
                <stop offset="1" stopColor="#BF5AF2" />
              </linearGradient>
            </defs>
            <path d={path} fill="none" stroke="#E8E8ED" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            <motion.path d={path} fill="none" stroke="url(#grow-line)" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength: mobile ? mobileYear / YEARS : draw }} />
          </svg>
          {mobile && <label className="mt-4 block text-left text-sm text-slate">Explore the timeline · {mobileYear} years<input className="slider mt-2" type="range" min="1" max="30" value={mobileYear} onChange={e => setMobileYear(Number(e.target.value))} aria-label="Illustration timeline in years" /></label>}
          <p className="mt-4 text-[11px] text-graphite">₹5,000 a month at an assumed 12% a year, for illustration. Returns aren’t guaranteed; mutual funds are subject to market risks.</p>
        </div>
      </div>
    </section>
  );
}
