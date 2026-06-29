import { TDifficulty } from '@/pages/game/types/game'

export type LeaderboardUnit = {
  data: {
    player: string
    time: number
    level: TDifficulty
  }
}
