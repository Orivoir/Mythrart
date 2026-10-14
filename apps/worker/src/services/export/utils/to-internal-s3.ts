export function toInternalS3Url(presignedUrl: string): string {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    return presignedUrl
  }

  const internalEndpoint = process.env.S3_INTERNAL_ENDPOINT

  if (!internalEndpoint) {
    throw new Error("S3_INTERNAL_ENDPOINT is required")
  }

  const url = new URL(presignedUrl)
  const internalUrl = new URL(internalEndpoint)

  url.protocol = internalUrl.protocol
  url.host = internalUrl.host

  return url.toString()
}