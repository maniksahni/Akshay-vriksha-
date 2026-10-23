import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));

// Self-contained Moneytec app: its own root, Tailwind config and output folder.
export default defineConfig({
  root: here,
  base: './',
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss({ config: `${here}tailwind.config.cjs` }), autoprefixer()] } },
  build: { outDir: `${here}dist`, emptyOutDir: true },
  server: { port: 5190, host: true },
});
