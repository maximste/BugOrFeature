import axios, { isAxiosError } from 'axios'

import { API_FETCH_BASE_URL } from '@/shared/config/env'

import type {
  ReasonBody,
  SignInBody,
  SignUpBody,
  SignUpResponse,
} from './types'

/**
 * Общий слой для запросов к API (логин, регистрация и т.д.).
 * Ошибки приводим к ApiError с понятным текстом для форм.
 */

/** Ошибка от API: код ответа (status) и текст для пользователя (reason / message). */
export class ApiError extends Error {
  status: number
  reason?: string

  constructor(status: number, message: string, reason?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.reason = reason
  }
}

const api = axios.create({
  baseURL: API_FETCH_BASE_URL ?? '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const getReason = (data?: ReasonBody) => data?.reason

const toApiError = (err: unknown): ApiError => {
  if (!isAxiosError<ReasonBody>(err)) {
    return new ApiError(0, 'Не удалось связаться с сервером')
  }

  const status = err.response?.status ?? 0
  const reason = getReason(err.response?.data)

  if (status === 401) {
    return new ApiError(401, 'Неверный логин или пароль', reason)
  }

  if (status === 400) {
    return new ApiError(400, reason ?? 'Некорректные данные', reason)
  }

  if (status === 0) {
    return new ApiError(0, 'Не удалось связаться с сервером')
  }

  return new ApiError(
    status,
    reason ?? 'Что-то пошло не так. Попробуйте ещё раз.',
    reason
  )
}

const request = async <T>(call: () => Promise<{ data: T }>): Promise<T> => {
  try {
    const { data } = await call()
    return data
  } catch (err) {
    throw toApiError(err)
  }
}

export const postSignIn = (body: SignInBody) =>
  request(() => api.post<void>('/auth/signin', body))

export const postSignUp = (body: SignUpBody) =>
  request(() => api.post<SignUpResponse>('/auth/signup', body))

export const postLogout = () => request(() => api.post<void>('/auth/logout'))
