import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GamePage } from './GamePage'
import React from 'react'

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react')

  const chakraStyleProps = [
    'borderRadius',
    'border',
    'bg',
    'color',
    'p',
    'm',
    'w',
    'h',
    'maxW',
    'minW',
    'maxH',
    'minH',
    'padding',
    'margin',
    'width',
    'height',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'textAlign',
    'verticalAlign',
    'display',
    'alignItems',
    'justifyContent',
    'flexDirection',
    'gap',
    'gridTemplateColumns',
    'gridTemplateRows',
    'overflowX',
    'overflowY',
    'overflow',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'zIndex',
    'boxShadow',
    'opacity',
  ]

  const createFilteredComponent = (tag: string) => (props: any) => {
    const filteredProps = Object.keys(props).reduce((acc, key) => {
      if (!chakraStyleProps.includes(key)) {
        acc[key] = props[key]
      }
      return acc
    }, {} as any)
    return React.createElement(tag, filteredProps)
  }

  return {
    ...actual,
    Box: createFilteredComponent('div'),
    Heading: createFilteredComponent('h1'),
    Button: createFilteredComponent('button'),
    Text: createFilteredComponent('p'),
    createSystem: vi.fn(),
    defineConfig: vi.fn(),
  }
})

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
