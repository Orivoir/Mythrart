import { GetObjectCommand, s3 } from "@mythrart/s3"
import type { NormalizedEbook } from "./normalize.js"
import {getAssetsById} from "./get-asset-by-id.js"

export function createImageDataUrlResolver(ebook: NormalizedEbook) {
  const assetsById = getAssetsById(ebook)
  const dataUrlsByAssetId = new Map<string, Promise<string>>()

  return async (assetId: string): Promise<string | undefined> => {
    const asset = assetsById.get(assetId)

    if (!asset) {
      return undefined
    }

    let dataUrl = dataUrlsByAssetId.get(assetId)

    if (!dataUrl) {
      dataUrl = s3.send(new GetObjectCommand({ Bucket: asset.bucket, Key: asset.key }))
        .then(async (response) => {
          if (!response.Body) {
            throw new Error(`Image asset ${assetId} has no object body`)
          }

          const bytes = await response.Body.transformToByteArray()
          const mimeType = response.ContentType ?? "application/octet-stream"

          return `data:${mimeType};base64,${Buffer.from(bytes).toString("base64")}`
        })
      dataUrlsByAssetId.set(assetId, dataUrl)
    }

    return await dataUrl
  }
}