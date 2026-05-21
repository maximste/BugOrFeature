import { CELL_SIZE, CANVAS_COLORS, RADIUS } from '../constants/game'
import { TCell, TImgSet } from '../types/game'

type TProps = {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  cell: TCell
  hoverAlpha: number
  revealAlpha: number
  imgs: TImgSet | null
}

export const drawCell = (props: TProps): void => {
  const { ctx, x, y, cell, hoverAlpha, revealAlpha, imgs } = props

  const s = CELL_SIZE

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(x, y, s, s, RADIUS)
  ctx.clip()

  if (cell.revealed) {
    // hidden-цвет основа для плавного перехода
    ctx.fillStyle = CANVAS_COLORS.hidden
    ctx.fillRect(x, y, s, s)

    ctx.globalAlpha = revealAlpha
    ctx.fillStyle = cell.exploded
      ? CANVAS_COLORS.exploded
      : CANVAS_COLORS.revealed
    ctx.fillRect(x, y, s, s)

    if (cell.mine) {
      if (imgs?.mine) {
        const m = s * 0.25
        ctx.drawImage(imgs.mine, x + m, y + m, s - m * 2, s - m * 2)
      }
    } else if (!cell.mine && cell.adjacent > 0) {
      ctx.fillStyle = CANVAS_COLORS.num[cell.adjacent] ?? '#000'
      ctx.font = `600 ${s * 0.52}px 'Fredoka', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(cell.adjacent), x + s / 2, y + s / 2 + 1)
    } else if (!cell.mine && cell.adjacent === 0) {
      if (imgs?.emptyCell) {
        const m = s * 0.25
        ctx.drawImage(imgs.emptyCell, x + m, y + m, s - m * 2, s - m * 2)
      }
    }

    ctx.globalAlpha = 1
  } else {
    ctx.fillStyle = CANVAS_COLORS.hidden
    ctx.fillRect(x, y, s, s)

    if (hoverAlpha > 0) {
      ctx.globalAlpha = hoverAlpha
      ctx.fillStyle = CANVAS_COLORS.hover
      ctx.fillRect(x, y, s, s)
      ctx.globalAlpha = 1
    }

    ctx.strokeStyle = 'rgba(188,147,140,0.15)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(x + s / 2, y + s - 6, s * 0.38, 5, 0, 0, Math.PI)
    ctx.stroke()

    if (cell.flagged && imgs?.flag) {
      const m = s * 0.25
      ctx.drawImage(imgs.flag, x + m, y + m, s - m * 2, s - m * 2)
    }
  }

  ctx.restore()
}
