import { CELL_SIZE, RADIUS, TCanvasColors } from '../constants/game'
import { TCell, TImgSet } from '../types/game'

type TProps = {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  cell: TCell
  hoverAlpha: number
  revealAlpha: number
  imgs: TImgSet | null
  colors: TCanvasColors
}

const canDrawImage = (img: HTMLImageElement | null): img is HTMLImageElement =>
  img != null && img.complete && img.naturalWidth > 0

export const drawCell = (props: TProps): void => {
  const { ctx, x, y, cell, hoverAlpha, revealAlpha, imgs, colors } = props

  const s = CELL_SIZE

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(x, y, s, s, RADIUS)
  ctx.clip()

  if (cell.revealed) {
    // hidden-цвет основа для плавного перехода
    ctx.fillStyle = colors.hidden
    ctx.fillRect(x, y, s, s)

    ctx.globalAlpha = revealAlpha
    ctx.fillStyle = cell.exploded ? colors.exploded : colors.revealed
    ctx.fillRect(x, y, s, s)

    if (cell.mine) {
      const mineImg = imgs?.mine ?? null
      if (canDrawImage(mineImg)) {
        const m = s * 0.25
        ctx.drawImage(mineImg, x + m, y + m, s - m * 2, s - m * 2)
      }
    } else if (!cell.mine && cell.adjacent > 0) {
      ctx.fillStyle = colors.num[cell.adjacent] ?? '#000'
      ctx.font = `600 ${s * 0.52}px 'Fredoka', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(cell.adjacent), x + s / 2, y + s / 2 + 1)
    } else if (!cell.mine && cell.adjacent === 0) {
      const emptyCellImg = imgs?.emptyCell ?? null
      if (canDrawImage(emptyCellImg)) {
        const m = s * 0.25
        ctx.drawImage(emptyCellImg, x + m, y + m, s - m * 2, s - m * 2)
      }
    }

    ctx.globalAlpha = 1
  } else {
    ctx.fillStyle = colors.hidden
    ctx.fillRect(x, y, s, s)

    if (hoverAlpha > 0) {
      ctx.globalAlpha = hoverAlpha
      ctx.fillStyle = colors.hover
      ctx.fillRect(x, y, s, s)
      ctx.globalAlpha = 1
    }

    ctx.strokeStyle = 'rgba(188,147,140,0.15)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(x + s / 2, y + s - 6, s * 0.38, 5, 0, 0, Math.PI)
    ctx.stroke()

    const flagImg = imgs?.flag ?? null
    if (cell.flagged && canDrawImage(flagImg)) {
      const m = s * 0.25
      ctx.drawImage(flagImg, x + m, y + m, s - m * 2, s - m * 2)
    }
  }

  ctx.restore()
}
