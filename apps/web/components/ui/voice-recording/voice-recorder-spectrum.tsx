"use client"

import { motion } from "framer-motion"

type VoiceRecorderSpectrumProps = {
  /** Current normalized frequency levels. */
  levels: number[]
}

/** Renders the full frequency spectrum beneath the recorder button. */
export function VoiceRecorderSpectrum({ levels }: VoiceRecorderSpectrumProps) {
  return (
    <div className="flex h-10 items-center justify-center gap-0.5" aria-hidden="true">
      {levels.map((level, index) => (
        <motion.span
          key={index}
          className="w-1 rounded-full bg-primary"
          animate={{
            height: `${Math.max(3, level * 32)}px`,
            opacity: 0.3 + level * 0.7,
          }}
          transition={{ duration: 0.08, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}