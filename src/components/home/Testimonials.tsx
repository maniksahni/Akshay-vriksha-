import React from 'react';
import { motion } from 'framer-motion';
import { Quote, MapPin, Award, CheckCircle } from 'lucide-react';
import { TESTIMONIALS } from '../../data/testimonials';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-ivory-warm border-y border-border-hairline relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="gold" size="md" icon={<Award className="w-3.5 h-3.5 text-gold-dull" />}>
            Client Vignettes & Trust
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-pine-deep font-normal tracking-tight">
            Enduring Relationships Across Continents
          </h2>
          <p className="text-charcoal-muted text-sm sm:text-base font-sans leading-relaxed">
            From Silicon Valley tech executives and London healthcare specialists to Indian industrial promoters, discover how our multi-decade stewardship shapes family legacies.
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="flex"
            >
              <Card
                variant="light"
                padding="lg"
                className="flex flex-col justify-between w-full h-full bg-white border-border-hairline shadow-subtle hover:border-gold-dull/60 relative"
              >
                {/* Quote Icon & Category */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-hairline pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dull px-2.5 py-0.5 rounded-full bg-ivory-warm border border-gold-dull/30">
                      {t.investorType}
                    </span>
                    <span className="text-[11px] font-serif italic text-charcoal-muted">
                      {t.relationshipYears}
                    </span>
                  </div>

                  <Quote className="w-6 h-6 text-gold-dull/40" />

                  <p className="text-xs sm:text-sm text-charcoal-slate font-sans leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                {/* Client Profile Footer */}
                <div className="pt-6 mt-6 border-t border-border-hairline flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pine-deep text-gold-dull flex items-center justify-center font-serif font-bold text-sm border border-gold-dull/30">
                      {t.avatarInitials}
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-semibold text-pine-deep">
                        {t.clientName}
                      </h3>
                      <p className="text-[11px] text-charcoal-muted line-clamp-1">
                        {t.role}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-gold-dull mt-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{t.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-14 pt-8 border-t border-border-hairline/80 flex flex-wrap items-center justify-center gap-8 text-xs text-charcoal-muted">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> 100% Paperless Cross-Border Onboarding
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Direct Clearing via NSE/BSE & AMCs
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Zero Custody Risk
          </span>
        </div>
      </div>
    </section>
  );
};
