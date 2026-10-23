import { motion } from 'framer-motion';
import { BadgePercent, Globe2, HeartPulse, Search, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import { MouseEvent, ReactNode, useEffect, useState } from 'react';
import { wa } from '../data';
import { FadeIn, Rise } from './ui';

/** Card with a pointer-following glow; the glow is CSS variables, so no re-renders. */
function Tile({ children, className = '', glow = 'rgba(212,255,58,0.16)' }: { children: ReactNode; className?: string; glow?: string }) {
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  return (
    <div onMouseMove={move} className={`card group p-5 transition-colors hover:border-white/20 sm:p-7 ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(420px circle at var(--x) var(--y), ${glow}, transparent 45%)` }} />
      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  );
}

function Ask({ what }: { what: string }) {
  return (
    <a href={wa(`Hey! I want to know more about ${what}.`)} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-lime underline-offset-4 hover:underline">
      Ask about this <span aria-hidden>↗</span>
    </a>
  );
}

function MiniChart() {
  return (
    <svg viewBox="0 0 300 110" className="mt-4 h-24 w-full sm:h-28" aria-hidden>
      <defs>
        <linearGradient id="bento-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#D4FF3A" stopOpacity="0.45" />
          <stop offset="1" stopColor="#D4FF3A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 100 C40 96 70 92 100 84 S150 70 180 56 S240 22 300 6 L300 110 L0 110Z"
        fill="url(#bento-fill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
      />
      <motion.path
        d="M0 100 C40 96 70 92 100 84 S150 70 180 56 S240 22 300 6"
        fill="none"
        stroke="#D4FF3A"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
      <motion.circle cx="300" cy="6" r="6" fill="#D4FF3A" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }} />
    </svg>
  );
}

function Clocks() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const zones = [
    ['Delhi', 'Asia/Kolkata'],
    ['Dubai', 'Asia/Dubai'],
    ['London', 'Europe/London'],
    ['NYC', 'America/New_York'],
  ];
  return (
    <div className="mt-4 grid grid-cols-4 gap-1.5">
      {zones.map(([c, tz]) => (
        <div key={c} className="rounded-xl bg-white/5 px-2 py-2 text-center">
          <p className="font-display text-[13px] font-bold tabular-nums sm:text-base">
            {new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(now)}
          </p>
          <p className="text-[10px] text-chalk/50">{c}</p>
        </div>
      ))}
    </div>
  );
}

export function Bento() {
  return (
    <section id="menu" className="relative py-16 sm:py-24">
      <div className="wrap">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="kicker text-volt-soft">02 · what we actually do</p>
            <Rise className="h-display mt-3 text-[clamp(1.9rem,4.4vw,3.9rem)]">{'One money person. / *Every* money question.'}</Rise>
          </div>
          <FadeIn delay={0.1}>
            <p className="max-w-md text-chalk/60 lg:ml-auto">No 40-page brochures. Pick what you need, we’ll walk you through it, and you decide. Zero pressure.</p>
          </FadeIn>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto] lg:gap-4">
          <FadeIn className="sm:col-span-2 lg:row-span-2">
            <Tile className="h-full">
              <div className="flex items-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-lime text-void"><TrendingUp size={20} /></span>
                <span className="chip">most popular</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-4xl">SIPs & mutual funds</h3>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-chalk/65">
                Goal-based SIPs that start from as little as ₹500 a month in many schemes. Funds picked for your goal and your comfort with risk, not for the hype of the week.
              </p>
              <MiniChart />
              <ul className="mt-2 flex flex-wrap gap-2">
                {['goal-based SIPs', 'risk profiling', 'fund selection', 'regular reviews'].map((t) => (
                  <li key={t} className="chip">{t}</li>
                ))}
              </ul>
              <Ask what="starting a SIP" />
            </Tile>
          </FadeIn>

          <FadeIn delay={0.05}>
            <Tile className="h-full" glow="rgba(139,108,255,0.22)">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-volt text-chalk"><ShieldCheck size={20} /></span>
              <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight">Life cover</h3>
              <p className="mt-2 text-sm leading-relaxed text-chalk/60">Term plans via Kotak Life, so your family is sorted no matter what.</p>
              <Ask what="life insurance" />
            </Tile>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Tile className="h-full" glow="rgba(255,107,74,0.2)">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-coral text-void"><HeartPulse size={20} /></span>
              <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight">Health cover</h3>
              <p className="mt-2 text-sm leading-relaxed text-chalk/60">One hospital bill shouldn’t wipe out years of saving.</p>
              <Ask what="health insurance" />
            </Tile>
          </FadeIn>

          <FadeIn delay={0.05} className="sm:col-span-2">
            <Tile className="h-full" glow="rgba(92,225,230,0.18)">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky text-void"><Globe2 size={20} /></span>
                <h3 className="font-display text-xl font-extrabold tracking-tight">NRI desk</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-chalk/60">Earning in $, £ or AED? Invest back home through NRE/NRO, mostly online, with a call at a time that works for you.</p>
              <Clocks />
              <Ask what="investing in India as an NRI" />
            </Tile>
          </FadeIn>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-4 lg:gap-4">
          {[
            { icon: <BadgePercent size={20} />, t: 'Tax-saving SIPs', d: 'ELSS funds: 80C deduction under the old regime, with a 3-year lock-in.', what: 'ELSS tax-saving funds' },
            { icon: <Target size={20} />, t: 'Goal planning', d: 'A home, a wedding, a gap year, retiring early. We put a number on it.', what: 'planning for a goal' },
            { icon: <Search size={20} />, t: 'Portfolio check-up', d: 'Already investing? We look for overlap, idle money and forgotten SIPs.', what: 'a portfolio review' },
          ].map((c, i) => (
            <FadeIn key={c.t} delay={i * 0.05}>
              <Tile className="h-full">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-lime">{c.icon}</span>
                <h3 className="mt-4 font-display text-lg font-extrabold tracking-tight">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-chalk/60">{c.d}</p>
                <Ask what={c.what} />
              </Tile>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
