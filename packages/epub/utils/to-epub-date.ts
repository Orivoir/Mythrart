import { EpubError } from "../errors"

export function toEpubDate(date: Date, field: string): string {
  if (
    !(date instanceof Date) ||
    Number.isNaN(date.getTime())
  ) {
    throw new EpubError(
      `Invalid date for EPUB metadata: ${field}`,
      "INVALID_METADATA",
    )
  }

  return date.toISOString().replace(/\.\d{3}Z$/, "Z")
}