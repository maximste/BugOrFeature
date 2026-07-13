import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { useRef } from 'react'

// Мокаем зависимости, чтобы не тянуть реальные файлы
vi.mock('../constants/game', () => ({
  LIGHT_CANVAS_COLORS: { border: '#000000' },
  DARK_CANVAS_COLORS: { border: '#ffffff' },
  CELL_SIZE: 50,
  GAP: 5,
}))

vi.mock('../services/drawCell', () => ({
  drawCell: vi.fn(),
}))

vi.mock('../services/getBoardSize', () => ({
  getBoardSize: vi.fn(size => size * 55), // CELL_SIZE + GAP = 55
}))

// Импортируем тестируемый хук
import { TProps, useCanvasDraw } from './useCanvasDraw' // Укажите правильный путь
import { drawCell } from '../services/drawCell'
import { TCell } from '../types/game'

// Вспомогательный компонент для тестирования хука
const TestComponent = (props: Omit<TProps, 'canvasRef' | 'drawRef'>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef<(() => void) | null>(null)

  useCanvasDraw({
    ...props,
    canvasRef,
    drawRef,
  })

  return <canvas ref={canvasRef} />
}

describe('useCanvasDraw', () => {
  let props: Omit<TProps, 'canvasRef' | 'drawRef'>
  let matchMediaMock: ReturnType<typeof vi.spyOn>
  let drawCellMock: ReturnType<typeof vi.mocked>

  beforeEach(() => {
    // Мокаем getContext для всех canvas-элементов
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      setTransform: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
    })

    // Гарантируем, что window.matchMedia существует
    if (!window.matchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn(),
      })
    }

    props = {
      grid: [[{ mine: false, adjacent: 0, flagged: false, revealed: true }]],
      rows: 1,
      cols: 1,
      hoverRef: { current: { row: 0, col: 0 } },
      hoverAlphaRef: { current: 0.5 },
      revealMapRef: { current: new Map([['0-0', 1]]) },
      imgsRef: {
        current: {
          flag: null,
          mine: null,
          emptyCell: null,
        },
      },
    }

    matchMediaMock = vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      matches: true,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn().mockReturnValue(true),
    }))

    drawCellMock = vi.mocked(drawCell)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('должен вызывать draw при монтировании компонента', async () => {
    const drawCellMock = vi.mocked(drawCell)
    const { container } = render(<TestComponent {...props} />)
    const canvas = container.querySelector('canvas')

    expect(canvas).toBeInTheDocument()
    expect(canvas).toBeVisible()

    await waitFor(() => {
      expect(drawCellMock).toHaveBeenCalled()
    })
  })

  it('должен перерисовывать при изменении grid', async () => {
    const drawCellMock = vi.mocked(drawCell)
    const { rerender } = render(<TestComponent {...props} />)

    // Запоминаем начальное количество вызовов
    const initialCallCount = drawCellMock.mock.calls.length
    const testGrid = [
      [{ mine: false, adjacent: 0, flagged: true, revealed: true }],
    ] as TCell[][]

    const newProps = {
      ...props,
      grid: testGrid,
    }

    // Выполняем ререндер с новым grid
    rerender(<TestComponent {...newProps} />)

    // Ждём, пока количество вызовов drawCell увеличится
    await waitFor(() => {
      expect(drawCellMock.mock.calls.length).toBeGreaterThan(initialCallCount)
    })
  })

  it('должен обрабатывать resize', async () => {
    const drawCellMock = vi.mocked(drawCell)

    // Рендерим компонент
    render(<TestComponent {...props} />)

    // Ждём начальной отрисовки
    await waitFor(() => {
      expect(drawCellMock).toHaveBeenCalled()
    })

    const initialCallCount = drawCellMock.mock.calls.length

    // Получаем обработчик события из мока matchMedia
    expect(matchMediaMock).toHaveBeenCalled()

    const mediaQueryList = matchMediaMock.mock.results[0].value
    const changeHandler = mediaQueryList.addEventListener.mock.calls[0][1]

    changeHandler()

    // Ждём, пока drawCell будет вызван повторно после resize
    await waitFor(
      () => {
        expect(drawCellMock.mock.calls.length).toBeGreaterThan(initialCallCount)
      },
      {
        timeout: 3000,
        interval: 100,
      }
    )
  })

  it('не должен выполнять отрисовку, если canvas недоступен', () => {
    const drawCellMock = vi.mocked(drawCell)
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(vi.fn())

    // Создаём тестовый компонент, который использует хук с null-canvas
    const TestNullCanvasComponent = () => {
      const mockProps = {
        ...props,
        canvasRef: { current: null },
        drawRef: { current: null },
      }

      useCanvasDraw(mockProps)
      return null // Компонент не рендерит ничего в DOM
    }

    // Рендерим компонент с null-canvas
    render(<TestNullCanvasComponent />)

    // Отрисовка не должна была произойти
    expect(drawCellMock).not.toHaveBeenCalled()
    expect(consoleErrorMock).not.toHaveBeenCalled()
  })

  it('корректно устанавливает размеры canvas с учётом DPI', () => {
    // Устанавливаем DPI
    Object.defineProperty(window, 'devicePixelRatio', {
      value: 2,
      writable: true,
    })

    const getContextMock = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      setTransform: vi.fn(),
    })

    const canvasMock = {
      getContext: getContextMock,
      width: 0,
      height: 0,
    } as unknown as HTMLCanvasElement

    const testProps = {
      ...props,
      canvasRef: { current: canvasMock },
      drawRef: { current: null },
    }

    // Создаём тестовый компонент, который использует хук
    const TestDPICanvasComponent = () => {
      useCanvasDraw(testProps)
      return <canvas ref={{ current: canvasMock }} />
    }

    // Рендерим компонент — это гарантирует корректный вызов хука
    render(<TestDPICanvasComponent />)

    // При DPI=2 размеры должны быть удвоены
    expect(canvasMock.width).toBe(55 * 2) // cols * (CELL_SIZE + GAP) * dpr
    expect(canvasMock.height).toBe(55 * 2) // rows * (CELL_SIZE + GAP) * dpr

    const ctx = getContextMock()
    expect(ctx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0)
  })
})
