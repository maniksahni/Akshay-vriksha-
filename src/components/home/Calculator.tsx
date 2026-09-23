import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon, Sparkles, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { calculateSip, calculateLumpsum, calculateRequiredSipForGoal } from '../../utils/calculations';
import { formatINR, formatPercentage, formatYears } from '../../utils/formatters';

interface CalculatorProps {
  onOpenConsultation: (initialGoal?: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onOpenConsultation }) => {
  const [calcMode, setCalcMode] = useState<'sip' | 'lumpsum' | 'goal'>('sip');

  // SIP / Lumpsum Inputs
  const [monthlyAmount, setMonthlyAmount] = useState<number>(50000); // ₹50,000
  const [lumpSumAmount, setLumpSumAmount] = useState<number>(2500000); // ₹25 Lakhs
  const [targetGoalAmount, setTargetGoalAmount] = useState<number>(50000000); // ₹5 Crores
  const [returnRate, setReturnRate] = useState<number>(13.5); // 13.5%
  const [years, setYears] = useState<number>(15); // 15 years

  // Calculate results based on mode
  const sipResult = useMemo(() => {
    return calculateSip(monthlyAmount, returnRate, years);
  }, [monthlyAmount, returnRate, years]);

  const lumpsumResult = useMemo(() => {
    return calculateLumpsum(lumpSumAmount, returnRate, years);
  }, [lumpSumAmount, returnRate, years]);

  const goalResult = useMemo(() => {
    return calculateRequiredSipForGoal(targetGoalAmount, returnRate, years);
  }, [targetGoalAmount, returnRate, years]);

  // Current active summary
  const currentInvested = calcMode === 'sip' 
    ? sipResult.totalInvested 
    : calcMode === 'lumpsum' 
    ? lumpsumResult.totalInvested 
    : goalResult.totalInvested;

  const currentReturns = calcMode === 'sip' 
    ? sipResult.estimatedReturns 
    : calcMode === 'lumpsum' 
    ? lumpsumResult.estimatedReturns 
    : goalResult.estimatedReturns;

  const currentTotal = calcMode === 'sip' 
    ? sipResult.totalMaturityValue 
    : calcMode === 'lumpsum' 
    ? lumpsumResult.totalMaturityValue 
    : targetGoalAmount;

  // Donut chart calculations
  const returnsPercent = currentTotal > 0 ? (currentReturns / currentTotal) * 100 : 50;

  // SVG Donut calculation (Circumference 2 * PI * 40 = 251.32)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (returnsPercent / 100) * circumference;

  const handleStartPlan = () => {
    let summary = '';
    if (calcMode === 'sip') {
      summary = `SIP Plan: ${formatINR(monthlyAmount)}/mo for ${years} yrs @ ${returnRate}% (Target: ${formatINR(sipResult.totalMaturityValue, true)})`;
    } else if (calcMode === 'lumpsum') {
      summary = `Lumpsum Plan: ${formatINR(lumpSumAmount, true)} for ${years} yrs @ ${returnRate}% (Target: ${formatINR(lumpsumResult.totalMaturityValue, true)})`;
    } else {
      summary = `Goal Plan: Target ${formatINR(targetGoalAmount, true)} in ${years} yrs (Required SIP: ${formatINR(goalResult.requiredMonthlySip)}/mo)`;
    }
    onOpenConsultation(summary);
  };

  return (
    <section id="calculator" className="py-24 bg-ivory-sand relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gold-dull/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="gold" size="md" icon={<CalcIcon className="w-3.5 h-3.5 text-gold-dull" />}>
            Precision Compounding Engine
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-pine-deep font-normal tracking-tight">
            Interactive Wealth & SIP Architecture
          </h2>
          <p className="text-charcoal-muted text-sm sm:text-base font-sans leading-relaxed">
            Harness pure mathematical compounding: simulate disciplined monthly systematic allocations, one-time deployments, or target corpus engineering.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1.5 rounded-xl bg-ivory-warm border border-border-hairline shadow-inner">
              <button
                type="button"
                onClick={() => setCalcMode('sip')}
                className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  calcMode === 'sip'
                    ? 'bg-pine-deep text-gold-dull shadow-sm'
                    : 'text-charcoal-muted hover:text-pine-deep'
                }`}
              >
                Monthly SIP
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('lumpsum')}
                className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  calcMode === 'lumpsum'
                    ? 'bg-pine-deep text-gold-dull shadow-sm'
                    : 'text-charcoal-muted hover:text-pine-deep'
                }`}
              >
                Lumpsum Capital
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('goal')}
                className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  calcMode === 'goal'
                    ? 'bg-pine-deep text-gold-dull shadow-sm'
                    : 'text-charcoal-muted hover:text-pine-deep'
                }`}
              >
                Target Goal Corpus
              </button>
            </div>
          </div>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sliders Card (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-9 border border-border-hairline shadow-luxury space-y-8"
          >
            {/* Mode-specific Sliders */}
            {calcMode === 'sip' && (
              <Slider
                label="Monthly Investment Amount"
                value={monthlyAmount}
                min={5000}
                max={500000}
                step={5000}
                onChange={setMonthlyAmount}
                formatValue={(v) => formatINR(v)}
                presets={[
                  { label: '₹15k', value: 15000 },
                  { label: '₹25k', value: 25000 },
                  { label: '₹50k', value: 50000 },
                  { label: '₹1 Lakh', value: 100000 },
                  { label: '₹2.5 Lakh', value: 250000 },
                ]}
                helperText="Disciplined Monthly Allocation"
              />
            )}

            {calcMode === 'lumpsum' && (
              <Slider
                label="One-Time Capital Deployment"
                value={lumpSumAmount}
                min={100000}
                max={20000000}
                step={100000}
                onChange={setLumpSumAmount}
                formatValue={(v) => formatINR(v, true)}
                presets={[
                  { label: '₹10 Lakh', value: 1000000 },
                  { label: '₹25 Lakh', value: 2500000 },
                  { label: '₹50 Lakh', value: 5000000 },
                  { label: '₹1 Crore', value: 10000000 },
                ]}
                helperText="Lump-sum Strategy"
              />
            )}

            {calcMode === 'goal' && (
              <Slider
                label="Target Goal Maturity Corpus"
                value={targetGoalAmount}
                min={2500000}
                max={250000000}
                step={2500000}
                onChange={setTargetGoalAmount}
                formatValue={(v) => formatINR(v, true)}
                presets={[
                  { label: '₹1 Cr (Child Ed)', value: 10000000 },
                  { label: '₹3 Cr (Dream Home)', value: 30000000 },
                  { label: '₹5 Cr (Retirement)', value: 50000000 },
                  { label: '₹10 Cr (Legacy)', value: 100000000 },
                ]}
                helperText="Future Corpus Target"
              />
            )}

            {/* Expected Annual Rate Slider */}
            <Slider
              label="Expected Annual Growth (CAGR)"
              value={returnRate}
              min={8}
              max={18}
              step={0.5}
              onChange={setReturnRate}
              formatValue={(v) => formatPercentage(v)}
              presets={[
                { label: '10% (Conservative)', value: 10 },
                { label: '12% (Balanced Index)', value: 12 },
                { label: '14% (Active Alpha)', value: 14 },
                { label: '16% (High Growth)', value: 16 },
              ]}
              helperText="Benchmark Indian Equities: ~12-14%"
            />

            {/* Time Horizon Slider */}
            <Slider
              label="Investment Time Horizon"
              value={years}
              min={1}
              max={30}
              step={1}
              onChange={setYears}
              formatValue={(v) => formatYears(v)}
              presets={[
                { label: '5 Yrs', value: 5 },
                { label: '10 Yrs', value: 10 },
                { label: '15 Yrs', value: 15 },
                { label: '20 Yrs', value: 20 },
                { label: '25 Yrs', value: 25 },
              ]}
              helperText="Compounding Accelerates Exponentially After Year 7"
            />

            {/* Math Formula Transparency Footer */}
            <div className="pt-4 border-t border-border-hairline/80 flex items-center justify-between text-[11px] text-charcoal-muted">
              <span className="font-mono text-gold-dull">
                Formula: M = P × [((1 + i)ⁿ - 1) / i] × (1 + i)
              </span>
              <span className="flex items-center gap-1 text-pine-deep font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SEBI Benchmark Compliant
              </span>
            </div>
          </motion.div>

          {/* Right Output & Donut Summary Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 bg-pine-deep text-ivory-sand rounded-2xl p-7 sm:p-9 border border-gold-dull/30 shadow-luxury space-y-7 relative overflow-hidden"
          >
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-widest-luxury font-serif text-gold-dull font-semibold">
                Projected Outcome
              </span>
              <span className="text-[11px] font-sans text-ivory-sand/60">
                {years} Year Compounding
              </span>
            </div>

            {/* If in Goal mode, show Required Monthly SIP Highlight */}
            {calcMode === 'goal' && (
              <div className="p-4 rounded-xl bg-gold-radiant/10 border border-gold-radiant/30 text-center space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-gold-dull">
                  Required Monthly SIP
                </span>
                <div className="font-serif text-3xl font-bold text-gold-radiant">
                  {formatINR(goalResult.requiredMonthlySip)}
                  <span className="text-sm font-sans font-normal text-ivory-sand/80"> / month</span>
                </div>
              </div>
            )}

            {/* Grand Total Maturity Value Card */}
            <div className="p-5 rounded-xl bg-pine-secondary/90 border border-white/10 text-center space-y-1">
              <span className="text-xs uppercase tracking-widest-luxury font-sans text-gold-dull font-medium">
                {calcMode === 'goal' ? 'Target Corpus Value' : 'Projected Maturity Corpus'}
              </span>
              <div className="font-serif text-3xl sm:text-4xl lg:text-4xl text-ivory-sand font-bold tracking-tight">
                {formatINR(currentTotal)}
              </div>
              <div className="text-xs text-gold-dull/90 font-serif">
                (~ {formatINR(currentTotal, true)})
              </div>
            </div>

            {/* Donut Chart & Breakdown Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
              {/* SVG Donut Visual (5 cols) */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {/* Background Track (Invested Capital) */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke="#163832"
                      strokeWidth="14"
                    />
                    {/* Active Wealth Returns Overlay */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke="#D4AF37"
                      strokeWidth="14"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <Sparkles className="w-4 h-4 text-gold-radiant" />
                    <span className="text-[10px] uppercase font-bold text-ivory-sand/80 mt-0.5">
                      {returnsPercent.toFixed(0)}%
                    </span>
                    <span className="text-[8px] text-gold-dull">Wealth Gain</span>
                  </div>
                </div>
              </div>

              {/* Breakdown Figures (7 cols) */}
              <div className="sm:col-span-7 space-y-3">
                <div className="p-3 rounded-lg bg-pine-secondary/60 border border-white/5 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pine-secondary border border-white/40" />
                    <span className="text-[11px] text-ivory-sand/70 uppercase tracking-wider font-semibold">
                      Total Invested Amount
                    </span>
                  </div>
                  <div className="text-sm font-sans font-bold text-ivory-sand pl-4.5">
                    {formatINR(currentInvested)}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-pine-secondary/60 border border-gold-dull/20 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold-radiant" />
                    <span className="text-[11px] text-gold-dull uppercase tracking-wider font-semibold">
                      Estimated Wealth Gain
                    </span>
                  </div>
                  <div className="text-sm font-sans font-bold text-gold-radiant pl-4.5">
                    + {formatINR(currentReturns)}
                  </div>
                </div>
              </div>
            </div>

            {/* Integrated CTA */}
            <div className="pt-2">
              <Button
                variant="gold"
                fullWidth
                size="lg"
                icon={<ArrowUpRight className="w-4 h-4" />}
                onClick={handleStartPlan}
              >
                Start This Plan With Us
              </Button>
              <div className="text-center text-[10px] text-ivory-sand/50 mt-2.5">
                Mutual fund projections for illustration. Actual returns depend on market performance.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
