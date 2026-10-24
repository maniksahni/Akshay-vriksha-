# Moneytec preview

Financial-services frontend for Moneytec with Gulshan Kohli (AMFI Registered Mutual Fund Distributor, ARN-105840). The approved black/white contrast, orange–pink–purple and mint gradients, scrolling coin and growth story are retained.

- Build from repository root: `npx tsc --noEmit -p moneytec-next/tsconfig.json && npx vite build --config moneytec-next/vite.config.ts`
- Serve the production output: `python3 -m http.server 5191 --directory moneytec-next/dist`
- Publish only the contents of `moneytec-next/dist/` into `moneytec-next/` on `gh-pages`. Preserve other site folders. No custom domain is configured.

Features: SIP illustrations including a zero-return scenario, contribution/growth breakdown, delayed-start comparison, goal conversation prompts, financial-service highlights, credentials, FAQs and WhatsApp drafts. Drafts include calculator assumptions or selected planning answers; visitors must send them themselves. No investment transaction is made here.

Polish includes restrained static glow, responsive layouts, useful next-step routes and keyboard/mobile navigation. Travel content and invented initials are excluded.
