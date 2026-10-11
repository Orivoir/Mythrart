
import type { JSONContent } from "@tiptap/core"
import type { EpubAsset } from "../../types"
import { EpubError } from "../../errors"
import { escapeXml } from "../../utils/escape-xml"
import { createImageHref } from "../../utils/image-href"
import { normalizeText } from "../../utils/normalize-text"

/**
 * Core image media types supported by EPUB 3.3.
 * Other media types require an appropriate fallback in the EPUB manifest.
 */
const CORE_IMAGE_MEDIA_TYPES = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
])

/**
 * @description Generates XHTML for an image referencing an internal EPUB asset.
 * The image must already exist in the EPUB assets collection.
 *
 * Chapter documents are stored in OEBPS/chapters/, while images are stored
 * in OEBPS/images/. The generated src is therefore relative to the chapter.
 *
 * @see https://www.w3.org/TR/epub-33/#sec-fallbacks-img
 * @param node The TipTap JSONContent image node.
 * @param assets The EPUB assets available to the renderer.
 * @returns The XHTML representation of the image.
 * @throws EpubError if the node or referenced asset is invalid.
 */
export function renderImage(
  node: JSONContent,
  assets: readonly EpubAsset[],
): string {
  const attrs = node.attrs

  if (node.type !== "image" || !attrs) {
    throw new EpubError(
      "Invalid TipTap image node",
      "INVALID_ASSET",
    )
  }

  if (typeof attrs.assetId !== "string") {
    throw new EpubError(
      "Missing assetId on TipTap image node",
      "ASSET_NOT_FOUND",
    )
  }

  const assetId = normalizeText(attrs.assetId)

  if (!assetId) {
    throw new EpubError(
      "Missing assetId on TipTap image node",
      "ASSET_NOT_FOUND",
    )
  }

  const asset = assets.find((candidate) => candidate.id === assetId)

  if (!asset) {
    throw new EpubError(
      `EPUB asset not found: ${assetId}`,
      "ASSET_NOT_FOUND",
    )
  }

  const fileName = normalizeText(asset.fileName)

  if (!fileName) {
    throw new EpubError(
      `Invalid filename for EPUB asset: ${assetId}`,
      "INVALID_ASSET",
    )
  }

  const mimeType = normalizeText(asset.mimeType).toLowerCase()

  if (!CORE_IMAGE_MEDIA_TYPES.has(mimeType)) {
    throw new EpubError(
      `Unsupported image media type: ${mimeType}`,
      "INVALID_ASSET",
    )
  }

  // createImageHref returns "images/<encoded filename>".
  // Chapter XHTML lives one directory below OEBPS/images/.
  const src = `../${createImageHref(fileName)}`

  // An empty alt is valid for decorative images. Informative images
  // should have meaningful alternative text supplied by the editor.
  const alt = typeof attrs.alt === "string" ? attrs.alt : ""
  const title = typeof attrs.title === "string" ? attrs.title : undefined

  const titleAttribute =
    title !== undefined ? ` title="${escapeXml(title)}"` : ""

  return `<img src="${escapeXml(src)}" alt="${escapeXml(alt)}"${titleAttribute} />`
}
