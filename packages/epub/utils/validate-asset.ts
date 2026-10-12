import type { EpubAsset, EpubResource } from "../types"
import { EpubError } from "../errors"
import { normalizeText } from "./normalize-text"
import { isSupportedImageMediaType } from "../resources/media-types"

export function validateAsset(asset: EpubAsset): EpubResource {
  const id = normalizeText(asset.id)
  const fileName = normalizeText(asset.fileName)
  const mimeType = normalizeText(asset.mimeType)

  if (!id) {
    throw new EpubError("Invalid EPUB asset ID", "INVALID_ASSET")
  }

  if (
    !fileName ||
    fileName === "." ||
    fileName === ".." ||
    /[/\\\u0000-\u001f\u007f]/.test(fileName)
  ) {
    throw new EpubError(
      `Invalid EPUB asset filename: ${asset.fileName}`,
      "INVALID_ASSET",
    )
  }

  if (!isSupportedImageMediaType(mimeType)) {
    throw new EpubError(
      `Unsupported EPUB image media type: ${mimeType}`,
      "INVALID_ASSET",
    )
  }

  if (!(asset.data instanceof Uint8Array)) {
    throw new EpubError(`Invalid EPUB asset data: ${fileName}`, "INVALID_ASSET")
  }

  return {
    path: `OEBPS/images/${fileName}`,
    data: asset.data,
    mimeType,
  }
}
