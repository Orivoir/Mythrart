"use client"

import { Mic, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type VoiceRecorderButtonProps = {
  /** Disables the control. */
  disabled: boolean
  /** Selects the stop or microphone icon and pressed state. */
  isRecording: boolean
  /** Handles starting or stopping the active recording. */
  onClick: () => void
}

/** Renders the primary start/stop button for the recorder. */
export function VoiceRecorderButton({
  disabled,
  isRecording,
  onClick,
}: VoiceRecorderButtonProps) {
  return (
    <Button
      type="button"
      variant="default"
      size="icon"
      disabled={disabled}
      aria-label={
        isRecording
          ? "Arrêter l'enregistrement"
          : "Démarrer l'enregistrement"
      }
      aria-pressed={isRecording}
      onClick={onClick}
      className={cn(
        "relative size-20 rounded-full",
        "bg-primary text-primary-foreground",
        "hover:bg-primary hover:text-primary-foreground",
        "shadow-[0_0_0_10px_color-mix(in_oklab,var(--primary)_8%,transparent)]",
        "transition-transform duration-200",
        "active:scale-95",
        isRecording && "scale-105",
      )}
    >
      {isRecording ? (
        <Square className="size-7 fill-current" aria-hidden="true" />
      ) : (
        <Mic className="size-8" strokeWidth={2} aria-hidden="true" />
      )}
    </Button>
  )
}