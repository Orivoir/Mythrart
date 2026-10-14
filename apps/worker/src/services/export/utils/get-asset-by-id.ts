import type { NormalizedEbook } from "./normalize.js";

export function getAssetsById(ebook: NormalizedEbook) {
  const assetsById = new Map(ebook.assets.map((asset) => [asset.id, asset]));

  if (ebook.coverImage) {
    assetsById.set(ebook.coverImage.assetId, {
      id: ebook.coverImage.assetId,
      key: ebook.coverImage.key,
      bucket: ebook.coverImage.bucket,
    });
  }

  return assetsById;
}
