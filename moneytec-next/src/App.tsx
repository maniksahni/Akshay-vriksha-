import { Bento } from './components/Bento';
import { Cta, Faq, Footer } from './components/Close';
import { GlowUp } from './components/GlowUp';
import { Hero } from './components/Hero';
import { Myths } from './components/Myths';
import { MobileBar, Nav } from './components/Nav';
import { Gulshan, Steps } from './components/People';
import { Vibe } from './components/Vibe';

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:text-void">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <GlowUp />
        <Bento />
        <Vibe />
        <Myths />
        <Gulshan />
        <Steps />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <MobileBar />
      <div className="grain" aria-hidden />
    </>
  );
}
