import { BrandLogo } from './BrandLogo';
import { FACTS, AMFI_WA, KOTAK_WA } from '../data';

/**
 * The original trust strip, kept word for word, set as a still masthead: four credentials in a row of
 * hairline-ruled cells (laptop) or a short stack (phone). No motion; credentials should sit still.
 */
export function Ticker() {
  return (
    <div className="lux-masthead relative z-10">
      <div className="wrap-wide lux-masthead-row">
        <a href={AMFI_WA} target="_blank" rel="noreferrer" aria-label="Ask Gulshan about his AMFI registration on WhatsApp" className="lux-masthead-cell"><BrandLogo brand="amfi" /><span><strong>AMFI Registered Mutual Fund Distributor</strong> · {FACTS.arn} ↗</span></a>
        <a href={KOTAK_WA} target="_blank" rel="noreferrer" aria-label="Ask Gulshan about Kotak Life insurance on WhatsApp" className="lux-masthead-cell"><BrandLogo brand="kotak" /><span>Kotak Life advisor · {FACTS.kotak}</span></a>
        <span className="lux-masthead-cell"><span><strong>{FACTS.name}</strong> · {FACTS.years}+ years of experience</span></span>
        <a href="#safety" className="lux-masthead-cell lux-masthead-link">Understand how your money is handled ↓</a>
      </div>
    </div>
  );
}
