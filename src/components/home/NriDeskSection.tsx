import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Video, FileCheck, TrendingUp, RefreshCw, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { NRI_STEPS, CURRENCY_RATES } from '../../data/nriSteps';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { formatINR } from '../../utils/formatters';

interface NriDeskSectionProps {
  onOpenConsultation: (goal?: string) => void;
}

export const NriDeskSection: React.FC<NriDeskSectionProps> = ({ onOpenConsultation }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCY_RATES[0]);
  const [monthlyOverseasAmount, setMonthlyOverseasAmount] = useState(selectedCurrency.sampleAmount);

  const activeStep = NRI_STEPS[activeStepIndex];

  // Calculate INR equivalent for preview
  const inrEquivalent = monthlyOverseasAmount * selectedCurrency.rate;
  // 15-year compounding at 13.5%
  const i = 13.5 / 12 / 100;
  const n = 15 * 12;
  const projected15YrINR = inrEquivalent * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return <Video className="w-5 h-5 text-gold-dull" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-gold-dull" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-gold-dull" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5 text-gold-dull" />;
      default:
        return <Globe className="w-5 h-5 text-gold-dull" />;
    }
  };

  return (
    <section id="nri-desk" className="py-24 bg-pine-deep text-ivory-sand relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gold-radiant/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="dark" size="md" icon={<Globe className="w-3.5 h-3.5 text-gold-radiant" />}>
            Cross-Border Fiduciary Excellence
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory-sand font-normal tracking-tight">
            Global NRI Investment Desk
          </h2>
          <p className="text-ivory-sand/75 text-sm sm:text-base font-sans leading-relaxed">
            Seamlessly participate in the world’s fastest-growing major economy. We navigate cross-border compliance, NRE/NRO KYC, DTAA tax optimization, and RBI repatriation for NRIs in 15+ countries.
          </p>
        </div>

        {/* Currency Power Simulator Strip */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-pine-secondary/80 border border-gold-dull/30 shadow-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Currency Selector & Input */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest-luxury font-serif text-gold-dull font-semibold">
                  Diaspora Compounding Power
                </span>
                <span className="text-[11px] text-ivory-sand/50">• Select Country / Currency</span>
              </div>

              {/* Currency Selector Pills */}
              <div className="flex flex-wrap gap-2">
                {CURRENCY_RATES.map((curr) => (
                  <button
                    key={curr.currency}
                    type="button"
                    onClick={() => {
                      setSelectedCurrency(curr);
                      setMonthlyOverseasAmount(curr.sampleAmount);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      selectedCurrency.currency === curr.currency
                        ? 'bg-gold-radiant text-pine-deep shadow-gold-glow'
                        : 'bg-pine-deep text-ivory-sand/80 border border-white/10 hover:border-gold-dull/50'
                    }`}
                  >
                    <span>{curr.flag}</span>
                    <span>{curr.currency}</span>
                  </button>
                ))}
              </div>

              {/* Monthly Amount Preset */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-ivory-sand/80 font-medium">Monthly Allocation:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-gold-dull font-serif font-bold text-lg">
                    {selectedCurrency.symbol}
                  </span>
                  <input
                    type="number"
                    value={monthlyOverseasAmount}
                    onChange={(e) => setMonthlyOverseasAmount(Math.max(100, Number(e.target.value)))}
                    className="w-28 px-3 py-1 rounded bg-pine-deep border border-gold-dull/40 text-ivory-sand text-sm font-semibold focus:outline-none focus:border-gold-radiant"
                  />
                  <span className="text-xs text-ivory-sand/60">/ month</span>
                </div>
              </div>
            </div>

            {/* Live INR Output & Compounding Projection */}
            <div className="lg:col-span-5 p-4 rounded-xl bg-pine-deep border border-gold-dull/20 flex flex-col justify-center space-y-2 text-center lg:text-left">
              <div className="text-[11px] text-ivory-sand/60 uppercase tracking-wider">
                Monthly Indian SIP Equivalent @ ₹{selectedCurrency.rate}/{selectedCurrency.currency}
              </div>
              <div className="font-serif text-2xl sm:text-3xl text-gold-radiant font-bold">
                {formatINR(inrEquivalent)} <span className="text-xs font-sans text-ivory-sand/70 font-normal">/ month</span>
              </div>
              <div className="text-xs text-ivory-sand/80 pt-1 border-t border-white/10">
                15-Yr Projected Indian Wealth: <strong className="text-gold-dull">{formatINR(projected15YrINR, true)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Interactive Process Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Step Navigation Tabs (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs uppercase tracking-widest-luxury font-serif text-gold-dull font-semibold block mb-2">
              4-Step Cross-Border Roadmap
            </span>
            {NRI_STEPS.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <button
                  key={step.stepNumber}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl transition-all duration-300 flex items-start gap-4 border ${
                    isActive
                      ? 'bg-pine-secondary border-gold-radiant/60 shadow-gold-glow/20'
                      : 'bg-pine-secondary/40 border-white/5 hover:border-gold-dull/30 hover:bg-pine-secondary/60'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isActive
                        ? 'bg-gold-radiant text-pine-deep'
                        : 'bg-pine-deep text-gold-dull border border-white/10'
                    }`}
                  >
                    {getStepIcon(step.iconName)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-mono text-gold-dull">
                        Step {step.stepNumber}
                      </span>
                      <span className="text-[10px] text-ivory-sand/50 font-medium">
                        {step.timeframe}
                      </span>
                    </div>
                    <h3
                      className={`text-sm font-serif font-semibold ${
                        isActive ? 'text-gold-radiant' : 'text-ivory-sand'
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Active Step Deep-Dive Details (7 cols) */}
          <div className="lg:col-span-7 flex">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.stepNumber}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <Card
                  variant="dark"
                  padding="xl"
                  className="h-full flex flex-col justify-between border-gold-dull/30 bg-pine-secondary/90 shadow-luxury"
                >
                  <div className="space-y-6">
                    {/* Header Details */}
                    <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-3xl font-bold text-gold-radiant">
                          {activeStep.stepNumber}
                        </span>
                        <div>
                          <span className="text-[11px] font-mono text-gold-dull uppercase tracking-wider block">
                            Milestone Execution
                          </span>
                          <h3 className="font-serif text-xl sm:text-2xl text-ivory-sand font-semibold">
                            {activeStep.title}
                          </h3>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-pine-deep border border-gold-dull/30 text-gold-dull font-medium">
                        {activeStep.timeframe}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-ivory-sand/85 leading-relaxed font-sans">
                      {activeStep.description}
                    </p>

                    {/* Deep-Dive Bullet Points */}
                    <div className="space-y-3 pt-2">
                      <span className="text-xs uppercase font-bold text-gold-dull tracking-wider block">
                        What We Handle For You:
                      </span>
                      {activeStep.details.map((item) => (
                        <div key={item} className="flex items-start gap-3 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-gold-radiant shrink-0 mt-0.5" />
                          <span className="text-ivory-sand/90">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Key Benefit Highlight */}
                    <div className="p-3.5 rounded-lg bg-pine-deep border border-gold-dull/20 text-xs flex items-center gap-2.5">
                      <span className="text-gold-radiant font-bold uppercase tracking-wider shrink-0">
                        Key Assurance:
                      </span>
                      <span className="text-ivory-sand/90 font-medium">
                        {activeStep.keyBenefit}
                      </span>
                    </div>
                  </div>

                  {/* Step Action CTA */}
                  <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-ivory-sand/60">
                      Timezone flexible • Remote digital verification
                    </span>
                    <Button
                      variant="gold"
                      size="md"
                      icon={<ArrowUpRight className="w-4 h-4" />}
                      onClick={() => onOpenConsultation(`NRI Desk Onboarding: Step ${activeStep.stepNumber}`)}
                    >
                      Initiate NRI Advisory Setup
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
