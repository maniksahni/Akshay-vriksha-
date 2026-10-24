import { Faq, Finale, Footer, Gulshan, Safety } from './components/Closing';
import { Configure } from './components/Configure';
import { Grow } from './components/Grow';
import { Hero } from './components/Hero';
import { Highlights } from './components/Highlights';
import { InstagramReels } from './components/InstagramReels';
import { Nav } from './components/Nav';
import { NextSteps } from './components/NextSteps';
import { Plans } from './components/Plans';

/** moneytec, told like a product launch: one idea per scene, lots of air, motion only where it means something. */
export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-link focus:px-5 focus:py-3 focus:text-white">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <div className="border-b border-mist bg-white py-5">
          <div className="wrap-wide flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-center text-xs text-slate">
            <a href="https://www.amfiindia.com/locate-distributor" target="_blank" rel="noreferrer" className="hover:underline"><strong className="text-coal">AMFI Registered Mutual Fund Distributor</strong> · ARN-105840 ↗</a>
            <span><strong className="text-coal">Gulshan Kohli</strong> · 12+ years of experience</span>
            <a href="#safety" className="text-link">Understand how your money is handled ↓</a>
          </div>
        </div>
        <Grow />
        <Highlights />
        <InstagramReels />
        <Configure />
        <Plans />
        <Safety />
        <Gulshan />
        <NextSteps />
        <Faq />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
