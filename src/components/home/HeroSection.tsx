import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Lock, Award, Globe, Compass, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { TRUST_METRICS } from '../../data/trustMetrics';

interface HeroSectionProps {
  onOpenConsultation: (goal?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenConsultation }) => {
  const getTrustIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-gold-dull" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-gold-dull" />;
      case 'Award':
        return <Award className="w-5 h-5 text-gold-dull" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-gold-dull" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-gold-dull" />;
    }
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-ivory-sand">
      {/* Subtle Luxury Background Geometry */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full bg-gold-dull/10 blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-pine-deep/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Editorial Copy Column (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-7 text-left"
          >
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-dull/40 bg-gold-dull/10 text-gold-dull text-xs font-semibold uppercase tracking-widest-luxury">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-radiant animate-pulse" />
              12+ Years of Trusted Wealth Stewardship
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-pine-deep font-normal leading-[1.12] tracking-tight">
              Your Wealth Has a Purpose.{' '}
              <span className="italic font-serif text-gold-dull block sm:inline">
                Let’s Build It Around Your Life.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-charcoal-slate/85 font-sans text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl">
              Bespoke goal-based investing, robust family protection, and global NRI advisory rooted in absolute fiduciary clarity and multi-generational trust.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button
                variant="gold"
                size="lg"
                icon={<ArrowUpRight className="w-4 h-4" />}
                onClick={() => onOpenConsultation('Schedule Portfolio Review')}
              >
                Schedule a Portfolio Review
              </Button>
              <Button
                variant="outline-pine"
                size="lg"
                icon={<Compass className="w-4 h-4" />}
                onClick={() => {
                  const el = document.querySelector('#philosophy');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Wealth Solutions
              </Button>
            </div>

            {/* Fast Summary Note */}
            <div className="pt-2 flex items-center gap-4 text-xs text-charcoal-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Zero Conflict of Interest
              </span>
              <span>•</span>
              <span>SEBI & AMFI Registered Framework</span>
              <span>•</span>
              <span className="hidden sm:inline">Private Client Confidentiality</span>
            </div>
          </motion.div>

          {/* Right Visual Architecture Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl bg-pine-deep text-ivory-sand p-7 sm:p-9 border border-gold-dull/30 shadow-luxury overflow-hidden">
              {/* Card Gold Trim Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-radiant/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-radiant/60 to-transparent" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-gold-radiant" />
                    <span className="text-xs uppercase tracking-widest-luxury font-serif text-gold-dull font-semibold">
                      The Inexhaustible Canopy
                    </span>
                  </div>
                  <span className="text-[11px] font-sans text-ivory-sand/60">
                    Akshaya Vriksha Model
                  </span>
                </div>

                {/* 3 Pillars Quick Visual Progression */}
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-lg bg-pine-secondary/80 border border-white/5 flex items-start gap-3.5">
                    <span className="text-gold-radiant font-serif font-bold text-base">01</span>
                    <div>
                      <h2 className="text-xs font-semibold text-ivory-sand uppercase tracking-wider">
                        Wealth Engine
                      </h2>
                      <p className="text-xs text-ivory-sand/70 mt-0.5">
                        High-conviction equity SIPs & bespoke mutual fund alpha.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-pine-secondary/80 border border-white/5 flex items-start gap-3.5">
                    <span className="text-gold-radiant font-serif font-bold text-base">02</span>
                    <div>
                      <h2 className="text-xs font-semibold text-ivory-sand uppercase tracking-wider">
                        Kotak Protection Shield
                      </h2>
                      <p className="text-xs text-ivory-sand/70 mt-0.5">
                        Estate ringfencing, MWP trust & whole life coverage.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-pine-secondary/80 border border-white/5 flex items-start gap-3.5">
                    <span className="text-gold-radiant font-serif font-bold text-base">03</span>
                    <div>
                      <h2 className="text-xs font-semibold text-ivory-sand uppercase tracking-wider">
                        Heritage Sanctuaries
                      </h2>
                      <p className="text-xs text-ivory-sand/70 mt-0.5">
                        Connecting generational capital with sacred roots & legacy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Summary */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-ivory-sand/75">Global NRI & Family Desk</span>
                  <span className="text-gold-dull font-semibold">Bespoke Advisory</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Strip (Directly Below Hero) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 md:mt-20 pt-10 border-t border-border-hairline"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_METRICS.map((metric) => (
              <div
                key={metric.id}
                className="group relative p-5 rounded-xl bg-white/70 border border-border-hairline hover:border-gold-dull/50 hover:bg-white hover:shadow-subtle transition-all duration-300 flex items-start gap-4"
              >
                <div className="p-2.5 rounded-lg bg-ivory-warm border border-gold-dull/20 text-pine-deep shrink-0 group-hover:scale-105 transition-transform">
                  {getTrustIcon(metric.iconName)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-pine-deep">
                      {metric.title}
                    </h2>
                  </div>
                  <p className="text-xs text-charcoal-muted leading-relaxed font-sans">
                    {metric.subtitle}
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-gold-dull mt-1 font-serif">
                    {metric.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <div className="text-center mt-12 hidden md:block">
        <a
          href="#philosophy"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest-luxury text-charcoal-muted hover:text-gold-dull transition-colors"
        >
          <span>Discover The 3 Pillars</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
