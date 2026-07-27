import axios from 'axios'
import { API_BASE_URL } from '@/shared/config/env'
import { request } from './apiClient'
import { ColorMode } from '@/app/providers/ColorModeProvider'

export interface UserThemeResponse {
  themeCode: string
}

//вынести в отдельный файл и форум апи перенаправить сюда же?
const themeApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const addGameThemes = async (themeTitles: string[]) => {
  try {
    return await request(() =>
      themeApi.post('/theme/add', { themes: themeTitles })
    )
  } catch (_e) {
    return null
  }
}

export const getUserTheme = async (): Promise<UserThemeResponse | null> => {
  try {
    const rawData = await request(() => themeApi.get(`/theme`))

    if (!rawData || typeof rawData !== 'object' || !('themeCode' in rawData)) {
      return null
    }

    return rawData as unknown as UserThemeResponse
  } catch (error) {
    return null
  }
}

export const updateUserTheme = async (themeTitle: ColorMode) => {
  try {
    return await request(() =>
      themeApi.post(`/theme/update`, { themeCode: themeTitle })
    )
  } catch (e) {
    return null
  }
}
