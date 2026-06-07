import { TGrid } from '../types/game'

export const cloneGrid = (grid: TGrid): TGrid => {
  return grid.map(row => row.map(cell => ({ ...cell })))
}
