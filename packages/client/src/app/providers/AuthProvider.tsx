import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { fetchAuthUser, useDispatch } from '@/app/store'
import { isAuthCookieSet } from '@/shared/auth'

type AuthContextValue = {
  isAuthenticated: boolean
  isAuthChecked: boolean
  refreshAuth: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch()
  // SSR: на сервере document нет — всегда false. На клиенте тоже стартуем с false,
  // чтобы первый рендер совпал с сервером; cookie читаем после mount (9 спринт — с сервера).
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthChecked, setIsAuthChecked] = useState(false)

  const refreshAuth = () => {
    setIsAuthenticated(isAuthCookieSet())
    setIsAuthChecked(true)
  }

  useEffect(() => {
    const authenticated = isAuthCookieSet()
    setIsAuthenticated(authenticated)
    setIsAuthChecked(true)

    if (authenticated) {
      dispatch(fetchAuthUser())
    }
  }, [dispatch])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAuthChecked, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)

  if (context == null) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
