// Every fact here comes from the live site (akshayavriksha.in). Keep it that way:
// a mutual fund distributor's site must not invent credentials, returns or clients.

export const CONTACT = {
  founder: 'Gulshan Kohli',
  phone: '9136792367',
  phoneIntl: '919136792367',
  email: 'akshayavriksha@gmail.com',
  address: 'Rohini, New Delhi – 110089',
  arn: 'ARN-105840',
  kotak: 'KLI61205587',
  instagram: 'https://www.instagram.com/akshayavriksha/',
  facebook: 'https://www.facebook.com/gulshankohli13',
  years: 12,
};

export const whatsappLink = (text: string) =>
  `https://wa.me/${CONTACT.phoneIntl}?text=${encodeURIComponent(text)}`;

export const NAV = [
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Offerings', href: '#offerings' },
  { label: 'How we work', href: '#process' },
  { label: 'Goal planner', href: '#goals' },
  { label: 'Compounding', href: '#compounding' },
  { label: 'Toolkit', href: '#toolkit' },
  { label: 'NRI Desk', href: '#nri' },
  { label: 'Verify us', href: '#trust' },
  { label: 'Learn', href: '#learn' },
  { label: 'Founder', href: '#founder' },
  { label: 'Contact', href: '#contact' },
];

export type Offering = {
  no: string;
  title: string;
  hindi: string;
  line: string;
  body: string;
  points: string[];
  cta: string;
  motif: 'roots' | 'shield' | 'temple';
};

export const OFFERINGS: Offering[] = [
  {
    no: '01',
    title: 'Mutual Funds',
    hindi: 'निवेश',
    line: 'Goal-based SIPs for long-term growth.',
    body: 'Risk assessment and goal-based strategies for the things that matter: your dream house, an early retirement, your children and the generations after them.',
    points: ['Goal-based SIP planning', 'Risk profiling & fund selection', 'For Indian residents', 'For NRIs all over the world'],
    cta: 'Plan my SIP',
    motif: 'roots',
  },
  {
    no: '02',
    title: 'Life & Health Insurance',
    hindi: 'सुरक्षा',
    line: 'Living too long, or dying too early.',
    body: 'Comprehensive life and health plans for every need, so your family’s future is secure whatever happens. Served personally across India, with online plans for NRIs worldwide.',
    points: ['Term & life cover via Kotak Life', 'Health insurance', 'SIPs bundled with protection', 'Online plans for NRIs'],
    cta: 'Protect my family',
    motif: 'shield',
  },

];

export const NRI_STEPS = [
  {
    title: 'A call in your timezone',
    body: 'We start with a video call at an hour that suits you, wherever you are, to understand your goals and residency status.',
  },
  {
    title: 'Paperless onboarding',
    body: 'We guide you through NRI KYC and FATCA declarations online and link your NRE or NRO account. No trip to India needed.',
  },
  {
    title: 'A goal-based plan',
    body: 'Funds are chosen to match your goals and risk profile, from AMCs that accept investors from your country of residence.',
  },
  {
    title: 'Reviews, for the long run',
    body: 'Regular reviews, rebalancing when your life changes, and help with redemptions whenever you need the money.',
  },
];

export const CITIES = [
  { city: 'New Delhi', tz: 'Asia/Kolkata' },
  { city: 'Dubai', tz: 'Asia/Dubai' },
  { city: 'London', tz: 'Europe/London' },
  { city: 'New York', tz: 'America/New_York' },
  { city: 'Singapore', tz: 'Asia/Singapore' },
  { city: 'Sydney', tz: 'Australia/Sydney' },
];

export type Journey = {
  name: string;
  hindi: string;
  region: string;
  line: string;
  scene: 'ghats' | 'ruins' | 'peaks' | 'sun';
  sky: [string, string];
};

export const JOURNEYS: Journey[] = [
  { name: 'Kashi', hindi: 'काशी', region: 'Varanasi, Uttar Pradesh', line: 'Dawn on the ghats and the evening Ganga aarti in the oldest living city.', scene: 'ghats', sky: ['#F2A65A', '#5B2A3A'] },
  { name: 'Hampi', hindi: 'हम्पी', region: 'Karnataka', line: 'The boulder-strewn ruins of the Vijayanagara empire along the Tungabhadra.', scene: 'ruins', sky: ['#E9C46A', '#7A3E1D'] },
  { name: 'Kedarnath', hindi: 'केदारनाथ', region: 'Uttarakhand', line: 'A Himalayan pilgrimage to one of the twelve Jyotirlingas.', scene: 'peaks', sky: ['#A7C4D9', '#1F3550'] },
  { name: 'Konark', hindi: 'कोणार्क', region: 'Odisha', line: 'The stone chariot of the Sun God, and the sacred shores of Puri.', scene: 'sun', sky: ['#F6C177', '#B4472A'] },
];

export const VALUES = [
  { title: 'Integrity', body: 'Transparency and honesty in every dealing. You always know what you own and why.' },
  { title: 'Excellence', body: 'Solutions tailored to your needs, not to a sales target.' },
  { title: 'Customer-centric', body: 'Your goals come first. We align our work to the life you want to build.' },
];

export const TESTIMONIAL = {
  quote: 'Akshayavriksha has transformed my financial future! Their personalized approach made a significant difference in my investment strategy.',
  name: 'Priya Sharma',
};

export const FAQS = [
  {
    q: 'Where does my money actually go?',
    a: 'Straight from your bank account to the mutual fund house (AMC) or the insurer. Units and policies are held in your own name. Your money never passes through AkshayVriksha.',
  },
  {
    q: 'How much do I need to start a SIP?',
    a: 'Many schemes accept SIPs from as little as ₹500 a month. What matters more than the amount is starting early and staying invested.',
  },
  {
    q: 'I live abroad. Can I invest in Indian mutual funds?',
    a: 'Yes. NRIs can invest through NRE or NRO accounts, and onboarding is done online. Residents of the US and Canada can invest too, but only with the AMCs that accept them, and we’ll show you which ones.',
  },
  {
    q: 'What documents do I need to start?',
    a: 'Usually your PAN, Aadhaar (or passport for NRIs), a bank account and a photo. KYC is done once and works across all fund houses. We walk you through it online.',
  },
  {
    q: 'Can I pause or stop my SIP?',
    a: 'Yes. Most SIPs can be paused, changed or stopped at any time, and you can usually redeem your units whenever you need to. Some schemes, like ELSS tax-saving funds, have a three-year lock-in, and we’ll flag that before you invest.',
  },
  {
    q: 'Will you help with insurance claims?',
    a: 'Yes. Claims are settled by the insurer, but we help your family with the paperwork and follow-up so they aren’t doing it alone at a difficult time.',
  },
  {
    q: 'How is AkshayVriksha paid?',
    a: 'We are an AMFI-registered mutual fund distributor (ARN-105840) and a Kotak Life Insurance advisor. We are paid commission by the fund houses and the insurer, as regulated by SEBI, AMFI and IRDAI, and we disclose it.',
  },
];
