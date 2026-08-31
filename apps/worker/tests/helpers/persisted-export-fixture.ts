import { prisma, type Prisma } from "@mythrart/database"
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  s3,
} from "@mythrart/s3"
import type { JSONContent } from "@mythrart/editor-extensions"
import normalizeExportData from "../../src/services/export/normalize.js"
import { loadRequirements } from "../../src/services/utils.js"
import {
  tipTapAssetFixtures,
  tipTapChapterFixtures,
  tipTapEbookFixture,
} from "../fixtures/index.js"

const createdObjectKeys = new Set<string>()

export function getIntegrationBucketName(): string {
  const bucket = process.env.S3_BUCKET

  if (!bucket) {
    throw new Error("S3_BUCKET must be configured for integration tests")
  }

  return bucket
}

export async function ensureIntegrationBucket(bucket: string): Promise<void> {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }))
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: bucket }))
  }
}

export async function createPersistedExportFixture(
  emailPrefix: string,
  coverAssetMatchesChapterImage = true,
) {
  const bucket = getIntegrationBucketName()
  const owner = await prisma.user.create({
    data: { email: `${emailPrefix}owner@example.test`, name: "Export Test Owner" },
  })
  const assetIds = new Map<string, string>()
  const assets = new Map<string, { id: string; key: string }>()

  for (const [index, fixtureAsset] of tipTapAssetFixtures.entries()) {
    const asset = await createAsset(owner.id, fixtureAsset.fileName, fixtureAsset.mimeType, index + 1)
    assetIds.set(fixtureAsset.id, asset.id)
    assets.set(fixtureAsset.id, asset)
  }

  const coverAsset = coverAssetMatchesChapterImage
    ? assets.get(tipTapAssetFixtures[0].id)
    : await createAsset(owner.id, "standalone-cover.png", "image/png", 4)

  if (!coverAsset) {
    throw new Error("Cover asset was not created")
  }

  const ebook = await prisma.ebook.create({
    data: {
      ownerId: owner.id,
      title: tipTapEbookFixture.title,
      subtitle: tipTapEbookFixture.subtitle,
      coverAssetId: coverAsset.id,
    },
  })

  for (const fixtureChapter of tipTapChapterFixtures) {
    const chapter = await prisma.chapter.create({
      data: {
        ebookId: ebook.id,
        title: fixtureChapter.title,
        position: fixtureChapter.position,
        locales: {
          create: {
            locale: "en",
            title: fixtureChapter.title,
            content: replaceImageAssetIds(fixtureChapter.content, assetIds) as Prisma.InputJsonValue,
          },
        },
      },
    })
    const assetId = assetIds.get(tipTapAssetFixtures[fixtureChapter.position].id)

    if (!assetId) {
      throw new Error("Chapter image asset was not created")
    }

    await prisma.chapterAssetReference.create({
      data: { chapterId: chapter.id, assetId, type: "CONTENT_IMAGE" },
    })
  }

  return { ebookId: ebook.id, coverAssetId: coverAsset.id }
}

export async function loadNormalizedPersistedEbook(ebookId: string) {
  return normalizeExportData(await loadRequirements(ebookId, "with-content-assets"))
}

export async function deletePersistedExportFixtures(emailPrefix: string): Promise<void> {
  const bucket = getIntegrationBucketName()
  const owners = await prisma.user.findMany({
    where: { email: { startsWith: emailPrefix } },
    select: { id: true },
  })
  const ownerIds = owners.map((owner) => owner.id)

  if (ownerIds.length > 0) {
    const ebooks = await prisma.ebook.findMany({
      where: { ownerId: { in: ownerIds } }, select: { id: true },
    })
    await prisma.chapter.deleteMany({ where: { ebookId: { in: ebooks.map((ebook) => ebook.id) } } })
    await prisma.ebook.deleteMany({ where: { id: { in: ebooks.map((ebook) => ebook.id) } } })
    await prisma.asset.deleteMany({ where: { ownerId: { in: ownerIds } } })
    await prisma.user.deleteMany({ where: { id: { in: ownerIds } } })
  }

  for (const key of createdObjectKeys) {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
  }
  createdObjectKeys.clear()
}

async function createAsset(ownerId: string, fileName: string, mimeType: string, index: number) {
  const bucket = getIntegrationBucketName()
  const format = mimeType === "image/png" ? "png" : "jpeg"
  const response = await fetch(`https://placehold.co/640x480.${format}?text=Export+${index}`)

  if (!response.ok) {
    throw new Error(`Unable to download placeholder image: ${response.status}`)
  }

  const body = Buffer.from(await response.arrayBuffer())
  const key = `integration/export/${ownerId}/${fileName}`
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: mimeType }))
  createdObjectKeys.add(key)

  return await prisma.asset.create({
    data: { ownerId, key, bucket, fileName, mimeType, sizeBytes: body.byteLength },
    select: { id: true, key: true },
  })
}

function replaceImageAssetIds(content: JSONContent, assetIds: Map<string, string>): JSONContent {
  const attrs = { ...content.attrs }

  if (content.type === "image" && typeof attrs.assetId === "string") {
    const assetId = assetIds.get(attrs.assetId)
    if (!assetId) throw new Error(`Missing fixture asset mapping for ${attrs.assetId}`)
    attrs.assetId = assetId
  }

  return {
    ...content,
    attrs,
    content: content.content?.map((child) => replaceImageAssetIds(child, assetIds)),
  }
}
