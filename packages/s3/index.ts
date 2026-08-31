import { S3Client } from "@aws-sdk/client-s3"
import { PutObjectCommand, HeadObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import path from "path"
import { randomUUID } from "crypto"
import type { AssetReferenceType } from "@mythrart/database"

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  // Custom endpoints (for example MinIO on localhost) need path-style URLs
  // in all environments, including tests.
  // forcePathStyle: Boolean(process.env.S3_ENDPOINT) || process.env.NODE_ENV === "development",
  forcePathStyle: true
})


export interface S3PresignedUrlOptions {
  fileName: string;
  mimeType: string;
  context: AssetReferenceType;
  size: number;
  expiresIn?: number;
}

export interface S3PresignedUrlResponse {
  uploadUrl: string;
  expiresIn: number;
}

export interface S3ValidateObjectUploadOptions {
  key: string;
  expectedMimeType: string;
  expectedSizeBytes: number;
}

export interface S3ValidateObjectUploadResponse {
  success: boolean;
  error?: string
}

export function generateTempUploadKey({ context, fileName }: Pick<S3PresignedUrlOptions, "context" | "fileName">): string {
  const extension = path.extname(fileName)

  return `${process.env.S3_TEMP_UPLOAD_PREFIX!}/${context}/${randomUUID()}${extension}`
}

export async function generatePresignedUrl({ key, mimeType, expiresIn = 3600 }: { key: string, mimeType: string, expiresIn?: number }): Promise<S3PresignedUrlResponse> {

  const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: mimeType,
  })

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn })

  return {
    uploadUrl,
    expiresIn
  }
}

export async function validateObjectUpload({ key, expectedMimeType, expectedSizeBytes }: S3ValidateObjectUploadOptions): Promise<S3ValidateObjectUploadResponse> {

  if (!key.startsWith(process.env.S3_TEMP_UPLOAD_PREFIX!)) {
    return {
      success: false,
      error: "Invalid upload key."
    }
  }

  let tempFileMetadata

  try {
    tempFileMetadata = await s3.send(new HeadObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key
    }))
  } catch {
    return {
      success: false,
      error: "Uploaded object does not exist"
    }
  }

  if(tempFileMetadata.ContentType !== expectedMimeType) {
    return {
      success: false,
      error: "MIME type does not match" // or file not exists
    }
  }

  // ContentLength and browser file size exposed value as brute octets
  // but if browser a zipped the file before upload or Worker process the file (like compact image, resize, etc...)
  // the size will be different, in the future this endpoint should be deleted instead of
  // S3 Event notification system (webhooks listeners), which will be more reliable and secure.
  if(tempFileMetadata.ContentLength !== expectedSizeBytes) {
    return {
      success: false,
      error: "File size does not match"
    }
  }

  // Additional checks for context and fileName can be added here

  return {
    success: true
  }
}

export async function moveObjectToPermanentLocation({ key, context, fileName, userId }: { key: string, context: AssetReferenceType, fileName: string, userId: string }) {

  const extension = path.extname(fileName || key)

  const keyPermanent = `users/${userId}/${context}/${randomUUID()}${extension}`

  await s3.send(new CopyObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    CopySource: `${process.env.S3_BUCKET}/${key}`,
    Key: keyPermanent
  }))

  await s3.send(new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key
  }))

  return keyPermanent
}

export async function isValidPermanentObject({ key }: { key: string}): Promise<{isValid:boolean, mimeType?: string, sizeBytes?: number}> {

  const tempFileMetadata = await s3.send(new HeadObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key
  }))

  if (key.startsWith(process.env.S3_TEMP_UPLOAD_PREFIX!)) {
    return {isValid: false}
  }
  if(!tempFileMetadata.ContentType || !tempFileMetadata.ContentLength) {
    return {isValid: false}
  }

  return {
    isValid: true,
    mimeType: tempFileMetadata.ContentType,
    sizeBytes: tempFileMetadata.ContentLength
  }
}

export {getSignedUrl} from "@aws-sdk/s3-request-presigner"
export * from "@aws-sdk/client-s3"