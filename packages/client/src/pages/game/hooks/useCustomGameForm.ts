import { useState, useEffect } from 'react'
import {
  CUSTOM_MAX_MINE_DENSITY,
  CUSTOM_MIN_MINE_DENSITY,
  DEFAULT_DIFFICULTY,
} from '../constants/game'
import { clampFieldSize } from '../services/clampFieldSize'

type TProps = {
  onStart: (rows: number, cols: number, mines: number) => void
}
export const useCustomGameForm = (props: TProps) => {
  const { onStart } = props

  const [formRows, setFormRows] = useState(DEFAULT_DIFFICULTY.rows)
  const [formCols, setFormCols] = useState(DEFAULT_DIFFICULTY.cols)
  const [formMines, setFormMines] = useState(DEFAULT_DIFFICULTY.mines)

  const safeRows = clampFieldSize(formRows)
  const safeCols = clampFieldSize(formCols)
  const minMines = Math.max(
    1,
    Math.ceil(safeRows * safeCols * CUSTOM_MIN_MINE_DENSITY)
  )
  const maxMines = Math.floor(safeRows * safeCols * CUSTOM_MAX_MINE_DENSITY)
  const safeMines = Math.min(Math.max(minMines, formMines), maxMines)

  useEffect(() => {
    setFormMines(prev => Math.min(Math.max(minMines, prev), maxMines))
  }, [minMines, maxMines])

  const start = () => onStart(safeRows, safeCols, safeMines)

  return {
    formRows,
    setFormRows,
    safeRows,
    formCols,
    setFormCols,
    safeCols,
    formMines,
    setFormMines,
    safeMines,
    minMines,
    maxMines,
    start,
  }
}
