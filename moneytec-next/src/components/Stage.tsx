import { useEffect, useRef, useState } from 'react';
import { RUPEE_PATH } from './rupeePath';
import { reduced, useMobile } from './ui';
import type { RupeeHandle, RupeePose } from './RupeeScene';
import type { AuroraHandle } from './AuroraField';

/**
 * A fixed layer behind the page: a faint warm light field everywhere, and the gold ₹ that owns the opening.
 * As you scroll past the hero the ₹ turns once, rises and fades away, leaving the rest of the site calm.
 */
/** `at` pins a cue to a point inside a pinned section (0 = pin starts, 1 = pin ends) instead of its centre. */
type Cue = { sel: string; at?: number; pose: RupeePose; field: number; o: number };

// spins are whole turns (plus a slight lean) so the ₹ always reads the right way round when it settles
const TURN = Math.PI * 2;
const LAPTOP: Cue[] = [
  { sel: '#top', at: 0, pose: { x: 0.5, y: -0.16, s: 0.54, spin: 0, glow: 1 }, field: 0, o: 1 },
  { sel: '#highlights', pose: { x: 0.5, y: -1.6, s: 0.6, spin: TURN * 1.5, glow: 0 }, field: 0.6, o: 0 },
];
const PHONE: Cue[] = [
  { sel: '#top', pose: { x: 0.5, y: -0.54, s: 0.36, spin: 0, glow: 1 }, field: 0, o: 1 },
  { sel: '#highlights', pose: { x: 0.5, y: -1.6, s: 0.3, spin: TURN, glow: 0 }, field: 0.6, o: 0 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function Stage() {
  const mobile = useMobile();
  const field = useRef<HTMLCanvasElement>(null);
  const coin = useRef<HTMLCanvasElement>(null);
  const flat = useRef<SVGSVGElement>(null);
  const [ready, setReady] = useState({ field: false, coin: false });

  useEffect(() => {
    const cues = mobile ? PHONE : LAPTOP;
    let aurora: AuroraHandle | undefined, rupee: RupeeHandle | undefined, dead = false;
    let anchors: { at: number; cue: Cue }[] = [];

    // the scroll position at which each chapter is "centred" (the hero is centred at the very top)
    const measure = () => {
      anchors = cues.flatMap((cue) => {
        const el = document.querySelector<HTMLElement>(cue.sel);
        if (!el) return [];
        const top = el.getBoundingClientRect().top + window.scrollY;
        const at = cue.at !== undefined
          ? top + cue.at * Math.max(0, el.offsetHeight - window.innerHeight)
          : top + Math.min(el.offsetHeight, window.innerHeight * 1.6) / 2 - window.innerHeight / 2;
        return [{ at, cue }];
      }).sort((a, b) => a.at - b.at);
    };
    const poseAt = (y: number) => {
      if (!anchors.length) return { pose: cues[0].pose, field: 0, o: 1 };
      let i = anchors.findIndex((a) => a.at > y);
      if (i === -1) return anchors[anchors.length - 1].cue;
      if (i === 0) return anchors[0].cue;
      const a = anchors[i - 1], b = anchors[i];
      const t = smooth(Math.min(1, Math.max(0, (y - a.at) / Math.max(1, b.at - a.at))));
      const p = {} as RupeePose;
      (Object.keys(a.cue.pose) as (keyof RupeePose)[]).forEach((k) => { p[k] = mix(a.cue.pose[k], b.cue.pose[k], t); });
      return { pose: p, field: mix(a.cue.field, b.cue.field, t), o: mix(a.cue.o, b.cue.o, t) };
    };
    let lastY = window.scrollY, lastT = performance.now();
    const apply = () => {
      const now = performance.now();
      rupee?.setVelocity(((window.scrollY - lastY) / Math.max(8, now - lastT)) * 0.6);
      lastY = window.scrollY; lastT = now;
      const { pose, field: f, o } = poseAt(window.scrollY);
      rupee?.setPose(pose);
      aurora?.setScroll(f);
      if (coin.current) {
        coin.current.style.setProperty('--o', String(o));
        // once the ₹ has left, take its canvas out entirely so it stops drawing
        coin.current.style.display = o < 0.01 ? 'none' : '';
      }
      if (flat.current) {
        flat.current.style.left = `${pose.x * 100}%`;
        flat.current.style.top = `${50 + pose.y * 50}%`;
        flat.current.style.scale = String(pose.s);
        flat.current.style.setProperty('--o', String(o));
      }
    };

    measure(); apply();
    const ro = new ResizeObserver(() => { measure(); apply(); });
    ro.observe(document.body);
    window.addEventListener('scroll', apply, { passive: true });

    const fine = window.matchMedia('(pointer: fine)').matches;
    const move = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1, y = (e.clientY / window.innerHeight) * 2 - 1;
      rupee?.setPointer(x, y); aurora?.setPointer(x, y);
    };
    if (fine) window.addEventListener('pointermove', move, { passive: true });
    // a click (or tap) on empty space flicks the ₹ round; links, buttons and fields keep their own clicks
    const flick = (e: PointerEvent) => { if (!(e.target as HTMLElement).closest('a, button, input, select, label, summary, textarea, form')) rupee?.kick(); };
    window.addEventListener('pointerdown', flick);
    // let scroll speed settle back to zero once scrolling stops
    const calm = window.setInterval(() => { if (performance.now() - lastT > 120) rupee?.setVelocity(0); }, 150);

    // WebGL waits for the page to settle so it never delays the first paint
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    let timer = 0;
    const go = () => {
      import('./AuroraField').then(({ mountAurora }) => {
        if (dead || !field.current) return;
        try { aurora = mountAurora(field.current, { phone: mobile, still: reduced() }); apply(); setReady((r) => ({ ...r, field: true })); } catch { /* CSS aurora stays */ }
      });
      import('./RupeeScene').then(({ mountRupee }) => {
        if (dead || !coin.current) return;
        try {
          rupee = mountRupee(coin.current, { phone: mobile, still: reduced(), pose: poseAt(window.scrollY).pose });
          apply();
          requestAnimationFrame(() => setReady((r) => ({ ...r, coin: true })));
        } catch { /* the flat ₹ stays */ }
      });
    };
    const later = () => { timer = idle ? idle(go, { timeout: 1200 }) : window.setTimeout(go, 250); };
    if (document.readyState === 'complete') later(); else window.addEventListener('load', later, { once: true });

    return () => {
      dead = true;
      ro.disconnect();
      window.removeEventListener('scroll', apply);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', flick);
      window.clearInterval(calm);
      window.removeEventListener('load', later);
      if (!idle) window.clearTimeout(timer);
      rupee?.dispose(); aurora?.dispose();
    };
  }, [mobile]);

  return (
    <div aria-hidden className="stage">
      <div className="aurora opacity-30" />
      <canvas ref={field} className="stage-field" style={{ opacity: ready.field ? 1 : 0 }} />
      <svg ref={flat} viewBox="118 68 186 275" className="stage-flat" style={{ opacity: ready.coin ? 0 : undefined }}>
        <defs><linearGradient id="flat-rupee" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F3DFB6" /><stop offset=".45" stopColor="#C9A06A" /><stop offset="1" stopColor="#8E6A43" /></linearGradient></defs>
        <path d={RUPEE_PATH} fill="url(#flat-rupee)" />
      </svg>
      <canvas ref={coin} className="stage-coin" style={{ visibility: ready.coin ? 'visible' : 'hidden' }} />
    </div>
  );
}
