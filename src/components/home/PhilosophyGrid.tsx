import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldAlert, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { PHILOSOPHY_PILLARS } from '../../data/philosophy';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface PhilosophyGridProps {
  onOpenConsultation: (goal?: string) => void;
}

export const PhilosophyGrid: React.FC<PhilosophyGridProps> = ({ onOpenConsultation }) => {
  const getPillarIcon = (id: string) => {
    switch (id) {
      case 'wealth':
        return <TrendingUp className="w-5 h-5 text-gold-dull" />;
      case 'protection':
        return <ShieldAlert className="w-5 h-5 text-gold-radiant" />;
      case 'experiences':
        return <Compass className="w-5 h-5 text-gold-dull" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gold-dull" />;
    }
  };

  return (
    <section id="philosophy" className="py-24 bg-ivory-warm border-y border-border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="gold" size="md">
            The Akshaya Vriksha Trinity
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-pine-deep font-normal tracking-tight">
            Wealth → Protection → Experiences
          </h2>
          <p className="text-charcoal-muted text-sm sm:text-base font-sans leading-relaxed">
            A cohesive philosophy engineered for high-achieving families: building multi-generational compounding, shielding what you have built, and unlocking the freedom to cherish your heritage.
          </p>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PHILOSOPHY_PILLARS.map((pillar, idx) => {
            const isDark = pillar.bgDark;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="flex"
              >
                <Card
                  variant={isDark ? 'dark' : 'light'}
                  padding="lg"
                  className={`flex flex-col justify-between w-full h-full relative group ${
                    isDark ? 'border-gold-dull/30 shadow-luxury' : 'border-border-hairline'
                  }`}
                >
                  {/* Top Bar Indicator */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-serif text-2xl font-bold tracking-tight ${
                          isDark ? 'text-gold-radiant' : 'text-gold-dull'
                        }`}
                      >
                        {pillar.number}
                      </span>
                      <div
                        className={`p-2 rounded-lg ${
                          isDark
                            ? 'bg-pine-deep border border-gold-dull/30'
                            : 'bg-ivory-warm border border-gold-dull/20'
                        }`}
                      >
                        {getPillarIcon(pillar.id)}
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <span
                        className={`text-[11px] font-sans font-bold uppercase tracking-widest-luxury block mb-1 ${
                          isDark ? 'text-gold-dull' : 'text-charcoal-muted'
                        }`}
                      >
                        {pillar.tagline}
                      </span>
                      <h3
                        className={`font-serif text-2xl font-semibold tracking-normal ${
                          isDark ? 'text-ivory-sand' : 'text-pine-deep'
                        }`}
                      >
                        {pillar.title}
                      </h3>
                    </div>

                    {/* Narrative Description */}
                    <p
                      className={`text-xs leading-relaxed font-sans ${
                        isDark ? 'text-ivory-sand/75' : 'text-charcoal-muted'
                      }`}
                    >
                      {pillar.description}
                    </p>

                    {/* Offerings Checklist */}
                    <div className="pt-2 border-t border-border-hairline/40 space-y-2.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider block ${
                          isDark ? 'text-gold-dull' : 'text-pine-deep'
                        }`}
                      >
                        Core Advisory Scope:
                      </span>
                      {pillar.offerings.map((item) => (
                        <div key={item} className="flex items-start gap-2.5 text-xs">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isDark ? 'text-gold-radiant' : 'text-gold-dull'
                            }`}
                          />
                          <span
                            className={
                              isDark ? 'text-ivory-sand/85' : 'text-charcoal-slate'
                            }
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-8 mt-6 border-t border-border-hairline/30">
                    <button
                      onClick={() => onOpenConsultation(`Pillar Inquiry: ${pillar.title}`)}
                      className={`w-full inline-flex items-center justify-between py-2.5 px-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        isDark
                          ? 'text-gold-dull hover:text-gold-radiant bg-pine-deep/70 hover:bg-pine-deep border border-gold-dull/30'
                          : 'text-pine-deep hover:text-gold-dull bg-ivory-warm hover:bg-ivory-sand border border-border-hairline'
                      }`}
                    >
                      <span>{pillar.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
