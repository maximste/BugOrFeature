import { describe, it, expect } from 'vitest'
import { clampFieldSize } from './clampFieldSize' // замените на реальный путь
import { CUSTOM_FIELD_MAX_SIZE, CUSTOM_FIELD_MIN_SIZE } from '../constants/game'

describe('clampFieldSize', () => {
  it('должно возвращать значение без изменений, если оно находится в допустимом диапазоне', () => {
    const value = (CUSTOM_FIELD_MIN_SIZE + CUSTOM_FIELD_MAX_SIZE) / 2
    const result = clampFieldSize(value)
    expect(result).toBe(value)
  })

  it('должно ограничивать значение сверху, если оно превышает максимальный размер', () => {
    const value = CUSTOM_FIELD_MAX_SIZE + 100
    const result = clampFieldSize(value)
    expect(result).toBe(CUSTOM_FIELD_MAX_SIZE)
  })

  it('должно ограничивать значение снизу, если оно меньше минимального размера', () => {
    const value = CUSTOM_FIELD_MIN_SIZE - 50
    const result = clampFieldSize(value)
    expect(result).toBe(CUSTOM_FIELD_MIN_SIZE)
  })

  it('должно возвращать максимальный размер, если входное значение равно максимальному', () => {
    const result = clampFieldSize(CUSTOM_FIELD_MAX_SIZE)
    expect(result).toBe(CUSTOM_FIELD_MAX_SIZE)
  })

  it('должно возвращать минимальный размер, если входное значение равно минимальному', () => {
    const result = clampFieldSize(CUSTOM_FIELD_MIN_SIZE)
    expect(result).toBe(CUSTOM_FIELD_MIN_SIZE)
  })

  it('должно корректно обрабатывать отрицательные значения', () => {
    const value = -1000
    const result = clampFieldSize(value)
    expect(result).toBe(CUSTOM_FIELD_MIN_SIZE)
  })

  it('должно корректно обрабатывать очень большие числа', () => {
    const value = Number.MAX_VALUE
    const result = clampFieldSize(value)
    expect(result).toBe(CUSTOM_FIELD_MAX_SIZE)
  })
})
