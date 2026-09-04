"use client"
import { VoiceRecording } from "./voice-recording"
import { cn } from "@/lib/utils"
import type { VoiceRecorderProps } from "./index"
import { useVoiceRecorder } from "./use-voice-recorder"
import { VoiceRecorderButton } from "./voice-recorder-button"
import { VoiceRecorderWaveform } from "./voice-recorder-waveform"

/** Renders the complete voice recording control and its live status. */
export function VoiceRecorder({
  disabled = false,
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

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        isRecording && "fixed inset-0 z-50 size-full bg-background",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex items-center justify-center gap-5">
          <VoiceRecorderWaveform
            levels={levels}
            side="left"
            isRecording={isRecording}
          />
          <VoiceRecorderButton
            disabled={isDisabled}
            isRecording={isRecording}
            onClick={handleClick}
          />
          <VoiceRecorderWaveform
            levels={levels}
            side="right"
            isRecording={isRecording}
          />
        </div>

        {isRecording && (
          <VoiceRecording levels={levels} elapsedTime={elapsedTime} />
        )}
      </div>
    </div>
  )
}