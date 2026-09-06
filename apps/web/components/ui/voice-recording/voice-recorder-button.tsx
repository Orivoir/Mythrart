"use client"

import { Mic, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { VoiceRecorderSize } from "./sizes"
import {
  buttonSizeClasses,
  micIconSizeClasses,
  ringSizePx,
  stopIconSizeClasses,
} from "./sizes"

type VoiceRecorderButtonProps = {
  /** Disables the control. */
  disabled: boolean
  /** Selects the stop or microphone icon and pressed state. */
  isRecording: boolean
  /** Handles starting or stopping the active recording. */
  onClick: () => void
  /** Controls the button and icon dimensions. */
  size: VoiceRecorderSize
}

/** Renders the primary start/stop button for the recorder. */
export function VoiceRecorderButton({
  disabled,
  isRecording,
  onClick,
  size,
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
      style={{
        boxShadow: `0 0 0 ${ringSizePx[size]}px color-mix(in oklab, var(--primary) 8%, transparent)`,
      }}
      className={cn(
        "relative rounded-full",
        buttonSizeClasses[size],
        "bg-primary text-primary-foreground",
        "hover:bg-primary hover:text-primary-foreground",
        "transition-transform duration-200",
        "active:scale-95",
        isRecording && "scale-105",
      )}
    >
      {isRecording ? (
        <Square
          className={cn(stopIconSizeClasses[size], "fill-current")}
          aria-hidden="true"
        />
      ) : (
        <Mic
          className={micIconSizeClasses[size]}
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
    </Button>
  )
}