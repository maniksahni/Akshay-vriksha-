// Real business facts only (same credentials as Gulshan Kohli's existing site).
// A mutual fund distributor's site must not invent returns, clients or credentials.

export const FACTS = {
  name: 'Gulshan Kohli',
  phone: '+91 91367 92367',
  phoneIntl: '919136792367',
  email: 'akshayavriksha@gmail.com',
  city: 'Rohini, New Delhi',
  arn: 'ARN-105840',
  kotak: 'KLI61205587',
  years: 12,
  amfiLocator: 'https://www.amfiindia.com/locate-distributor',
};

export const wa = (text: string) => `https://wa.me/${FACTS.phoneIntl}?text=${encodeURIComponent(text)}`;

export const NAV = [
  { label: 'Calculator', href: '#glow-up' },
  { label: 'What we do', href: '#menu' },
  { label: 'Vibe check', href: '#vibe' },
  { label: 'Who’s Gulshan', href: '#gulshan' },
  { label: 'FAQ', href: '#faq' },
];

export const DISCLAIMER =
  'Mutual fund investments are subject to market risks; read all scheme-related documents carefully. Illustrations assume a constant return and are not a promise of future returns. Insurance is the subject matter of solicitation.';
