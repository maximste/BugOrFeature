import { describe, it, expect } from 'vitest'
import { resolveChord } from './resolveChord' // путь к вашему файлу
import { TGameState } from '../types/game'

describe('Функция resolveChord', () => {
  const mockGameState = {
    status: 'playing' as const,
    grid: [
      [
        { revealed: true, adjacent: 1, flagged: false, mine: false },
        { revealed: false, adjacent: 0, flagged: true, mine: true },
      ],
      [
        { revealed: false, adjacent: 1, flagged: false, mine: false },
        { revealed: false, adjacent: 1, flagged: false, mine: false },
      ],
    ],
    minesLeft: 1,
    started: true,
    time: 0,
  }

  it('не изменяет состояние игры, если игра уже завершена (выиграна)', () => {
    const prevState = { ...mockGameState, status: 'won' as const }
    const result = resolveChord(prevState, 0, 0, 2, 2)

    expect(result).toBe(prevState)
    expect(result.status).toBe('won')
  })

  it('не изменяет состояние игры, если ячейка не открыта или у неё нет соседних мин', () => {
    const prevState = { ...mockGameState }
    // Ячейка с координатами (1, 1) не открыта
    const result = resolveChord(prevState, 1, 1, 2, 2)

    expect(result).toBe(prevState)
  })

  it('не выполняет действия, если количество флагов не совпадает с числом соседних мин', () => {
    // Создаём состояние: у ячейки (0,0) adjacent = 2, но стоит только 1 флаг
    const gridWithInsufficientFlags = [
      [
        { revealed: true, adjacent: 2, flagged: false, mine: false }, // целевая ячейка
        { revealed: false, adjacent: 0, flagged: true, mine: true }, // мина с флагом (1 из 2)
        { revealed: false, adjacent: 1, flagged: false, mine: true }, // мина без флага
      ],
      [
        { revealed: false, adjacent: 2, flagged: false, mine: false },
        { revealed: false, adjacent: 2, flagged: false, mine: false },
        { revealed: false, adjacent: 1, flagged: false, mine: false },
      ],
    ]

    const prevState: TGameState = {
      status: 'playing',
      grid: gridWithInsufficientFlags,
      minesLeft: 2,
      started: true,
      time: 0,
    }

    const result = resolveChord(prevState, 0, 0, 2, 3)

    expect(result).toBe(prevState) // проверяем, что объект не изменился
    expect(result.status).toBe('playing') // статус остался 'playing'
    expect(result.minesLeft).toBe(2) // количество мин не изменилось

    // Проверяем, что ни одна ячейка не была раскрыта или изменена
    expect(result.grid[0][1].revealed).toBe(false)
    expect(result.grid[1][0].revealed).toBe(false)
    expect(result.grid[1][1].revealed).toBe(false)
  })

  it('завершает игру с проигрышем, если при обработке аккорда была взорвана мина', () => {
    // Модифицируем состояние: ставим флаг на соседнюю ячейку с миной
    const gridWithFlag = [
      [
        { revealed: true, adjacent: 1, flagged: false, mine: false },
        { revealed: false, adjacent: 0, flagged: true, mine: true }, // флаг на мине
      ],
      [
        { revealed: false, adjacent: 1, flagged: false, mine: true },
        { revealed: false, adjacent: 1, flagged: false, mine: false },
      ],
    ]
    const prevState = { ...mockGameState, grid: gridWithFlag }

    const result = resolveChord(prevState, 0, 0, 2, 2)

    expect(result.status).toBe('lost')
    expect(result.grid[1][0].revealed).toBe(true) // соседняя ячейка открыта
    expect(result.grid[1][0].exploded).toBe(true) // мина взорвана
    expect(result.grid[0][1].flagged).toBe(true) // флаг остался на своей мине
  })

  it('завершает игру с выигрышем, если после обработки аккорда все условия победы выполнены', () => {
    // Создаём состояние, где после обработки аккорда игрок выигрывает
    const winningGrid = [
      [
        { revealed: true, adjacent: 1, flagged: false, mine: false },
        { revealed: false, adjacent: 0, flagged: true, mine: true },
      ],
      [
        { revealed: true, adjacent: 1, flagged: false, mine: false },
        { revealed: true, adjacent: 1, flagged: false, mine: false },
      ],
    ]
    const prevState = { ...mockGameState, grid: winningGrid }

    const result = resolveChord(prevState, 0, 0, 2, 2)

    expect(result.status).toBe('won')
    expect(result.minesLeft).toBe(0)
  })
})
