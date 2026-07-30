import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '../../../.env') })

// @zag-js/store (used by Chakra UI v3) references `File` at module init time.
// File is only a Node.js global from v20+; polyfill it for older runtimes.
if (typeof (globalThis as Record<string, unknown>).File === 'undefined') {
  ;(globalThis as Record<string, unknown>).File = class File {}
}

import { HelmetData } from 'react-helmet'
import express, { Request as ExpressRequest } from 'express'

import fs from 'fs/promises'
import { createServer as createViteServer, ViteDevServer } from 'vite'
import serialize from 'serialize-javascript'
import cookieParser from 'cookie-parser'

import { resolvePageAuthRedirect } from './auth'
import { createCspMiddleware, injectScriptNonces, parseOrigin } from './csp'

const port = process.env.CLIENT_PORT
const clientPath = path.join(__dirname, '..')
const isDev = process.env.NODE_ENV === 'development'
const apiOrigin = parseOrigin(process.env.EXTERNAL_SERVER_URL)

async function createServer() {
  const app = express()

  app.use(cookieParser())
  app.use(
    createCspMiddleware({
      isDev,
      apiOrigin,
      clientPort: port,
    })
  )
  let vite: ViteDevServer | undefined
  if (isDev) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: clientPath,
      appType: 'custom',
    })

    app.use(vite.middlewares)
  } else {
    app.use(
      express.static(path.join(clientPath, 'dist/client'), { index: false })
    )
  }

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      const authRedirect = await resolvePageAuthRedirect(req)

      if (authRedirect != null) {
        res.redirect(302, authRedirect)
        return
      }
      // Получаем файл client/index.html который мы правили ранее
      // Создаём переменные
      let render: (req: ExpressRequest) => Promise<{
        html: string
        initialState: unknown
        routerState: unknown
        helmet: HelmetData
        styleTags: string
      }>
      let template: string
      const cspNonce = String(res.locals.cspNonce ?? '')

      if (vite) {
        template = await fs.readFile(
          path.resolve(clientPath, 'index.html'),
          'utf-8'
        )

        template = await vite.transformIndexHtml(url, template)
        template = injectScriptNonces(template, cspNonce)

        render = (
          await vite.ssrLoadModule(
            path.join(clientPath, 'src/app/entry-server.tsx')
          )
        ).render
      } else {
        template = await fs.readFile(
          path.join(clientPath, 'dist/client/index.html'),
          'utf-8'
        )
        template = injectScriptNonces(template, cspNonce)

        const pathToServer = path.join(
          clientPath,
          'dist/server/entry-server.js'
        )

        render = (await import(pathToServer)).render
      }

      const {
        html: appHtml,
        initialState,
        routerState,
        helmet,
        styleTags,
      } = await render(req)

      const html = template
        .replace('<!--ssr-styles-->', styleTags)
        .replace(
          `<!--ssr-helmet-->`,
          `${helmet.meta.toString()} ${helmet.title.toString()} ${helmet.link.toString()}`
        )
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(
          `<!--ssr-initial-state-->`,
          `<script nonce="${cspNonce}">window.APP_INITIAL_STATE = ${serialize(
            initialState,
            {
              isJSON: true,
            }
          )}</script>`
        )
        .replace(
          `<!--ssr-router-state-->`,
          `<script nonce="${cspNonce}">window.__staticRouterHydrationData = ${serialize(
            routerState,
            {
              isJSON: true,
            }
          )}</script>`
        )

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      if (e instanceof Response) {
        const location = e.headers.get('Location')

        if (location) {
          return res.redirect(e.status, location)
        }

        return res.status(e.status).end()
      }
      if (vite) vite.ssrFixStacktrace(e as Error)
      next(e)
    }
  })

  app.listen(port, () => {
    console.log(`Client is listening on port: ${port}`)
  })
}

createServer()
