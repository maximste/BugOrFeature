import { CELL_SIZE, GAP } from '../constants/game'

export const getBoardSize = (count: number) => {
  return count * CELL_SIZE + (count - 1) * GAP
}
