import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MutableRefObject } from 'react'
import { useHoverAnimation } from './useHoverAnimation'

describe('useHoverAnimation', () => {
  let draw: ReturnType<typeof vi.fn>
  let drawRef: MutableRefObject<(() => void) | null>
  let rafCallback: FrameRequestCallback | null

  beforeEach(() => {
    draw = vi.fn<() => void>()
    drawRef = { current: draw } as MutableRefObject<(() => void) | null>
    rafCallback = null

    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((cb: FrameRequestCallback) => {
        rafCallback = cb
        return 1
      })
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.spyOn(performance, 'now').mockReturnValue(0)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('возвращает начальные значения', () => {
    const { result } = renderHook(() => useHoverAnimation({ drawRef }))

    expect(result.current.hoverRef.current).toEqual({ row: -1, col: -1 })
    expect(result.current.hoverAlphaRef.current).toBe(0)
    expect(typeof result.current.animateHover).toBe('function')
  })

  it('animateHover вызывает drawRef на кадре анимации', () => {
    const { result } = renderHook(() => useHoverAnimation({ drawRef }))

    result.current.animateHover(1)
    rafCallback?.(60)

    expect(draw).toHaveBeenCalledTimes(1)
    expect(result.current.hoverAlphaRef.current).toBeCloseTo(0.5, 5)
  })

  it('не вызывает drawRef, если он null', () => {
    drawRef.current = null

    const { result } = renderHook(() => useHoverAnimation({ drawRef }))

    result.current.animateHover(1)
    rafCallback?.(120)

    expect(draw).not.toHaveBeenCalled()
    expect(result.current.hoverAlphaRef.current).toBe(1)
  })
})
