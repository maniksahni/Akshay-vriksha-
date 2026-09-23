import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ArrowUpRight } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMessage = encodeURIComponent(
    "Hello Akshaya Vriksha Advisory, I would like to schedule a private consultation regarding wealth management / NRI advisory."
  );
  const whatsappUrl = `https://wa.me/919845012345?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-3 w-80 bg-pine-deep text-ivory-sand border border-gold-dull/40 rounded-xl p-5 shadow-2xl overflow-hidden relative"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-serif text-sm font-semibold tracking-wide text-ivory-sand">
                  Priority Advisory Desk
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-ivory-sand/60 hover:text-ivory-sand p-1"
                aria-label="Close dialogue"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-ivory-sand/80 leading-relaxed mb-4">
              Connect directly with a Senior Wealth Strategist for immediate questions on SIPs, Kotak Life shields, or NRI repatriation.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold shadow-md transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open WhatsApp Concierge</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <div className="text-[10px] text-ivory-sand/50 text-center mt-2.5">
              Typical response time: &lt; 15 minutes during IST market hours
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-pine-deep text-ivory-sand border border-gold-dull/50 shadow-gold-glow hover:border-gold-radiant transition-all"
        aria-label="Contact Wealth Concierge on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-gold-radiant" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <span className="text-xs font-semibold tracking-wide hidden sm:inline text-ivory-sand">
          VIP Concierge
        </span>
      </motion.button>
    </div>
  );
};
