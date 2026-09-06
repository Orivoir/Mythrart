"use client"
import { VoiceRecording } from "./voice-recording"
import { cn } from "@/lib/utils"
import type { VoiceRecorderProps } from "./index"
import { recorderGapClasses } from "./sizes"
import { useVoiceRecorder } from "./use-voice-recorder"
import { VoiceRecorderButton } from "./voice-recorder-button"
import { VoiceRecorderWaveform } from "./voice-recorder-waveform"

/** Renders the complete voice recording control and its live status. */
export function VoiceRecorder({
  disabled = false,
  size = "lg",
  onStart,
  onRecordFinish,
  onNoCompatible,
  onError,
  onStream,
  className,
}: VoiceRecorderProps) {

  const {
    elapsedTime,
    handleClick,
    isDisabled,
    isRecording,
    levels,
  } = useVoiceRecorder({
    disabled,
    onStart,
    onRecordFinish,
    onNoCompatible,
    onError,
    onStream,
  })

  const recorder = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={cn("flex items-center justify-center", recorderGapClasses[size])}>
        <VoiceRecorderWaveform
          levels={levels}
          side="left"
          isRecording={isRecording}
          size={size}
        />
        <VoiceRecorderButton
          disabled={isDisabled}
          isRecording={isRecording}
          onClick={handleClick}
          size={size}
        />
        <VoiceRecorderWaveform
          levels={levels}
          side="right"
          isRecording={isRecording}
          size={size}
        />
      </div>

      {isRecording && (
        <VoiceRecording levels={levels} elapsedTime={elapsedTime} />
      )}
    </div>
  )

  // Recording takes over the full viewport, ignoring any caller-provided
  // positioning classes meant for the idle trigger.
  if (isRecording) {
    return (
      <div className="fixed inset-0 z-50 flex size-full items-center justify-center bg-background">
        {recorder}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {recorder}
    </div>
  )
}