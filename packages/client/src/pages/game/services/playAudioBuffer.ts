import { MUSIC_FADE_SECONDS } from '../constants/game'

type TPlayResult = {
  gain: GainNode
  source: AudioBufferSourceNode
}

export const playAudioBuffer = (
  ctx: AudioContext,
  buffer: AudioBuffer,
  onEnded: () => void
): TPlayResult => {
  const gain = ctx.createGain()

  // фейд-ин при старте мелодии
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(1, ctx.currentTime + MUSIC_FADE_SECONDS)

  // фейд-аут в конце мелодии
  const naturalFadeStart =
    ctx.currentTime + buffer.duration - MUSIC_FADE_SECONDS
  gain.gain.setValueAtTime(1, naturalFadeStart)
  gain.gain.linearRampToValueAtTime(0, naturalFadeStart + MUSIC_FADE_SECONDS)

  gain.connect(ctx.destination)

  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(gain)
  source.start()
  source.onended = onEnded

  return { gain, source }
}
