"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { VoiceRecorderSize } from "./sizes"
import {
  waveformGapClasses,
  waveformIdleBars,
  waveformMaxHeightPx,
} from "./sizes"

type VoiceRecorderWaveformProps = {
  /** Current normalized frequency levels. */
  levels: number[]
  /** Determines which five levels are rendered while recording. */
  side: "left" | "right"
  /** Selects the animated recording or static idle waveform. */
  isRecording: boolean
  /** Controls the bar heights and spacing. */
  size: VoiceRecorderSize
}

/** Renders one of the mirrored waveforms around the recorder button. */
export function VoiceRecorderWaveform({
  levels,
  side,
  isRecording,
  size,
}: VoiceRecorderWaveformProps) {
  const maxHeight = waveformMaxHeightPx[size]

  return isRecording ? (
    <motion.div
      className={cn(
        "flex items-center justify-center",
        waveformGapClasses[size],
      )}
      style={{ height: maxHeight }}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {(side === "left" ? levels.slice(0, 5) : levels.slice(-5)).map(
        (level, index) => (
          <motion.span
            key={`${side}-${index}`}
            className="w-1 rounded-full bg-primary/60"
            animate={{
              height: `${Math.max(maxHeight * 0.3, level * maxHeight)}px`,
            }}
            transition={{ duration: 0.08, ease: "easeOut" }}
          />
        ),
      )}
    </motion.div>
  ) : (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center opacity-70",
        waveformGapClasses[size],
      )}
    >
      {waveformIdleBars[size].map((height, index) => (
        <span
          key={`${side}-${index}`}
          className={cn("w-1 rounded-full bg-primary/60", height)}
        />
      ))}
    </div>
  )
}