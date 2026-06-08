import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { MutableRefObject } from 'react'
import { useCanvasImages } from './useCanvasImages'

vi.mock('@/assets/icons/fish.svg', () => ({ default: 'fish.svg' }))
vi.mock('@/assets/icons/dog.svg', () => ({ default: 'dog.svg' }))
vi.mock('@/assets/icons/cat.svg', () => ({ default: 'cat.svg' }))

type MockImage = {
  onload: (() => void) | null
  onerror: (() => void) | null
  src: string
  simulateLoad: () => void
  simulateError: () => void
}

let imageInstances: MockImage[]

function createMockImage(): MockImage {
  const img: MockImage = {
    onload: null,
    onerror: null,
    src: '',
    simulateLoad() {
      img.onload?.()
    },
    simulateError() {
      img.onerror?.()
    },
  }
  imageInstances.push(img)
  return img
}

describe('useCanvasImages', () => {
  beforeEach(() => {
    imageInstances = []
    vi.stubGlobal('Image', vi.fn(createMockImage))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('создаёт по одному Image на каждую иконку', () => {
    const drawRef: MutableRefObject<(() => void) | null> = { current: vi.fn() }

    renderHook(() => useCanvasImages({ drawRef }))

    expect(imageInstances, 'должно быть создано 3 изображения').toHaveLength(3)
    expect(imageInstances[0]!.src, 'первая иконка — fish').toBe('fish.svg')
    expect(imageInstances[1]!.src, 'вторая иконка — dog').toBe('dog.svg')
    expect(imageInstances[2]!.src, 'третья иконка — cat').toBe('cat.svg')
  })

  it('кладёт загружаемые Image в ref', () => {
    const drawRef: MutableRefObject<(() => void) | null> = { current: vi.fn() }

    const { result } = renderHook(() => useCanvasImages({ drawRef }))

    expect(result.current.current, 'ref не должен быть null').not.toBeNull()
    const imgs = result.current.current!

    expect(imgs.flag, 'flag должен быть Image').toBe(imageInstances[0])
    expect(imgs.mine, 'mine должен быть Image').toBe(imageInstances[1])
    expect(imgs.emptyCell, 'emptyCell должен быть Image').toBe(
      imageInstances[2]
    )
  })

  it('вызывает drawRef после загрузки всех изображений', async () => {
    const draw = vi.fn()
    const drawRef: MutableRefObject<(() => void) | null> = { current: draw }

    renderHook(() => useCanvasImages({ drawRef }))

    await waitFor(() => {
      imageInstances.forEach(img => img.simulateLoad())
    })

    await waitFor(() => {
      expect(draw, 'drawRef должен быть вызван один раз').toHaveBeenCalledTimes(
        1
      )
    })
  })

  it('не вызывает drawRef, если он равен null', async () => {
    const drawRef: MutableRefObject<(() => void) | null> = { current: null }

    renderHook(() => useCanvasImages({ drawRef }))

    await waitFor(() => {
      imageInstances.forEach(img => img.simulateLoad())
    })

    expect(drawRef.current, 'drawRef остаётся null').toBeNull()
  })
})
