import { TrustMetric } from '../types';

export const TRUST_METRICS: TrustMetric[] = [
  {
    id: 'amfi',
    title: 'AMFI Registered',
    subtitle: 'Mutual Fund Distributor ARN-XXXXXX with 100% compliance',
    highlight: 'ARN Certified',
    badge: 'AMFI Regd.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'kotak',
    title: 'Kotak Life Partner',
    subtitle: 'Authorized corporate agency for premier life & estate protection',
    highlight: 'Strategic Alliance',
    badge: 'Kotak Life',
    iconName: 'Lock',
  },
  {
    id: 'legacy',
    title: '12+ Years Legacy',
    subtitle: 'Over a decade of fiduciary stewardship across market cycles',
    highlight: '12+ Years',
    badge: 'Est. 2012',
    iconName: 'Award',
  },
  {
    id: 'nri',
    title: 'Global NRI Desk',
    subtitle: 'Serving discerning families across USA, UAE, UK, Singapore & 15+ nations',
    highlight: '15+ Nations',
    badge: 'Cross-Border',
    iconName: 'Globe',
  },
];
