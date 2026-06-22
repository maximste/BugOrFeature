import { describe, it, expect, vi } from 'vitest'
import { getBoardSize } from './getBoardSize'

// Переопределяем значения констант в модуле
vi.mock('../constants/game', () => ({
  CELL_SIZE: 36,
  GAP: 4,
}))

describe('getBoardSize', () => {
  /*it('должен вернуть 0 для count = 0', () => {
    expect(getBoardSize(0)).toBe(0);
  }); - обсудить */

  it('должен правильно рассчитать размер для count = 1', () => {
    expect(getBoardSize(1)).toBe(36)
  })

  it('должен правильно рассчитать размер для count = 2', () => {
    expect(getBoardSize(2)).toBe(76)
  })

  it('должен правильно рассчитать размер для count = 3', () => {
    expect(getBoardSize(3)).toBe(116)
  })

  it('должен корректно работать с большими числами', () => {
    expect(getBoardSize(10)).toBe(396)
  })
})
