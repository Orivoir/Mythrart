import { NextRequest } from "next/server"
import {s3, CreateBucketCommand, DeleteObjectCommand, HeadBucketCommand } from "@mythrart/s3"
import { expect } from "vitest"

import { createUserFixture } from "../../helpers/factories"
import prisma from "../../helpers/prisma"
import resetDb from "../../helpers/reset-db"
import { type UploadHandshakeStatus } from "@mythrart/database"

export interface PresignedUploadResponse {
    uploadHandshakeId: string
    uploadUrl: string
    expiresIn: number
}

export interface CompleteUploadResponse {
    success: boolean
    assetId: string
    permanentKey: string
}

export interface CoverImageReferenceResponse {
    success: boolean
    asset: {
        id: string
        key: string
        bucket: string
        mimeType: string
        sizeBytes: number
        fileName: string
        createdAt: string
        updatedAt: string
    }
}

const hasS3Config = Boolean(
    process.env.S3_ENDPOINT
    && process.env.S3_REGION
    && process.env.S3_ACCESS_KEY
    && process.env.S3_SECRET_KEY
    && process.env.S3_BUCKET,
)

export const runIfS3Configured = hasS3Config

export async function ensureBucketExists(bucket: string): Promise<void> {
    try {
        await s3.send(new HeadBucketCommand({ Bucket: bucket }))
        return
    } catch {
        await s3.send(new CreateBucketCommand({ Bucket: bucket }))
    }

    await s3.send(new HeadBucketCommand({ Bucket: bucket }))
}

export async function setupUploadFixture() {
    await resetDb()

    const bucket = process.env.S3_BUCKET
    if (!bucket) {
        throw new Error("S3_BUCKET is required for this integration test")
    }

    await ensureBucketExists(bucket)

    const user = await createUserFixture()
    const ebook = await prisma.ebook.create({
        data: {
            title: "Ebook cover upload",
            ownerId: user.id,
        },
    })

    return {
        userId: user.id,
        ebookId: ebook.id,
        bucket,
    }
}

export async function teardownUploadFixture() {
    await resetDb()
}

export async function cleanupUploadedKeys(bucket: string, uploadedKeys: string[]) {
    while (uploadedKeys.length > 0) {
        const key = uploadedKeys.pop()

        if (!key) {
            continue
        }

        try {
            await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
        } catch {
            // Best-effort cleanup for integration artifacts.
        }
    }
}

export function createPresignedUrlRequest(userId: string, body: {
    fileName: string
    mimeType: string
    context: "COVER"
    size: number
}) {
    return new NextRequest("http://localhost:3000/api/uploads/presigned-url", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-auth-user-id": userId,
        },
        body: JSON.stringify(body),
    })
}

export function createCompleteUploadRequest(userId: string, body: {
    uploadHandshakeId: string
}) {
    return new NextRequest("http://localhost:3000/api/uploads/complete", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-auth-user-id": userId,
        },
        body: JSON.stringify(body),
    })
}

export async function getUploadHandshake(uploadHandshakeId: string) {
    return prisma.uploadHandshake.findUniqueOrThrow({
        where: { id: uploadHandshakeId },
    })
}

export async function expectUploadHandshakeStatus(uploadHandshakeId: string, status: UploadHandshakeStatus) {
    const handshake = await getUploadHandshake(uploadHandshakeId)
    expect(handshake.status).toBe(status)
    return handshake
}

export function createCoverReferenceRequest(userId: string, assetId: string) {
    return new NextRequest("http://localhost:3000/api/uploads/reference/cover-image", {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            "x-auth-user-id": userId,
        },
        body: JSON.stringify({
            assetId,
        }),
    })
}
