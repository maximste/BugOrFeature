import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import express from 'express'
import { connectDb } from './db'

const app = express()
app.use(cors())
const port = Number(process.env.SERVER_PORT) || 3001

connectDb()

app.get('/', (_, res) => {
  res.json({ message: 'Hello from API' })
})

app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
})
