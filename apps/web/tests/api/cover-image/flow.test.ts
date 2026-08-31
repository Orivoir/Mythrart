import { afterAll, afterEach, beforeEach, describe, expect, test } from "vitest"
import { s3, HeadObjectCommand } from "@mythrart/s3"
import { UploadHandshakeStatus } from "@mythrart/database"

import { POST as createPresignedUploadUrl } from "@/app/api/uploads/presigned-url/routes"
import { POST as completeUpload } from "@/app/api/uploads/complete/routes"
import { PUT as createCoverImageReference } from "@/app/api/uploads/reference/cover-image/routes"
import prisma from "../../helpers/prisma"

import {
    cleanupUploadedKeys,
    createCompleteUploadRequest,
    createCoverReferenceRequest,
    createPresignedUrlRequest,
    expectUploadHandshakeStatus,
    getUploadHandshake,
    runIfS3Configured,
    setupUploadFixture,
    teardownUploadFixture,
    type CompleteUploadResponse,
    type CoverImageReferenceResponse,
    type PresignedUploadResponse,
} from "./shared"

const runDescribe = runIfS3Configured ? describe : describe.skip

runDescribe("cover image upload flow", () => {
    let userId = ""
    let ebookId = ""
    let bucket = ""
    const uploadedKeys: string[] = []

    beforeEach(async () => {
        const fixture = await setupUploadFixture()
        userId = fixture.userId
        ebookId = fixture.ebookId
        bucket = fixture.bucket
    })

    afterEach(async () => {
        await cleanupUploadedKeys(bucket, uploadedKeys)
    })

    afterAll(async () => {
        await teardownUploadFixture()
    })

    test("generates URL, completes upload move, and creates cover image reference", async () => {
        const uploadPayload = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])

        const response = await createPresignedUploadUrl(createPresignedUrlRequest(userId, {
            fileName: "cover.png",
            mimeType: "image/png",
            context: "COVER",
            size: uploadPayload.length,
        }))
        const body = await response.json() as PresignedUploadResponse

        expect(response.status).toBe(200)
        expect(body.uploadUrl).toMatch(/^https?:\/\//)
        expect(body.uploadHandshakeId).toBeTruthy()
        expect(body.expiresIn).toBeGreaterThan(0)

        const handshake = await getUploadHandshake(body.uploadHandshakeId)

        expect(handshake.key).toContain(process.env.S3_TEMP_UPLOAD_PREFIX ?? "temp-upload")
        expect(handshake.fileName).toBe("cover.png")
        expect(handshake.expectedMimeType).toBe("image/png")
        expect(handshake.expectedSizeBytes).toBe(uploadPayload.length)
        expect(handshake.status).toBe(UploadHandshakeStatus.PENDING)

        const uploadResponse = await fetch(body.uploadUrl, {
            method: "PUT",
            headers: {
                "content-type": "image/png",
            },
            body: uploadPayload,
        })

        const uploadErrorBody = uploadResponse.ok ? null : await uploadResponse.text()

        expect(uploadResponse.status).toBeGreaterThanOrEqual(200)
        expect(uploadResponse.status, uploadErrorBody ?? undefined).toBeLessThan(300)

        const headObject = await s3.send(new HeadObjectCommand({
            Bucket: bucket,
            Key: handshake.key,
        }))

        uploadedKeys.push(handshake.key)

        expect(headObject.ContentLength).toBe(uploadPayload.length)
        expect(headObject.ContentType).toBe("image/png")

        const completeResponse = await completeUpload(createCompleteUploadRequest(userId, {
            uploadHandshakeId: body.uploadHandshakeId,
        }))
        const completeBody = await completeResponse.json() as CompleteUploadResponse

        expect(completeResponse.status).toBe(200)
        expect(completeBody.success).toBe(true)
        expect(completeBody.assetId).toBeTruthy()
        expect(completeBody.permanentKey).toContain(`users/${userId}/COVER/`)
        await expectUploadHandshakeStatus(body.uploadHandshakeId, UploadHandshakeStatus.COMPLETED)

        const uploadedAsset = await prisma.asset.findUnique({
            where: { id: completeBody.assetId },
        })

        expect(uploadedAsset).not.toBeNull()
        expect(uploadedAsset?.key).toBe(completeBody.permanentKey)
        expect(uploadedAsset?.fileName).toBe("cover.png")
        expect(uploadedAsset?.mimeType).toBe("image/png")
        expect(uploadedAsset?.sizeBytes).toBe(uploadPayload.length)
        expect(uploadedAsset?.ownerId).toBe(userId)

        uploadedKeys.push(completeBody.permanentKey)

        await expect(s3.send(new HeadObjectCommand({
            Bucket: bucket,
            Key: handshake.key,
        }))).rejects.toBeDefined()

        const headPermanentObject = await s3.send(new HeadObjectCommand({
            Bucket: bucket,
            Key: completeBody.permanentKey,
        }))

        expect(headPermanentObject.ContentLength).toBe(uploadPayload.length)
        expect(headPermanentObject.ContentType).toBe("image/png")

        const referenceResponse = await createCoverImageReference(createCoverReferenceRequest(
            userId,
            completeBody.assetId,
        ), {
            params: { id: ebookId },
        })
        const referenceBody = await referenceResponse.json() as CoverImageReferenceResponse

        expect(referenceResponse.status).toBe(200)
        expect(referenceBody.success).toBe(true)
        expect(referenceBody.asset.key).toBe(completeBody.permanentKey)
        expect(referenceBody.asset.fileName).toBe("cover.png")
        expect(referenceBody.asset.mimeType).toBe("image/png")

        const ebookWithCover = await prisma.ebook.findUnique({
            where: { id: ebookId },
            include: { coverAsset: true },
        })

        expect(ebookWithCover).not.toBeNull()
        expect(ebookWithCover?.coverAssetId).toBe(referenceBody.asset.id)
        expect(ebookWithCover?.coverAsset?.key).toBe(completeBody.permanentKey)
        expect(ebookWithCover?.coverAsset?.ownerId).toBe(userId)
    })

    test.skip("security: should reject multiple uploads with the same URL", async () => {
        // TODO: enable when bucket policy enforces single-use signed URLs.
    })
})
