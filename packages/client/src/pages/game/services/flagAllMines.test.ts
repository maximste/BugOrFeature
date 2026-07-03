import { describe, it, expect } from 'vitest'
import { flagAllMines } from './flagAllMines' // замените на актуальный путь

describe('flagAllMines', () => {
  it('должна пометить все ячейки с минами в сетке 3×3', () => {
    // Исходные данные: сетка 3×3 с двумя минами
    const grid = [
      [
        { mine: true, flagged: false, revealed: false, adjacent: 0 },
        { mine: false, flagged: false, revealed: false, adjacent: 0 },
        { mine: true, flagged: false, revealed: false, adjacent: 0 },
      ],
      [
        { mine: false, flagged: false, revealed: false, adjacent: 0 },
        { mine: true, flagged: false, revealed: false, adjacent: 0 },
        { mine: false, flagged: false, revealed: false, adjacent: 0 },
      ],
      [
        { mine: false, flagged: false, revealed: false, adjacent: 0 },
        { mine: false, flagged: false, revealed: false, adjacent: 0 },
        { mine: false, flagged: false, revealed: false, adjacent: 0 },
      ],
    ]

    const rows = 3
    const cols = 3

    // Вызов тестируемой функции
    flagAllMines(grid, rows, cols)

    // Проверка результатов
    expect(grid[0][0].flagged).toBe(true) // мина в [0][0] — должна быть помечена
    expect(grid[0][1].flagged).toBe(false) // нет мины в [0][1] — не должна быть помечена
    expect(grid[0][2].flagged).toBe(true) // мина в [0][2] — должна быть помечена
    expect(grid[1][0].flagged).toBe(false) // нет мины в [1][0] — не должна быть помечена
    expect(grid[1][1].flagged).toBe(true) // мина в [1][1] — должна быть помечена
    expect(grid[1][2].flagged).toBe(false) // нет мины в [1][2] — не должна быть помечена
    expect(grid[2][0].flagged).toBe(false) // нет мины в [2][0] — не должна быть помечена
    expect(grid[2][1].flagged).toBe(false) // нет мины в [2][1] — не должна быть помечена
    expect(grid[2][2].flagged).toBe(false) // нет мины в [2][2] — не должна быть помечена
  })

  it('should do nothing on an empty grid', () => {
    const grid: any[][] = []
    const rows = 0
    const cols = 0

    flagAllMines(grid, rows, cols)

    expect(grid).toEqual([])
  })

  it('должен корректно обрабатывать грид без мин', () => {
    const grid = [
      [
        { mine: false, flagged: false, revealed: false, adjacent: 0 },
        { mine: false, flagged: false, revealed: false, adjacent: 0 },
      ],
      [
        { mine: false, flagged: false, revealed: false, adjacent: 0 },
        { mine: false, flagged: false, revealed: false, adjacent: 0 },
      ],
    ]

    const rows = 2
    const cols = 2

    flagAllMines(grid, rows, cols)

    // Все ячейки должны остаться с flagged = false
    grid.forEach(row => row.forEach(cell => expect(cell.flagged).toBe(false)))
  })
})
