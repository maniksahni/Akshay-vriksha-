import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CONTACT, TESTIMONIAL, VALUES } from '../../data/site';
import { CountUp, FadeUp, MaskLines } from '../ui/motion';
import { Scramble } from '../ui/effects';

export function Founder() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const archY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const ringR = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section id="founder" ref={ref} className="relative overflow-hidden bg-night py-14 sm:py-32">
      <div className="container-x grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        {/* desktop: tall arch portrait card */}
        <motion.div style={{ y: archY }} className="relative mx-auto hidden w-full max-w-[440px] lg:block">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full border border-gold/30 bg-gradient-to-b from-moss to-forest">
            <motion.svg style={{ rotate: ringR }} viewBox="0 0 400 400" className="absolute left-1/2 top-[18%] w-[130%] -translate-x-1/2 opacity-40" aria-hidden>
              {Array.from({ length: 14 }).map((_, i) => (
                <circle key={i} cx="200" cy="200" r={30 + i * 12} fill="none" stroke="#D9AE5B" strokeOpacity={0.5 - i * 0.03} strokeDasharray={i % 2 ? '2 6' : undefined} />
              ))}
            </motion.svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-[9rem] italic leading-none text-gold">GK</span>
              <span className="eyebrow mt-2 text-bone/50">Founder</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-night/50 p-5 backdrop-blur">
              <p className="font-display text-3xl">{CONTACT.founder}</p>
              <p className="text-sm text-bone/50">Electronics Engineer · Founder, AkshayVriksha</p>
            </div>
          </div>
        </motion.div>

        <div>
          <FadeUp>
            <Scramble text="The gardener" className="eyebrow mb-3 text-gold sm:mb-4" />
          </FadeUp>
          <MaskLines
            lines={['An engineer’s discipline,', <span className="italic text-gold">a gardener’s patience.</span>]}
            className="font-display text-[clamp(2rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.02em]"
          />
          {/* phones: compact profile row instead of the tall arch */}
          <FadeUp className="mt-6 flex items-center gap-4 lg:hidden">
            <div className="relative grid h-24 w-[72px] shrink-0 place-items-center overflow-hidden rounded-t-full border border-gold/30 bg-gradient-to-b from-moss to-forest">
              <span className="font-display text-4xl italic leading-none text-gold">GK</span>
            </div>
            <div>
              <p className="font-display text-2xl leading-tight">{CONTACT.founder}</p>
              <p className="text-xs text-bone/50">Electronics Engineer · Founder</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-bone/65 sm:mt-8 sm:text-lg">
              {CONTACT.founder} facilitates goal-based SIP distribution tailored to each family’s needs. For over {CONTACT.years} years, AkshayVriksha has helped SIP investors build long-term wealth, and backed it with protection through Kotak Life Insurance, for Indian citizens and NRIs alike.
            </p>
            <motion.p
              className="mt-4 font-sign text-4xl text-gold lg:mt-6 lg:text-6xl"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
              aria-label={`Signed, ${CONTACT.founder}`}
            >
              {CONTACT.founder}
            </motion.p>
          </FadeUp>

          <div className="mt-6 grid grid-cols-3 border-y border-white/10 sm:mt-12">
            <div className="py-4 pr-3 sm:py-6 sm:pr-4">
              <p className="font-display text-4xl text-gold sm:text-6xl"><CountUp to={CONTACT.years} />+</p>
              <p className="mt-1 text-[11px] leading-tight text-bone/50 sm:mt-2 sm:text-sm">Years of stewardship</p>
            </div>
            <div className="border-l border-white/10 px-3 py-4 sm:px-4 sm:py-6">
              <p className="font-display text-4xl text-gold sm:text-6xl">2</p>
              <p className="mt-1 text-[11px] leading-tight text-bone/50 sm:mt-2 sm:text-sm">Branches of service</p>
            </div>
            <div className="border-l border-white/10 py-4 pl-3 sm:py-6 sm:pl-4">
              <p className="font-display text-4xl text-gold sm:text-6xl">∞</p>
              <p className="mt-1 text-[11px] leading-tight text-bone/50 sm:mt-2 sm:text-sm">Patience for compounding</p>
            </div>
          </div>

          <div className="founder-values mt-6 grid gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-8">
            {VALUES.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.1} className="flex items-baseline gap-3 sm:block">
                <p className="w-28 shrink-0 font-display text-lg text-bone sm:w-auto sm:text-2xl">{v.title}</p>
                <p className="text-xs leading-relaxed text-bone/50 sm:mt-2 sm:text-sm">{v.body}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x mt-20 sm:mt-32">
        <FadeUp>
          <figure className="relative mx-auto max-w-4xl text-center">
            <span className="absolute -top-16 left-1/2 -translate-x-1/2 font-display text-[10rem] leading-none text-gold/20">“</span>
            <blockquote className="relative font-display text-[clamp(1.5rem,3.6vw,3.2rem)] italic leading-[1.15] text-bone">{TESTIMONIAL.quote}</blockquote>
            <figcaption className="eyebrow mt-8 text-gold">{TESTIMONIAL.name}</figcaption>
          </figure>
        </FadeUp>
      </div>
    </section>
  );
}
