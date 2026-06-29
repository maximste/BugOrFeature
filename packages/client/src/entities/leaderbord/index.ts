import { TDifficulty } from '@/pages/game/types/game'
import { api, request } from '@/shared/api/apiClient'

export type LeaderboardUnit = {
  data: {
    player: string
    BOFTimeTest: number
    level: TDifficulty
  }
}

//Лидерборд - отправка данных по окончании игры
const ratingFieldName = 'BOFTimeTest'
const teamName = 'BugOrFeature'

export const sendResultToLeaderbord = (data: any) => {
  const body = {
    data: {
      ...data,
    },
    ratingFieldName: ratingFieldName,
    teamName: teamName,
  }

  request(() => api.post<void>('/leaderboard', body))
}

export const getLeaderbordData = () => {
  const body = {
    ratingFieldName: ratingFieldName,
    cursor: 0,
    limit: 10,
  }
  return request(() => api.post<LeaderboardUnit[]>(`/leaderboard/all`, body))
}
