import { normalizeText } from "./normalize-text"

export function createOutputFileName(title: string): string {
  const baseName = normalizeText(title)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()

  return `${baseName || "book"}.epub`
}
