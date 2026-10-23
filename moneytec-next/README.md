# moneytec (next)

Gen-Z fintech front end for Moneytec, with Gulshan Kohli (AMFI-registered MFD, ARN-105840).

- Dev: `npx vite --config moneytec-next/vite.config.ts` (from the repo root) → http://localhost:5190
- Build: `npx vite build --config moneytec-next/vite.config.ts` → `moneytec-next/dist/`
- Deploy: copy `moneytec-next/dist/` to any static host (relative paths, works in a sub-folder or on its own domain).

Sections: hero with a draggable 3D coin and throwable stickers, glow-up SIP calculator (start now vs in 5 years),
services bento, money vibe-check quiz, myth-vs-fact swipe deck, founder, 3 steps, FAQ and a WhatsApp starter form.
Every number is an illustration with disclaimers; forms only prefill a WhatsApp message, nothing is submitted or invested.
