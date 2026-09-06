import { motion } from "framer-motion"
import { VoiceRecorderSpectrum } from "./voice-recorder-spectrum"
import { VoiceRecorderTimer } from "./voice-recorder-timer"

export interface VoiceRecordingProps {
  levels: number[]
  elapsedTime: number
}

export function VoiceRecording({ levels, elapsedTime }: VoiceRecordingProps) {

  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <VoiceRecorderSpectrum levels={levels} />
      <VoiceRecorderTimer elapsedTime={elapsedTime} />
    </motion.div>
  )
}