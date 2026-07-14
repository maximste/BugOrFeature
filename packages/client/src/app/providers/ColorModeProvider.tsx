import {
  getUserTheme,
  addGameThemes,
  updateUserTheme,
} from '@/shared/api/themeApiClient'
import { createContext, useContext, useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'

export type ColorMode = 'light' | 'dark'

const STORAGE_KEY = 'color-mode'

type ColorModeContextValue = {
  colorMode: ColorMode
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null)

const getPreferredColorMode = (): ColorMode => {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  //получение
  if (stored === 'light' || stored === 'dark') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export const ColorModeProvider = ({ children }: PropsWithChildren) => {
  const [colorMode, setColorMode] = useState<ColorMode>(getPreferredColorMode)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const load = async () => {
      await addGameThemes(['light', 'dark']) //если этих записей в базе нет, сохраняем

      const themeLink = await getUserTheme()

      if (themeLink?.themeCode) {
        const code = themeLink.themeCode

        if (code === 'light' || code === 'dark') {
          setColorMode(code)
        } else {
          setColorMode('light')
        }
      } else {
        const mode = localStorage.getItem(STORAGE_KEY)
        if (mode && (mode === 'light' || mode === 'dark')) {
          setColorMode(mode)
        } else {
          setColorMode('light')
        }
      }
    }

    load()
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', colorMode === 'dark')
    document.documentElement.classList.toggle('light', colorMode === 'light')
    window.localStorage.setItem(STORAGE_KEY, colorMode)

    updateUserTheme(colorMode)
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
