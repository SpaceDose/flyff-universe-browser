import {resolve} from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'electron-vite';

export default defineConfig({
  main: {
    build: {
      // electron-store is ESM-only, so it has to be bundled into the CJS main build.
      externalizeDeps: {exclude: ['electron-store']},
    },
  },
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [react(), tailwindcss()],
  },
});
