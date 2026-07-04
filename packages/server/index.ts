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

const bootstrapDb = async () => {
  const connected = await connectDb()
  if (connected) {
    await syncModels()
  }
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
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
})
