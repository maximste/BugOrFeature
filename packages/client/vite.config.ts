import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import dotenv from 'dotenv'
import path from 'path'
import type { HttpProxy } from 'vite'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const PRACTICUM_AUTH_API_BASE = 'https://ya-praktikum.tech/api/v2'

// Сервер отдаёт куки для домена ya-praktikum.tech — на localhost они не приживаются.
// Убираем Domain и Secure, чтобы браузер принял куку на http://localhost:3000.
const rewriteSetCookieForLocalhost = (proxy: HttpProxy.Server) => {
  proxy.on('proxyRes', proxyRes => {
    const setCookie = proxyRes.headers['set-cookie']

    if (!setCookie) {
      return
    }

    proxyRes.headers['set-cookie'] = setCookie.map(cookie =>
      cookie.replace(/; ?Domain=[^;]+/gi, '').replace(/; ?Secure/gi, '')
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
    // В dev пересылаем /auth/* на API Практикума через Vite, чтобы логин работал с localhost
    // (без ошибок CORS и с рабочими куками). В собранном приложении прокси нет.
    proxy: {
      '/auth': {
        target: PRACTICUM_AUTH_API_BASE,
        changeOrigin: true,
        secure: true,
        configure: rewriteSetCookieForLocalhost,
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
  plugins: [react(), svgr()],
}))
