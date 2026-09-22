import { randomUUID } from "node:crypto"

import { AssetReferenceType } from "@mythrart/database"
import { NextRequest } from "next/server"

import prisma from "../../helpers/prisma"
import { createUserFixture } from "../../helpers/factories"
import resetDb from "../../helpers/reset-db"

export type AnalysisSynopsisFixture = {
    userId: string
    outsiderId: string
    assetId: string
}

export function analysisSynopsisRequest(options: {
    userId?: string
    body: Record<string, unknown>
}): NextRequest {
    return new NextRequest(
        "http://localhost:3000/api/analysis-synopsis",
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
                ...(options.userId
                    ? { "x-auth-user-id": options.userId }
                    : {}),
            },
            body: JSON.stringify(options.body),
        },
    )
}

export async function setupAnalysisSynopsisFixture(): Promise<AnalysisSynopsisFixture> {
    await resetDb()

    const user = await createUserFixture()
    const outsider = await createUserFixture()

    const asset = await prisma.asset.create({
        data: {
            ownerId: user.id,
            key: `fixtures/analysis-synopsis/${randomUUID()}.txt`,
            bucket: process.env.S3_BUCKET ?? "test",
            fileName: "synopsis.txt",
            mimeType: "text/plain",
            sizeBytes: 100
        },
    })

    return {
        userId: user.id,
        outsiderId: outsider.id,
        assetId: asset.id,
    }
}

export async function teardownAnalysisSynopsisFixture() {
    await resetDb()
}