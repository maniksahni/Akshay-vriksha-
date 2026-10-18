import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Cursor } from './components/Cursor';
import { Nav } from './components/Nav';
import { Preloader } from './components/Preloader';
import { SectionIndex } from './components/SectionIndex';
import { Compounding } from './components/sections/Compounding';
import { Contact, Footer } from './components/sections/Contact';
import { Faq, Marquee } from './components/sections/Faq';
import { Founder } from './components/sections/Founder';
import { GrowthStory } from './components/sections/GrowthStory';
import { Heritage } from './components/sections/Heritage';
import { Hero } from './components/sections/Hero';
import { Manifesto } from './components/sections/Manifesto';
import { NriDesk } from './components/sections/NriDesk';
import { Offerings } from './components/sections/Offerings';
import { whatsappLink } from './data/site';
import { startSmoothScroll } from './lib/smooth';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gold" />;
}

function WhatsAppFab({ show }: { show: boolean }) {
  return (
    <motion.a
      href={whatsappLink('Namaste! I have a question for Akshaya Vriksha.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      data-cursor="Chat"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,0.5)]"
      initial={{ scale: 0 }}
      animate={{ scale: show ? 1 : 0 }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.38 9.38 0 0 1 9.43 9.44c0 5.2-4.24 9.43-9.44 9.43M20.08 3.9A11.3 11.3 0 0 0 12.05.58C5.8.58.7 5.67.7 11.93c0 2 .52 3.95 1.52 5.67L.6 23.5l6.04-1.58a11.3 11.3 0 0 0 5.4 1.38h.01c6.26 0 11.35-5.1 11.35-11.36 0-3.03-1.18-5.88-3.32-8.03" />
      </svg>
    </motion.a>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => startSmoothScroll(), []);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <ScrollProgress />
      <Nav ready={ready} />
      <SectionIndex show={ready} />
      <main className="relative z-10 bg-night">
        <Hero ready={ready} />
        <Manifesto />
        <GrowthStory />
        <Offerings />
        <Compounding />
        <NriDesk />
        <Marquee />
        <Founder />
        <Heritage />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab show={ready} />
      <div className="grain" aria-hidden />
    </>
  );
}
