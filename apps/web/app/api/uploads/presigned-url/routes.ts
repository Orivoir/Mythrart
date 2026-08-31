import { NextResponse } from "next/server"
import { getAuthenticatedUserIdFromHeaders } from "@/lib/auth"
import { ApiException } from "@/lib/errors/api-exception"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { canUploadFile } from "@/lib/authorization"
import { CreateUploadRequest } from "@/app/types/api/upload"
import { createUploadHandshake } from "@/lib/upload-handshake"

export async function POST(request: Request) {
  const userId = getAuthenticatedUserIdFromHeaders(request.headers)

  if (!userId) {
    throw new ApiException(HTTP_ERRORS.UNAUTHORIZED)
  }

  const { fileName, mimeType, context, size } = await request.json() as CreateUploadRequest

  const canUpload = await canUploadFile({
    size,
    userId,
    context,
    fileName,
    mimeType
  })
  
  if(!canUpload) {
    throw new ApiException(HTTP_ERRORS.PAYMENT_REQUIRED)
  } else {
    const results = await createUploadHandshake({
      userId,
      fileName,
      mimeType,
      context,
      size
    })
  
    return NextResponse.json(results)
  }

}
