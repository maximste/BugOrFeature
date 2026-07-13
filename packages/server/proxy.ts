import type { IncomingMessage, ServerResponse } from 'http'
import { createProxyMiddleware } from 'http-proxy-middleware'

const PRACTICUM_API_BASE =
  process.env.PRACTICUM_API_BASE_URL ??
  process.env.PRACTICUM_API_BASE ??
  'https://ya-praktikum.tech/api/v2'

const rewriteSetCookieForLocalhost = (proxyRes: IncomingMessage) => {
  const setCookie = proxyRes.headers['set-cookie']

  if (!setCookie) {
    return
  }

  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]

  proxyRes.headers['set-cookie'] = cookies.map(cookie =>
    cookie
      .replace(/; ?Domain=[^;]+/gi, '')
      .replace(/; ?Secure/gi, '')
      .replace(/; ?SameSite=None/gi, '; SameSite=Lax')
      .replace(/; ?Path=\/api\/v2[^;]*/gi, '; Path=/')
  )
}

export const createApiProxy = (mountPath: string) =>
  createProxyMiddleware({
    target: PRACTICUM_API_BASE,
    changeOrigin: true,
    secure: true,
    // Express снимает mountPath (/auth) — возвращаем его для API Практикума
    pathRewrite: path => `${mountPath}${path}`,
    on: {
      proxyRes: (proxyRes, _req, _res: ServerResponse) => {
        rewriteSetCookieForLocalhost(proxyRes)
      },
    },
  })

export const practicumResourcesProxy = createProxyMiddleware({
  target: 'https://ya-praktikum.tech',
  changeOrigin: true,
  secure: true,
  pathRewrite: path => `/api/v2/resources${path}`,
  on: {
    proxyRes: (proxyRes, _req, _res: ServerResponse) => {
      rewriteSetCookieForLocalhost(proxyRes)
    },
  },
})
