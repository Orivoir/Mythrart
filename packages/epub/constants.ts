export const OCF_CONTAINER_NAMESPACE =
  "urn:oasis:names:tc:opendocument:xmlns:container"

export const PACKAGE_DOCUMENT_PATH = "OEBPS/content.opf"
export const PACKAGE_MEDIA_TYPE = "application/oebps-package+xml"

export const XHTML_NAMESPACE = "http://www.w3.org/1999/xhtml"
export const EPUB_NAMESPACE = "http://www.idpf.org/2007/ops"

export const OPF_NAMESPACE = "http://www.idpf.org/2007/opf"
export const DC_NAMESPACE = "http://purl.org/dc/elements/1.1/"
export const DCTERMS_NAMESPACE = "http://purl.org/dc/terms/"

export const DC_IDENTIFIER = "pub-id"

export const ISBN_ONIX_SCHEME = "onix:codelist5"
export const ISBN_13_CODE = "15"

export const EPUB_MIMETYPE = "application/epub+zip"
export const MIMETYPE_FILE = "mimetype"

export const IMAGE_MEDIA_TYPES_BY_EXTENSION = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
} as const

export const SUPPORTED_IMAGE_MEDIA_TYPES = new Set<string>(
  Object.values(IMAGE_MEDIA_TYPES_BY_EXTENSION),
)