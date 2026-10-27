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
  { label: 'Expertise', href: '#highlights' },
  { label: 'Growth', href: '#grow' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'Plans', href: '#plans' },
  { label: 'Verify ARN', href: '#arn-verifier' },
  { label: 'Gulshan', href: '#gulshan' },
  { label: 'FAQ', href: '#faq' },
];

export const DISCLAIMER =
  'Mutual fund investments are subject to market risks; read all scheme-related documents carefully. Illustrations assume a constant return and are not a promise of future returns. Insurance is the subject matter of solicitation.';

export const SOCIALS = [
  { name: 'Instagram', href: 'https://www.instagram.com/akshayavriksha?utm_source=qr&vrfl=Ym9ub2psenpldDY0', handle: '@akshayavriksha', icon: 'instagram' },
  { name: 'Facebook', href: 'https://www.facebook.com/share/1DsGWmmBrY/', handle: 'Connect with Gulshan', icon: 'facebook' },
  { name: 'YouTube', href: 'https://youtube.com/@gulshanonwheels?si=p6E3A7oKxky9Zodh', handle: '@gulshanonwheels', icon: 'youtube' },
  { name: 'X (Twitter)', href: 'https://x.com/GulshanOnWheels', handle: '@GulshanOnWheels', icon: 'x' },
];
