import { TGameState } from '../types/game'
import { NEIGHBOR_OFFSETS } from '../constants/game'
import { cloneGrid } from './cloneGrid'
import { floodReveal } from './floodReveal'
import { revealAllMines } from './revealAllMines'
import { checkWin } from './checkWin'
import { flagAllMines } from './flagAllMines'

export const resolveChord = (
  prev: TGameState,
  row: number,
  col: number,
  rows: number,
  cols: number
): TGameState => {
  if (prev.status === 'won' || prev.status === 'lost') {
    return prev
  }

  const cell = prev.grid[row][col]

  if (!cell.revealed || cell.adjacent === 0) {
    return prev
  }

  const flagCount = NEIGHBOR_OFFSETS.reduce((sum, [rowOffset, colOffset]) => {
    const neighborRow = row + rowOffset,
      neighborCol = col + colOffset
    return (
      sum +
      (neighborRow >= 0 &&
      neighborRow < rows &&
      neighborCol >= 0 &&
      neighborCol < cols &&
      prev.grid[neighborRow][neighborCol].flagged
        ? 1
        : 0)
    )
  }, 0)

  if (flagCount !== cell.adjacent) {
    return prev
  }

  const grid = cloneGrid(prev.grid)
  let exploded = false

  NEIGHBOR_OFFSETS.forEach(([rowOffset, colOffset]) => {
    const neighborRow = row + rowOffset,
      neighborCol = col + colOffset
    if (
      neighborRow < 0 ||
      neighborRow >= rows ||
      neighborCol < 0 ||
      neighborCol >= cols
    )
      return

    const neighbor = grid[neighborRow][neighborCol]

    if (neighbor.revealed || neighbor.flagged) return

    if (neighbor.mine) {
      neighbor.revealed = true
      neighbor.exploded = true
      exploded = true
    } else {
      floodReveal(grid, rows, cols, neighborRow, neighborCol)
    }
  })

  if (exploded) {
    revealAllMines(grid, rows, cols)

    return {
      ...prev,
      grid,
      status: 'lost',
    }
  }

  const won = checkWin(grid, rows, cols)

  if (won) {
    flagAllMines(grid, rows, cols)
  }

  return {
    ...prev,
    grid,
    status: won ? 'won' : prev.status,
    minesLeft: won ? 0 : prev.minesLeft,
  }
}
