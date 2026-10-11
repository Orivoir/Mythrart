import type { EpubAsset, EpubBook } from "../types"
import { EpubError } from "../errors"
import { normalizeText } from "../utils/normalize-text"
import { validateAsset } from "../utils/validate-asset"
import type { EpubResource } from "../types"

/**
 * Prepares the book's binary image resources for the EPUB archive.
 *
 * The cover is included separately. An asset with the same filename
 * as the cover is not added twice, matching the OPF manifest logic.
 */
export function createEpubResources(
  book: Pick<EpubBook, "coverImage" | "assets">,
): EpubResource[] {
  const resources: EpubResource[] = []
  const seenPaths = new Set<string>()
  const seenIds = new Set<string>()

  const coverFileName = book.coverImage
    ? normalizeText(book.coverImage.fileName)
    : undefined

  const assets = [
    ...(book.coverImage ? [book.coverImage] : []),
    ...book.assets,
  ]

  for (const asset of assets) {
    const id = normalizeText(asset.id)
    const fileName = normalizeText(asset.fileName)

    if (seenIds.has(id)) {
      throw new EpubError(
        `Duplicate EPUB asset ID: ${id}`,
        "INVALID_ASSET",
      )
    }

    seenIds.add(id)

    const resource = validateAsset(asset)

    // The OPF manifest already treats the cover as a separate item.
    if (
      asset !== book.coverImage &&
      coverFileName &&
      fileName === coverFileName
    ) {
      continue
    }

    if (seenPaths.has(resource.path)) {
      throw new EpubError(
        `Duplicate EPUB resource path: ${resource.path}`,
        "INVALID_ASSET",
      )
    }

    seenPaths.add(resource.path)
    resources.push(resource)
  }

  return resources
}
