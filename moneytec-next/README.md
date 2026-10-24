# Moneytec preview

Financial-services frontend for Moneytec with Gulshan Kohli (AMFI Registered Mutual Fund Distributor, ARN-105840). The approved black/white contrast, orange–pink–purple and mint gradients, scrolling coin and growth story are retained.

- Build from repository root: `npx tsc --noEmit -p moneytec-next/tsconfig.json && npx vite build --config moneytec-next/vite.config.ts`
- Serve the production output: `python3 -m http.server 5191 --directory moneytec-next/dist`
- Publish only the contents of `moneytec-next/dist/` into `moneytec-next/` on `gh-pages`. Preserve other site folders. No custom domain is configured.

Features: SIP illustrations including a zero-return scenario, contribution/growth breakdown, delayed-start comparison, goal conversation prompts, financial-service highlights, visible distributor credentials, FAQs and WhatsApp drafts. Drafts include calculator assumptions or selected planning answers; visitors must send them themselves. No investment transaction is made here. Content focuses on SIPs, family protection and NRI planning. It does not include travel, invented testimonials, product picks or sample asset allocations.

Polish includes restrained static glow, responsive layouts, useful next-step routes and keyboard/mobile navigation. The mobile header uses one wordmark, the coin faces forward, and the financial copy describes product terms and payment paths carefully.

## Mobile layout

Below 640px, the hero and growth story use normal document flow, with a manual timeline slider. Service and goal cards stack within the screen rather than requiring horizontal swipes. Headings, illustrations, calculator controls and vertical spacing use compact phone sizes. Highlight autoplay defaults off.

Validated in headless Chromium at 320×640, 375×667, 390×844, 430×932, 768×1024 and 1366×768: section overflow, mobile timeline, FAQ expansion, next-step links and menu Escape behavior. Phone screenshots were inspected. TypeScript and production build pass. Safari was not used.
