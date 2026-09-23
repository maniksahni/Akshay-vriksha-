import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { FAQS } from '../../data/faqs';
import { Badge } from '../ui/Badge';

export const FaqAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('amfi-safety');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Advisory & Safety', 'NRI Desk', 'Insurance & Protection', 'Heritage Concierge'];

  const filteredFaqs = selectedCategory === 'All'
    ? FAQS
    : FAQS.filter((f) => f.category === selectedCategory);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-ivory-sand relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <Badge variant="gold" size="md" icon={<HelpCircle className="w-3.5 h-3.5 text-gold-dull" />}>
            Transparency & Clarity
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-pine-deep font-normal tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-charcoal-muted text-sm sm:text-base font-sans leading-relaxed">
            Everything you need to know about our regulatory status, overseas NRI compliance, fee transparency, and holistic advisory framework.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all duration-200 font-semibold uppercase tracking-wider ${
                  selectedCategory === cat
                    ? 'bg-pine-deep text-gold-dull shadow-sm'
                    : 'bg-ivory-warm text-charcoal-muted hover:text-pine-deep hover:bg-ivory-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Items List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-border-hairline bg-white shadow-subtle transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-bold text-gold-dull px-2 py-0.5 rounded bg-ivory-warm shrink-0 hidden sm:inline-block">
                      {faq.category}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-pine-deep">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-1.5 rounded-full bg-ivory-warm text-pine-deep shrink-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-border-hairline/60 bg-ivory-sand/40 px-6 pt-4 pb-6"
                    >
                      <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-sans">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Support Note */}
        <div className="mt-12 p-5 rounded-xl bg-ivory-warm border border-gold-dull/30 text-center text-xs text-charcoal-slate flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            Have a custom cross-border tax question not listed here?
          </span>
          <a
            href="mailto:advisory@akshayavriksha.in"
            className="font-semibold text-gold-dull hover:text-gold-radiant uppercase tracking-wider text-[11px] underline"
          >
            Email Advisory Desk →
          </a>
        </div>
      </div>
    </section>
  );
};
