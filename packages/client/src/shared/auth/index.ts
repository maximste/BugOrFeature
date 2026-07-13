/**
 * Сценарии авторизации: вход, регистрация, выход.
 * Сессия хранится в cookie API (authCookie/uuid); проверка — на бэкенде.
 */

import { ApiError, postLogout, postSignIn, postSignUp } from '@/shared/api'
import { removeCookie } from '@/shared/lib/cookie'

/** Cookie сессии API Практикума (могут быть HttpOnly). */
export const AUTH_COOKIE = 'authCookie'
export const UUID_COOKIE = 'uuid'

export const clearAuthCookie = () => {
  removeCookie(AUTH_COOKIE)
  removeCookie(UUID_COOKIE)
}

/** Текст ошибки для форм */
export const toAuthError = (err: unknown): string => {
  if (err instanceof ApiError) {
    return err.reason ?? err.message
  }

  return 'Что-то пошло не так. Попробуйте ещё раз.'
}

const throwAuthError = (err: ApiError): never => {
  throw new Error(err.reason ?? err.message)
}

/** POST /auth/signin. 400 «already in system» не считаем ошибкой */
export const signIn = async (
  login: string,
  password: string
): Promise<void> => {
  try {
    await postSignIn({
      login: login.trim(),
      password: password.trim(),
    })
  } catch (err) {
    if (err instanceof ApiError) {
      const alreadyLoggedIn =
        err.status === 400 &&
        err.reason?.toLowerCase().includes('already in system')

      if (!alreadyLoggedIn) {
        throwAuthError(err)
      }
    } else {
      throw err
    }
  }
}

export type SignUpFields = {
  firstName: string
  secondName: string
  login: string
  email: string
  password: string
  phone: string
}

/** POST /auth/signup — только создание аккаунта */
export const signUp = async (fields: SignUpFields): Promise<void> => {
  try {
    await postSignUp({
      first_name: fields.firstName.trim(),
      second_name: fields.secondName.trim(),
      login: fields.login.trim(),
      email: fields.email.trim(),
      password: fields.password.trim(),
      phone: fields.phone.trim(),
    })
  } catch (err) {
    if (err instanceof ApiError) {
      throwAuthError(err)
    }

    throw err
  }
}

/** POST /auth/logout; cookie на клиенте сбрасываем, если доступны из JS */
export const logout = async (): Promise<void> => {
  try {
    await postLogout()
  } catch {
    // API недоступен — локально всё равно разлогиниваем UI
  } finally {
    clearAuthCookie()
  }
}
