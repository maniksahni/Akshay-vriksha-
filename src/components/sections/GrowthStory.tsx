import { useState } from 'react';
import { sipValue } from '../../utils/calculations';
import { formatINR } from '../../utils/formatters';
import { TreeIllustration } from '../TreeIllustration';

const MONTHLY = 10000;
const RATE = 12;
const YEARS = 25;

const CHAPTERS = [
  { year: 0, title: 'The seed', hindi: 'बीज', body: 'It starts as something you could hold in your palm: ₹10,000 a month, set aside before life can spend it.' },
  { year: 5, title: 'The roots', hindi: 'मूल', body: 'Nothing much shows above the ground. Markets fall, and you keep going. Every dip is monsoon rain; the roots go deeper.' },
  { year: 15, title: 'The branches', hindi: 'शाखा', body: 'Compounding takes over. Growth begins to grow on growth, and the tree starts adding more each year than you put in.' },
  { year: 25, title: 'The shade', hindi: 'छाया', body: 'Your family rests beneath what you planted. A home, an education, a retirement on your own terms.' },
];

export function GrowthStory() {
  const [chapter, setChapter] = useState(0);
  const ch = CHAPTERS[chapter];
  const value = sipValue(MONTHLY, RATE, ch.year * 12);
  const invested = MONTHLY * ch.year * 12;
  return (
    <section className="relative overflow-hidden bg-forest py-14 lg:py-20" aria-label="How a SIP grows, from seed to shade">
      <div className="container-x relative grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="eyebrow mb-4 text-gold">From seed to shade</p>
          <h2 className="font-display text-4xl lg:text-5xl">Explore the years of growth.</h2>
          <p className="mt-3 text-sm text-bone/60">Choose a milestone to explore this investment illustration.</p>
          <div className="my-6 grid grid-cols-4 gap-2" role="group" aria-label="Investment milestone">
            {CHAPTERS.map((c,i) => <button key={c.year} type="button" aria-pressed={chapter === i} onClick={() => setChapter(i)} className={`min-h-12 rounded-full border px-2 text-sm ${chapter === i ? 'border-gold bg-gold text-night' : 'border-white/20 text-bone hover:border-gold'}`}>Year {c.year}</button>)}
          </div>
          <div aria-live="polite"><p className="font-deva text-xl text-gold">{ch.hindi}</p><h3 className="mt-1 font-display text-3xl">{ch.title}</h3><p className="mt-3 max-w-lg text-sm leading-relaxed text-bone/65">{ch.body}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-5"><div><dt className="text-xs text-bone/55">Amount invested</dt><dd className="mt-2 font-display text-3xl">{formatINR(invested,true)}</dd></div><div><dt className="text-xs text-bone/55">Illustrated value</dt><dd className="mt-2 font-display text-3xl text-gold">{formatINR(value,true)}</dd></div></dl></div>
          <p className="mt-5 text-xs leading-relaxed text-bone/50">Illustration: ₹10,000/month at an assumed {RATE}% p.a. for up to {YEARS} years. Actual returns vary and are not guaranteed. Mutual fund investments are subject to market risks.</p>
        </div>
        <TreeIllustration className="hidden h-[460px] w-full self-end opacity-60 lg:block" />
      </div>
    </section>
  );
}
