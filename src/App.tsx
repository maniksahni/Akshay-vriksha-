import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloat } from './components/layout/WhatsAppFloat';
import { HeroSection } from './components/home/HeroSection';
import { PhilosophyGrid } from './components/home/PhilosophyGrid';
import { Calculator } from './components/home/Calculator';
import { NriDeskSection } from './components/home/NriDeskSection';
import { ProtectionKotak } from './components/home/ProtectionKotak';
import { HeritageTravel } from './components/home/HeritageTravel';
import { Testimonials } from './components/home/Testimonials';
import { FaqAccordion } from './components/home/FaqAccordion';
import { ConsultationPage } from './components/contact/ConsultationPage';
import { BookingModal } from './components/contact/BookingModal';

export function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'consultation'>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeConsultationGoal, setActiveConsultationGoal] = useState<string | undefined>();

  const handleOpenConsultation = (goal?: string) => {
    setActiveConsultationGoal(goal || 'Comprehensive Wealth Advisory');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigatePage = (page: 'home' | 'consultation') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-ivory-sand text-charcoal-slate font-sans antialiased flex flex-col selection:bg-gold-subtle selection:text-pine-deep">
      {/* Global Header */}
      <Header
        onOpenConsultation={handleOpenConsultation}
        onNavigatePage={handleNavigatePage}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentPage === 'home' ? (
          <>
            {/* 1. Hero Section & Trust Strip */}
            <HeroSection onOpenConsultation={handleOpenConsultation} />

            {/* 2. The 3 Pillars Philosophy: Wealth → Protection → Experiences */}
            <PhilosophyGrid onOpenConsultation={handleOpenConsultation} />

            {/* 3. Interactive Precision SIP & Goal Compounding Calculator */}
            <Calculator onOpenConsultation={handleOpenConsultation} />

            {/* 4. Global NRI Investment Desk & 4-Step Cross-Border Flow */}
            <NriDeskSection onOpenConsultation={handleOpenConsultation} />

            {/* 5. Defensive Architecture: Protection & Kotak Life Authorized Desk */}
            <ProtectionKotak onOpenConsultation={handleOpenConsultation} />

            {/* 6. Pillar III: Heritage Travel & Sacred Roots */}
            <HeritageTravel onOpenConsultation={handleOpenConsultation} />

            {/* 7. Client Vignettes & Multi-Decade Trust */}
            <Testimonials />

            {/* 8. Fiduciary Clarity & FAQ Accordion */}
            <FaqAccordion />
          </>
        ) : (
          /* Standalone Consultation / Booking View */
          <ConsultationPage
            initialGoal={activeConsultationGoal}
            onBackToHome={() => handleNavigatePage('home')}
          />
        )}
      </main>

      {/* Footer & Statutory Disclosures Strip */}
      <Footer onOpenConsultation={handleOpenConsultation} />

      {/* Floating Priority VIP Concierge Trigger */}
      <WhatsAppFloat />

      {/* Universal Quick Consultation Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialGoal={activeConsultationGoal}
      />
    </div>
  );
}

export default App;
