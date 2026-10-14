import { GetObjectCommand, getSignedUrl, s3 } from "@mythrart/s3"
import type { NormalizedEbook } from "./normalize.js"
import {getAssetsById} from "./get-asset-by-id.js"
import { toInternalS3Url } from "./to-internal-s3.js"

const imageUrlExpirySeconds = 60 * 60 * 24 * 7 // 7 days

export function createImageUrlResolver(
  ebook: NormalizedEbook,
  withInternalPoint = false
) {
  const assetsById = getAssetsById(ebook)
  const urlsByAssetId = new Map<string, Promise<string>>()

  return async (assetId: string): Promise<string | undefined> => {
    const asset = assetsById.get(assetId)

    if (!asset) {
      return undefined
    }

    let url = urlsByAssetId.get(assetId)

    if (!url) {
      url = getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: asset.bucket, Key: asset.key }),
        { expiresIn: imageUrlExpirySeconds },
      )
      urlsByAssetId.set(assetId, url)
    }

    const s3Url = await url

    if(withInternalPoint) {
      return toInternalS3Url(s3Url)
    }

    return s3Url
  }
}
