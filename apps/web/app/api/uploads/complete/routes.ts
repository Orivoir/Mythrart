import { NextResponse } from "next/server"
import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { ApiException } from "@/lib/errors/api-exception"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { CompleteUploadRequest } from "@/app/types/api/upload"
import { apiUploadException } from "@/lib/errors/api-upload-exception"
import { completeUploadHandshake } from "@/lib/upload-handshake"

export async function POST(request: Request) {
  const userId = getAuthenticatedUserIdFromHeaders(request.headers)
  if (!userId) {
    throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
  }

  const { uploadHandshakeId } = await request.json() as CompleteUploadRequest

  try {
    const { assetId, permanentKey } = await completeUploadHandshake({
      uploadHandshakeId,
      userId,
    })

    return NextResponse.json({ success: true, assetId, permanentKey })
  } catch (error) {
    if (error instanceof ApiException) {
      throw error
    }

    const message = error instanceof Error ? error.message : "Unknown error during upload validation"
    throw apiUploadException(message)
  }
}
