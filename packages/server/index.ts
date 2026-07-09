import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { createClientAndConnect } from './db'
import { requireAuth } from './authMiddleware'
import { createApiProxy, practicumResourcesProxy } from './proxy'

const app = express()
const port = Number(process.env.SERVER_PORT) || 3001
const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:3000'

app.use(cors({ origin: clientOrigin, credentials: true }))
app.use(cookieParser())

createClientAndConnect()

app.get('/', (_req, res) => {
  res.json({ message: 'Hello from API' })
})

app.use('/auth', createApiProxy('/auth'))
app.use('/oauth/yandex', createApiProxy('/oauth/yandex'))
app.use('/user', requireAuth, createApiProxy('/user'))
app.use('/leaderboard', createApiProxy('/leaderboard'))
app.use('/api/v2/resources', practicumResourcesProxy)

const server = app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
})

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `  ➜ ❌ Порт ${port} уже занят. Остановите другой процесс (Ctrl+C в терминале с yarn dev:server).`
    )
    process.exit(1)
  }

  throw err
})

const shutdown = () => {
  if ('closeAllConnections' in server) {
    ;(
      server as typeof server & { closeAllConnections: () => void }
    ).closeAllConnections()
  }

  server.close(() => process.exit(0))

  setTimeout(() => process.exit(0), 1000).unref()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
