import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ConsultationPage } from './ConsultationPage';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoal?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialGoal,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-pine-darkest/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-5xl bg-ivory-sand rounded-2xl shadow-2xl border border-gold-dull/40 overflow-hidden z-10 max-h-[92vh] overflow-y-auto"
          >
            {/* Close Button Header */}
            <div className="sticky top-0 z-20 flex justify-end p-4 bg-ivory-sand/90 backdrop-blur-md border-b border-border-hairline">
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-ivory-warm text-charcoal-slate hover:bg-pine-deep hover:text-gold-dull transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-2 sm:p-6">
              <ConsultationPage
                initialGoal={initialGoal}
                onBackToHome={onClose}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
