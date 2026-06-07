import { useState, useCallback, useRef } from 'react'
import { TDifficulty, TDifficultyConfig, TGameState, TMinesweeperApi } from '../types/game'
import { createGrid } from '../services/createGrid'
import { DIFFICULTY } from '../constants/game'
import { cloneGrid } from '../services/cloneGrid'
import { flagAllMines } from '../services/flagAllMines'
import { placeMines } from '../services/placeMines'
import { resolveChord } from '../services/resolveChord'
import { resolveReveal } from '../services/resolveReveal'

export const useMinesweeper = (
  difficulty: TDifficulty = 'easy',
  customConfig?: TDifficultyConfig
): TMinesweeperApi => {
  const config =
    difficulty === 'custom' && customConfig
      ? customConfig
      : DIFFICULTY[difficulty as Exclude<TDifficulty, 'custom'>]
  const { rows, cols, mines } = config

  const configKey =
    difficulty === 'custom'
      ? `custom:${rows}:${cols}:${mines}`
      : difficulty
  const prevConfigKeyRef = useRef(configKey)

  const [state, setState] = useState<TGameState>({
    grid: createGrid(rows, cols),
    status: 'idle',
    started: false,
    minesLeft: mines,
    time: 0,
  })

  if (configKey !== prevConfigKeyRef.current) {
    prevConfigKeyRef.current = configKey

    setState({
      grid: createGrid(rows, cols),
      status: 'idle',
      started: false,
      minesLeft: mines,
      time: 0,
    })
  }

  const reset = useCallback(() => {
    setState({
      grid: createGrid(rows, cols),
      status: 'idle',
      started: false,
      minesLeft: mines,
      time: 0,
    })
  }, [rows, cols, mines])

  const reveal = useCallback(
    (row: number, col: number) => {
      setState(prev => resolveReveal(prev, row, col, rows, cols, mines))
    },
    [rows, cols, mines]
  )

  const chord = useCallback(
    (row: number, col: number) => {
      setState(prev => resolveChord(prev, row, col, rows, cols))
    },
    [rows, cols]
  )

  const flag = useCallback((row: number, col: number) => {
    setState(prev => {
      if (prev.status === 'won' || prev.status === 'lost' || !prev.started) {
        return prev
      }

      const cell = prev.grid[row][col]

      if (cell.revealed) {
        return prev
      }

      const grid = cloneGrid(prev.grid)
      grid[row][col].flagged = !grid[row][col].flagged

      const minesLeft = prev.minesLeft + (grid[row][col].flagged ? -1 : 1)

      return {
        ...prev,
        grid,
        minesLeft,
      }
    })
  }, [])

  // TODO: убрать после тестирования
  const cheat = useCallback(() => {
    setState(prev => {
      if (prev.status === 'won' || prev.status === 'lost') {
        return prev
      }

      const grid = cloneGrid(prev.grid)

      if (!prev.started) {
        placeMines({ grid, rows, cols, mines, safeRow: 0, safeCol: 0 })
      }

      for (let row = 0; row < rows; row++)
        for (let col = 0; col < cols; col++)
          if (!grid[row][col].mine) {
            grid[row][col].revealed = true
          }

      flagAllMines(grid, rows, cols)

      return {
        ...prev,
        grid,
        status: 'won',
        started: true,
        minesLeft: 0,
      }
    })
  }, [rows, cols, mines])

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.status !== 'playing') {
        return prev
      }

      return {
        ...prev,
        time: prev.time + 1,
      }
    })
  }, [])

  return {
    ...state,
    rows,
    cols,
    mines,
    reveal,
    flag,
    chord,
    reset,
    tick,

    cheat,
  }
}
