import { EpubError } from "../errors"
import { MIMETYPE_FILE } from "../constants"

/**
 * Validates an archive entry path.
 *
 * Paths are relative to the archive root and use forward slashes.
 */
export function validateArchivePath(path: string): void {
  if (
    !path ||
    path.startsWith("/") ||
    path.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(path)
  ) {
    throw new EpubError(
      `Invalid EPUB archive path: ${path}`,
      "INVALID_BOOK",
    )
  }

  const segments = path.split("/")

  if (
    segments.some(
      (segment) =>
        !segment || segment === "." || segment === "..",
    )
  ) {
    throw new EpubError(
      `Invalid EPUB archive path: ${path}`,
      "INVALID_BOOK",
    )
  }

  if (path === MIMETYPE_FILE) {
    throw new EpubError(
      'The "mimetype" file is managed by the EPUB archive builder',
      "INVALID_BOOK",
    )
  }
}
