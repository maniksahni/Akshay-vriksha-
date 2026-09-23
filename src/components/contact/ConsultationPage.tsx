import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MessageCircle, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Globe, User, Mail, Phone, Sparkles } from 'lucide-react';
import { ConsultationFormData } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { TimelineCard } from './TimelineCard';

interface ConsultationPageProps {
  initialGoal?: string;
  onBackToHome?: () => void;
}

export const ConsultationPage: React.FC<ConsultationPageProps> = ({
  initialGoal,
  onBackToHome,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<ConsultationFormData>({
    investorType: 'Resident Indian',
    primaryGoal: (initialGoal as any) || 'Goal-Based SIP Creation',
    estimatedPortfolioSize: '₹1 Cr - ₹5 Cr',
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferredTimeSlot: '11:00 AM - 12:00 PM',
    timezone: 'Asia/Kolkata (IST)',
    notes: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const timeSlots = [
    '09:30 AM - 10:30 AM',
    '11:00 AM - 12:00 PM',
    '02:30 PM - 03:30 PM',
    '05:00 PM - 06:00 PM',
    '07:30 PM - 08:30 PM (NRI Friendly)',
    '09:30 PM - 10:30 PM (US/Gulf Evening)',
  ];

  const timezones = [
    { label: 'India Standard Time (IST)', value: 'Asia/Kolkata (IST)' },
    { label: 'Gulf Standard Time (GST - Dubai)', value: 'Asia/Dubai (GST)' },
    { label: 'Singapore / Hong Kong (SGT/HKT)', value: 'Asia/Singapore (SGT)' },
    { label: 'Greenwich Mean / BST (London)', value: 'Europe/London (GMT/BST)' },
    { label: 'Eastern Time (US EST - New York)', value: 'America/New_York (EST)' },
    { label: 'Pacific Time (US PST - California)', value: 'America/Los_Angeles (PST)' },
  ];

  const handleInputChange = (field: keyof ConsultationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setCurrentStep(3);
  };

  const directWhatsAppUrl = `https://wa.me/919845012345?text=${encodeURIComponent(
    `Hello Akshaya Vriksha, I'd like to book an advisory consultation. Investor: ${formData.investorType}, Goal: ${formData.primaryGoal}.`
  )}`;

  return (
    <div className="py-16 md:py-24 bg-ivory-sand min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-charcoal-muted hover:text-pine-deep mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Platform</span>
          </button>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="gold" size="md">
            Private Client Engagement
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-pine-deep font-normal tracking-tight">
            Schedule a Confidential Consultation
          </h1>
          <p className="text-charcoal-muted text-sm sm:text-base font-sans leading-relaxed">
            Reserve a 1-on-1 strategy session with our senior fiduciary advisory team. Select your preferred timezone and investment parameters below.
          </p>

          {/* Quick WhatsApp Alternative Strip */}
          <div className="pt-2 flex justify-center">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Need Immediate Assistance? Connect via WhatsApp VIP Concierge</span>
            </a>
          </div>
        </div>

        {/* 2-Column Booking Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-7 sm:p-10 border border-border-hairline shadow-luxury relative overflow-hidden">
            {/* Step Progress Header */}
            {!formSubmitted && (
              <div className="flex items-center justify-between border-b border-border-hairline pb-6 mb-8">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm font-bold ${
                      currentStep === 1
                        ? 'bg-pine-deep text-gold-dull border border-gold-dull'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-gold-dull block">
                      Phase 1
                    </span>
                    <span className="text-xs font-bold text-pine-deep uppercase">
                      Investor Profile & Scope
                    </span>
                  </div>
                </div>

                <div className="h-[1px] w-12 bg-border-hairline hidden sm:block" />

                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm font-bold ${
                      currentStep === 2
                        ? 'bg-pine-deep text-gold-dull border border-gold-dull'
                        : 'bg-ivory-warm text-charcoal-muted'
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-charcoal-muted block">
                      Phase 2
                    </span>
                    <span className="text-xs font-bold text-charcoal-slate uppercase">
                      Schedule & Coordinates
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Profile & Scope */}
            {currentStep === 1 && (
              <motion.form
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleStep1Submit}
                className="space-y-6"
              >
                {/* Investor Type Radios */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-pine-deep block">
                    1. Investor Status / Classification:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'Resident Indian', desc: 'Domestic Portfolio' },
                      { id: 'NRI / OCI', desc: 'Cross-Border Advisory' },
                      { id: 'Family Office / Corporate', desc: 'Institutional & Trust' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleInputChange('investorType', t.id)}
                        className={`p-3.5 rounded-xl text-left border transition-all duration-200 ${
                          formData.investorType === t.id
                            ? 'bg-pine-deep text-gold-dull border-gold-dull shadow-sm'
                            : 'bg-ivory-warm/70 text-charcoal-slate border-border-hairline hover:border-gold-dull/50'
                        }`}
                      >
                        <div className="text-xs font-bold">{t.id}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Objective Select */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-pine-deep block">
                    2. Primary Advisory Objective:
                  </label>
                  <select
                    value={formData.primaryGoal}
                    onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border-hairline bg-ivory-sand text-charcoal-slate text-sm font-medium focus:outline-none focus:border-gold-dull"
                  >
                    <option value="Goal-Based SIP Creation">Goal-Based SIP Creation & Compounding</option>
                    <option value="Comprehensive Portfolio Review">Comprehensive Portfolio Health Review</option>
                    <option value="Kotak Life & Estate Shield">Kotak Life Shield & Estate Ringfencing (MWP Act)</option>
                    <option value="NRI India Repatriation & Allocation">NRI India Repatriation & DTAA Allocation</option>
                    <option value="Heritage & Legacy Planning">Heritage & Legacy Concierge Expedition</option>
                  </select>
                </div>

                {/* Estimated Portfolio Size */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-pine-deep block">
                    3. Target Allocation / Portfolio Scale:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['₹25L - ₹1 Cr', '₹1 Cr - ₹5 Cr', '₹5 Cr - ₹25 Cr', '₹25 Cr+'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleInputChange('estimatedPortfolioSize', sz)}
                        className={`py-2.5 px-3 rounded-lg text-xs font-semibold text-center border transition-all duration-200 ${
                          formData.estimatedPortfolioSize === sz
                            ? 'bg-pine-deep text-gold-dull border-gold-dull'
                            : 'bg-ivory-warm text-charcoal-slate border-border-hairline hover:border-gold-dull/50'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 1 Next Button */}
                <div className="pt-4 border-t border-border-hairline flex justify-end">
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue to Schedule Slot
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Step 2: Date, Timezone & Contact Info */}
            {currentStep === 2 && (
              <motion.form
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleFinalSubmit}
                className="space-y-6"
              >
                {/* Timezone Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-pine-deep flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-gold-dull" />
                    Your Preferred Timezone:
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-ivory-sand text-charcoal-slate text-sm font-medium focus:outline-none focus:border-gold-dull"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time Slot Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-pine-deep flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-dull" />
                      Preferred Date:
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-ivory-sand text-charcoal-slate text-sm font-medium focus:outline-none focus:border-gold-dull"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-pine-deep flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-dull" />
                      Time Window:
                    </label>
                    <select
                      value={formData.preferredTimeSlot}
                      onChange={(e) => handleInputChange('preferredTimeSlot', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-ivory-sand text-charcoal-slate text-sm font-medium focus:outline-none focus:border-gold-dull"
                    >
                      {timeSlots.map((ts) => (
                        <option key={ts} value={ts}>
                          {ts}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="space-y-4 pt-2 border-t border-border-hairline">
                  <div className="text-xs font-bold uppercase tracking-wider text-pine-deep">
                    Personal & Confidential Details:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-charcoal-muted flex items-center gap-1">
                        <User className="w-3 h-3 text-gold-dull" /> Full Name:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Vikramaditya Sharma"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-border-hairline bg-ivory-sand text-charcoal-slate text-sm focus:outline-none focus:border-gold-dull"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-charcoal-muted flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gold-dull" /> Email Address:
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. vikram@domain.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-border-hairline bg-ivory-sand text-charcoal-slate text-sm focus:outline-none focus:border-gold-dull"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[11px] font-semibold text-charcoal-muted">
                        Country Code:
                      </label>
                      <input
                        type="text"
                        value={formData.countryCode}
                        onChange={(e) => handleInputChange('countryCode', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-border-hairline bg-ivory-sand text-charcoal-slate text-sm focus:outline-none focus:border-gold-dull"
                        required
                      />
                    </div>
                    <div className="sm:col-span-8 space-y-1">
                      <label className="text-[11px] font-semibold text-charcoal-muted flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gold-dull" /> Phone / WhatsApp Number:
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 98450 12345"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-border-hairline bg-ivory-sand text-charcoal-slate text-sm focus:outline-none focus:border-gold-dull"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-charcoal-muted">
                      Optional Notes or Specific Portfolio Inquiries:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any specific current AMC portfolios, insurance policies, or overseas NRE account queries..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-border-hairline bg-ivory-sand text-charcoal-slate text-sm focus:outline-none focus:border-gold-dull"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 border-t border-border-hairline flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted hover:text-pine-deep flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    Confirm Private Consultation
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Step 3: Confirmation State */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-pine-deep text-gold-radiant border-2 border-gold-dull flex items-center justify-center mx-auto shadow-gold-glow">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <Badge variant="gold" size="md">
                    Reservation Confirmed
                  </Badge>
                  <h3 className="font-serif text-2xl sm:text-3xl text-pine-deep font-semibold">
                    We Have Received Your Advisory Request
                  </h3>
                  <p className="text-sm text-charcoal-muted max-w-md mx-auto">
                    A dedicated senior strategist from our fiduciary desk will reach out to{' '}
                    <strong>{formData.email}</strong> and send your secure calendar invite for{' '}
                    <strong className="text-pine-deep">{formData.preferredDate} ({formData.preferredTimeSlot})</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-ivory-warm border border-gold-dull/30 text-xs text-charcoal-slate max-w-md mx-auto text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Investor Type:</span>
                    <strong className="text-pine-deep">{formData.investorType}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Primary Focus:</span>
                    <strong className="text-pine-deep">{formData.primaryGoal}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Selected Timezone:</span>
                    <strong className="text-pine-deep">{formData.timezone}</strong>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                  {onBackToHome && (
                    <Button variant="outline-pine" size="md" onClick={onBackToHome}>
                      Return to Homepage
                    </Button>
                  )}
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold shadow-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant WhatsApp Update</span>
                  </a>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right SLA Timeline Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <TimelineCard />

            {/* Direct Contact Coordinates */}
            <div className="bg-white p-6 rounded-2xl border border-border-hairline shadow-subtle space-y-3 text-xs">
              <div className="font-bold text-pine-deep uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Advisory Integrity & Data Shield
              </div>
              <p className="text-charcoal-muted leading-relaxed">
                Your coordinates and portfolio disclosures are protected under strict fiduciary nondisclosure covenants. We never share, sell, or monetize client records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
