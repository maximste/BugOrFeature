import axios from 'axios'
import { API_BASE_URL } from '@/shared/config/env'
import { request } from './apiClient'

//вынести в отдельный файл и форум апи перенаправить сюда же?
const themeApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const addGameTheme = (themeTitles: string[]) => {
  request(() => themeApi.post('/theme/add', { themes: themeTitles }))
}

export const getUserTheme = () => {
  request(() => themeApi.get(`/theme`))
}

export const updateUserTheme = (themeTitle: string) => {
  request(() => themeApi.post(`/theme/update`, { title: themeTitle }))
}
