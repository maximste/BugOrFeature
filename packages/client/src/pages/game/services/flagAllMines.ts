import { TGrid } from '../types/game'

export const flagAllMines = (grid: TGrid, rows: number, cols: number): void => {
  for (let row = 0; row < rows; row++)
    for (let col = 0; col < cols; col++)
      if (grid[row][col].mine) {
        grid[row][col].flagged = true
      }
}
