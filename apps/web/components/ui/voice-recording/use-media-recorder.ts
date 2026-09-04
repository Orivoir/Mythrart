"use client"

import { useRef, useState } from "react"
import { getSupportedMimeType } from "./utils"

type UseMediaRecorderOptions = {
  /** Prevents a recording from being started. */
  disabled: boolean
  /** Receives the completed audio blob. */
  onRecordFinish?: (voice: Blob) => void
  /** Receives browser or recorder errors. */
  onError?: (error?: unknown) => void
  /** Called after the recorder has started. */
  onStart?: () => void
  /** Starts the audio visualizer for the active stream. */
  startVisualizer: (stream: MediaStream) => void
  /** Stops the audio visualizer. */
  stopVisualizer: () => void
  /** Notifies the owner that recording setup completed. */
  onRecordingStart?: () => void
  /** Notifies the owner that recording ended or setup failed. */
  onRecordingStop?: () => void
}

/** Owns MediaRecorder creation, stream cleanup, and recording callbacks. */
export function useMediaRecorder({
  disabled,
  onRecordFinish,
  onError,
  onStart,
  startVisualizer,
  stopVisualizer,
  onRecordingStart,
  onRecordingStop,
}: UseMediaRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  function stopMediaStream() {
    mediaStreamRef.current?.getTracks().forEach((track) => {
      track.stop()
    })
  }

  async function startRecording() {
    if (disabled || isRecording) {
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      startVisualizer(stream)

      const mimeType = getSupportedMimeType()
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)

      chunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onerror = (event) => {
        setIsRecording(false)
        setStream(null)
        stream.getTracks().forEach((track) => track.stop())
        mediaRecorderRef.current = null
        mediaStreamRef.current = null
        onError?.(event)
      }

      recorder.onstop = () => {
        const voice = new Blob(chunksRef.current, {
          type: recorder.mimeType || mimeType || "audio/webm",
        })

        stopVisualizer()
        onRecordingStop?.()
        chunksRef.current = []
        stream.getTracks().forEach((track) => track.stop())
        mediaRecorderRef.current = null
        mediaStreamRef.current = null
        setIsRecording(false)
        setStream(null)
        onRecordFinish?.(voice)
      }

      mediaRecorderRef.current = recorder
      mediaStreamRef.current = stream
      recorder.start()
      setIsRecording(true)
      setStream(stream)
      onRecordingStart?.()
      onStart?.()
    } catch (error) {
      stopMediaStream()
      mediaRecorderRef.current = null
      mediaStreamRef.current = null
      setIsRecording(false)
      setStream(null)
      stopVisualizer()
      onError?.(error)
      onRecordingStop?.()
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current

    if (!recorder || recorder.state === "inactive") {
      return
    }

    recorder.stop()
  }

  function cleanup() {
    const recorder = mediaRecorderRef.current

    if (recorder && recorder.state !== "inactive") {
      recorder.stop()
    }

    stopMediaStream()
    mediaRecorderRef.current = null
    mediaStreamRef.current = null
    chunksRef.current = []
    setStream(null)
  }

  return { cleanup, isRecording, startRecording, stopRecording, stream }
}