export type TCell = {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
  exploded?: boolean
}

export type TGrid = TCell[][]

export type TGameStatus = 'idle' | 'playing' | 'won' | 'lost'

export type TDifficulty = 'easy' | 'medium' | 'hard'

export type TDifficultyConfig = {
  rows: number
  cols: number
  mines: number
}

export type TGameState = {
  grid: TGrid
  status: TGameStatus
  started: boolean
  minesLeft: number
  time: number
}

export type TImgSet = {
  flag: HTMLImageElement | null
  mine: HTMLImageElement | null
  emptyCell: HTMLImageElement | null
}

export type TMinesweeperApi = {
  grid: TGrid
  status: TGameStatus
  started: boolean
  minesLeft: number
  time: number
  rows: number
  cols: number
  mines: number
  reveal: (row: number, col: number) => void
  flag: (row: number, col: number) => void
  chord: (row: number, col: number) => void
  reset: () => void
  tick: () => void

  cheat: () => void
}
