import { Faq, Finale, Footer, Gulshan, Safety } from './components/Closing';
import { Configure } from './components/Configure';
import { Grow } from './components/Grow';
import { Hero } from './components/Hero';
import { Highlights } from './components/Highlights';
import { Nav } from './components/Nav';
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
        <Grow />
        <Highlights />
        <Configure />
        <Plans />
        <Safety />
        <Gulshan />
        <Faq />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
