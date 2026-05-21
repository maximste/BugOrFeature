import {
  useEffect,
  useCallback,
  useRef,
  RefObject,
  MutableRefObject,
} from 'react'
import { CANVAS_COLORS, CELL_SIZE, GAP } from '../constants/game'
import { drawCell } from '../services/drawCell'
import { TGrid, TImgSet } from '../types/game'
import { getBoardSize } from '../services/getBoardSize'

type TProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>
  drawRef: MutableRefObject<(() => void) | null>
  grid: TGrid
  rows: number
  cols: number
  hoverRef: RefObject<{ row: number; col: number }>
  hoverAlphaRef: RefObject<number>
  revealMapRef: RefObject<Map<string, number>>
  imgsRef: RefObject<TImgSet>
}

export const useCanvasDraw = (props: TProps) => {
  const {
    canvasRef,
    drawRef,
    grid,
    rows,
    cols,
    hoverRef,
    hoverAlphaRef,
    revealMapRef,
    imgsRef,
  } = props

  const lastSizeRef = useRef<{
    width: number
    height: number
    dpr: number
  } | null>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx || !hoverRef.current) return

    const { row: hoveredRow, col: hoveredCol } = hoverRef.current

    // на дисплеях retina dpr=2+, поэтому рисуем в физических пикселях, чтобы не было мыла, css возвращает логический размер
    const dpr = window.devicePixelRatio || 1

    const width = getBoardSize(cols)
    const height = getBoardSize(rows)

    const last = lastSizeRef.current

    if (
      !last ||
      last.width !== width ||
      last.height !== height ||
      last.dpr !== dpr
    ) {
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      lastSizeRef.current = { width, height, dpr }
    }

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = CANVAS_COLORS.border
    ctx.fillRect(0, 0, width, height)

    for (let row = 0; row < rows; row++)
      for (let col = 0; col < cols; col++)
        drawCell({
          ctx,
          x: col * (CELL_SIZE + GAP),
          y: row * (CELL_SIZE + GAP),
          cell: grid[row][col],
          hoverAlpha:
            row === hoveredRow && col === hoveredCol && hoverAlphaRef.current
              ? hoverAlphaRef.current
              : 0,
          revealAlpha: revealMapRef.current?.get(`${row}-${col}`) ?? 1,
          imgs: imgsRef.current,
        })
  }, [
    grid,
    rows,
    cols,
    canvasRef,
    hoverRef,
    hoverAlphaRef,
    revealMapRef,
    imgsRef,
  ])

  useEffect(() => {
    drawRef.current = draw
    draw()
  }, [draw, drawRef])

  // перерисовываем при изменении зума браузера, иначе канвас мылится из-за старого dpr
  useEffect(() => {
    let remove: (() => void) | null = null

    const subscribe = () => {
      const mql = window.matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`
      )

      const handler = () => {
        draw()
        remove?.()
        remove = subscribe()
      }

      mql.addEventListener('change', handler)

      return () => mql.removeEventListener('change', handler)
    }

    remove = subscribe()

    return () => remove?.()
  }, [draw])
}
