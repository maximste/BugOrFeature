import { useCallback, useEffect, useRef, useState } from 'react'
import { TGameStatus } from '../types/game'
import happySong from '@/assets/audio/happy-cat-song.mp3'
import sadSong from '@/assets/audio/sad-meow-song.mp3'
import { MUSIC_FADE_SECONDS } from '../constants/game'
import { loadAudioBuffer } from '../services/loadAudioBuffer'
import { playAudioBuffer } from '../services/playAudioBuffer'

export const useGameAudio = (status: TGameStatus) => {
  const [isMuted, setIsMuted] = useState(false)
  const toggleMute = useCallback(() => setIsMuted(prev => !prev), [])

  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const prevStatusRef = useRef<TGameStatus | null>(null)

  // буферы для обеих мелодий, загружаются один раз при монтировании
  const buffersRef = useRef<Record<'won' | 'lost', AudioBuffer | null>>({
    won: null,
    lost: null,
  })

  useEffect(() => {
    const ctx = new AudioContext()
    ctxRef.current = ctx

    loadAudioBuffer(ctx, happySong).then(buf => {
      buffersRef.current.won = buf
    })
    loadAudioBuffer(ctx, sadSong).then(buf => {
      buffersRef.current.lost = buf
    })

    return () => {
      ctx.close()
    }
  }, [])

  useEffect(() => {
    const ctx = ctxRef.current

    if (!ctx) return

    const stopAudio = () => {
      const gain = gainRef.current
      const src = sourceRef.current

      if (!gain || !src) return

      gain.gain.cancelScheduledValues(ctx.currentTime)
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + MUSIC_FADE_SECONDS)

      // останавливаем источник после завершения фейда, try/catch на случай если музыка уже закончилась
      setTimeout(() => {
        try {
          src.stop()
        } catch {
          /* empty */
        }
      }, MUSIC_FADE_SECONDS * 1000)

      gainRef.current = null
      sourceRef.current = null
    }

    const statusChanged = prevStatusRef.current !== status
    prevStatusRef.current = status

    if (isMuted) {
      stopAudio()
      return
    }

    if (status === 'won' || status === 'lost') {
      // не запускаем музыку если включили звук уже после окончания игры
      if (!statusChanged) return

      stopAudio()

      const buffer = buffersRef.current[status]
      if (!buffer) return

      if (ctx.state === 'suspended') ctx.resume()

      const { gain, source } = playAudioBuffer(ctx, buffer, () => {
        if (sourceRef.current === source) {
          gainRef.current = null
          sourceRef.current = null
        }
      })

      gainRef.current = gain
      sourceRef.current = source
    } else if (status === 'idle') {
      stopAudio()
    }
  }, [status, isMuted])

  return { isMuted, toggleMute }
}
