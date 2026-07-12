import { Sequelize } from 'sequelize'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = process.env

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: POSTGRES_HOST || 'localhost',
  port: Number(POSTGRES_PORT) || 5432,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  logging: false,
})

export const connectDb = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate()
    console.log('Connected to the database')
    return true
  } catch (e) {
    console.error('Unable to connect to the database:', e)
    return false
  }
}
