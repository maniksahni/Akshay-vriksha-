import { ReactNode } from 'react';

/** Keep sections in normal document flow without repainting a large clip-path. */
export function Curtain({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
