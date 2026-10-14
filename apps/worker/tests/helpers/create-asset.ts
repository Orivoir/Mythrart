import { prisma } from "@mythrart/database";

export interface CreateAssetParams {
  ownerId: string;
  key: string;
  bucket: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export default async function createAsset(params: CreateAssetParams) {
  return prisma.asset.create({
    data: {
      ownerId: params.ownerId,
      key: params.key,
      bucket: params.bucket,
      fileName: params.fileName,
      mimeType: params.mimeType,
      sizeBytes: params.sizeBytes,
    },
  });
}
