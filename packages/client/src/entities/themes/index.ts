import { getUserTheme, addGameTheme } from '@/shared/api'

export const addThemes = (titles: string[]) => {
  addGameTheme(titles)
}

export const getTheme = () => {
  getUserTheme()
}
