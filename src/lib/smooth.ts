export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Let the browser handle wheel and touch scrolling without a permanent RAF loop. */
export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

let activeLocks = 0;
let restorePage: (() => void) | null = null;

/** Each overlay owns its lock; closing one cannot unlock another overlay. */
export function lockScroll(locked: boolean) {
  if (!locked) return () => {};
  if (activeLocks++ === 0) {
    const y = window.scrollY;
    const body = document.body;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: document.documentElement.style.overflow };
    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.width = '100%';
    document.documentElement.style.overflow = 'hidden';
    restorePage = () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      document.documentElement.style.overflow = previous.overflow;
      window.scrollTo({ top: y, behavior: 'instant' });
    };
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--activeLocks === 0) { restorePage?.(); restorePage = null; }
  };
}
