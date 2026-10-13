import { GetObjectCommand, getSignedUrl, s3 } from "@mythrart/s3"
import type { NormalizedEbook } from "./normalize.js"

const imageUrlExpirySeconds = 60 * 60 * 24 * 7 // 7 days

export function createImageUrlResolver(ebook: NormalizedEbook) {
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

    return await url
  }
}

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

function getAssetsById(ebook: NormalizedEbook) {
  const assetsById = new Map(ebook.assets.map((asset) => [asset.id, asset]))

  if (ebook.coverImage) {
    assetsById.set(ebook.coverImage.assetId, {
      id: ebook.coverImage.assetId,
      key: ebook.coverImage.key,
      bucket: ebook.coverImage.bucket,
    })
  }

  return assetsById
}