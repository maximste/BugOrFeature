import { describe, it, expect } from 'vitest'
import { TGrid } from '../types/game'
import { checkWin } from './checkWin' // путь к вашей функции

describe('checkWin function', () => {
  it('should return true for empty grid', () => {
    const grid: TGrid = []
    expect(checkWin(grid, 0, 0)).toBe(true)
  })

  it('должен возвращать false, если ячейка не раскрыта и на ней нет мин', () => {
    const grid: TGrid = [
      [
        {
          mine: false,
          revealed: false,
          flagged: false,
          adjacent: 0,
        },
      ],
      [
        {
          mine: false,
          revealed: true,
          flagged: false,
          adjacent: 0,
        },
      ],
    ]
    expect(checkWin(grid, 2, 1)).toBe(false)
  })

  it('Должен возвращать true, если все ячейки без мин открыты', () => {
    const grid: TGrid = [
      [
        {
          mine: false,
          revealed: true,
          flagged: false,
          adjacent: 0,
        },
        {
          mine: true,
          revealed: false,
          flagged: false,
          adjacent: 0,
        },
      ],
      [
        {
          mine: false,
          revealed: true,
          flagged: false,
          adjacent: 0,
        },
        {
          mine: false,
          revealed: true,
          flagged: false,
          adjacent: 0,
        },
      ],
    ]
    expect(checkWin(grid, 2, 2)).toBe(true)
  })

  it('Должен возвращать true, если во всех ячейкахм мина', () => {
    const grid: TGrid = [
      [
        {
          mine: true,
          revealed: false,
          flagged: false,
          adjacent: 0,
        },
        {
          mine: true,
          revealed: false,
          flagged: false,
          adjacent: 0,
        },
      ],
      [
        {
          mine: true,
          revealed: false,
          flagged: false,
          adjacent: 0,
        },
        {
          mine: true,
          revealed: false,
          flagged: false,
          adjacent: 0,
        },
      ],
    ]
    expect(checkWin(grid, 2, 2)).toBe(true)
  })

  it('должен корректно обрабатывать сценарий с одной ячейкой без мины', () => {
    const grid: TGrid = [
      [
        {
          mine: false,
          revealed: true,
          flagged: false,
          adjacent: 0,
        },
      ],
    ]
    expect(checkWin(grid, 1, 1)).toBe(true)
  })

  it('Должен возвращать false для сетки из одной ячейки с неоткрытой безопасной ячейкой', () => {
    const grid: TGrid = [
      [
        {
          mine: false,
          revealed: false,
          flagged: false,
          adjacent: 0,
        },
      ],
    ]
    expect(checkWin(grid, 1, 1)).toBe(false)
  })

  it('Должен обрабатывать сетку, содержащую как открытые, так и закрытые ячейки с минами', () => {
    const grid: TGrid = [
      [
        {
          mine: true,
          revealed: true,
          flagged: false,
          adjacent: 0,
        },
        {
          mine: false,
          revealed: true,
          flagged: false,
          adjacent: 0,
        },
      ],
      [
        {
          mine: true,
          revealed: false,
          flagged: false,
          adjacent: 0,
        },
        {
          mine: false,
          revealed: true,
          flagged: false,
          adjacent: 0,
        },
      ],
    ]
    expect(checkWin(grid, 2, 2)).toBe(true)
  })

  it('должен ввозвращать true, если все ячейки раскрыты и мин нет', () => {
    const grid: TGrid = Array(5)
      .fill(null)
      .map(() =>
        Array(5)
          .fill(null)
          .map(() => ({
            mine: false,
            revealed: true,
            flagged: false,
            adjacent: 0,
          }))
      )
    expect(checkWin(grid, 5, 5)).toBe(true)
  })

  it('должен возвращать false, если грид содержит нераскрытые ячейки', () => {
    const grid: TGrid = Array(3)
      .fill(null)
      .map((_, row) =>
        Array(3)
          .fill(null)
          .map((_, col) => ({
            mine: row === 1 && col === 1,
            revealed: !(row === 0 && col === 0),
            flagged: false,
            adjacent: 0,
          }))
      )
    expect(checkWin(grid, 3, 3)).toBe(false)
  })
})
