import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GamePage } from './GamePage'

vi.mock('@chakra-ui/react', () => ({
  Box: (props: any) => <div {...props} />,
  Heading: (props: any) => <h1 {...props} />,
  Button: (props: any) => <button {...props} />,
  Text: (props: any) => <p {...props} />,
}))

vi.mock('@/app/hooks/usePage', () => ({
  usePage: vi.fn(),
}))

vi.mock('../hooks/useMinesweeper', () => ({
  useMinesweeper: vi.fn().mockReturnValue({
    grid: [],
    rows: 9,
    cols: 9,
    status: 'playing',
    minesLeft: 10,
    time: 0,
    reveal: vi.fn(),
    flag: vi.fn(),
    chord: vi.fn(),
    reset: vi.fn(),
    tick: vi.fn(),
    cheat: vi.fn(),
  }),
}))

vi.mock('./ControlPanel', () => ({
  ControlPanel: () => <div data-testid="control-panel">ControlPanel</div>,
}))

vi.mock('./GameStatusBanner', () => ({
  GameStatusBanner: () => (
    <div data-testid="game-status-banner">GameStatusBanner</div>
  ),
}))

vi.mock('./MinesweeperCanvas', () => ({
  default: () => <div data-testid="minesweeper-canvas">MinesweeperCanvas</div>,
}))

describe('GamePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Должен собраться и отрендериться без ошибок', () => {
    render(<GamePage />)

    expect(screen.getByText('Котосапёр 🐾')).toBeInTheDocument()
    expect(
      screen.getByText('Не разбудите пёсиков и соберите всех котиков')
    ).toBeInTheDocument()
    expect(screen.getByTestId('control-panel')).toBeInTheDocument()
    expect(screen.getByTestId('game-status-banner')).toBeInTheDocument()
    expect(screen.getByTestId('minesweeper-canvas')).toBeInTheDocument()
  })
})
