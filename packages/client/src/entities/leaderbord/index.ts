import { TDifficulty } from '@/pages/game/types/game'

export type LeaderboardUnit = {
  data: {
    player: string
    BOFTimeTest: number
    level: TDifficulty
  }
}
