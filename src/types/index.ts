export type NavSection = 'home' | 'wealth' | 'protection' | 'nri-desk' | 'heritage' | 'testimonials' | 'faq' | 'about';
export type PageView = 'home' | 'consultation' | 'wealth' | 'protection' | 'nri' | 'heritage';

export interface NavItem {
  label: string;
  href: string;
  isAnchor?: boolean;
  page?: PageView;
}

export interface TrustMetric {
  id: string;
  title: string;
  subtitle: string;
  highlight: string;
  badge?: string;
  iconName: string;
}

export interface PhilosophyPillar {
  id: 'wealth' | 'protection' | 'experiences';
  number: string;
  title: string;
  tagline: string;
  description: string;
  offerings: string[];
  ctaText: string;
  accentColor: string;
  bgDark?: boolean;
}

export interface CalculatorState {
  investmentType: 'sip' | 'lumpsum' | 'goal';
  monthlyAmount: number;     // ₹5,000 to ₹5,00,000
  lumpSumAmount: number;     // ₹1,00,000 to ₹1,00,00,000
  targetGoalAmount: number;  // For Goal mode
  expectedReturnRate: number;// 8% to 18%
  timeHorizonYears: number;  // 1 to 30 years
  inflationRate: number;     // 6% default for goal calculations
}

export interface CalculationResult {
  totalInvested: number;
  estimatedReturns: number;
  totalMaturityValue: number;
  purchasingPowerAdjusted?: number;
  yearlyBreakdown: {
    year: number;
    invested: number;
    value: number;
  }[];
}

export interface NriStep {
  stepNumber: string;
  title: string;
  timeframe: string;
  description: string;
  details: string[];
  keyBenefit: string;
  iconName: string;
}

export interface HeritageTour {
  id: string;
  title: string;
  region: string;
  duration: string;
  curationHighlight: string;
  description: string;
  experiences: string[];
  imageTag: string;
  tag: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  location: string;
  investorType: 'NRI Client' | 'Family Office' | 'Business Leader' | 'Senior Professional';
  avatarInitials: string;
  quote: string;
  portfolioFocus: string;
  relationshipYears: string;
}

export interface FaqItem {
  id: string;
  category: 'Advisory & Safety' | 'NRI Desk' | 'Insurance & Protection' | 'Heritage Concierge';
  question: string;
  answer: string;
}

export interface ConsultationFormData {
  investorType: 'Resident Indian' | 'NRI / OCI' | 'Family Office / Corporate';
  primaryGoal: 'Goal-Based SIP Creation' | 'Comprehensive Portfolio Review' | 'Kotak Life & Estate Shield' | 'NRI India Repatriation & Allocation' | 'Heritage & Legacy Planning';
  estimatedPortfolioSize: '₹25L - ₹1 Cr' | '₹1 Cr - ₹5 Cr' | '₹5 Cr - ₹25 Cr' | '₹25 Cr+';
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  preferredDate: string;
  preferredTimeSlot: string;
  timezone: string;
  notes?: string;
}
