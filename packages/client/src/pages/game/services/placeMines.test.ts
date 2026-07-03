import { describe, it, expect } from 'vitest'
import { placeMines } from './placeMines' // укажите корректный путь к файлу
import { NEIGHBOR_OFFSETS } from '../constants/game'

// Вспомогательная функция для создания пустой сетки
const createEmptyGrid = (rows: number, cols: number) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      adjacent: 0,
      flagged: false,
      revealed: false,
    }))
  )
}

describe('Функция placeMines', () => {
  it('не размещает мины в безопасной зоне 3x3 вокруг указанной ячейки', () => {
    const rows = 5
    const cols = 5
    const mines = 5
    const safeRow = 2
    const safeCol = 2

    const grid = createEmptyGrid(rows, cols)
    placeMines({ grid, rows, cols, mines, safeRow, safeCol })

    // Проверяем, что в безопасной зоне (3x3) нет мин
    for (let row = safeRow - 1; row <= safeRow + 1; row++) {
      for (let col = safeCol - 1; col <= safeCol + 1; col++) {
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
          expect(grid[row][col].mine).toBe(false)
        }
      }
    }
  })

  it('размещает ровно указанное количество мин', () => {
    const rows = 4
    const cols = 4
    const mines = 3
    const safeRow = 0
    const safeCol = 0

    const grid = createEmptyGrid(rows, cols)
    placeMines({ grid, rows, cols, mines, safeRow, safeCol })

    let mineCount = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col].mine) mineCount++
      }
    }

    expect(mineCount).toBe(mines)
  })

  it('корректно подсчитывает количество соседних мин для каждой ячейки', () => {
    // Создаём сетку и вручную размещаем мины для предсказуемого результата
    const rows = 3
    const cols = 3
    const grid = createEmptyGrid(rows, cols)

    // Размещаем мины в углах
    grid[0][0].mine = true
    grid[2][2].mine = true

    placeMines({ grid, rows, cols, mines: 2, safeRow: 1, safeCol: 1 })

    // Ожидаемые значения adjacent для центральной ячейки (1,1)
    // Она граничит с обеими минами
    expect(grid[1][1].adjacent).toBe(2)

    // Ячейка (0,1) граничит только с одной миной (0,0)
    expect(grid[0][1].adjacent).toBe(1)

    // Ячейка (1,0) граничит только с одной миной (0,0)
    expect(grid[1][0].adjacent).toBe(1)
  })

  it('работает корректно на сетке минимального размера', () => {
    const rows = 1
    const cols = 1
    const mines = 0 // На сетке 1x1 с safeCell мины не могут быть размещены
    const safeRow = 0
    const safeCol = 0

    const grid = createEmptyGrid(rows, cols)
    placeMines({ grid, rows, cols, mines, safeRow, safeCol })

    expect(grid[0][0].mine).toBe(false)
    expect(grid[0][0].adjacent).toBe(0)
  })
})
