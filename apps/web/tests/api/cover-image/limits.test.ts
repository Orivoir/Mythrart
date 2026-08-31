import { afterAll, afterEach, beforeEach, describe, expect, test } from "vitest"

import { POST as createPresignedUploadUrl } from "@/app/api/uploads/presigned-url/routes"
import { createProUserFixture, createPremiumUserFixture, createUserFixture } from "../../helpers/factories"
import { ApiException } from "@/lib/errors/api-exception"
import { HTTP_ERRORS } from "@/lib/constants/http-code"
import { PLANS } from "@/lib/constants/plan"

import {
    cleanupUploadedKeys,
    runIfS3Configured,
    setupUploadFixture,
    teardownUploadFixture,
    createPresignedUrlRequest,
    type PresignedUploadResponse,
} from "./shared"

const runDescribe = runIfS3Configured ? describe : describe.skip

runDescribe("POST /api/uploads/presigned-url limits", () => {
    let bucket = ""
    const uploadedKeys: string[] = []

    beforeEach(async () => {
        const fixture = await setupUploadFixture()
        bucket = fixture.bucket
    })

    afterEach(async () => {
        await cleanupUploadedKeys(bucket, uploadedKeys)
    })

    afterAll(async () => {
        await teardownUploadFixture()
    })

    test.each([
        ["FREE", PLANS.FREE.limits.maxUploadSizeBytes, async () => createUserFixture()],
        ["PREMIUM", PLANS.PREMIUM.limits.maxUploadSizeBytes, createPremiumUserFixture],
        ["PRO", PLANS.PRO.limits.maxUploadSizeBytes, createProUserFixture],
    ])("returns 200 for %s plan when file size is within max upload limit", async (_plan, allowedSize, createPlanUser) => {
        const planUser = await createPlanUser()

        const response = await createPresignedUploadUrl(createPresignedUrlRequest(planUser.id, {
            fileName: "cover.png",
            mimeType: "image/png",
            context: "COVER",
            size: allowedSize,
        }))
        const body = await response.json() as PresignedUploadResponse

        expect(response.status).toBe(200)
        expect(body.uploadUrl).toMatch(/^https?:\/\//)
        expect(body.uploadHandshakeId).toBeTruthy()
    })

    test.each([
        ["FREE", PLANS.FREE.limits.maxUploadSizeBytes + 1, async () => createUserFixture()],
        ["PREMIUM", PLANS.PREMIUM.limits.maxUploadSizeBytes + 1, createPremiumUserFixture],
        ["PRO", PLANS.PRO.limits.maxUploadSizeBytes + 1, createProUserFixture],
    ])("returns payment-required for %s plan when file size exceeds max upload limit", async (_plan, exceededSize, createPlanUser) => {
        const planUser = await createPlanUser()

        const uploadRequest = createPresignedUploadUrl(createPresignedUrlRequest(planUser.id, {
            fileName: "cover.png",
            mimeType: "image/png",
            context: "COVER",
            size: exceededSize,
        }))

        await expect(uploadRequest).rejects.toBeInstanceOf(ApiException)
        await expect(uploadRequest).rejects.toMatchObject({
            status: HTTP_ERRORS.PAYMENT_REQUIRED.status,
            code: HTTP_ERRORS.PAYMENT_REQUIRED.code,
        })
    })
})
