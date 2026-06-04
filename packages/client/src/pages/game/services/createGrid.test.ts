import { describe, it, expect } from 'vitest'
import { createGrid } from './createGrid' // укажите корректный путь к вашему файлу
import type { TGrid, TCell } from '../types/game'

describe('createGrid', () => {
  it('должен создавать грид с правильными размерами', () => {
    const rows = 3
    const cols = 4
    const grid: TGrid = createGrid(rows, cols)

    expect(grid).toHaveLength(rows)
    grid.forEach(row => {
      expect(row).toHaveLength(cols)
    })
  })

  it('должен создавать грид со значениями ячеек по умолчанию', () => {
    const grid: TGrid = createGrid(2, 2)

    grid.forEach(row => {
      row.forEach(cell => {
        expect(cell).toEqual({
          mine: false,
          revealed: false,
          flagged: false,
          adjacent: 0,
        })
      })
    })
  })

  it('должен корректно обрабатывать 0 строк', () => {
    const grid: TGrid = createGrid(0, 5)

    expect(grid).toHaveLength(0)
  })

  it('должен корректно обрабатывать 0 столбцов', () => {
    const grid: TGrid = createGrid(5, 0)

    expect(grid).toHaveLength(5)
    grid.forEach(row => {
      expect(row).toHaveLength(0)
    })
  })

  it('должен корректно работать на больших числах', () => {
    const largeRows = 100
    const largeCols = 100
    const grid: TGrid = createGrid(largeRows, largeCols)

    expect(grid).toHaveLength(largeRows)
    grid.forEach(row => {
      expect(row).toHaveLength(largeCols)
    })
  })
})
