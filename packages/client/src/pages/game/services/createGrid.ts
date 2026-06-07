import { TGrid, TCell } from '../types/game'

export const createGrid = (rows: number, cols: number): TGrid => {
  return Array.from({ length: rows }, () =>
    Array.from(
      { length: cols },
      (): TCell => ({
        mine: false,
        revealed: false,
        flagged: false,
        adjacent: 0,
      })
    )
  )
}
