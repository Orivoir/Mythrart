"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { waveformBars } from "./utils"

type VoiceRecorderWaveformProps = {
  /** Current normalized frequency levels. */
  levels: number[]
  /** Determines which five levels are rendered while recording. */
  side: "left" | "right"
  /** Selects the animated recording or static idle waveform. */
  isRecording: boolean
}

/** Renders one of the mirrored waveforms around the recorder button. */
export function VoiceRecorderWaveform({
  levels,
  side,
  isRecording,
}: VoiceRecorderWaveformProps) {
  return isRecording ? (
    <motion.div
      className="flex h-16 items-center justify-center gap-1"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {(side === "left" ? levels.slice(0, 5) : levels.slice(-5)).map(
        (level, index) => (
          <motion.span
            key={`${side}-${index}`}
            className="w-1 rounded-full bg-primary/60"
            animate={{ height: `${Math.max(12, level * 40)}px` }}
            transition={{ duration: 0.08, ease: "easeOut" }}
          />
        ),
      )}
    </motion.div>
  ) : (
    <div aria-hidden="true" className="flex items-center gap-1.5 opacity-70">
      {waveformBars.map((height, index) => (
        <span
          key={`${side}-${index}`}
          className={cn("w-1 rounded-full bg-primary/60", height)}
        />
      ))}
    </div>
  )
}