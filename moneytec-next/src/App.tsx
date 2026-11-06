import { useEffect, useLayoutEffect } from 'react';
import { Faq, Finale, Footer, Gulshan, Safety } from './components/Closing';
import { Configure } from './components/Configure';
import { Grow } from './components/Grow';
import { Hero } from './components/Hero';
import { Highlights } from './components/Highlights';
import { Stage } from './components/Stage';
import { InstagramReels } from './components/InstagramReels';
import { Ticker } from './components/Ticker';
import { Nav } from './components/Nav';
import { NextSteps } from './components/NextSteps';
import { Plans } from './components/Plans';
import { reduced } from './components/ui';

/** Smooth, weighted scrolling for mouse and trackpad; touch devices keep their native scroll. */
function useSmoothScroll() {
  useEffect(() => {
    if (reduced() || !window.matchMedia('(pointer: fine)').matches) return;
    let raf = 0, live = true, cleanup = () => {};
    import('lenis').then(({ default: Lenis }) => {
      if (!live) return;
      const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: { offset: -80 } });
      (window as Window & { __lenis?: unknown }).__lenis = lenis;
      raf = requestAnimationFrame(function loop(t) { lenis.raf(t); raf = requestAnimationFrame(loop); });
      const menu = (e: Event) => ((e as CustomEvent<boolean>).detail ? lenis.stop() : lenis.start());
      window.addEventListener('moneytec:menu', menu);
      cleanup = () => { window.removeEventListener('moneytec:menu', menu); lenis.destroy(); };
    });
    return () => { live = false; cancelAnimationFrame(raf); cleanup(); };
  }, []);
}

/** Decorative loops stop while their section is off screen, so a long page never spends power on what no one can see. */
function usePauseOffscreen() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)), { rootMargin: '200px 0px' });
    document.querySelectorAll('#main > section, #main > div, footer').forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
}

/**
 * Phones: coming Back from a guide rebuilds this page from nothing. index.html remembers where you were; here the
 * page is put back there before its first paint, so you never see the hero replay and then a jump down the page.
 */
function useReturnToPlace() {
  useLayoutEffect(() => {
    const y = (window as Window & { __mtReturn?: number }).__mtReturn;
    if (!y) return;
    const put = () => window.scrollTo({ top: y, left: 0, behavior: 'instant' as ScrollBehavior });
    put();
    // late fonts can change the page height for a moment: hold the place until the visitor moves or it settles
    const ro = new ResizeObserver(put);
    ro.observe(document.body);
    const stop = () => {
      ro.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener('touchstart', stop);
      history.scrollRestoration = 'auto';
    };
    const timer = window.setTimeout(stop, 1500);
    window.addEventListener('touchstart', stop, { passive: true });
    requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.remove('returning')));
    return stop;
  }, []);
}

/** moneytec, told as one continuous night scene: light gathers into the ₹, then the story unfolds around it. */
export default function App() {
  useSmoothScroll();
  usePauseOffscreen();
  useReturnToPlace();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-paper focus:px-5 focus:py-3 focus:text-ink">
        Skip to content
      </a>
      <Stage />
      <div className="grain" aria-hidden />
      <Nav />
      <main id="main">
        <Hero />
        <Ticker />
        <Highlights />
        <Grow />
        <InstagramReels />
        <Configure />
        <Plans />
        <Gulshan />
        <Safety />
        <NextSteps />
        <Faq />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
