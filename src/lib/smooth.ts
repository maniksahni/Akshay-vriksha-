export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Let the browser handle wheel and touch scrolling without a permanent RAF loop. */
export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
