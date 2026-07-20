import { ConnectionError, DatabaseError, ValidationError } from 'sequelize'

export type DbErrorResponse = {
  status: number
  reason: string
}

/** Различает ошибки Sequelize, чтобы не отдавать одно и то же "500" на любую причину */
export const toDbErrorResponse = (err: unknown): DbErrorResponse | null => {
  if (err instanceof ConnectionError) {
    return { status: 503, reason: 'База данных недоступна, попробуйте позже' }
  }

  if (err instanceof ValidationError) {
    return { status: 400, reason: 'Некорректные данные' }
  }

  if (err instanceof DatabaseError) {
    return { status: 500, reason: 'Ошибка при обращении к базе данных' }
  }

  return null
}
