import { PointerEvent, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { whatsappLink } from '../../data/site';
import { sipSeries } from '../../utils/calculations';
import { formatINR } from '../../utils/formatters';
import { FadeUp, MaskLines, useTween } from '../ui/motion';

function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[13px] text-bone/60 sm:text-sm">{label}</span>
        <span className="font-display text-2xl tabular-nums text-bone sm:text-3xl">{display}</span>
      </div>
      <input
        type="range"
        className="range sm:mt-2"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--fill' as string]: `${fill}%` }}
      />
    </label>
  );
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(600);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export function Compounding() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(12);
  const [delay, setDelay] = useState(5);
  const [hover, setHover] = useState<number | null>(null);
  const [boxRef, width] = useWidth<HTMLDivElement>();

  const now = useMemo(() => sipSeries(monthly, rate, years), [monthly, rate, years]);
  const later = useMemo(() => sipSeries(monthly, rate, years, Math.min(delay, years)), [monthly, rate, years, delay]);
  const final = now[now.length - 1];
  const finalLater = later[later.length - 1];
  const cost = final.value - finalLater.value;

  const tValue = useTween(final.value);
  const tInvested = useTween(final.invested);
  const tCost = useTween(cost);

  // chart geometry
  const H = width < 500 ? 150 : 320;
  const pad = { l: 8, r: 8, t: 20, b: 28 };
  const iw = Math.max(10, width - pad.l - pad.r);
  const ih = H - pad.t - pad.b;
  const maxV = Math.max(final.value, 1);
  const px = (y: number) => pad.l + (y / years) * iw;
  const py = (v: number) => pad.t + ih - (v / maxV) * ih;
  const line = (s: { year: number; value: number; invested: number }[], key: 'value' | 'invested' = 'value') =>
    s.map((p, i) => `${i ? 'L' : 'M'}${px(p.year).toFixed(1)},${py(key === 'value' ? p.value : p.invested).toFixed(1)}`).join(' ');
  const area = (s: typeof now) => `${line(s)} L${px(years)},${py(0)} L${px(0)},${py(0)} Z`;

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const yr = Math.round(((e.clientX - r.left - pad.l) / iw) * years);
    setHover(Math.max(0, Math.min(years, yr)));
  };
  const hv = hover != null ? now[hover] : null;
  const ticks = Array.from(new Set([0, Math.round(years / 4), Math.round(years / 2), Math.round((3 * years) / 4), years]));

  return (
    <section id="compounding" className="relative overflow-hidden bg-moss py-14 sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[120px]" />
      <div className="container-x relative">
        <div className="grid gap-3 sm:gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <FadeUp>
              <p className="eyebrow mb-3 text-gold sm:mb-4">The eighth wonder</p>
            </FadeUp>
            <MaskLines
              lines={['Watch your money', <span className="italic text-gold">grow branches.</span>]}
              className="font-display text-[clamp(2.1rem,6vw,5.6rem)] leading-[0.95] tracking-[-0.02em] text-bone"
            />
          </div>
          <FadeUp delay={0.15}>
            <p className="max-w-md text-sm text-bone/60 sm:text-base lg:ml-auto">
              Move the sliders. Then see what happens if you wait a few years before you start. That gap is the price of waiting.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.1} className="mt-6 grid grid-cols-1 overflow-hidden rounded-[24px] border border-white/10 bg-night/40 backdrop-blur sm:mt-14 sm:rounded-[28px] lg:grid-cols-[380px_1fr] lg:grid-rows-[auto_1fr]">
          <div className="order-2 min-w-0 space-y-3 border-b border-white/10 px-5 py-4 sm:space-y-7 sm:p-9 lg:order-none lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:border-b-0 lg:border-r">
            <Range label="Monthly SIP" value={monthly} min={500} max={200000} step={500} onChange={setMonthly} display={formatINR(monthly, monthly >= 100000)} />
            <Range label="Time in the market" value={years} min={3} max={40} step={1} onChange={setYears} display={`${years} yrs`} />
            <Range label="Expected return (p.a.)" value={rate} min={6} max={15} step={0.5} onChange={setRate} display={`${rate}%`} />
            <div className="rounded-2xl border border-ember/30 bg-ember/10 px-4 py-2 sm:p-5">
              <Range label="What if you wait…" value={delay} min={0} max={10} step={1} onChange={setDelay} display={delay === 0 ? 'Start now' : `${delay} yrs`} />
            </div>
          </div>

          <div className="order-1 min-w-0 border-b border-white/10 px-5 pb-4 pt-5 sm:p-9 sm:pb-0 lg:order-none lg:col-start-2 lg:row-start-1 lg:border-b-0">
            <div className="grid grid-cols-3 gap-x-3 gap-y-3 sm:gap-6">
              <div className="col-span-3">
                <p className="text-xs text-bone/50 sm:text-sm">Start today, and in {years} years you could have</p>
                <p className="mt-1 font-display text-[clamp(2.8rem,7vw,6rem)] leading-none tabular-nums text-gold">{formatINR(tValue, true)}</p>
              </div>
              <div>
                <p className="eyebrow text-[9px] text-bone/40 sm:text-[11px]">You invest</p>
                <p className="mt-1 text-sm tabular-nums sm:mt-2 sm:text-xl">{formatINR(tInvested, true)}</p>
              </div>
              <div>
                <p className="eyebrow text-[9px] text-bone/40 sm:text-[11px]">Time adds</p>
                <p className="mt-1 text-sm tabular-nums text-gold-soft sm:mt-2 sm:text-xl">{formatINR(Math.max(0, tValue - tInvested), true)}</p>
              </div>
              <div>
                <p className="eyebrow text-[9px] text-ember sm:text-[11px]">Waiting costs</p>
                <p className="mt-1 text-sm tabular-nums text-[#F08A55] sm:mt-2 sm:text-xl">{delay === 0 ? '—' : formatINR(tCost, true)}</p>
              </div>
            </div>
          </div>

          <div className="order-3 flex min-w-0 flex-col px-5 pb-5 pt-4 sm:p-9 lg:order-none lg:col-start-2 lg:row-start-2">
            <div ref={boxRef} className="relative w-full min-w-0 overflow-hidden sm:mt-4">
              <svg width={width} height={H} className="block touch-none" onPointerMove={onMove} onPointerLeave={() => setHover(null)} role="img" aria-label={`Growth chart: ${formatINR(final.value, true)} after ${years} years.`}>
                <defs>
                  <linearGradient id="gNow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#D9AE5B" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#D9AE5B" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gLater" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#C4622D" stopOpacity="0.4" />
                    <stop offset="1" stopColor="#C4622D" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75, 1].map((f) => (
                  <line key={f} x1={pad.l} x2={pad.l + iw} y1={py(maxV * f)} y2={py(maxV * f)} stroke="rgba(243,238,229,0.06)" />
                ))}
                <path d={area(now)} fill="url(#gNow)" />
                {delay > 0 && <path d={area(later)} fill="url(#gLater)" />}
                <path d={line(now, 'invested')} stroke="rgba(243,238,229,0.35)" strokeDasharray="4 6" fill="none" />
                <path d={line(now)} stroke="#D9AE5B" strokeWidth="2.5" fill="none" />
                {delay > 0 && <path d={line(later)} stroke="#E07A45" strokeWidth="2" fill="none" />}
                {ticks.map((t) => (
                  <text key={t} x={px(t)} y={H - 6} fill="rgba(243,238,229,0.4)" fontSize="11" textAnchor={t === 0 ? 'start' : t === years ? 'end' : 'middle'}>
                    {t === 0 ? 'Today' : `Yr ${t}`}
                  </text>
                ))}
                {hv && (
                  <g>
                    <line x1={px(hv.year)} x2={px(hv.year)} y1={pad.t} y2={pad.t + ih} stroke="rgba(243,238,229,0.25)" />
                    <circle cx={px(hv.year)} cy={py(hv.value)} r="5" fill="#D9AE5B" />
                  </g>
                )}
              </svg>
              {hv && (
                <div
                  className="pointer-events-none absolute top-0 rounded-xl border border-white/10 bg-night/90 px-3 py-2 text-xs backdrop-blur"
                  style={{ left: Math.min(Math.max(px(hv.year) - 70, 0), width - 150), width: 150 }}
                >
                  <p className="text-bone/50">Year {hv.year}</p>
                  <p className="text-gold">{formatINR(hv.value, true)}</p>
                  {delay > 0 && <p className="text-[#F08A55]">{formatINR(later[hv.year].value, true)} if you wait</p>}
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-bone/50 sm:mt-4 sm:gap-x-6 sm:text-xs">
              <span className="flex items-center gap-2"><span className="h-0.5 w-5 bg-gold" />Start today</span>
              {delay > 0 && <span className="flex items-center gap-2"><span className="h-0.5 w-5 bg-[#E07A45]" />Start in {delay} yrs</span>}
              <span className="flex items-center gap-2"><span className="h-0 w-5 border-t border-dashed border-bone/50" />Amount invested</span>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-3 border-t border-white/10 pt-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:pt-6">
              <p className="max-w-md text-[10px] leading-relaxed text-bone/40 sm:text-[11px]">
                Illustration only, assuming a constant return. Mutual fund investments are subject to market risks; read all scheme-related documents carefully. Past performance does not guarantee future returns.
              </p>
              <a
                href={whatsappLink(`Namaste! I'd like to plan a SIP of ${formatINR(monthly)} a month for ${years} years.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-night transition-colors hover:bg-gold-soft"
              >
                Plan this SIP with us →
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
