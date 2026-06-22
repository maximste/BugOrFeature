import { resolveReveal } from './resolveReveal'
import { TGameState } from '../types/game'

describe('resolveReveal', () => {
  let initialState: TGameState
  const rows = 4
  const cols = 5
  const mines = 10

  beforeEach(() => {
    initialState = {
      grid: Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          revealed: false,
          flagged: false,
          mine: false,
          adjacent: 0,
        }))
      ),
      status: 'playing',
      started: false,
      minesLeft: mines,
      time: 0,
    }
  })

  test('не меняет состояние, если клетка уже открыта или помечена', () => {
    const row = 0
    const col = 0
    initialState.grid[row][col].revealed = true
    const result = resolveReveal(initialState, row, col, rows, cols, mines)
    expect(result.status).toBe('playing')
    expect(result.minesLeft).toBe(mines)
  })

  test('не меняет состояние, если клетка уже помечена флагом', () => {
    const row = 1
    const col = 1
    initialState.grid[row][col].flagged = true
    const result = resolveReveal(initialState, row, col, rows, cols, mines)
    expect(result.status).toBe('playing')
    expect(result.minesLeft).toBe(mines)
  })

  test('проигрыш при открытии мины статус меняется на "lost"', () => {
    const row = 2
    const col = 3
    initialState.grid[row][col].mine = true
    const result = resolveReveal(initialState, row, col, rows, cols, mines)
    expect(result.status).toBe('lost')
  })

  test('проигрыш при открытии мины: minesLeft остаётся неизменным (не сбрасывается в 0)', () => {
    const row = 2
    const col = 3
    initialState.grid[row][col].mine = true

    const result = resolveReveal(initialState, row, col, rows, cols, mines)

    // Важно: minesLeft не меняется при проигрыше
    expect(result.minesLeft).toBe(mines) // Ожидаем 10, а не 0
  })

  test('проигрыш при открытии мины: клетка с миной получает exploded = true', () => {
    const row = 2
    const col = 3
    initialState.grid[row][col].mine = true

    const result = resolveReveal(initialState, row, col, rows, cols, mines)

    expect(result.grid[row][col].exploded).toBe(true)
  })

  test('проигрыш при открытии мины: все мины раскрываются', () => {
    const row = 0
    const col = 0
    // Помечаем несколько клеток как мины
    initialState.grid[1][1].mine = true
    initialState.grid[2][2].mine = true
    initialState.grid[3][3].mine = true

    initialState.grid[row][col].mine = true // Клетка для открытия

    const result = resolveReveal(initialState, row, col, rows, cols, mines)

    // Проверяем, что все мины стали revealed = true
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (initialState.grid[r][c].mine) {
          expect(result.grid[r][c].revealed).toBe(true)
        }
      }
    }
  })

  /*test('победа при раскрытии всех клеток без мин', () => {
    const grid = Array.from({ length: rows }, (_, r) => 
      Array.from({ length: cols }, (_, c) => ({ revealed: false, flagged: false, mine: false, adjacent: 0 })));
    const result = resolveReveal({ ...initialState, grid }, 0, 0, rows, cols, mines);
    expect(result.status).toBe('won');
    expect(result.minesLeft).toBe(0);
  });*/

  test('раскрытие безопасной клетки: статус остаётся "playing"', () => {
    const row = 0
    const col = 0

    const result = resolveReveal(initialState, row, col, rows, cols, mines)

    expect(result.status).toBe('playing')
  })
})
