import { motion, PanInfo } from 'framer-motion';
import { useRef, useState } from 'react';
import { Folio, Lines, Riso, Stamp } from './print';

const MYTHS = [
  { m: 'Investing is for rich people', by: 'your uncle, at every wedding', f: 'Many SIPs start at ₹500 a month. Starting early matters way more than starting big.' },
  { m: 'You have to time the market', by: 'a guy on the internet', f: 'Time in the market beats timing it. A SIP keeps buying through ups and downs and averages your cost.' },
  { m: 'Mutual funds are basically gambling', by: 'the group chat', f: 'They’re regulated by SEBI and spread across many holdings. Risk depends on the type of fund you choose.' },
  { m: 'Insurance is an investment', by: 'that one pushy agent', f: 'Insurance protects, investing grows. Planning each for its own job usually gets you more of both.' },
  { m: 'You’re too young to plan', by: 'literally everyone', f: 'Being young is the cheat code. Time is the one thing compounding needs most.' },
  { m: 'NRIs can’t invest back home easily', by: 'a cousin in Toronto', f: 'NRIs invest through NRE/NRO accounts, mostly online. US and Canada residents can too, with select fund houses.' },
];

export function Clippings() {
  const [i, setI] = useState(0);
  const [busted, setBusted] = useState(false);
  const [dir, setDir] = useState(1);
  const dragged = useRef(false);

  const go = (d: number) => {
    setDir(d);
    setBusted(false);
    setI((n) => (n + d + MYTHS.length) % MYTHS.length);
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 450) go(info.offset.x < 0 ? 1 : -1);
    setTimeout(() => (dragged.current = false), 0);
  };
  const c = MYTHS[i];

  return (
    <section id="myths" className="relative py-12 sm:py-20">
      <div className="wrap">
        <Folio no="05" title="Fact-check desk" />
        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <Lines className="text-[clamp(2.6rem,6.4vw,5.6rem)]" lines={['Your uncle', 'said what?', <Riso amount={4}>Fact-check.</Riso>]} />
            <p className="mt-4 max-w-sm font-serif text-xl leading-snug">Clippings from the family WhatsApp. Tap to bust the myth, swipe for the next one.</p>
          </div>

          <div className="mx-auto w-full max-w-[460px]">
            <div className="relative">
              {/* clippings underneath */}
              <div aria-hidden className="absolute inset-0 translate-x-2 translate-y-3 rotate-2 border-2 border-ink bg-newsprint" />
              <div aria-hidden className="absolute inset-0 -translate-x-1 translate-y-1.5 -rotate-2 border-2 border-ink bg-[#F6F1E6]" />

              <motion.div
                key={i}
                className="relative cursor-grab touch-pan-y active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragStart={() => (dragged.current = true)}
                onDragEnd={onDragEnd}
                initial={{ x: dir * 70, opacity: 0, rotate: dir * 4 }}
                animate={{ x: 0, opacity: 1, rotate: -0.8 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              >
                <button
                  type="button"
                  onClick={() => !dragged.current && setBusted((b) => !b)}
                  className="relative block w-full border-2 border-ink bg-[#FBF8F1] p-5 text-left sm:p-6"
                  aria-label={busted ? `Fact: ${c.f}` : `Myth: ${c.m}. Tap to fact-check.`}
                >
                  <span className="tape -left-3 -top-3 -rotate-12" aria-hidden />
                  <div className="flex items-center justify-between border-b-2 border-ink pb-1.5 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span>The Family Gazette</span>
                    <span>No. {String(i + 1).padStart(2, '0')}/{String(MYTHS.length).padStart(2, '0')}</span>
                  </div>
                  <p className={`headline mt-3 text-[1.9rem] leading-[0.95] transition-colors duration-300 sm:text-[2.4rem] ${busted ? 'text-ink/35 line-through decoration-pink decoration-[5px]' : ''}`}>“{c.m}.”</p>
                  <p className="mt-2 font-serif text-[15px] italic text-ink/60">— {c.by}</p>

                  {/* the fact, printed in blue under the busted headline */}
                  <div className="grid transition-[grid-template-rows] duration-500 ease-out" style={{ gridTemplateRows: busted ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden">
                      <p className="mt-4 border-t-2 border-dashed border-ink/40 pt-3 font-display text-lg font-bold leading-snug text-blue sm:text-xl">✓ Fact: {c.f}</p>
                    </div>
                  </div>
                  <p className="mt-4 font-mono text-[11px] text-ink/55">{busted ? 'swipe or tap → for the next clipping' : 'tap to fact-check ↓'}</p>

                  <span className="absolute right-4 top-12">
                    <Stamp show={busted} className="text-2xl sm:text-3xl" rotate={-14}>False</Stamp>
                  </span>
                </button>
              </motion.div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-1.5" aria-hidden>
                {MYTHS.map((_, k) => (
                  <span key={k} className={`h-2 border-2 border-ink transition-all duration-300 ${k === i ? 'w-6 bg-pink' : 'w-2 bg-paper'}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => go(-1)} className="btn-paper h-11 w-11 px-0" aria-label="Previous clipping">←</button>
                <button onClick={() => setBusted((b) => !b)} className="btn-sun h-11 px-4 text-sm" aria-pressed={busted}>{busted ? 'Undo' : 'Fact-check'}</button>
                <button onClick={() => go(1)} className="btn-pink h-11 w-11 px-0" aria-label="Next clipping">→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
