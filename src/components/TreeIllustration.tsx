/** A lightweight brand illustration shared by the hero and growth story. */
export function TreeIllustration({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 500 550" className={className} fill="none" aria-hidden>
    <g stroke="#D9AE5B" strokeLinecap="round" strokeLinejoin="round">
      <path d="M250 540V265M250 390l-92-92M250 350l105-110M250 305l-55-83M250 300l46-100" strokeWidth="8" />
      <path d="m158 298-52-12m52 12-8-63m205 5 52-24m-52 24 2-69m-162 51-48-23m48 23 4-59m99 37 41-40m-41 40-6-61M250 490l-65 50m65-50 68 50" strokeWidth="4" />
    </g>
    <g fill="#D9AE5B" fillOpacity="0.65">
      {[ [106,260],[141,213],[111,186],[166,166],[197,141],[232,170],[249,112],[290,117],[325,143],[355,145],[385,175],[409,199],[361,215],[304,173],[214,198],[155,264],[190,284],[267,219],[322,253],[227,244] ].map(([x,y],i) => <ellipse key={i} cx={x} cy={y} rx={i % 2 ? 17 : 22} ry={i % 2 ? 29 : 15} transform={`rotate(${i * 37} ${x} ${y})`} />)}
    </g>
  </svg>;
}
