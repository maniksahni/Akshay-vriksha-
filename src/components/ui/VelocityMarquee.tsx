import { ReactNode } from 'react';

/** Readable credentials without an always-running animation or duplicated content. */
export function VelocityMarquee({ children, className = '' }: { children: ReactNode; baseVelocity?: number; className?: string }) {
  return <div className={`overflow-hidden ${className}`}><div className="flex flex-wrap items-center justify-center gap-y-3 px-5">{children}</div></div>;
}
