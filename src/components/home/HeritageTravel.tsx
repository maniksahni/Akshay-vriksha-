import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { HERITAGE_TOURS } from '../../data/heritageTours';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface HeritageTravelProps {
  onOpenConsultation: (goal?: string) => void;
}

export const HeritageTravel: React.FC<HeritageTravelProps> = ({ onOpenConsultation }) => {
  return (
    <section id="heritage-travel" className="py-24 bg-ivory-sand relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="gold" size="md" icon={<Compass className="w-3.5 h-3.5 text-gold-dull" />}>
            Pillar 03 • The Heritage Sanctuary
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-pine-deep font-normal tracking-tight">
            Wealth in Fruition: Reconnecting with Sacred Roots
          </h2>
          <p className="text-charcoal-muted text-sm sm:text-base font-sans leading-relaxed">
            True wealth is not merely a number on a statement—it is the freedom to experience timeless civilizational roots, pass down sacred traditions, and create unforgettable memories with your loved ones.
          </p>
        </div>

        {/* 3 Heritage Expeditions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-14">
          {HERITAGE_TOURS.map((tour, idx) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="flex"
            >
              <Card
                variant="light"
                padding="none"
                className="flex flex-col justify-between w-full h-full border-border-hairline bg-white shadow-subtle group hover:border-gold-dull/50"
              >
                {/* Visual Header Banner */}
                <div className="relative h-52 bg-pine-deep p-6 flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-pine-deep via-pine-deep/80 to-pine-secondary/60" />
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-radiant/10 rounded-full blur-2xl" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold-radiant px-2.5 py-0.5 rounded-full bg-pine-secondary/80 border border-gold-dull/40">
                      {tour.tag}
                    </span>
                    <span className="text-[11px] text-ivory-sand/75 font-mono">
                      {tour.imageTag}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1">
                    <div className="flex items-center gap-1.5 text-gold-dull text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{tour.region}</span>
                    </div>
                    <h3 className="font-serif text-xl text-ivory-sand font-semibold leading-snug">
                      {tour.title}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-charcoal-muted border-b border-border-hairline pb-3">
                      <Calendar className="w-3.5 h-3.5 text-gold-dull" />
                      <span className="font-medium text-pine-deep">{tour.duration}</span>
                    </div>

                    <p className="text-xs text-charcoal-slate leading-relaxed">
                      {tour.description}
                    </p>

                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pine-deep block">
                        Privileged Access:
                      </span>
                      {tour.experiences.map((exp) => (
                        <div key={exp} className="flex items-start gap-2 text-xs text-charcoal-muted">
                          <Sparkles className="w-3.5 h-3.5 text-gold-dull shrink-0 mt-0.5" />
                          <span>{exp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-border-hairline">
                    <button
                      type="button"
                      onClick={() => onOpenConsultation(`Heritage Concierge: ${tour.title}`)}
                      className="w-full inline-flex items-center justify-between py-2.5 px-3 rounded-md bg-ivory-warm hover:bg-pine-deep hover:text-gold-dull text-pine-deep text-xs font-semibold uppercase tracking-wider transition-all duration-200 border border-border-hairline"
                    >
                      <span>Inquire for Family Itinerary</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Narrative Bottom Philosophy */}
        <div className="p-8 rounded-2xl bg-ivory-warm border border-gold-dull/30 text-center max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-serif font-semibold text-gold-dull uppercase tracking-widest-luxury">
            The Philosophy of Completion
          </span>
          <p className="text-xs sm:text-sm text-charcoal-slate font-serif italic max-w-2xl mx-auto leading-relaxed">
            "We believe an investment portfolio should not merely generate compounding percentages; it should ultimately enrich the spirit and deepen bonds with the civilizational roots that nurtured us."
          </p>
        </div>
      </div>
    </section>
  );
};
