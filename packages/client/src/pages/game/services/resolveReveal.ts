import { TGameState } from '../types/game'
import { cloneGrid } from './cloneGrid'
import { placeMines } from './placeMines'
import { revealAllMines } from './revealAllMines'
import { floodReveal } from './floodReveal'
import { checkWin } from './checkWin'
import { flagAllMines } from './flagAllMines'

export const resolveReveal = (
  prev: TGameState,
  row: number,
  col: number,
  rows: number,
  cols: number,
  mines: number
): TGameState => {
  if (prev.status === 'won' || prev.status === 'lost') return prev

  const grid = cloneGrid(prev.grid)
  const cell = grid[row][col]

  if (cell.revealed || cell.flagged) return prev

  let started = prev.started

  if (!started) {
    placeMines({ grid, rows, cols, mines, safeRow: row, safeCol: col })
    started = true
  }

  if (cell.mine) {
    revealAllMines(grid, rows, cols)
    grid[row][col].exploded = true

    return {
      ...prev,
      grid,
      status: 'lost',
      started,
    }
  }

  floodReveal(grid, rows, cols, row, col)

  const won = checkWin(grid, rows, cols)

  if (won) {
    flagAllMines(grid, rows, cols)
  }

  return {
    ...prev,
    grid,
    status: won ? 'won' : 'playing',
    started,
    minesLeft: won ? 0 : prev.minesLeft,
  }
}
