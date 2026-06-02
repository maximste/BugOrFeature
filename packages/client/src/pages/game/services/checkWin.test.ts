import { describe, it, expect } from 'vitest'
import { TGrid } from '../types/game'
import { checkWin } from './checkWin' // путь к вашей функции

describe('checkWin function', () => {
  it('should return true for empty grid', () => {
    const grid: TGrid = []
    expect(checkWin(grid, 0, 0)).toBe(true)
  })

  it('should return false if there are unrevealed non‑mine cells', () => {
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

  it('should return true if all non‑mine cells are revealed', () => {
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

  it('should return true when all cells are mines', () => {
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

  it('should handle single cell grid without mine', () => {
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

  it('should return false for single cell grid with unrevealed non‑mine cell', () => {
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

  it('should handle grid with mixed revealed and unrevealed mine cells', () => {
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

  it('should work correctly with larger grid', () => {
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

  it('should return false with larger grid containing unrevealed cells', () => {
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
