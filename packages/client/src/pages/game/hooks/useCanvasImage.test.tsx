import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCanvasImages } from './useCanvasImages'

// Мокируем SVG-иконки
vi.mock('@/assets/icons/fish.svg', () => ({ default: 'fish-icon-path' }))
vi.mock('@/assets/icons/dog.svg', () => ({ default: 'dog-icon-path' }))
vi.mock('@/assets/icons/cat.svg', () => ({ default: 'cat-icon-path' }))

describe('useCanvasImages', () => {
  let drawRef: React.MutableRefObject<(() => void) | null>
  let mockDrawFunction: () => void

  beforeEach(() => {
    mockDrawFunction = vi.fn()
    drawRef = { current: mockDrawFunction }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('должен вернуть ref с начальным состоянием TImgSet', () => {
    const { result } = renderHook(() => useCanvasImages({ drawRef }))

    const images = result.current.current
    expect(images).toHaveProperty('flag')
    expect(images).toHaveProperty('mine')
    expect(images).toHaveProperty('emptyCell')
  })

  it('должен загружать все изображения и устанавливать их в ref', async () => {
    const { result } = renderHook(() => useCanvasImages({ drawRef }))

    // Ждём завершения загрузки изображений
    await waitFor(() => {
      const images = result.current.current

      expect(images).not.toBeNull()

      if (images) {
        expect(images.flag).toBeInstanceOf(Image)
        expect(images.mine).toBeInstanceOf(Image)
        expect(images.emptyCell).toBeInstanceOf(Image)
      }
    })

    //expect(mockDrawFunction).toHaveBeenCalledTimes(1);
  })

  /*it('должен корректно обрабатывать ошибки загрузки изображений', async () => {
    // Переопределяем Image для имитации ошибки загрузки
    const originalImage = global.Image;
    global.Image = vi.fn().mockImplementation(() => ({
      onload: null,
      onerror: null,
      src: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));

    const errorImage = new Image();
    errorImage.onerror = () => {};

    vi.spyOn(errorImage, 'onerror', 'set').mockImplementation(cb => {
      // Имитируем ошибку сразу при установке обработчика
      cb();
    });

    const { result } = renderHook(() => useCanvasImages({ drawRef }));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const images = result.current.current;
    expect(images.flag).toBeNull();
    expect(images.mine).toBeNull();
    expect(images.emptyCell).toBeNull();

    global.Image = originalImage;
  });

  it('должен правильно обрабатывать частичное успешное завершение загрузки', async () => {
    const originalImage = global.Image;

    let errorTriggered = false;
    global.Image = vi.fn().mockImplementation(() => {
      const img = {
        onload: null as unknown,
        onerror: null as unknown,
        src: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      };

      Object.defineProperty(img, 'onload', {
        set: (cb) => {
          // Имитируем успешную загрузку для двух изображений
          setTimeout(() => cb?.call(img), 50);
        }
      });

      Object.defineProperty(img, 'onerror', {
        set: (cb) => {
          if (!errorTriggered) {
            errorTriggered = true;
            // Имитируем ошибку для одного изображения
            setTimeout(() => cb?.call(img), 60);
          } else {
            setTimeout(() => cb?.call(img), 50);
          }
        }
      });

      return img;
    });

    const { result } = renderHook(() => useCanvasImages({ drawRef }));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    const images = result.current.current;
    // Два изображения должны быть загружены, одно — null из‑за ошибки
    const loadedCount = Object.values(images).filter(img => img !== null).length;
    expect(loadedCount).toBe(2);

    global.Image = originalImage;
  });

  it('не должен вызывать drawRef.current(), если он null', async () => {
    drawRef.current = null;

    renderHook(() => useCanvasImages({ drawRef }));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(mockDrawFunction).not.toHaveBeenCalled();
  });

  it('должен очищать pending-счётчик и корректно завершать работу', async () => {
    const { result } = renderHook(() => useCanvasImages({ drawRef }));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    const images = result.current.current;
    expect(Object.values(images).some(img => img !== null)).toBe(true);
  });*/
})
