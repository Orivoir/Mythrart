export type EpubErrorCode =
  | "INVALID_BOOK"
  | "INVALID_METADATA"
  | "UNSUPPORTED_CONTENT"
  | "ASSET_NOT_FOUND"
  | "INVALID_ASSET"
  | "GENERATION_FAILED"

export class EpubError extends Error {
  readonly code: EpubErrorCode

  constructor(
    message: string,
    code: EpubErrorCode,
    options?: ErrorOptions,
  ) {
    super(message, options)

    this.name = "EpubError"
    this.code = code
  }
}