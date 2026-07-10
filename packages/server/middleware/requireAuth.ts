import { NextFunction, Request, Response } from 'express'
import axios from 'axios'

const PRACTICUM_AUTH_API_BASE =
  process.env.PRACTICUM_API_BASE_URL ?? 'https://ya-praktikum.tech/api/v2'

export type AuthUser = {
  id: number
  login: string
  displayName: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- так требует паттерн расширения типов Express
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

type PracticumUserResponse = {
  id: number
  login: string
  display_name?: string | null
  first_name?: string
  second_name?: string
}

const resolveDisplayName = (data: PracticumUserResponse): string => {
  if (data.display_name) {
    return data.display_name
  }

  const fullName = [data.first_name, data.second_name]
    .filter(Boolean)
    .join(' ')
    .trim()

  return fullName || data.login
}

// вызывать только внутри роутов за requireAuth — там req.user уже гарантированно есть
export const getAuthUser = (req: Request): AuthUser => req.user as AuthUser

// своей авторизации у нас нет, сессию проверяем через Практикум
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const cookie = req.headers.cookie

  if (!cookie) {
    res.status(403).json({ reason: 'Unauthorized' })
    return
  }

  try {
    const { data } = await axios.get<PracticumUserResponse>(
      `${PRACTICUM_AUTH_API_BASE}/auth/user`,
      { headers: { cookie } }
    )

    req.user = {
      id: data.id,
      login: data.login,
      displayName: resolveDisplayName(data),
    }

    next()
  } catch {
    res.status(403).json({ reason: 'Unauthorized' })
  }
}
