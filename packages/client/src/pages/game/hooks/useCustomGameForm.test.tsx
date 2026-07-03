import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

vi.mock('../constants/game', () => ({
  DEFAULT_DIFFICULTY: { rows: 10, cols: 10, mines: 20 },
  CUSTOM_MIN_MINE_DENSITY: 0.1,
  CUSTOM_MAX_MINE_DENSITY: 0.4,
}))

vi.mock('../services/clampFieldSize', () => ({
  clampFieldSize: (n: number) => Math.min(50, Math.max(5, n)),
}))

import { useCustomGameForm } from './useCustomGameForm'

describe('useCustomGameForm', () => {
  it('инициализируется значениями DEFAULT_DIFFICULTY', () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useCustomGameForm({ onStart }))

    expect(result.current.formRows, 'начальные строки').toBe(10)
    expect(result.current.formCols, 'начальные столбцы').toBe(10)
    expect(result.current.formMines, 'начальные мины').toBe(20)
    expect(result.current.safeRows, 'безопасные строки').toBe(10)
    expect(result.current.safeCols, 'безопасные столбцы').toBe(10)
    expect(result.current.safeMines, 'безопасные мины').toBe(20)
  })

  it('считает minMines и maxMines от размера поля и плотности', () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useCustomGameForm({ onStart }))

    // 10×10: min = ceil(100 × 0.1) = 10, max = floor(100 × 0.4) = 40
    expect(result.current.minMines, 'минимум мин').toBe(10)
    expect(result.current.maxMines, 'максимум мин').toBe(40)
  })
})
