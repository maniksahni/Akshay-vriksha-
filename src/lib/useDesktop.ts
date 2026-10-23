import { useEffect, useState } from 'react';

const QUERY = '(min-width: 1024px)';

/** True on laptop/desktop widths. Phones and tablets get the streamlined essentials-only page. */
export function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const on = () => setDesktop(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return desktop;
}

/** Where "scroll down" should land: the philosophy scene on desktop, straight to the offerings on phones. */
export const firstSectionAfterHero = () => (window.matchMedia(QUERY).matches ? '#philosophy' : '#offerings');
