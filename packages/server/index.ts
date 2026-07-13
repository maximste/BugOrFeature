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
import { themeRouter } from './routes/theme'

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

// true — подключились (и накатили схему), false — исчерпали все попытки
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

app.get('/', (_, res) => {
  res.json({ message: 'Hello from API' })
})

app.use('/forum', forumRouter)
app.use('/theme', themeRouter)

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

// порт не слушаем, пока не подключимся к БД — иначе healthcheck (GET /) считает
// контейнер здоровым, а /forum/* при этом всё равно отдаёт 500
const main = async () => {
  const connected = await bootstrapDb()

  if (!connected) {
    console.error(
      `Не удалось подключиться к базе данных после ${DB_CONNECT_ATTEMPTS} попыток — выходим`
    )
    process.exit(1)
  }

  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`)
  })
}

main()
