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
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getCookie(TOKEN_COOKIE))
  )

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
