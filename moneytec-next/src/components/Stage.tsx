import { useEffect, useRef, useState } from 'react';
import { RUPEE_PATH } from './rupeePath';
import { reduced, useMobile } from './ui';
import type { RupeeHandle, RupeePose } from './RupeeScene';
import type { AuroraHandle } from './AuroraField';

/**
 * A fixed layer behind the page: a faint light field everywhere, and the chrome ₹ that owns the opening.
 * As you scroll past the hero the ₹ rises away with it and fades, leaving the rest of the site calm.
 */
/** `at` pins a cue to a point inside a pinned section (0 = pin starts, 1 = pin ends) instead of its centre. */
type Cue = { sel: string; at?: number; pose: RupeePose; field: number; o: number };

// spins are whole turns (plus a slight lean) so the ₹ always reads the right way round when it settles
const TURN = Math.PI * 2;
const LAPTOP: Cue[] = [
  { sel: '#top', at: 0, pose: { x: 0.5, y: -0.12, s: 0.98, spin: 0, glow: 1 }, field: 0, o: 1 },
  // leaving the hero, the ₹ rises with it and is gone before the next section arrives
  { sel: '.lux-masthead', pose: { x: 0.5, y: -1.5, s: 0.8, spin: TURN * 0.25, glow: 0 }, field: 0.5, o: 0 },
];
const PHONE: Cue[] = [
  { sel: '#top', pose: { x: 0.5, y: -0.44, s: 0.42, spin: 0, glow: 1 }, field: 0, o: 1 },
  { sel: '.lux-masthead', pose: { x: 0.5, y: -1.6, s: 0.36, spin: TURN * 0.25, glow: 0 }, field: 0.5, o: 0 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);
// half the visible height, in scene units, of the phone camera (32° field of view at distance 11.5)
const PHONE_HALF_H = Math.tan((32 * Math.PI) / 360) * 11.5;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function Stage() {
  const mobile = useMobile();
  const field = useRef<HTMLCanvasElement>(null);
  const coin = useRef<HTMLCanvasElement>(null);
  const flat = useRef<SVGSVGElement>(null);
  const glow = useRef<HTMLDivElement>(null);
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
      let { pose, field: f, o } = poseAt(window.scrollY);
      // phones: the ₹ is pinned to its slot in the hero, so it sits right on any screen height and scrolls
      // away with the page exactly, no trailing
      const slot = mobile ? document.querySelector<HTMLElement>('.coin-slot') : null;
      if (slot && coin.current) {
        const r = slot.getBoundingClientRect(), st = coin.current.getBoundingClientRect();
        const W = st.width || window.innerWidth, H = st.height || window.innerHeight;
        pose = { x: (r.left + r.width / 2) / W, y: ((r.top + r.height / 2) / H) * 2 - 1, s: (r.height / 2) * 2 * PHONE_HALF_H / (2.95 * H), spin: window.scrollY * 0.004, glow: 1 };
        o = Math.max(0, Math.min(1, r.bottom / (r.height * 0.7)));
        f = 0;
        // a soft halo travels with the coin so it glows against the night even mid-spin
        if (field.current) field.current.style.display = o < 0.01 ? 'none' : '';
        if (glow.current) {
          glow.current.style.transform = `translate3d(${r.left + r.width / 2}px, ${r.top + r.height / 2}px, 0) translate(-50%, -50%)`;
          glow.current.style.opacity = String(o);
        }
      }
      rupee?.setPose(pose, !!slot);
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
        flat.current.style.display = o < 0.05 ? 'none' : '';
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
    // phones: the ₹ leans toward your finger while you touch, then settles back; no tilt-to-lean, so the ring
    // faces the same way on Android, iPhone and laptop
    const touch = (e: TouchEvent) => { const t = e.touches[0]; if (t) rupee?.setPointer((t.clientX / window.innerWidth) * 2 - 1, (t.clientY / window.innerHeight) * 2 - 1); };
    const release = () => rupee?.setPointer(0, 0);
    if (mobile) {
      window.addEventListener('touchmove', touch, { passive: true });
      window.addEventListener('touchend', release, { passive: true });
      window.addEventListener('touchcancel', release, { passive: true });
    }
    // a click (or tap) on empty space flicks the ₹ round; links, buttons and fields keep their own clicks
    const flick = (e: PointerEvent) => { if (!(e.target as HTMLElement).closest('a, button, input, select, label, summary, textarea, form')) rupee?.kick(); };
    window.addEventListener('pointerdown', flick);
    // let scroll speed settle back to zero once scrolling stops
    const calm = window.setInterval(() => { if (performance.now() - lastT > 120) rupee?.setVelocity(0); }, 150);

    // WebGL waits for the page to settle so it never delays the first paint
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    let timer = 0;
    const go = () => {
      // phones get the same liquid light as laptops, drawn small and only while the hero is on screen
      import('./AuroraField').then(({ mountAurora }) => {
        if (dead || !field.current) return;
        try { aurora = mountAurora(field.current, { phone: mobile, still: false }); apply(); setReady((r) => ({ ...r, field: true })); } catch { /* CSS aurora stays */ }
      });
      import('./RupeeScene').then(({ mountRupee }) => {
        if (dead || !coin.current) return;
        try {
          // phones and laptops show the same living scene; Reduce Motion only drops the spinning entrance and tap-spins
          rupee = mountRupee(coin.current, { phone: mobile, still: false, calm: reduced(), pose: poseAt(window.scrollY).pose });
          apply();
          requestAnimationFrame(() => setReady((r) => ({ ...r, coin: true })));
        } catch { /* the flat ₹ stays */ }
      });
    };
    // phones hold the 3D scene back a little longer so it never fights the headline's entrance for the CPU
    let hold = 0;
    const settle = () => { timer = idle ? idle(go, { timeout: 1200 }) : window.setTimeout(go, 250); };
    const later = () => { if (mobile) hold = window.setTimeout(settle, 1400); else settle(); };
    if (document.readyState === 'complete') later(); else window.addEventListener('load', later, { once: true });

    return () => {
      dead = true;
      ro.disconnect();
      window.removeEventListener('scroll', apply);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', flick);
      window.removeEventListener('touchmove', touch);
      window.removeEventListener('touchend', release);
      window.removeEventListener('touchcancel', release);
      window.clearInterval(calm);
      window.removeEventListener('load', later);
      window.clearTimeout(hold);
      if (!idle) window.clearTimeout(timer);
      rupee?.dispose(); aurora?.dispose();
    };
  }, [mobile]);

  return (
    <div aria-hidden className="stage">
      <div className="aurora opacity-30" />
      <canvas ref={field} className="stage-field" style={{ opacity: ready.field ? 1 : 0 }} />
      <svg ref={flat} viewBox="118 68 186 275" className="stage-flat" style={{ opacity: ready.coin ? 0 : undefined }}>
        <defs><linearGradient id="flat-rupee" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFD688" /><stop offset=".45" stopColor="#FF375F" /><stop offset="1" stopColor="#BF5AF2" /></linearGradient></defs>
        <path d={RUPEE_PATH} fill="url(#flat-rupee)" />
      </svg>
      <div ref={glow} className="stage-glow" />
      <canvas ref={coin} className="stage-coin" style={{ visibility: ready.coin ? 'visible' : 'hidden' }} />
    </div>
  );
}
