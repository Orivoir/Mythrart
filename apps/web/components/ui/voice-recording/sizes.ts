export type VoiceRecorderSize = "xs" | "sm" | "md" | "lg" | "xl"

export const buttonSizeClasses: Record<VoiceRecorderSize, string> = {
  xs: "size-10",
  sm: "size-12",
  md: "size-16",
  lg: "size-20",
  xl: "size-24",
}

export const micIconSizeClasses: Record<VoiceRecorderSize, string> = {
  xs: "size-4",
  sm: "size-5",
  md: "size-6",
  lg: "size-8",
  xl: "size-9",
}

export const stopIconSizeClasses: Record<VoiceRecorderSize, string> = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
  xl: "size-8",
}

// Width of the soft focus ring drawn around the button, in pixels.
export const ringSizePx: Record<VoiceRecorderSize, number> = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
}

export const waveformGapClasses: Record<VoiceRecorderSize, string> = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-5",
  xl: "gap-6",
}

/** Fixed bar heights displayed before recording begins. */
export const waveformIdleBars: Record<VoiceRecorderSize, string[]> = {
  xs: ["h-1.5", "h-2.5", "h-4", "h-2.5", "h-1.5"],
  sm: ["h-2", "h-3", "h-5", "h-3", "h-2"],
  md: ["h-2.5", "h-4", "h-6", "h-4", "h-2.5"],
  lg: ["h-3", "h-5", "h-8", "h-5", "h-3"],
  xl: ["h-3.5", "h-6", "h-9", "h-6", "h-3.5"],
}

// Maximum bar height, in pixels, reached while recording.
export const waveformMaxHeightPx: Record<VoiceRecorderSize, number> = {
  xs: 20,
  sm: 26,
  md: 32,
  lg: 40,
  xl: 48,
}
