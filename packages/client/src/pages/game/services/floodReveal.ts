import { NEIGHBOR_OFFSETS } from '../constants/game'
import { TGrid } from '../types/game'

export const floodReveal = (
  grid: TGrid,
  rows: number,
  cols: number,
  row: number,
  col: number
): void => {
  const stack: [number, number][] = [[row, col]]

  while (stack.length) {
    const lastElement = stack.pop()

    if (!lastElement) continue

    const [currentRow, currentCol] = lastElement

    if (
      currentRow < 0 ||
      currentRow >= rows ||
      currentCol < 0 ||
      currentCol >= cols
    )
      continue

    const cell = grid[currentRow][currentCol]

    if (cell.revealed || cell.flagged || cell.mine) continue

    cell.revealed = true

    if (cell.adjacent === 0) {
      NEIGHBOR_OFFSETS.forEach(([rowOffset, colOffset]) =>
        stack.push([currentRow + rowOffset, currentCol + colOffset])
      )
    }
  }
}
