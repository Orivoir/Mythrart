import { prisma } from "@mythrart/database"
import type { Prisma } from "@mythrart/database"
import { GetObjectCommand, s3 } from "@mythrart/s3"
import { z } from "zod"
import type { ExportSource } from "./normalize.js"

const assetSchema = z.object({
  assetId: z.string().min(1),
  key: z.string().trim().min(1),
  bucket: z.string().trim().min(1),
})

// Mirrors the JSON written by services/snapshot/snapshot.ts (formatVersion 1).
const snapshotPayloadSchema = z.object({
  formatVersion: z.literal(1),
  ebook: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().nullable(),
    shortDescription: z.string().nullable(),
    createdAt: z.coerce.date(),
    coverImage: assetSchema.nullable(),
  }),
  chapters: z.array(z.object({
    id: z.string(),
    title: z.string(),
    position: z.number(),
    createdAt: z.coerce.date(),
    locales: z.array(z.object({
      locale: z.string(),
      title: z.string().nullable(),
      content: z.unknown(),
    })),
    assets: z.array(assetSchema),
  })),
})

export async function loadSnapshotSource(ebookId: string, snapshotId: string): Promise<ExportSource> {
  const snapshot = await prisma.snapshot.findUnique({
    where: { id: snapshotId },
    include: { file: true },
  })

  if (!snapshot) {
    throw new Error(`Snapshot ${snapshotId} not found`)
  }

  if (snapshot.ebookId !== ebookId) {
    throw new Error(`Snapshot ${snapshotId} does not belong to ebook ${ebookId}`)
  }

  if (snapshot.status !== "READY") {
    throw new Error(`Snapshot ${snapshotId} is not ready (status: ${snapshot.status})`)
  }

  if (!snapshot.file) {
    throw new Error(`Snapshot ${snapshotId} has no file`)
  }

  const response = await s3.send(
    new GetObjectCommand({ Bucket: snapshot.file.bucket, Key: snapshot.file.key }),
  )
  const body = await response.Body?.transformToString()

  if (!body) {
    throw new Error(`Snapshot ${snapshotId} file is empty`)
  }

  const payload = snapshotPayloadSchema.parse(JSON.parse(body))

  if (payload.ebook.id !== ebookId) {
    throw new Error(`Snapshot ${snapshotId} content does not belong to ebook ${ebookId}`)
  }

  const toAsset = ({ assetId, key, bucket }: z.infer<typeof assetSchema>) => ({ id: assetId, key, bucket })

  const { coverImage, ...ebook } = payload.ebook

  return {
    ...ebook,
    coverAsset: coverImage ? toAsset(coverImage) : null,
    chapters: [...payload.chapters]
      .sort((a, b) => a.position - b.position)
      .map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        position: chapter.position,
        createdAt: chapter.createdAt,
        locales: chapter.locales.map((entry) => ({
          locale: entry.locale,
          title: entry.title,
          content: (entry.content ?? null) as Prisma.JsonValue,
        })),
        assetReferences: chapter.assets.map((asset) => ({ asset: toAsset(asset) })),
      })),
  }
}
