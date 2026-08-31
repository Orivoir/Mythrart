import { NextResponse } from "next/server"
import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { ApiException } from "@/lib/errors/api-exception"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { apiUploadException } from "@/lib/errors/api-upload-exception"
import { prisma } from "@mythrart/database"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const userId = getAuthenticatedUserIdFromHeaders(request.headers)

  if (!userId) {
    throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
  }

  const { assetId } = (await request.json()) as {
    assetId: string;
  }

  const addReferenceUpload = await prisma.$transaction(async (tx) => {
    const assetCoverImage = await tx.asset.findUnique({
      where: {
        id: assetId,
        ownerId: userId,
      },
    })

    if (!assetCoverImage) {
      throw apiUploadException("The provided asset does not correspond to a valid uploaded object.")
    }

    const ebookUpdated = await tx.ebook.update({
      where: { id: params.id, ownerId: userId },
      data: { coverAssetId: assetCoverImage.id },
    })

    return { assetCoverImage, ebookUpdated }
  })

  if (!addReferenceUpload) {
    throw apiUploadException("Failed to add reference upload.")
  }

  const { assetCoverImage } = addReferenceUpload

  return NextResponse.json({
    success: true,
    asset: {
      id: assetCoverImage.id,
      key: assetCoverImage.key,
      bucket: assetCoverImage.bucket,
      mimeType: assetCoverImage.mimeType,
      sizeBytes: assetCoverImage.sizeBytes,
      fileName: assetCoverImage.fileName,
      createdAt: assetCoverImage.createdAt.toISOString(),
      updatedAt: assetCoverImage.updatedAt.toISOString(),
    },
  })
}
