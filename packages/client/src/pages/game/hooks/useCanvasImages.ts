import { useRef, useEffect, RefObject, MutableRefObject } from 'react'

import fishIcon from '@/assets/icons/fish.svg'
import dogIcon from '@/assets/icons/dog.svg'
import catIcon from '@/assets/icons/cat.svg'
import { TImgSet } from '../types/game'

type TProps = {
  drawRef: MutableRefObject<(() => void) | null>
}

// загружаем свгшки один раз, перерисовываем канвас когда загрузились
export const useCanvasImages = (props: TProps): RefObject<TImgSet> => {
  const { drawRef } = props

  const imgsRef = useRef<TImgSet>({ flag: null, mine: null, emptyCell: null })

  useEffect(() => {
    const entries: [keyof TImgSet, string][] = [
      ['flag', fishIcon],
      ['mine', dogIcon],
      ['emptyCell', catIcon],
    ]

    let pending = entries.length
    let cancelled = false
    const loaded: HTMLImageElement[] = []

    const onSettled = () => {
      if (cancelled) return
      if (--pending === 0 && drawRef.current) drawRef.current()
    }

    for (const [key, src] of entries) {
      const img = new Image()
      img.onload = onSettled
      img.onerror = () => {
        imgsRef.current[key] = null
        onSettled()
      }
      img.src = src
      imgsRef.current[key] = img
      loaded.push(img)
    }

    // при размонтировании снимаем обработчики, чтобы onload/onerror не
    // дёргали drawRef после удаления компонента и не держали замыкание
    return () => {
      cancelled = true
      for (const img of loaded) {
        img.onload = null
        img.onerror = null
      }
    }
  }, [drawRef])

  return imgsRef
}
