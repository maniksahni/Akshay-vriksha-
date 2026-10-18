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
    <label className="block min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[11px] text-bone/60 lg:text-sm">{label}</span>
        <span className="shrink-0 font-display text-lg tabular-nums text-bone lg:text-3xl">{display}</span>
      </div>
      <input
        type="range"
        className="range lg:mt-2"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--fill' as string]: `${fill}%` }}
        aria-label={label}
      />
    </label>
  );
}

function useIsDesktop() {
  const [lg, setLg] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);
  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setLg(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return lg;
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
  const desktop = useIsDesktop();

  const now = useMemo(() => sipSeries(monthly, rate, years), [monthly, rate, years]);
  const later = useMemo(() => sipSeries(monthly, rate, years, Math.min(delay, years)), [monthly, rate, years, delay]);
  const final = now[now.length - 1];
  const finalLater = later[later.length - 1];
  const cost = final.value - finalLater.value;

  const tValue = useTween(final.value);
  const tInvested = useTween(final.invested);
  const tCost = useTween(cost);

  // chart geometry
  const H = desktop ? 320 : 120;
  const pad = { l: 8, r: 8, t: desktop ? 20 : 8, b: desktop ? 28 : 20 };
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
    <section id="compounding" className="relative overflow-hidden bg-moss py-10 lg:py-32">
      <div className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[120px]" />
      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <FadeUp>
              <p className="eyebrow mb-2 text-[10px] text-gold lg:mb-4 lg:text-[11px]">The eighth wonder</p>
            </FadeUp>
            <MaskLines
              lines={[<>Watch your money <br className="hidden lg:block" /><span className="italic text-gold">grow branches.</span></>]}
              className="font-display text-[clamp(1.8rem,5vw,5.6rem)] leading-[0.95] tracking-[-0.02em] text-bone"
            />
          </div>
          <FadeUp delay={0.15} className="hidden lg:block">
            <p className="ml-auto max-w-md text-bone/60">
              Move the sliders. Then see what happens if you wait a few years before you start. That gap is the price of waiting.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.1} className="mt-4 grid grid-cols-1 overflow-hidden rounded-[22px] border border-white/10 bg-night/40 backdrop-blur lg:mt-14 lg:grid-cols-[380px_1fr] lg:grid-rows-[auto_1fr] lg:rounded-[28px]">
          {/* result: first on phones and tablets so every slider move shows its effect */}
          <div className="order-1 min-w-0 border-b border-white/10 px-4 py-3 lg:order-none lg:col-start-2 lg:row-start-1 lg:border-b-0 lg:p-9 lg:pb-0">
            <div className="flex items-end justify-between gap-3 lg:block">
              <div className="min-w-0">
                <p className="text-[11px] text-bone/50 lg:text-sm">In {years} years you could have</p>
                <p className="font-display text-[clamp(2.2rem,8vw,6rem)] leading-none tabular-nums text-gold lg:mt-1">{formatINR(tValue, true)}</p>
              </div>
              <div className="shrink-0 space-y-0.5 text-right text-[11px] leading-tight tabular-nums lg:mt-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0 lg:text-left">
                <p className="text-bone/70"><span className="eyebrow mr-1 text-[9px] text-bone/40 lg:mb-2 lg:mr-0 lg:block lg:text-[11px]">Invest</span><span className="lg:text-xl">{formatINR(tInvested, true)}</span></p>
                <p className="text-gold-soft"><span className="eyebrow mr-1 text-[9px] text-bone/40 lg:mb-2 lg:mr-0 lg:block lg:text-[11px]">Growth</span><span className="lg:text-xl">{formatINR(Math.max(0, tValue - tInvested), true)}</span></p>
                <p className="text-[#F08A55]"><span className="eyebrow mr-1 text-[9px] text-ember lg:mb-2 lg:mr-0 lg:block lg:text-[11px]">Wait cost</span><span className="lg:text-xl">{delay === 0 ? '—' : formatINR(tCost, true)}</span></p>
              </div>
            </div>
          </div>

          {/* sliders: 2×2 grid until desktop, then a stacked left column */}
          <div className="order-2 grid min-w-0 grid-cols-2 gap-x-5 gap-y-1 border-b border-white/10 px-4 py-3 lg:order-none lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:block lg:space-y-7 lg:border-b-0 lg:border-r lg:p-9">
            <Range label="Monthly SIP" value={monthly} min={500} max={200000} step={500} onChange={setMonthly} display={formatINR(monthly, monthly >= 100000)} />
            <Range label="Years" value={years} min={3} max={40} step={1} onChange={setYears} display={`${years} yrs`} />
            <Range label="Return p.a." value={rate} min={6} max={15} step={0.5} onChange={setRate} display={`${rate}%`} />
            <div className="min-w-0 lg:rounded-2xl lg:border lg:border-ember/30 lg:bg-ember/10 lg:p-5">
              <Range label="If you wait" value={delay} min={0} max={10} step={1} onChange={setDelay} display={delay === 0 ? 'Now' : `${delay} yrs`} />
            </div>
          </div>

          <div className="order-3 flex min-w-0 flex-col px-4 pb-4 pt-3 lg:order-none lg:col-start-2 lg:row-start-2 lg:p-9">
            <div ref={boxRef} className="relative w-full min-w-0 overflow-hidden lg:mt-4">
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
                  <text key={t} x={px(t)} y={H - 5} fill="rgba(243,238,229,0.4)" fontSize={desktop ? 11 : 10} textAnchor={t === 0 ? 'start' : t === years ? 'end' : 'middle'}>
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
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-bone/50 lg:mt-4 lg:gap-x-6 lg:text-xs">
              <span className="flex items-center gap-2"><span className="h-0.5 w-5 bg-gold" />Start today</span>
              {delay > 0 && <span className="flex items-center gap-2"><span className="h-0.5 w-5 bg-[#E07A45]" />Start in {delay} yrs</span>}
              <span className="flex items-center gap-2"><span className="h-0 w-5 border-t border-dashed border-bone/50" />Amount invested</span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3 lg:mt-8 lg:gap-5 lg:pt-6">
              <p className="max-w-md text-[9px] leading-snug text-bone/40 lg:text-[11px] lg:leading-relaxed">
                Illustration only, at a constant return. Mutual fund investments are subject to market risks; read all scheme-related documents carefully.
              </p>
              <a
                href={whatsappLink(`Namaste! I'd like to plan a SIP of ${formatINR(monthly)} a month for ${years} years.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-gold px-4 text-xs font-semibold text-night transition-colors hover:bg-gold-soft lg:h-12 lg:px-6 lg:text-sm"
              >
                Plan this SIP →
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
