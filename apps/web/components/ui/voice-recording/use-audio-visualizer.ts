"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const BAR_COUNT = 24

/** Tracks frequency levels from a media stream for recorder visualizations. */
export function useAudioVisualizer() {
  const [levels, setLevels] = useState<number[]>(
    () => Array(BAR_COUNT).fill(0),
  )

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const stop = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    analyserRef.current?.disconnect()
    analyserRef.current = null

    if (audioContextRef.current) {
      void audioContextRef.current.close()
      audioContextRef.current = null
    }

    setLevels(Array(BAR_COUNT).fill(0))
  }, [])

  const start = useCallback((stream: MediaStream) => {
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()

    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.8

    const source = audioContext.createMediaStreamSource(stream)

    source.connect(analyser)

    audioContextRef.current = audioContext
    analyserRef.current = analyser

    const data = new Uint8Array(analyser.frequencyBinCount)

    const update = () => {
      if (!analyserRef.current) {
        return
      }

      analyser.getByteFrequencyData(data)

      const nextLevels = Array.from(
        { length: BAR_COUNT },
        (_, index) => {
          const start = Math.floor(
            (index / BAR_COUNT) * data.length,
          )

          const end = Math.floor(
            ((index + 1) / BAR_COUNT) * data.length,
          )

          let sum = 0

          for (let i = start; i < end; i++) {
            sum += data[i]
          }

          const average = sum / Math.max(1, end - start)

          return average / 255
        },
      )

      setLevels(nextLevels)

      animationFrameRef.current =
        requestAnimationFrame(update)
    }

    void audioContext.resume()

    update()
  }, [])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return {
    levels,
    start,
    stop,
  }
}