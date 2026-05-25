import { createContext, useContext, useState, type ReactNode } from 'react'

import { isAuthCookieSet, TOKEN_COOKIE } from '@/shared/auth'
import { getCookie } from '@/shared/lib/cookie'

type AuthContextValue = {
  isAuthenticated: boolean
  refreshAuth: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
  children: ReactNode
  /** SSR: из req.cookies.token */
  initialIsAuthenticated?: boolean
}

export const AuthProvider = ({
  children,
  initialIsAuthenticated = false,
}: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof document === 'undefined') {
      return initialIsAuthenticated
    }

    return window.APP_INITIAL_AUTH ?? Boolean(getCookie(TOKEN_COOKIE))
  })

  const refreshAuth = () => {
    setIsAuthenticated(isAuthCookieSet())
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, refreshAuth }}>
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
