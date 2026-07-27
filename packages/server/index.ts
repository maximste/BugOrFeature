import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { connectDb } from './db'
import { syncModels } from './models'
import { forumRouter } from './routes/forum'
import { requireAuth } from './authMiddleware'
import { createApiProxy, practicumResourcesProxy } from './proxy'
import { themeRouter } from './routes/theme'
import { toDbErrorResponse } from './utils/dbErrors'

const app = express()
const port = Number(process.env.SERVER_PORT) || 3001
const clientOrigin = process.env.CLIENT_ORIGIN
if (!clientOrigin) {
  throw new Error('CLIENT_ORIGIN is required')
}

app.use(cors({ origin: clientOrigin, credentials: true }))
app.use(cookieParser())
app.use(express.json())

// Postgres при холодном старте может быть ещё не готов — пробуем несколько раз
const DB_CONNECT_ATTEMPTS = 10
const DB_CONNECT_RETRY_DELAY_MS = 2000

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const bootstrapDb = async (): Promise<boolean> => {
  for (let attempt = 1; attempt <= DB_CONNECT_ATTEMPTS; attempt += 1) {
    if (await connectDb()) {
      await syncModels()
      return true
    }

    if (attempt < DB_CONNECT_ATTEMPTS) {
      await wait(DB_CONNECT_RETRY_DELAY_MS)
    }
  }

  return false
}

app.get('/', (_req, res) => {
  res.json({ message: 'Hello from API' })
})

app.use('/auth', createApiProxy('/auth'))
app.use('/oauth/yandex', createApiProxy('/oauth/yandex'))
app.use('/user', requireAuth, createApiProxy('/user'))
app.use('/leaderboard', requireAuth, createApiProxy('/leaderboard'))
app.use('/api/v2/resources', practicumResourcesProxy)
app.use('/forum', forumRouter)
app.use('/theme', themeRouter)

const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err)

  const dbError = toDbErrorResponse(err)

  if (dbError) {
    res.status(dbError.status).json({ reason: dbError.reason })
    return
  }

  res.status(500).json({ reason: 'Внутренняя ошибка сервера' })
}

app.use(errorHandler)

const shutdown = (server: ReturnType<typeof app.listen>) => {
  if ('closeAllConnections' in server) {
    ;(
      server as typeof server & { closeAllConnections: () => void }
    ).closeAllConnections()
  }

  server.close(() => process.exit(0))

  setTimeout(() => process.exit(0), 1000).unref()
}

// порт не слушаем, пока не подключимся к БД — иначе healthcheck решит, что всё ок
const main = async () => {
  const connected = await bootstrapDb()

  if (!connected) {
    console.error(
      `Не удалось подключиться к базе данных после ${DB_CONNECT_ATTEMPTS} попыток — выходим`
    )
    process.exit(1)
  }

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

  process.on('SIGTERM', () => shutdown(server))
  process.on('SIGINT', () => shutdown(server))
}

main()
