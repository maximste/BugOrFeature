import {
  useRef,
  useEffect,
  useCallback,
  RefObject,
  MutableRefObject,
} from 'react'
import { TGrid } from '../types/game'

type TProps = {
  grid: TGrid
  rows: number
  cols: number
  drawRef: MutableRefObject<(() => void) | null>
}

// анимация открытия ячеек: отслеживает новые ревилы и запускает fade-in через RAF
export const useRevealAnimation = (
  props: TProps
): RefObject<Map<string, number>> => {
  const { grid, rows, cols, drawRef } = props

  const revealMapRef = useRef<Map<string, number>>(new Map())
  const revealRafRef = useRef<number | null>(null)
  const prevGridRef = useRef<TGrid | null>(null)

  const startRevealAnim = useCallback(() => {
    if (revealRafRef.current) {
      cancelAnimationFrame(revealRafRef.current)
    }

    const duration = 60
    const startTime = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)

      for (const key of revealMapRef.current.keys()) {
        revealMapRef.current.set(key, progress)
      }

      if (drawRef.current) {
        drawRef.current()
      }

      if (progress < 1) {
        revealRafRef.current = requestAnimationFrame(step)
      } else {
        revealMapRef.current.clear()
      }
    }

    revealRafRef.current = requestAnimationFrame(step)
  }, [drawRef])

  useEffect(() => {
    const prev = prevGridRef.current

    if (prev) {
      revealMapRef.current.clear()

      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (grid[r][c].revealed && !prev[r]?.[c]?.revealed) {
            revealMapRef.current.set(`${r}-${c}`, 0)
          }

      if (revealMapRef.current.size > 0) {
        startRevealAnim()
      }
    }

    prevGridRef.current = grid
  }, [grid, rows, cols, startRevealAnim])

  // отменяем незавершённую анимацию открытия при размонтировании
  useEffect(() => {
    return () => {
      if (revealRafRef.current) {
        cancelAnimationFrame(revealRafRef.current)
      }
    }
  }, [])

  return revealMapRef
}
