import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, ShieldCheck, PhoneCall, Globe } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { NAV_ITEMS } from '../../data/navigation';

interface HeaderProps {
  onOpenConsultation: (initialGoal?: string) => void;
  onNavigatePage?: (page: 'home' | 'consultation') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConsultation,
  onNavigatePage,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (onNavigatePage) {
        onNavigatePage('home');
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  };

  return (
    <>
      {/* Top Regulatory Ticker Strip */}
      <div className="bg-pine-deep text-ivory-sand/90 text-[11px] py-1.5 px-4 border-b border-white/10 hidden md:block select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-gold-dull font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-radiant" />
              AMFI Registered Mutual Fund Distributor
            </span>
            <span className="text-ivory-sand/40">•</span>
            <span className="text-ivory-sand/80">
              Kotak Life Insurance Authorized Partner
            </span>
            <span className="text-ivory-sand/40">•</span>
            <span className="flex items-center gap-1 text-ivory-sand/80">
              <Globe className="w-3 h-3 text-gold-dull" /> Serving Global NRIs Across 15+ Nations
            </span>
          </div>
          <div className="flex items-center gap-4 text-gold-dull">
            <a
              href="tel:+919876543210"
              className="hover:text-gold-radiant transition-colors flex items-center gap-1 text-[11px]"
            >
              <PhoneCall className="w-3 h-3" /> Priority Desk: +91 (80) 4123-8900
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-header py-3.5 shadow-subtle border-b border-border-hairline'
            : 'bg-ivory-sand/95 py-5 border-b border-border-hairline/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div
              onClick={() => {
                if (onNavigatePage) onNavigatePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Logo size="md" variant="light" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-xs uppercase tracking-wider font-semibold text-charcoal-slate hover:text-gold-dull transition-colors relative py-1 group"
                >
                  <span>{item.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold-dull transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Header Right CTA */}
            <div className="hidden sm:flex items-center gap-3">
              <Button
                variant="outline-pine"
                size="sm"
                onClick={() => {
                  const el = document.querySelector('#calculator');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                SIP Calculator
              </Button>
              <Button
                variant="gold"
                size="sm"
                icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                onClick={() => onOpenConsultation('Comprehensive Wealth Advisory')}
              >
                Book Consultation
              </Button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <Button
                variant="gold"
                size="sm"
                className="text-xs px-3 py-1.5"
                onClick={() => onOpenConsultation()}
              >
                Book
              </Button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-charcoal-slate hover:bg-ivory-warm focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-border-hairline bg-ivory-sand px-4 pt-3 pb-6 space-y-3"
            >
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="block px-3 py-2.5 rounded-md text-sm font-semibold uppercase tracking-wider text-charcoal-slate hover:bg-ivory-warm hover:text-gold-dull transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="pt-3 border-t border-border-hairline space-y-2">
                <Button
                  variant="gold"
                  fullWidth
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation('Bespoke Wealth Advisory');
                  }}
                >
                  Book Private Consultation
                </Button>
                <div className="text-center text-[11px] text-charcoal-muted pt-1">
                  AMFI Registered • Kotak Life Partner
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
