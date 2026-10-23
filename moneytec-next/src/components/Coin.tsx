import { PointerEvent, useEffect, useRef } from 'react';
import { reduced } from './ui';

/**
 * A chunky 3D ₹ coin built from stacked CSS layers (no WebGL).
 * Spins on its own; drag or flick it to spin it yourself, and it eases back to idle.
 */
export function Coin({ size = 300 }: { size?: number }) {
  const coin = useRef<HTMLDivElement>(null);
  const state = useRef({ ry: -24, rx: 8, vy: 0.35, dragging: false, lastX: 0, lastY: 0, tiltTarget: 8 });
  const thickness = Math.round(size * 0.1);
  const layers = 14;

  useEffect(() => {
    const s = state.current;
    const still = reduced();
    let raf = 0;
    const tick = () => {
      if (!s.dragging) {
        // friction toward the gentle idle spin
        s.vy += (0.35 - s.vy) * 0.02;
        s.ry += still ? 0 : s.vy;
      }
      s.rx += (s.tiltTarget - s.rx) * 0.08;
      if (coin.current) coin.current.style.transform = `rotateX(${s.rx}deg) rotateY(${s.ry}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onMove = (e: globalThis.PointerEvent) => {
      if (!s.dragging) s.tiltTarget = 8 + ((e.clientY / window.innerHeight) - 0.5) * -18;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const down = (e: PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    s.dragging = true;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    s.ry += dx * 0.6;
    s.vy = dx * 0.6;
    s.tiltTarget = Math.max(-30, Math.min(30, s.tiltTarget - (e.clientY - s.lastY) * 0.3));
    s.lastX = e.clientX;
    s.lastY = e.clientY;
  };
  const up = () => {
    state.current.dragging = false;
  };

  const faceText = size * 0.52;

  return (
    <div
      className="coin-scene relative cursor-grab touch-pan-y select-none active:cursor-grabbing"
      style={{ width: size, height: size }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      role="img"
      aria-label="A spinning gold-lime rupee coin. Drag to spin it."
    >
      {/* glow underneath */}
      <div className="pointer-events-none absolute inset-[8%] rounded-full bg-lime/30 blur-[60px]" />
      <div ref={coin} className="coin h-full w-full">
        {/* rim: stacked discs give the coin real thickness */}
        {Array.from({ length: layers }).map((_, i) => {
          const z = -thickness / 2 + (i * thickness) / (layers - 1);
          return (
            <div
              key={i}
              style={{
                transform: `translateZ(${z}px)`,
                background: i % 2 ? '#9CC400' : '#B4E000',
                backfaceVisibility: 'visible',
              }}
            />
          );
        })}
        {/* front */}
        <div
          className="grid place-items-center"
          style={{
            transform: `translateZ(${thickness / 2 + 0.5}px)`,
            background: 'radial-gradient(circle at 32% 28%, #F4FFB8 0%, #D4FF3A 34%, #A8D400 78%, #7FA100 100%)',
            boxShadow: 'inset 0 0 0 10px rgba(9,9,11,0.08), inset 0 0 0 16px rgba(255,255,255,0.25), inset 0 -18px 40px rgba(0,0,0,0.18)',
          }}
        >
          <div className="absolute inset-[9%] rounded-full border-[3px] border-dashed border-void/25" />
          <span className="font-display font-black leading-none text-void" style={{ fontSize: faceText, textShadow: '0 2px 0 rgba(255,255,255,0.45), 0 -2px 0 rgba(0,0,0,0.25)' }}>
            ₹
          </span>
          <span className="absolute bottom-[14%] font-display text-[0.6rem] font-bold tracking-[0.4em] text-void/60" style={{ fontSize: size * 0.04 }}>
            MONEYTEC
          </span>
        </div>
        {/* back */}
        <div
          className="grid place-items-center"
          style={{
            transform: `rotateY(180deg) translateZ(${thickness / 2 + 0.5}px)`,
            background: 'radial-gradient(circle at 32% 28%, #E4DCFF 0%, #8B6CFF 45%, #5B3FE0 100%)',
            boxShadow: 'inset 0 0 0 10px rgba(9,9,11,0.12), inset 0 0 0 16px rgba(255,255,255,0.2)',
          }}
        >
          <svg viewBox="0 0 64 64" style={{ width: size * 0.46 }} aria-hidden>
            <path d="M15 46V28a6 6 0 0 1 12 0v18M27 46V24a6 6 0 0 1 12 0v22M39 46V18a6 6 0 0 1 10.2-4.2" fill="none" stroke="#F4F2EC" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="13" r="4" fill="#D4FF3A" />
          </svg>
        </div>
      </div>
    </div>
  );
}
