import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'
import dotenv from 'dotenv'
import path from 'path'
import type { HttpProxy } from 'vite'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const PRACTICUM_AUTH_API_BASE = 'https://ya-praktikum.tech/api/v2'

// Сервер отдаёт куки для ya-praktikum.tech: Domain, Secure, SameSite=None.
// На http://localhost:3000 без правок браузер часто отбрасывает authCookie после F5.
const rewriteSetCookieForLocalhost = (proxy: HttpProxy.Server) => {
  proxy.on('proxyRes', proxyRes => {
    const setCookie = proxyRes.headers['set-cookie']

    if (!setCookie) {
      return
    }

    proxyRes.headers['set-cookie'] = setCookie.map(cookie =>
      cookie
        .replace(/; ?Domain=[^;]+/gi, '')
        .replace(/; ?Secure/gi, '')
        // SameSite=None без Secure на http — cookie не живёт после перезагрузки
        .replace(/; ?SameSite=None/gi, '; SameSite=Lax')
    )
  })
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: Number(process.env.CLIENT_PORT) || 3000,
    // В dev пересылаем /auth/* и /user/* на API Практикума через Vite (localhost + куки)
    // (без ошибок CORS и с рабочими куками). В собранном приложении прокси нет.
    proxy: {
      '/auth': {
        target: PRACTICUM_AUTH_API_BASE,
        changeOrigin: true,
        secure: true,
        configure: rewriteSetCookieForLocalhost,
      },
      '/user': {
        target: PRACTICUM_AUTH_API_BASE,
        changeOrigin: true,
        secure: true,
        timeout: 120_000,
        configure: rewriteSetCookieForLocalhost,
      },
      '/api/v2/resources': {
        target: 'https://ya-praktikum.tech',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  define: {
    __EXTERNAL_SERVER_URL__: JSON.stringify(process.env.EXTERNAL_SERVER_URL),
    __INTERNAL_SERVER_URL__: JSON.stringify(process.env.INTERNAL_SERVER_URL),
    // В dev (yarn dev:spa) — пустая строка: запросы на /auth/... попадают в proxy ниже.
    // В production-сборке — полный URL из .env.
    __API_FETCH_BASE_URL__: JSON.stringify(
      mode === 'production' ? process.env.EXTERNAL_SERVER_URL ?? '' : ''
    ),
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/app/styles/variables" as *;\n`,
      },
    },
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
