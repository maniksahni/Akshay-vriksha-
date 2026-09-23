import { NriStep } from '../types';

export const NRI_STEPS: NriStep[] = [
  {
    stepNumber: '01',
    title: 'Virtual Consultation & Cross-Border Mapping',
    timeframe: 'Day 1 • 45 Mins',
    description:
      'A dedicated private session aligned with your overseas timezone (US EST/PST, Gulf GST, UK GMT, Singapore SGT) to assess residency tax status, cross-border goals, and Indian asset objectives.',
    details: [
      'Comprehensive residency status & FEMA classification review',
      'Evaluation of existing Indian real estate or ancestral capital',
      'Timezone-flexible video consultations with senior wealth strategists',
    ],
    keyBenefit: 'Clear fiduciary roadmap without regulatory ambiguity',
    iconName: 'Video',
  },
  {
    stepNumber: '02',
    title: 'Seamless NRE/NRO & Paperless KYC Setup',
    timeframe: 'Days 2–5 • 100% Digital',
    description:
      'We eliminate bureaucratic friction by coordinating digital NRI KYC, FATCA declarations, CKYC updates, and NRE/NRO banking linkages without requiring physical trips to India.',
    details: [
      'FATCA / CRS compliant paperless onboarding suite',
      'Assistance with NRE (fully repatriable) & NRO bank account linking',
      'Dedicated compliance concierge for document attestation guidance',
    ],
    keyBenefit: 'Zero travel required; complete digital onboarding',
    iconName: 'FileCheck',
  },
  {
    stepNumber: '03',
    title: 'Tax-Efficient India Allocation Strategy',
    timeframe: 'Days 6–7 • Custom Strategy',
    description:
      'Deploying capital into high-growth Indian equities and debt instruments structured to maximize Double Tax Avoidance Agreement (DTAA) benefits and minimize withholding taxes (TDS).',
    details: [
      'DTAA-optimized mutual fund and equity deployment',
      'Lower TDS rate certificates and tax credit documentation support',
      'Dynamic currency-hedged portfolio structures against INR volatility',
    ],
    keyBenefit: 'Maximum after-tax returns across home & host nations',
    iconName: 'TrendingUp',
  },
  {
    stepNumber: '04',
    title: 'Ongoing Monitoring & Seamless Repatriation',
    timeframe: 'Continuous • 24/7 Portal',
    description:
      'Continuous portfolio rebalancing with end-to-end guidance whenever you wish to repatriate funds back to your country of residence under RBI and Form 15CA/CB guidelines.',
    details: [
      'Single consolidated quarterly dashboard accessible globally',
      'Certified CA facilitation for Form 15CA & 15CB repatriation filings',
      'Bi-annual video reviews and proactive asset rebalancing',
    ],
    keyBenefit: 'Effortless capital mobility back to your overseas bank',
    iconName: 'RefreshCw',
  },
];

export const CURRENCY_RATES = [
  { currency: 'USD', symbol: '$', rate: 86.8, flag: '🇺🇸', name: 'US Dollar', sampleAmount: 2000 },
  { currency: 'AED', symbol: 'AED', rate: 23.6, flag: '🇦🇪', name: 'UAE Dirham', sampleAmount: 7500 },
  { currency: 'GBP', symbol: '£', rate: 109.5, flag: '🇬🇧', name: 'British Pound', sampleAmount: 1500 },
  { currency: 'SGD', symbol: 'S$', rate: 64.2, flag: '🇸🇬', name: 'Singapore Dollar', sampleAmount: 2500 },
  { currency: 'EUR', symbol: '€', rate: 91.4, flag: '🇪🇺', name: 'Euro', sampleAmount: 1800 },
  { currency: 'CAD', symbol: 'C$', rate: 61.3, flag: '🇨🇦', name: 'Canadian Dollar', sampleAmount: 2800 },
];
