import { CONTACT } from '../../data/site';

const TEXT =
  'Building wealth is not about timing the market. It’s about time in the market. Plant a seed, water it every month, and let the years do what years do best.';
export function Manifesto() {
  return <section id="philosophy" className="bg-night py-16 lg:py-24"><div className="container-x grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end"><div><p className="eyebrow mb-6 text-gold">Our philosophy</p><h2 className="max-w-3xl font-display text-[clamp(2rem,4vw,3.8rem)] leading-tight">{TEXT}</h2></div><p className="max-w-md text-sm leading-relaxed text-bone/60">Founded by {CONTACT.founder}, AkshayVriksha has spent {CONTACT.years}+ years helping families plan for long-term goals and protection.</p></div></section>;
}
