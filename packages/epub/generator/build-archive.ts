import JSZip from "jszip"
import { EpubError } from "../errors"
import { EPUB_MIMETYPE, MIMETYPE_FILE } from "../constants"
import type { EpubArchiveFile } from "../types"
import { validateArchivePath } from "../utils/validate-archive-path"

/**
 * Builds an EPUB ZIP archive.
 *
 * The required "mimetype" entry is inserted first and stored
 * without compression. All remaining files use DEFLATE.
 *
 * Directory entries are not explicitly created: EPUB readers
 * identify files by their paths inside the ZIP archive.
 */
export async function buildEpubArchive(
  files: readonly EpubArchiveFile[],
): Promise<Uint8Array> {
  if (!Array.isArray(files)) {
    throw new EpubError(
      "Invalid EPUB archive files",
      "INVALID_BOOK",
    )
  }

  const zip = new JSZip()
  const seenPaths = new Set<string>([MIMETYPE_FILE])

  // EPUB requires this exact entry first and without compression.
  zip.file(MIMETYPE_FILE, EPUB_MIMETYPE, {
    compression: "STORE",
    createFolders: false,
  })

  for (const file of files) {
    if (
      !file ||
      typeof file.path !== "string" ||
      !(
        typeof file.data === "string" ||
        file.data instanceof Uint8Array
      )
    ) {
      throw new EpubError(
        "Invalid EPUB archive file entry",
        "INVALID_BOOK",
      )
    }

    validateArchivePath(file.path)

    if (seenPaths.has(file.path)) {
      throw new EpubError(
        `Duplicate EPUB archive path: ${file.path}`,
        "INVALID_BOOK",
      )
    }

    seenPaths.add(file.path)

    zip.file(file.path, file.data, {
      createFolders: false,
    })
  }

  return zip.generateAsync({
    type: "uint8array",
    mimeType: EPUB_MIMETYPE,
    compression: "DEFLATE",
    compressionOptions: {
      level: 6,
    },
    platform: "UNIX",
  })
}
