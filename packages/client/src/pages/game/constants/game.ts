import { COLORS, DARK_COLORS } from '../../../theme'
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

export const DIFFICULTY: Record<
  Exclude<TDifficulty, 'custom'>,
  TDifficultyConfig
> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 20 },
  hard: { rows: 16, cols: 16, mines: 40 },
} as const

export const DIFFICULTY_LABEL: Record<
  Exclude<TDifficulty, 'custom'>,
  string
> = {
  easy: 'Котёнок',
  medium: 'Кот',
  hard: 'Дикий кот',
}

export const DEFAULT_DIFFICULTY: TDifficultyConfig = DIFFICULTY.easy

export const GAP = 4 as const
export const RADIUS = 16 as const

export const CUSTOM_FIELD_MIN_SIZE = 5
export const CUSTOM_FIELD_MAX_SIZE = 24
// мин ~12% — как у режима Easy, иначе flood-fill с первого клика раскроет всё поле
// макс ~35% — выше Hard, но ещё решаемо
export const CUSTOM_MIN_MINE_DENSITY = 0.12
export const CUSTOM_MAX_MINE_DENSITY = 0.35

export type TCanvasColors = {
  hidden: string
  hover: string
  revealed: string
  border: string
  exploded: string
  num: readonly string[]
}

export const LIGHT_CANVAS_COLORS: TCanvasColors = {
  hidden: COLORS.cyan,
  hover: COLORS.purple,
  revealed: COLORS.yellow,
  border: COLORS.white,
  exploded: COLORS.pink,
  num: COLORS.num,
}

export const DARK_CANVAS_COLORS: TCanvasColors = {
  hidden: DARK_COLORS.cyan,
  hover: DARK_COLORS.purple,
  revealed: DARK_COLORS.yellow,
  border: DARK_COLORS.white,
  exploded: DARK_COLORS.pink,
  num: COLORS.num,
}

export const MUSIC_FADE_SECONDS = 1 as const
