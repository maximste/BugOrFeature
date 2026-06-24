export const loadAudioBuffer = async (
  ctx: AudioContext,
  url: string
): Promise<AudioBuffer> => {
  const res = await fetch(url)
  const raw = await res.arrayBuffer()

  return ctx.decodeAudioData(raw)
}
