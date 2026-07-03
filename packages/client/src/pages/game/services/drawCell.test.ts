import { describe, it, expect, vi } from 'vitest'
import { drawCell } from './drawCell' // путь к вашему модулю

// Мокируем зависимости
vi.mock('../constants/game', () => ({
  CELL_SIZE: 32,
  CANVAS_COLORS: {
    hidden: '#808080',
    revealed: '#d0d0d0',
    exploded: '#ff0000',
    hover: '#c0c0c0',
    num: ['#000', '#00f', '#080', '#f00', '#008', '#800', '#088', '#000'],
  },
  RADIUS: 6,
}))

vi.mock('../types/game', () => ({}))

describe('drawCell', () => {
  it('Должен корректно вызывать методы контекста canvas для открытой ячейки с миной', () => {
    const mockCtx: Partial<CanvasRenderingContext2D> = {
      save: vi.fn(),
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      clip: vi.fn(),
      fillStyle: '',
      fillRect: vi.fn(),
      globalAlpha: 1,
      drawImage: vi.fn(),
      restore: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
      ellipse: vi.fn(),
      stroke: vi.fn(),
    }

    const validMineImage: HTMLImageElement = {
      complete: true,
      naturalWidth: 32,
      width: 32,
      height: 32,
    } as HTMLImageElement

    // Данные для теста
    const testProps = {
      ctx: mockCtx as CanvasRenderingContext2D,
      x: 0,
      y: 0,
      cell: {
        revealed: true,
        exploded: false,
        mine: true,
        adjacent: 0,
        flagged: false,
      },
      hoverAlpha: 0.3,
      revealAlpha: 0.8,
      imgs: {
        mine: validMineImage,
        flag: {} as HTMLImageElement,
        emptyCell: {} as HTMLImageElement,
      },
    }

    // Выполняем тестируемую функцию
    drawCell(testProps)

    // Проверяем, что методы контекста были вызваны нужное количество раз
    expect(mockCtx.save).toHaveBeenCalledTimes(1)
    expect(mockCtx.beginPath).toHaveBeenCalledTimes(1)
    expect(mockCtx.roundRect).toHaveBeenCalledTimes(1)
    expect(mockCtx.clip).toHaveBeenCalledTimes(1)
    expect(mockCtx.fillRect).toHaveBeenCalledTimes(2) // основа и цвет раскрытия
    expect(mockCtx.drawImage).toHaveBeenCalledTimes(1) // изображение мины
    expect(mockCtx.restore).toHaveBeenCalledTimes(1)
  })

  it('Должен обрабатывать скрытую ячейку с эффектом наведения и флагом', () => {
    const mockCtx: Partial<CanvasRenderingContext2D> = {
      save: vi.fn(),
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      clip: vi.fn(),
      fillStyle: '',
      fillRect: vi.fn(),
      globalAlpha: 1,
      drawImage: vi.fn(),
      restore: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
      ellipse: vi.fn(),
      stroke: vi.fn(),
    }

    const validFlagImage: HTMLImageElement = {
      complete: true,
      naturalWidth: 32,
      width: 32,
      height: 32,
    } as HTMLImageElement

    const testProps = {
      ctx: mockCtx as CanvasRenderingContext2D,
      x: 32,
      y: 32,
      cell: {
        revealed: false,
        exploded: false,
        mine: false,
        adjacent: 0,
        flagged: true,
      },
      hoverAlpha: 0.4,
      revealAlpha: 0,
      imgs: {
        mine: {} as HTMLImageElement,
        flag: validFlagImage,
        emptyCell: {} as HTMLImageElement,
      },
    }

    drawCell(testProps)

    expect(mockCtx.save).toHaveBeenCalledTimes(1)
    expect(mockCtx.fillRect).toHaveBeenCalledTimes(2) // скрытый фон + hover
    expect(mockCtx.ellipse).toHaveBeenCalledTimes(1) // тень
    expect(mockCtx.stroke).toHaveBeenCalledTimes(1) // отрисовка тени
    expect(mockCtx.drawImage).toHaveBeenCalledTimes(1) // флаг
    expect(mockCtx.restore).toHaveBeenCalledTimes(1)
  })

  it('Должен отображать открытую пустую ячейку с указанием количества соседних мин', () => {
    const mockCtx: Partial<CanvasRenderingContext2D> = {
      save: vi.fn(),
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      clip: vi.fn(),
      fillStyle: '',
      fillRect: vi.fn(),
      globalAlpha: 1,
      font: '',
      textAlign: undefined,
      textBaseline: undefined,
      fillText: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn(),
    }

    const testProps = {
      ctx: mockCtx as CanvasRenderingContext2D,
      x: 64,
      y: 64,
      cell: {
        revealed: true,
        exploded: false,
        mine: false,
        adjacent: 3,
        flagged: false,
      },
      hoverAlpha: 0,
      revealAlpha: 1,
      imgs: null,
    }

    drawCell(testProps)

    expect(mockCtx.fillRect).toHaveBeenCalledTimes(2)
    expect(mockCtx.fillText).toHaveBeenCalledWith('3', 80, 81) // x + s/2, y + s/2 + 1
    expect(mockCtx.font).toContain('16.64px') // 32 * 0.52
  })
})
