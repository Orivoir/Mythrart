"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { useAudioVisualizer } from "./use-audio-visualizer"
import { useMediaRecorder } from "./use-media-recorder"
import {
  isVoiceRecordingSupported,
} from "./utils"

type UseVoiceRecorderOptions = {
  /** Prevents a recording from being started. */
  disabled: boolean
  /** Called after the recorder starts. */
  onStart?: () => void
  /** Receives the completed audio blob. */
  onRecordFinish?: (voice: Blob) => void
  /** Called when recording is unavailable in the current browser. */
  onNoCompatible?: () => void
  /** Receives browser or recorder errors. */
  onError?: (error?: unknown) => void
  /** Receives the live media stream, or null once recording stops. */
  onStream?: (stream: MediaStream | null) => void
}

const subscribeNoop = () => () => {}

/** Coordinates recording availability, elapsed time, and media controls. */
export function useVoiceRecorder({
  disabled,
  onStart,
  onRecordFinish,
  onNoCompatible,
  onError,
  onStream,
}: UseVoiceRecorderOptions) {
  const { levels, start: startVisualizer, stop: stopVisualizer } =
    useAudioVisualizer()
  const isSupported = useSyncExternalStore(
    subscribeNoop,
    isVoiceRecordingSupported,
    () => false
  )
  const localDisabled = !isSupported
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isDisabled = disabled || localDisabled

  function startTimer() {
    setElapsedTime(0)
    timerRef.current = setInterval(() => {
      setElapsedTime((current) => current + 1)
    }, 1000)
  }

  function stopTimer() {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const {
    cleanup,
    isRecording,
    stream,
    startRecording,
    stopRecording,
  } = useMediaRecorder({
    disabled: isDisabled,
    onRecordFinish,
    onError,
    onStart,
    startVisualizer,
    stopVisualizer,
    onRecordingStart: startTimer,
    onRecordingStop: stopTimer,
  })


  useEffect(() => {
    // Read directly: `isSupported` is still the server value on the hydration commit.
    if (!isVoiceRecordingSupported()) {
      onNoCompatible?.()
      return
    }

    return () => {
      cleanup()
    }
  }, [onNoCompatible, cleanup])

  function handleClick() {
    if (isRecording) {
      stopRecording()
      return
    }

    void startRecording()
  }

  useEffect(() => {
    onStream?.(stream)
  }, [onStream, stream])

  return {
    elapsedTime,
    handleClick,
    isDisabled,
    isRecording,
    levels,
    stream
  }
}