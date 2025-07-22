import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json' assert { type: 'json' };

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',         // your popup or main view
        content: 'src/content.ts',  // CRX content script
        background: 'src/background.ts', // optional: CRX background
      },
    },
  },
});
