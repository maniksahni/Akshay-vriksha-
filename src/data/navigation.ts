import { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Wealth', href: '#wealth', isAnchor: true },
  { label: 'Protection', href: '#protection', isAnchor: true },
  { label: 'NRI Desk', href: '#nri-desk', isAnchor: true },
  { label: 'Heritage Travel', href: '#heritage-travel', isAnchor: true },
  { label: 'Calculator', href: '#calculator', isAnchor: true },
  { label: 'Client Stories', href: '#testimonials', isAnchor: true },
  { label: 'FAQ', href: '#faq', isAnchor: true },
];

export const FOOTER_LINKS = {
  wealth: [
    { label: 'Goal-Based SIP Architecture', href: '#calculator' },
    { label: 'Mutual Fund Advisory (AMFI)', href: '#wealth' },
    { label: 'High-Alpha Portfolio Solutions', href: '#wealth' },
    { label: 'Direct Equity & PMS Integration', href: '#wealth' },
    { label: 'Debt & Capital Preservation', href: '#wealth' },
  ],
  protection: [
    { label: 'Kotak Life Insurance Partner Desk', href: '#protection' },
    { label: 'High-Sum-Assured Term Shields', href: '#protection' },
    { label: 'Keyman & Business Continuity Cover', href: '#protection' },
    { label: 'Critical Illness & Family Estate Shield', href: '#protection' },
  ],
  nri: [
    { label: 'Global NRI Desk (15+ Nations)', href: '#nri-desk' },
    { label: 'Paperless NRE / NRO KYC', href: '#nri-desk' },
    { label: 'DTAA Tax Optimization', href: '#nri-desk' },
    { label: 'Repatriation & Form 15CA/CB', href: '#nri-desk' },
  ],
  experiences: [
    { label: 'The Heritage Sanctuary (Pillar III)', href: '#heritage-travel' },
    { label: 'Kashmir Himalayan Private Retreats', href: '#heritage-travel' },
    { label: 'Chettinad Architectural Expeditions', href: '#heritage-travel' },
    { label: 'Sacred Ganga Private Ghat Charters', href: '#heritage-travel' },
  ]
};
