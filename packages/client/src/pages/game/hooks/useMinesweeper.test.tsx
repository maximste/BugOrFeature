import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMinesweeper } from './useMinesweeper'

// Мокируем зависимости
vi.mock('../services/createGrid', () => ({
  createGrid: vi.fn((rows, cols) =>
    Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            revealed: false,
            flagged: false,
            mine: false,
          }))
      )
  ),
}))

vi.mock('../services/resolveReveal', () => ({
  resolveReveal: vi.fn((prev, row, col) => {
    const grid = JSON.parse(JSON.stringify(prev.grid))
    grid[row][col].revealed = true
    return { ...prev, grid, started: true, status: 'playing' }
  }),
}))

describe('useMinesweeper', () => {
  //
  let result: any

  beforeEach(() => {
    ;({ result } = renderHook(() => useMinesweeper('easy')))
  })

  it('инициализирует игру с корректными параметрами для сложности easy', () => {
    expect(result.current.rows).toBe(9)
    expect(result.current.cols).toBe(9)
    expect(result.current.mines).toBe(10)
    expect(result.current.status).toBe('idle')
    expect(result.current.started).toBe(false)
  })

  it('корректно обновляет состояние после reveal', async () => {
    result.current.reveal(0, 0)

    await waitFor(() => {
      expect(result.current.grid[0][0].revealed).toBe(true)
      expect(result.current.started).toBe(true)
      expect(result.current.status).toBe('playing')
    })
  })

  it('сбрасывает игру при вызове reset', async () => {
    // Сначала откроем ячейку, чтобы изменить состояние
    result.current.reveal(0, 0)

    // Затем сбрасываем
    result.current.reset()
    await waitFor(() => {
      expect(result.current.status).toBe('idle')
      expect(result.current.started).toBe(false)
      expect(result.current.time).toBe(0)
    })
  })
})
