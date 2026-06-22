import { useRef, useCallback, useEffect, MutableRefObject } from 'react'

type TProps = {
  drawRef: MutableRefObject<(() => void) | null>
}

// анимация ховера: плавная смена цвета при наведении и уходе курсора
export const useHoverAnimation = (props: TProps) => {
  const { drawRef } = props

  const hoverRef = useRef({ row: -1, col: -1 })
  const hoverAlphaRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const animateHover = useCallback(
    (toValue: number) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      const duration = 120
      const from = hoverAlphaRef.current
      const startTime = performance.now()

      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)

        hoverAlphaRef.current = from + (toValue - from) * progress

        if (drawRef.current) {
          drawRef.current()
        }

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step)
        }
      }

      rafRef.current = requestAnimationFrame(step)
    },
    [drawRef]
  )

  // отменяем незавершённую анимацию при размонтировании, иначе RAF-цикл
  // продолжает дёргать drawRef уже после удаления канваса
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return { hoverRef, hoverAlphaRef, animateHover }
}
