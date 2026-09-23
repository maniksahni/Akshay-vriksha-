import React from 'react';
import { ShieldCheck, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { FOOTER_LINKS } from '../../data/navigation';

interface FooterProps {
  onOpenConsultation: (goal?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsultation }) => {
  return (
    <footer className="bg-pine-deep text-ivory-sand pt-20 pb-12 border-t border-gold-dull/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grand CTA Banner */}
        <div className="relative rounded-2xl p-8 md:p-12 mb-16 bg-gradient-to-r from-pine-secondary via-pine-deep to-pine-secondary border border-gold-dull/30 shadow-luxury overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-gold-radiant/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="editorial-badge-dark text-xs mb-3 inline-block">
                Fiduciary Stewardship
              </span>
              <h3 className="font-serif text-2xl md:text-4xl text-ivory-sand font-normal tracking-wide">
                Ready to align your wealth with your life’s highest purpose?
              </h3>
              <p className="text-ivory-sand/70 text-sm md:text-base mt-2 font-sans">
                Schedule a confidential, non-obligatory portfolio architecture session with our senior advisory desk.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <button
                onClick={() => onOpenConsultation('Comprehensive Advisory Call')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-gold-gradient text-pine-deep font-semibold text-sm hover:shadow-gold-glow hover:brightness-105 transition-all"
              >
                <span>Schedule Confidential Review</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Column Structured Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          {/* Brand & Narrative Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-ivory-sand/70 text-sm leading-relaxed max-w-sm font-sans pt-2">
              Akshaya Vriksha (The Inexhaustible Tree) provides holistic wealth stewardship, risk mitigation, and heritage experiences for resident Indian leaders and the global diaspora across 15+ countries.
            </p>
            <div className="pt-2 space-y-2 text-xs text-ivory-sand/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-dull shrink-0 mt-0.5" />
                <span>Akshaya Vriksha Advisory, Indiranagar, Bengaluru, Karnataka 560038, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-dull shrink-0" />
                <span>+91 (80) 4123-8900 / +91 98450 12345</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-dull shrink-0" />
                <span>advisory@akshayavriksha.in</span>
              </div>
            </div>
          </div>

          {/* Column 1: Wealth */}
          <div>
            <h4 className="text-xs uppercase tracking-widest-luxury font-serif text-gold-dull font-semibold mb-4">
              01 • Wealth Creation
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-sand/75">
              {FOOTER_LINKS.wealth.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-gold-radiant transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Protection & Kotak */}
          <div>
            <h4 className="text-xs uppercase tracking-widest-luxury font-serif text-gold-dull font-semibold mb-4">
              02 • Family Protection
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-sand/75">
              {FOOTER_LINKS.protection.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-gold-radiant transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Global NRI Desk & Heritage */}
          <div>
            <h4 className="text-xs uppercase tracking-widest-luxury font-serif text-gold-dull font-semibold mb-4">
              03 • Global & Roots
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-sand/75">
              {FOOTER_LINKS.nri.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-gold-radiant transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-2 text-gold-dull/90 font-medium">Heritage Sanctuary:</li>
              {FOOTER_LINKS.experiences.slice(0, 2).map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-gold-radiant transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Regulatory & Compliance Disclosures (SEBI, AMFI, Kotak Life) */}
        <div className="py-8 border-b border-white/10 text-[11px] text-ivory-sand/60 space-y-3 leading-relaxed">
          <div className="flex items-center gap-2 text-gold-dull font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-gold-radiant" />
            Statutory Regulatory Declarations & Investor Disclosures
          </div>
          <p>
            <strong>AMFI Registration Disclaimer:</strong> Akshaya Vriksha is an AMFI Registered Mutual Fund Distributor (ARN-XXXXXX) valid and renewed as per SEBI regulations. Mutual fund investments are subject to market risks, read all scheme-related documents carefully before investing. The NAVs of schemes may go up or down depending upon factors and forces affecting securities markets.
          </p>
          <p>
            <strong>Kotak Life Authorized Partner Disclosure:</strong> Akshaya Vriksha operates as an authorized corporate agency partner for Kotak Mahindra Life Insurance Company Limited. Insurance is the subject matter of solicitation. Life insurance products are underwritten and issued directly by Kotak Mahindra Life Insurance Co. Ltd.
          </p>
          <p>
            <strong>NRI Advisory Disclaimer:</strong> Cross-border advisory services are provided in compliance with FEMA guidelines, RBI circulars, and bilateral DTAA provisions. Akshaya Vriksha does not provide direct sovereign legal opinion; investors are advised to consult their local CPA/tax consultants for country-specific filings.
          </p>
        </div>

        {/* Bottom Copyright & Fine Print */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory-sand/50">
          <div>
            © {new Date().getFullYear()} Akshaya Vriksha Wealth Advisory Services (akshayavriksha.in). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-gold-dull transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-gold-dull transition-colors">Terms of Stewardship</a>
            <span>•</span>
            <a href="#grievance" className="hover:text-gold-dull transition-colors">Grievance Redressal</a>
            <span>•</span>
            <a href="#disclaimers" className="hover:text-gold-dull transition-colors">Risk Disclaimers</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
