import { createContext, useContext, useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'

type ColorMode = 'light' | 'dark'

const STORAGE_KEY = 'color-mode'

type ColorModeContextValue = {
  colorMode: ColorMode
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null)

const getPreferredColorMode = (): ColorMode => {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export const ColorModeProvider = ({ children }: PropsWithChildren) => {
  const [colorMode, setColorMode] = useState<ColorMode>(getPreferredColorMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', colorMode === 'dark')
    document.documentElement.classList.toggle('light', colorMode === 'light')
    window.localStorage.setItem(STORAGE_KEY, colorMode)
  }, [colorMode])

  const toggleColorMode = () => {
    setColorMode(mode => (mode === 'light' ? 'dark' : 'light'))
  }

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  )
}

export const useColorMode = () => {
  const context = useContext(ColorModeContext)

  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider')
  }

  return context
}
