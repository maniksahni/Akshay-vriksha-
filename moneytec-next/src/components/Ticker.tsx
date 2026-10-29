import { FACTS } from '../data';

/** The original trust strip, kept word for word: credentials on a slow ticker (laptop) or a short stack (phone). */
export function Ticker() {
  const items = [
    <a key="arn" href={FACTS.amfiLocator} target="_blank" rel="noreferrer" className="hover:text-paper"><strong className="font-semibold text-paper">AMFI Registered Mutual Fund Distributor</strong> · {FACTS.arn} ↗</a>,
    <span key="gk"><strong className="font-semibold text-paper">{FACTS.name}</strong> · {FACTS.years}+ years of experience</span>,
    <a key="safe" href="#safety" className="text-amber hover:underline">Understand how your money is handled ↓</a>,
  ];
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-12 pr-12">
          {hidden ? <span>{it.props.children}</span> : it}
          <img src="./brand/moneytec-symbol.svg" width="16" height="15" alt="" className="opacity-70" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative z-10 border-y border-line bg-ink2 py-4 text-[13px] text-haze">
      <div className="hidden overflow-hidden md:block">
        <div className="marquee flex w-max">{row(false)}{row(true)}{row(true)}{row(true)}</div>
      </div>
      <div className="wrap flex flex-col items-center gap-1.5 text-center text-[12px] md:hidden">{items}</div>
    </div>
  );
}
