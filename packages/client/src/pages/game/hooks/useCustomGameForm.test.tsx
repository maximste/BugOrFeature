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

  /*it('применяет clampFieldSize к строкам и столбцам', async () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useCustomGameForm({ onStart }))

    await waitFor(() => {
      result.current.setFormRows(100)
      result.current.setFormCols(2)
    })

    expect(result.current.safeRows, 'строки ограничены сверху').toBe(50)
    expect(result.current.safeCols, 'столбцы ограничены снизу').toBe(5)
  })

  it('ограничивает safeMines сверху', async () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useCustomGameForm({ onStart }))

    await waitFor(() => {
      result.current.setFormMines(999)
    })

    expect(result.current.safeMines, 'мины не больше maxMines').toBe(40)
  })

  it('ограничивает safeMines снизу', async () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useCustomGameForm({ onStart }))

    await waitFor(() => {
      result.current.setFormMines(0)
    })

    expect(result.current.safeMines, 'мины не меньше minMines').toBe(10)
  })

  it('подстраивает formMines при изменении размера поля', async () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useCustomGameForm({ onStart }))

    await waitFor(() => {
      result.current.setFormRows(5)
      result.current.setFormCols(5)
    })

    // 5×5: max = floor(25 × 0.4) = 10; было 20 → useEffect сжимает до 10
    expect(result.current.formMines, 'мины пересчитаны под новый размер').toBe(10)
    expect(result.current.safeMines, 'safeMines совпадает с formMines').toBe(10)
  })

  it('вызывает onStart с безопасными значениями', async () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useCustomGameForm({ onStart }))

    await waitFor(() => {
      result.current.setFormRows(12)
      result.current.setFormCols(8)
      result.current.setFormMines(25)
    })

    await waitFor(() => {
      result.current.start()
    })

    expect(onStart, 'onStart вызван один раз').toHaveBeenCalledTimes(1)
    expect(onStart, 'onStart получает safeRows, safeCols, safeMines').toHaveBeenCalledWith(
      result.current.safeRows,
      result.current.safeCols,
      result.current.safeMines
    )
    expect(onStart, 'переданы конкретные безопасные значения').toHaveBeenCalledWith(12, 8, 25)
  })*/
})
