/** Returns whether the browser exposes the APIs required for recording. */
export function isVoiceRecordingSupported() {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined"
  )
}

/** Returns the first audio MIME type supported by the browser. */
export function getSupportedMimeType() {
  const mimeTypes = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ]

  return mimeTypes.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  )
}

/** Formats elapsed seconds as a zero-padded `MM:SS` string. */
export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`
}