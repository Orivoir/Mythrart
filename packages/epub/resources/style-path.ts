import path from "node:path"

export function getAbsoluteStylePath(): string {
  const filename = "styles.css"
  return path.resolve(__dirname, filename)
}
