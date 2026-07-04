import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express'
import { connectDb } from './db'
import { syncModels } from './models'
import { forumRouter } from './routes/forum'

const app = express()
// без прокси клиент бьёт сюда напрямую с другого порта — нужны credentials в CORS
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
const port = Number(process.env.SERVER_PORT) || 3001

// при холодном старте (особенно в docker-compose) Postgres может ещё не принимать
// соединения в момент запуска сервера — пробуем несколько раз с паузой
const DB_CONNECT_ATTEMPTS = 10
const DB_CONNECT_RETRY_DELAY_MS = 2000

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const bootstrapDb = async () => {
  for (let attempt = 1; attempt <= DB_CONNECT_ATTEMPTS; attempt += 1) {
    if (await connectDb()) {
      await syncModels()
      return
    }

    if (attempt < DB_CONNECT_ATTEMPTS) {
      await wait(DB_CONNECT_RETRY_DELAY_MS)
    }
  }

  console.error(
    `Не удалось подключиться к базе данных после ${DB_CONNECT_ATTEMPTS} попыток`
  )
}

bootstrapDb()

app.get('/', (_, res) => {
  res.json({ message: 'Hello from API' })
})

app.use('/forum', forumRouter)

const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err)
  res.status(500).json({ reason: 'Внутренняя ошибка сервера' })
}

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`)
})
