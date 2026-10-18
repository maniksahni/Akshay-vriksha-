import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CONTACT, TESTIMONIAL, VALUES } from '../../data/site';
import { CountUp, FadeUp, MaskLines } from '../ui/motion';

export function Founder() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const archY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const ringR = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section id="founder" ref={ref} className="relative overflow-hidden bg-night py-24 sm:py-32">
      <div className="container-x grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div style={{ y: archY }} className="relative mx-auto w-full max-w-[300px] sm:max-w-[440px]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full border border-gold/30 bg-gradient-to-b from-moss to-forest">
            <motion.svg style={{ rotate: ringR }} viewBox="0 0 400 400" className="absolute left-1/2 top-[18%] w-[130%] -translate-x-1/2 opacity-40" aria-hidden>
              {Array.from({ length: 14 }).map((_, i) => (
                <circle key={i} cx="200" cy="200" r={30 + i * 12} fill="none" stroke="#D9AE5B" strokeOpacity={0.5 - i * 0.03} strokeDasharray={i % 2 ? '2 6' : undefined} />
              ))}
            </motion.svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-[7rem] italic sm:text-[9rem] leading-none text-gold">GK</span>
              <span className="eyebrow mt-2 text-bone/50">Founder</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-night/50 p-5 backdrop-blur">
              <p className="font-display text-3xl">{CONTACT.founder}</p>
              <p className="text-sm text-bone/50">Electronics Engineer · Founder, Akshaya Vriksha</p>
            </div>
          </div>
        </motion.div>

        <div>
          <FadeUp>
            <p className="eyebrow mb-4 text-gold">The gardener</p>
          </FadeUp>
          <MaskLines
            lines={['An engineer’s discipline,', <span className="italic text-gold">a gardener’s patience.</span>]}
            className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.02em]"
          />
          <FadeUp delay={0.1}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-bone/65">
              {CONTACT.founder} facilitates goal-based SIP distribution tailored to each family’s needs. For over {CONTACT.years} years, Akshaya Vriksha has helped SIP investors build long-term wealth, and backed it with protection through Kotak Life Insurance, for Indian citizens and NRIs alike.
            </p>
          </FadeUp>

          <div className="mt-12 grid grid-cols-3 border-y border-white/10">
            <div className="py-6 pr-4">
              <p className="font-display text-5xl text-gold sm:text-6xl"><CountUp to={CONTACT.years} />+</p>
              <p className="mt-2 text-xs text-bone/50 sm:text-sm">Years of stewardship</p>
            </div>
            <div className="border-l border-white/10 px-4 py-6">
              <p className="font-display text-5xl text-gold sm:text-6xl">3</p>
              <p className="mt-2 text-xs text-bone/50 sm:text-sm">Branches of service</p>
            </div>
            <div className="border-l border-white/10 py-6 pl-4">
              <p className="font-display text-5xl text-gold sm:text-6xl">∞</p>
              <p className="mt-2 text-xs text-bone/50 sm:text-sm">Patience for compounding</p>
            </div>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {VALUES.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.1}>
                <p className="font-display text-2xl text-bone">{v.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-bone/50">{v.body}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x mt-24 sm:mt-32">
        <FadeUp>
          <figure className="relative mx-auto max-w-4xl text-center">
            <span className="absolute -top-16 left-1/2 -translate-x-1/2 font-display text-[10rem] leading-none text-gold/20">“</span>
            <blockquote className="relative font-display text-[clamp(1.8rem,3.6vw,3.2rem)] italic leading-[1.15] text-bone">{TESTIMONIAL.quote}</blockquote>
            <figcaption className="eyebrow mt-8 text-gold">{TESTIMONIAL.name}</figcaption>
          </figure>
        </FadeUp>
      </div>
    </section>
  );
}
