import { GetObjectCommand, s3 } from "@mythrart/s3";
import type { EpubAsset } from "@mythrart/epub";
import { loadDefaultCover } from "@mythrart/assets/node";

import type { NormalizedEbook } from "./normalize.js";

export interface LoadedEbookAssets {
  coverImage: EpubAsset | null;
  assets: EpubAsset[];
}

export async function loadEbookAssets(
  ebook: NormalizedEbook,
): Promise<LoadedEbookAssets> {
  const coverAssetId = ebook.coverImage?.assetId;

  const assetsById = new Map<string, NormalizedEbook["assets"][number]>();

  for (const asset of ebook.assets) {
    if (asset.id !== coverAssetId) {
      assetsById.set(asset.id, asset);
    }
  }

  const [coverImage, assets] = await Promise.all([
    ebook.coverImage
      ? loadAsset({
          id: ebook.coverImage.assetId,
          key: ebook.coverImage.key,
          bucket: ebook.coverImage.bucket,
        })
      : loadDefaultCover().then((data): EpubAsset => ({
          id: "mythrart-default-cover",
          fileName: "default_cover_image.png",
          mimeType: "image/png",
          data,
        })),
    Promise.all([...assetsById.values()].map(loadAsset)),
  ]);

  return {
    coverImage,
    assets,
  };
}

async function loadAsset(asset: {
  id: string;
  key: string;
  bucket: string;
}): Promise<EpubAsset> {
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: asset.bucket,
      Key: asset.key,
    }),
  );

  if (!response.Body) {
    throw new Error(`Asset ${asset.id} has no object body in S3`);
  }

  const fileName = asset.key.split("/").pop();

  if (!fileName) {
    throw new Error(`Asset ${asset.id} has an invalid S3 key`);
  }

  return {
    id: asset.id,
    fileName,
    mimeType: response.ContentType ?? "application/octet-stream",
    data: Buffer.from(await response.Body.transformToByteArray()),
  };
}
