import { COLORS } from '../../../theme'
import { TDifficulty, TDifficultyConfig } from '../types/game'

export const CELL_SIZE = 36

export const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

export const DIFFICULTY: Record<TDifficulty, TDifficultyConfig> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 20 },
  hard: { rows: 16, cols: 16, mines: 40 },
} as const

export const DIFFICULTY_LABEL: Record<TDifficulty, string> = {
  easy: 'Котёнок',
  medium: 'Кот',
  hard: 'Дикий кот',
}

export const GAP = 4 as const
export const RADIUS = 16 as const

export const CANVAS_COLORS = {
  hidden: COLORS.cyan,
  hover: COLORS.purple,
  revealed: COLORS.yellow,
  border: COLORS.white,
  exploded: COLORS.pink,
  num: COLORS.num,
} as const
