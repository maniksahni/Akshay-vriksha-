/** moneytec mark: an "m" whose three strokes climb like a growth chart, with a spark on top. */
export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="18" fill="#D4FF3A" />
      <path d="M15 46V28a6 6 0 0 1 12 0v18M27 46V24a6 6 0 0 1 12 0v22M39 46V18a6 6 0 0 1 10.2-4.2" fill="none" stroke="#09090B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="13" r="4" fill="#8B6CFF" />
    </svg>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Mark className="h-8 w-8" />
      <span className="font-display text-[19px] font-extrabold tracking-[-0.04em]">
        moneytec<span className="text-lime">.</span>
      </span>
    </span>
  );
}
