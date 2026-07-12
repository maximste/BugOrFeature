import { useRef } from 'react'
import { useColorMode } from '@/app/providers'
import { CELL_SIZE, GAP } from '../constants/game'
import { TGameStatus, TGrid } from '../types/game'

import { useCanvasDraw } from '../hooks/useCanvasDraw'
import { useCanvasImages } from '../hooks/useCanvasImages'
import { useHoverAnimation } from '../hooks/useHoverAnimation'
import { useRevealAnimation } from '../hooks/useRevealAnimation'
import { getBoardSize } from '../services/getBoardSize'

type TProps = {
  grid: TGrid
  rows: number
  cols: number
  status: TGameStatus
  onReveal: (row: number, col: number) => void
  onFlag: (row: number, col: number) => void
  onChord: (row: number, col: number) => void
}

export default function MinesweeperCanvas(props: TProps) {
  const { grid, rows, cols, status, onReveal, onFlag, onChord } = props
  const { colorMode } = useColorMode()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef<(() => void) | null>(null)

  const imgsRef = useCanvasImages({ drawRef })
  const { hoverRef, hoverAlphaRef, animateHover } = useHoverAnimation({
    drawRef,
  })
  const revealMapRef = useRevealAnimation({ grid, rows, cols, drawRef })

  useCanvasDraw({
    canvasRef,
    drawRef,
    grid,
    rows,
    cols,
    hoverRef,
    hoverAlphaRef,
    revealMapRef,
    imgsRef,
    colorMode,
  })

  const isFinished = status === 'won' || status === 'lost'

  const getCellCoordsFromEvent = (
    e: React.MouseEvent
  ): { row: number; col: number } | null => {
    const canvas = canvasRef.current

    if (!canvas) {
      return null
    }

    const rect = canvas.getBoundingClientRect()

    const col = Math.floor((e.clientX - rect.left) / (CELL_SIZE + GAP))
    const row = Math.floor((e.clientY - rect.top) / (CELL_SIZE + GAP))

    if (row < 0 || row >= rows || col < 0 || col >= cols) {
      return null
    }

    return { row, col }
  }

  const handleClick = (e: React.MouseEvent) => {
    const cell = getCellCoordsFromEvent(e)

    if (!cell) return

    if (grid[cell.row][cell.col].revealed) {
      onChord(cell.row, cell.col)
    } else {
      onReveal(cell.row, cell.col)
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()

    const cell = getCellCoordsFromEvent(e)

    if (cell) {
      onFlag(cell.row, cell.col)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isFinished) {
      hoverRef.current = { row: -1, col: -1 }
      return
    }

    const cell = getCellCoordsFromEvent(e)
    const prev = hoverRef.current
    const newRow = cell?.row ?? -1
    const newCol = cell?.col ?? -1

    if (prev.row !== newRow || prev.col !== newCol) {
      hoverRef.current = { row: newRow, col: newCol }

      if (newRow === -1) {
        animateHover(0)
      } else {
        hoverAlphaRef.current = 0
        animateHover(1)
      }
    }
  }

  const handleMouseLeave = () => {
    if (isFinished) {
      hoverRef.current = { row: -1, col: -1 }
      return
    }

    hoverRef.current = { row: -1, col: -1 }
    animateHover(0)
  }

  const width = getBoardSize(cols)
  const height = getBoardSize(rows)

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width,
        height,
        cursor: isFinished ? 'default' : 'pointer',
      }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  )
}
