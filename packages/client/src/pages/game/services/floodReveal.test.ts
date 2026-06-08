import { describe, it, expect } from 'vitest'
import { floodReveal } from './floodReveal' // путь к вашей функции
import { NEIGHBOR_OFFSETS } from '../constants/game'

describe('floodReveal', () => {
  it('Должна раскрыть ячейку без соседних мин и прилегающие к ней ячейки', () => {
    // Arrange
    const rows = 3
    const cols = 3

    const grid = [
      [
        { revealed: false, flagged: false, mine: false, adjacent: 0 },
        { revealed: false, flagged: false, mine: false, adjacent: 1 },
        { revealed: false, flagged: false, mine: true, adjacent: 0 },
      ],
      [
        { revealed: false, flagged: false, mine: false, adjacent: 1 },
        { revealed: false, flagged: false, mine: false, adjacent: 2 },
        { revealed: false, flagged: false, mine: false, adjacent: 1 },
      ],
      [
        { revealed: false, flagged: false, mine: false, adjacent: 0 },
        { revealed: false, flagged: false, mine: false, adjacent: 1 },
        { revealed: false, flagged: false, mine: false, adjacent: 1 },
      ],
    ]

    floodReveal(grid, rows, cols, 0, 0)
    expect(grid[0][0].revealed).toBe(true)

    // Прямые соседи ячейки старта открыты (даже если adjacent ≠ 0)
    expect(grid[0][1].revealed).toBe(true) // сосед справа
    expect(grid[1][0].revealed).toBe(true) // сосед снизу
    expect(grid[1][1].revealed).toBe(true) // диагональ, сосед

    // Ячейки, которые НЕ должны открыться (не являются прямыми соседями старта)
    expect(grid[2][0].revealed).toBe(false) // не сосед старта, adjacent=1
    expect(grid[2][1].revealed).toBe(false) // не сосед старта
    expect(grid[0][2].revealed).toBe(false) // мина, не должна открыться
  })

  it('не должен изменять уже открытые ячейки', () => {
    // Arrange
    const rows = 2
    const cols = 2

    const grid = [
      [
        { revealed: true, flagged: false, mine: false, adjacent: 0 }, // уже открыта
        { revealed: false, flagged: false, mine: false, adjacent: 0 },
      ],
      [
        { revealed: false, flagged: false, mine: false, adjacent: 0 },
        { revealed: false, flagged: false, mine: false, adjacent: 0 },
      ],
    ]

    floodReveal(grid, rows, cols, 0, 1)

    expect(grid[0][0].revealed).toBe(true)
  })

  it('не должен открывать помеченные или заминированные ячейки', () => {
    // Arrange
    const rows = 2
    const cols = 2

    const grid = [
      [
        { revealed: false, flagged: true, mine: false, adjacent: 0 }, // помечена флагом
        { revealed: false, flagged: false, mine: false, adjacent: 0 },
      ],
      [
        { revealed: false, flagged: false, mine: true, adjacent: 0 }, // мина
        { revealed: false, flagged: false, mine: false, adjacent: 0 },
      ],
    ]

    // Act
    floodReveal(grid, rows, cols, 0, 1)

    // Assert
    expect(grid[0][1].revealed).toBe(true) // стартовая откроется
    expect(grid[1][1].revealed).toBe(true) // сосед справа откроется

    expect(grid[0][0].revealed).toBe(false) // флаг не откроется
    expect(grid[1][0].revealed).toBe(false) // мина не откроется
  })

  it('не должэен падать, если вызвать с координатами за пределами сетки', () => {
    // Arrange
    const rows = 1
    const cols = 1

    const grid = [
      [{ revealed: false, flagged: false, mine: false, adjacent: 0 }],
    ]

    // Act & Assert
    // вызов с координатами за пределами сетки не должен вызывать ошибок
    expect(() => floodReveal(grid, rows, cols, -1, -1)).not.toThrow()
    expect(() => floodReveal(grid, rows, cols, 10, 10)).not.toThrow()

    // ячейка внутри сетки не должна измениться, если старт был за пределами
    expect(grid[0][0].revealed).toBe(false)
  })
})
