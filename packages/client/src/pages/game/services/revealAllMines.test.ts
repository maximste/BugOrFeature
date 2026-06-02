import { describe, it, expect, beforeEach } from 'vitest'
import { revealAllMines } from './revealAllMines'

describe('revealAllMines - тест', () => {
  let grid: any[][]
  const rows = 2
  const cols = 2

  beforeEach(() => {
    grid = [
      [
        { mine: true, revealed: false },
        { mine: false, revealed: false },
      ],
      [
        { mine: false, revealed: false },
        { mine: true, revealed: false },
      ],
    ]
  })

  it('Показывает ячейки с минами', () => {
    revealAllMines(grid, rows, cols)

    expect(grid[0][0].revealed).toBe(true)
    expect(grid[1][1].revealed).toBe(true)
  })

  it('Функция не применяется на пустых ячейках', () => {
    revealAllMines(grid, rows, cols)

    expect(grid[0][1].revealed).toBe(false)
    expect(grid[1][0].revealed).toBe(false)
  })
})
