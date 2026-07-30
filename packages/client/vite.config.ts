import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'
import dotenv from 'dotenv'
import path from 'path'

import { buildDevSpaCspHeaderValue, parseOrigin } from './server/csp'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const BFF_URL = process.env.EXTERNAL_SERVER_URL ?? 'http://localhost:3001'
const CLIENT_PORT = Number(process.env.CLIENT_PORT) || 3000
const apiOrigin = parseOrigin(process.env.EXTERNAL_SERVER_URL ?? BFF_URL)

const apiProxy = {
  target: BFF_URL,
  changeOrigin: true,
  secure: false,
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: CLIENT_PORT,
    headers:
      mode === 'development'
        ? {
            'Content-Security-Policy': buildDevSpaCspHeaderValue(
              apiOrigin,
              CLIENT_PORT
            ),
          }
        : undefined,
    // В dev (yarn dev:spa) запросы /auth, /user и т.д. идут на BFF (packages/server).
    proxy: {
      '/auth': apiProxy,
      '/oauth/yandex': apiProxy,
      '/user': { ...apiProxy, timeout: 120_000 },
      '/api/v2/resources': apiProxy,
      // Только API: /leaderboard-page — маршрут React, не проксировать
      '^/leaderboard$': { ...apiProxy, timeout: 120_000 },
      '^/leaderboard/': { ...apiProxy, timeout: 120_000 },
    },
  },
  define: {
    __EXTERNAL_SERVER_URL__: JSON.stringify(process.env.EXTERNAL_SERVER_URL),
    __INTERNAL_SERVER_URL__: JSON.stringify(process.env.INTERNAL_SERVER_URL),
    __CLIENT_ORIGIN__: JSON.stringify(process.env.CLIENT_ORIGIN ?? ''),
    // В dev (yarn dev:spa) — пустая строка: запросы на /auth/... попадают в proxy ниже.
    // В production-сборке — полный URL из .env.
    __API_FETCH_BASE_URL__: JSON.stringify(
      mode === 'production' ? process.env.EXTERNAL_SERVER_URL ?? '' : ''
    ),
  },
  build: {
    outDir: path.join(__dirname, 'dist/client'),
  },
  ssr: {
    format: 'cjs',
  },
  plugins: [
    react(),
    svgr(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectRegister: false,
      manifest: {
        name: 'Котосапёр',
        short_name: 'Котосапёр',
        description: 'Игра Котосапёр',
        start_url: '/',
        display: 'standalone',
        background_color: '#fff9ed',
        theme_color: '#ffb6bc',
        lang: 'ru',
        icons: [
          {
            src: '/icons/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      injectManifest: {
        globDirectory: path.join(__dirname, 'dist/client'),
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,ico}'],
        globIgnores: ['**/sw.js', '**/sw.js.map', '**/manifest.webmanifest'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
}))
