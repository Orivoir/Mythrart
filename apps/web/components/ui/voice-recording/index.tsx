"use client"

/** Public props accepted by the voice recorder component. */
export type VoiceRecorderProps = {
  /** Prevents starting a new recording. */
  disabled?: boolean
  /** Called after the media recorder starts capturing audio. */
  onStart?: () => void
  /** Called with the completed audio blob when recording stops. */
  onRecordFinish?: (voice: Blob) => void
  /** Receives the live media stream, or null once recording stops. */
  onStream?: (stream: MediaStream | null) => void
  /** Called when the browser cannot access the required recording APIs. */
  onNoCompatible?: () => void
  /** Called when permission or recording setup fails. */
  onError?: (error?: unknown) => void
  /** Additional classes for the recorder container. */
  className?: string
}

export { VoiceRecorder } from "./voice-recorder"