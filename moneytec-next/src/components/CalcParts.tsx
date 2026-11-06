import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { EASE } from './ui';

/** A row of tap choices. `value` may match none of them (a typed amount), then the first one stays reachable by keyboard. */
export function Segmented<T extends number | string>({ options, value, onChange, label, fmt, className = '' }: { options: T[]; value: T; onChange: (v: T) => void; label: string; fmt: (v: T) => string; className?: string }) {
  const selected = options.indexOf(value);
  return (
    <div role="radiogroup" aria-label={label} className={`grid grid-cols-3 gap-2 ${className}`}>
      {options.map((o, i) => (
        <button key={o} type="button" role="radio" aria-checked={o === value} tabIndex={o === value || (selected < 0 && i === 0) ? 0 : -1} onClick={() => onChange(o)} onKeyDown={e => {
          const index = Math.max(0, selected);
          const next = e.key === 'Home' ? 0 : e.key === 'End' ? options.length - 1 : ['ArrowRight', 'ArrowDown'].includes(e.key) ? (index + 1) % options.length : ['ArrowLeft', 'ArrowUp'].includes(e.key) ? (index - 1 + options.length) % options.length : -1;
          if (next < 0) return;
          e.preventDefault(); onChange(options[next]);
          (e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
        }} className="seg">
          {fmt(o)}
        </button>
      ))}
    </div>
  );
}

/** Phones: the calculator's result rises from the bottom of the screen. Tap outside, tap ×, or drag it down to close. */
export function ResultSheet({ open, onClose, id, label, children }: { open: boolean; onClose: () => void; id: string; label: string; children: ReactNode }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        // a tap anywhere outside the sheet closes it
        <motion.div key="scrim" className="calc-scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} aria-hidden />
      )}
      {open && (
        <motion.div
          key="sheet"
          id={id}
          role="dialog"
          aria-label={label}
          className="calc-sheet calc-result"
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          exit={{ y: '105%' }}
          transition={{ duration: 0.5, ease: EASE }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, i) => { if (i.offset.y > 80 || i.velocity.y > 500) onClose(); }}
        >
          <button type="button" className="calc-sheet-handle" onClick={onClose} aria-label="Close"><span /></button>
          <button type="button" className="calc-sheet-close" onClick={onClose} aria-label="Close result">×</button>
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
