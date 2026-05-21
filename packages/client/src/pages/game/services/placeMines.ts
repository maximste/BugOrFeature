import { NEIGHBOR_OFFSETS } from '../constants/game'
import { TGrid } from '../types/game'

type TProps = {
  grid: TGrid
  rows: number
  cols: number
  mines: number
  safeRow: number
  safeCol: number
}

export const placeMines = (props: TProps): void => {
  const { grid, rows, cols, mines, safeRow, safeCol } = props

  const cells: [number, number][] = []

  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols; col++)
      if (Math.abs(row - safeRow) > 1 || Math.abs(col - safeCol) > 1) {
        cells.push([row, col])
      }

  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cells[i], cells[j]] = [cells[j], cells[i]]
  }

  cells.slice(0, mines).forEach(([row, col]) => {
    grid[row][col].mine = true
  })

  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols; col++) {
      if (grid[row][col].mine) continue

      grid[row][col].adjacent = NEIGHBOR_OFFSETS.reduce(
        (sum, [rowOffset, colOffset]) => {
          const neighborRow = row + rowOffset
          const neighborCol = col + colOffset

          return (
            sum +
            (neighborRow >= 0 &&
            neighborRow < rows &&
            neighborCol >= 0 &&
            neighborCol < cols &&
            grid[neighborRow][neighborCol].mine
              ? 1
              : 0)
          )
        },
        0
      )
    }
}
