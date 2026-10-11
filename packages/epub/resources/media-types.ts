import { IMAGE_MEDIA_TYPES_BY_EXTENSION, SUPPORTED_IMAGE_MEDIA_TYPES } from "../constants"

export type EpubImageMediaType =
  (typeof IMAGE_MEDIA_TYPES_BY_EXTENSION)[keyof typeof IMAGE_MEDIA_TYPES_BY_EXTENSION]

export function isSupportedImageMediaType(
  mimeType: string,
): mimeType is EpubImageMediaType {
  return SUPPORTED_IMAGE_MEDIA_TYPES.has(mimeType)
}

export function getImageMediaTypeFromFileName(
  fileName: string,
): EpubImageMediaType | undefined {
  const extension = fileName
    .slice(fileName.lastIndexOf("."))
    .toLowerCase()

  return IMAGE_MEDIA_TYPES_BY_EXTENSION[
    extension as keyof typeof IMAGE_MEDIA_TYPES_BY_EXTENSION
  ]
}
