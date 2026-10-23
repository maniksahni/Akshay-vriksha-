/** Static atmosphere: no WebGL context, animation loop or pointer listeners. */
export function GoldSilk({ className = '', intensity = 0.5 }: { className?: string; intensity?: number }) {
  return <div aria-hidden className={`h-full w-full ${className}`} style={{ background: `radial-gradient(ellipse at 75% 30%, rgba(217,174,91,${intensity * 0.2}), transparent 55%), radial-gradient(ellipse at 30% 70%, #173b2a, #06110d 75%)` }} />;
}
