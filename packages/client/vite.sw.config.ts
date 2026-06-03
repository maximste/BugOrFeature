import { defineConfig } from 'vite'
import path from 'path'

/** Отдельная сборка Service Worker в dist/client/sw.js (IIFE, без хеша в имени) */
export default defineConfig({
  build: {
    outDir: path.join(__dirname, 'dist/client'),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/sw.ts'),
      name: 'sapperCatSw',
      formats: ['iife'],
      fileName: () => 'sw.js',
    },
    rollupOptions: {
      treeshake: false,
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
