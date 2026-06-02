import { describe, it, expect } from 'vitest'
import { cloneGrid } from './cloneGrid' // замените на реальный путь
import type { TGrid } from '../types/game'

describe('cloneGrid', () => {
  it('должно создавать глубокую копию сетки', () => {
    const originalGrid: TGrid = [
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
          adjacent: 1,
        },
      ],
      [
        {
          mine: true,
          revealed: false,
          flagged: false,
          adjacent: 2,
        },
        {
          mine: false,
          revealed: true,
          flagged: false,
          adjacent: 3,
        },
      ],
    ]

    const clonedGrid = cloneGrid(originalGrid)

    // Проверяем, что это разные массивы
    expect(clonedGrid).not.toBe(originalGrid)
    expect(clonedGrid[0]).not.toBe(originalGrid[0])
    expect(clonedGrid[1]).not.toBe(originalGrid[1])

    // Проверяем, что объекты ячеек тоже разные
    expect(clonedGrid[0][0]).not.toBe(originalGrid[0][0])
    expect(clonedGrid[0][1]).not.toBe(originalGrid[0][1])
    expect(clonedGrid[1][0]).not.toBe(originalGrid[1][0])
    expect(clonedGrid[1][1]).not.toBe(originalGrid[1][1])

    // Проверяем, что данные совпадают
    expect(clonedGrid).toEqual(originalGrid)
  })

  it('должно корректно клонировать пустую сетку', () => {
    const originalGrid: TGrid = []
    const clonedGrid = cloneGrid(originalGrid)

    expect(clonedGrid).toEqual([])
    expect(clonedGrid).not.toBe(originalGrid) // разные ссылки
  })

  it('должно корректно клонировать сетку с одной строкой', () => {
    const originalGrid: TGrid = [
      [
        {
          revealed: false,
          adjacent: 1,
          mine: true,
          flagged: false,
        },
        {
          revealed: false,
          adjacent: 3,
          mine: true,
          flagged: false,
        },
      ],
    ]
    const clonedGrid = cloneGrid(originalGrid)

    expect(clonedGrid).not.toBe(originalGrid)
    expect(clonedGrid[0]).not.toBe(originalGrid[0])
    expect(clonedGrid[0][0]).not.toBe(originalGrid[0][0])
    expect(clonedGrid).toEqual(originalGrid)
  })

  it('должно корректно клонировать сетку с одним столбцом', () => {
    const originalGrid: TGrid = [
      [
        {
          revealed: false,
          adjacent: 1,
          mine: true,
          flagged: false,
        },
      ],
      [
        {
          revealed: false,
          adjacent: 2,
          mine: true,
          flagged: false,
        },
      ],
    ]
    const clonedGrid = cloneGrid(originalGrid)

    expect(clonedGrid).not.toBe(originalGrid)
    expect(clonedGrid[0]).not.toBe(originalGrid[0])
    expect(clonedGrid[1]).not.toBe(originalGrid[1])
    expect(clonedGrid[0][0]).not.toBe(originalGrid[0][0])
    expect(clonedGrid[1][0]).not.toBe(originalGrid[1][0])
    expect(clonedGrid).toEqual(originalGrid)
  })

  it('изменения в клонированной сетке не должны влиять на оригинальную', () => {
    const originalGrid: TGrid = [
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
          adjacent: 1,
        },
      ],
      [
        {
          mine: true,
          revealed: false,
          flagged: false,
          adjacent: 2,
        },
        {
          mine: false,
          revealed: true,
          flagged: false,
          adjacent: 3,
        },
      ],
    ]

    const clonedGrid = cloneGrid(originalGrid)

    // Изменяем клонированную сетку
    clonedGrid[0][0].adjacent = 99
    clonedGrid[1][1].revealed = false

    // Оригинальная сетка должна остаться неизменной
    expect(originalGrid[0][0].adjacent).toBe(0)
    expect(originalGrid[1][1].revealed).toBe(true)
  })
})
