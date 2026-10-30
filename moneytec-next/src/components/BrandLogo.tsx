/** Identifies the registration body or insurer beside the corresponding credential. */
export function BrandLogo({ brand, className = '' }: { brand: 'amfi' | 'kotak'; className?: string }) {
  return <span className={`credential-logo credential-logo-${brand} ${className}`}><img src={`./brand/partners/${brand === 'amfi' ? 'amfi.svg' : 'kotak-life.png'}`} alt={brand === 'amfi' ? 'AMFI — Association of Mutual Funds in India' : 'Kotak Life'} width={brand === 'amfi' ? 226 : 674} height={brand === 'amfi' ? 56 : 150} loading="lazy" decoding="async" /></span>;
}
