"use client"

import { motion } from "framer-motion"
import { formatTime } from "./utils"

type VoiceRecorderTimerProps = {
  /** Number of seconds elapsed in the current recording. */
  elapsedTime: number
}

/** Renders the formatted elapsed recording time. */
export function VoiceRecorderTimer({ elapsedTime }: VoiceRecorderTimerProps) {
  return (
    <motion.span
      className="text-sm tabular-nums text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {formatTime(elapsedTime)}
    </motion.span>
  )
}