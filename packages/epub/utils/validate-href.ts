import { EpubError } from "../errors"

export function validateHref(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new EpubError(
      "Missing or invalid href on EPUB link",
      "UNSUPPORTED_CONTENT",
    )
  }

  const href = value.trim()

  // Refuse les caractères de contrôle, les espaces et les antislashs.
  if (/[\u0000-\u0020\u007f\\]/.test(href)) {
    throw new EpubError(
      "Invalid href on EPUB link",
      "UNSUPPORTED_CONTENT",
    )
  }

  const schemeMatch = href.match(/^([a-z][a-z\d+.-]*):/i)

  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase()

    if (!["https", "http", "mailto", "tel"].includes(scheme)) {
      throw new EpubError(
        `Unsupported EPUB link protocol: ${scheme}`,
        "UNSUPPORTED_CONTENT",
      )
    }
  }

  return href
}