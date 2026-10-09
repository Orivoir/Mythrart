import { randomUUID } from "node:crypto"

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

export async function ensureIntegrationBucket(
  bucket: string,
): Promise<void> {
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
  const uniqueId = randomUUID()

  const owner = await prisma.user.create({
    data: {
      email: `${emailPrefix}${uniqueId}@example.test`,
      firstName: "Export",
      lastName: "Test Owner",
      username: `export-test-${uniqueId}`,
      emailVerified: new Date(),
      termsAcceptedAt: new Date(),
    },
  })

  const ebookType = await createEbookTypeFixture()
  const ebookTheme = await createEbookThemeFixture()

  const assetIds = new Map<string, string>()
  const assets = new Map<
    string,
    {
      id: string
      key: string
      bucket: string
      fileName: string
      mimeType: string
      sizeBytes: number
    }
  >()

  for (const [index, fixtureAsset] of tipTapAssetFixtures.entries()) {
    const asset = await createAsset(
      owner.id,
      fixtureAsset.fileName,
      fixtureAsset.mimeType,
      index + 1,
    )

    assetIds.set(fixtureAsset.id, asset.id)
    assets.set(fixtureAsset.id, asset)
  }

  const firstFixtureAsset = tipTapAssetFixtures[0]

  if (!firstFixtureAsset) {
    throw new Error("At least one asset fixture is required")
  }

  const coverAsset = coverAssetMatchesChapterImage
    ? assets.get(firstFixtureAsset.id)
    : await createAsset(
        owner.id,
        "standalone-cover.png",
        "image/png",
        tipTapAssetFixtures.length + 1,
      )

  if (!coverAsset) {
    throw new Error("Cover asset was not created")
  }

  const ebook = await prisma.ebook.create({
    data: {
      ownerId: owner.id,
      title: tipTapEbookFixture.title,
      subtitle: tipTapEbookFixture.subtitle,
      coverAssetId: coverAsset.id,
      ebookTypeId: ebookType.id,
      ebookThemeId: ebookTheme.id,
    },
  })

  for (const fixtureChapter of tipTapChapterFixtures) {
    const content = replaceImageAssetIds(
      fixtureChapter.content,
      assetIds,
    )

    const chapter = await prisma.chapter.create({
      data: {
        ebookId: ebook.id,
        title: fixtureChapter.title,
        position: fixtureChapter.position,
        locales: {
          create: {
            locale: "en",
            title: fixtureChapter.title,
            content: content as Prisma.InputJsonValue,
            wordsCount: 0,
            charactersCount: 0,
          },
        },
      },
    })

    const referencedAssetIds = collectImageAssetIds(content)

    for (const assetId of referencedAssetIds) {
      await prisma.chapterAssetReference.create({
        data: {
          chapterId: chapter.id,
          assetId,
          type: "CONTENT_IMAGE",
        },
      })
    }
  }

  return {
    ebookId: ebook.id,
    coverAssetId: coverAsset.id,
  }
}

export async function createEbookTypeFixture() {
  return prisma.ebookType.create({
    data: {
      name: "Roman",
      slug: `roman-integration-test-${randomUUID()}`,
      description: "Integration test ebook type",
    },
    select: {
      id: true,
    },
  })
}

export async function createEbookThemeFixture() {
  return prisma.ebookTheme.create({
    data: {
      name: "Classique",
      slug: `classique-integration-test-${randomUUID()}`,
      description: "Integration test ebook theme",
      backgroundColor: "#ffffff",
      textColor: "#374151",
      textFont: "Inter",
      titleFont: "Inter",
      subtitleFont: "Inter",
      headingColor: "#1e3a5f",
      fontSize: "16px",
      lineHeight: "1.6",
      paragraphSpacing: "1rem",
      headingSpacing: "1.5rem",
    },
    select: {
      id: true,
    },
  })
}

export async function loadNormalizedPersistedEbook(
  ebookId: string,
) {
  return normalizeExportData(
    await loadRequirements(ebookId, "with-content-assets"),
  )
}

export async function deletePersistedExportFixtures(
  emailPrefix: string,
): Promise<void> {
  const bucket = getIntegrationBucketName()

  const owners = await prisma.user.findMany({
    where: {
      email: {
        startsWith: emailPrefix,
      },
    },
    select: {
      id: true,
    },
  })

  const ownerIds = owners.map((owner) => owner.id)

  if (ownerIds.length > 0) {
    const ebooks = await prisma.ebook.findMany({
      where: {
        ownerId: {
          in: ownerIds,
        },
      },
      select: {
        id: true,
      },
    })

    const ebookIds = ebooks.map((ebook) => ebook.id)

    if (ebookIds.length > 0) {
      const snapshots = await prisma.snapshot.findMany({
        where: {
          ebookId: {
            in: ebookIds,
          },
        },
        include: {
          file: {
            select: {
              key: true,
              bucket: true,
            },
          },
        },
      })

      for (const snapshot of snapshots) {
        if (snapshot.file?.key) {
          createdObjectKeys.add(snapshot.file.key)
        }
      }

      await deleteUploadedObjects(bucket)

      await prisma.snapshotFile.deleteMany({
        where: {
          snapshotId: {
            in: snapshots.map((snapshot) => snapshot.id),
          },
        },
      })

      await prisma.snapshot.deleteMany({
        where: {
          id: {
            in: snapshots.map((snapshot) => snapshot.id),
          },
        },
      })

      await prisma.chapter.deleteMany({
        where: {
          ebookId: {
            in: ebookIds,
          },
        },
      })

      await prisma.ebook.deleteMany({
        where: {
          id: {
            in: ebookIds,
          },
        },
      })
    }

    await deleteUploadedObjects(bucket)

    await prisma.asset.deleteMany({
      where: {
        ownerId: {
          in: ownerIds,
        },
      },
    })

    await prisma.user.deleteMany({
      where: {
        id: {
          in: ownerIds,
        },
      },
    })
  } else {
    await deleteUploadedObjects(bucket)
  }
}

async function deleteUploadedObjects(bucket: string): Promise<void> {
  for (const key of createdObjectKeys) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )
  }

  createdObjectKeys.clear()
}

async function createAsset(
  ownerId: string,
  fileName: string,
  mimeType: string,
  index: number,
) {
  const bucket = getIntegrationBucketName()
  const body = createTestImageBuffer(mimeType, index)
  const key = `integration/export/${ownerId}/${fileName}`

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: mimeType,
    }),
  )

  createdObjectKeys.add(key)

  return prisma.asset.create({
    data: {
      ownerId,
      key,
      bucket,
      fileName,
      mimeType,
      sizeBytes: body.byteLength,
    },
    select: {
      id: true,
      key: true,
      bucket: true,
      fileName: true,
      mimeType: true,
      sizeBytes: true,
    },
  })
}

/**
 * Generates a small valid image locally.
 *
 * No network access, filesystem access, or external image service
 * is required by the integration tests.
 */
function createTestImageBuffer(
  mimeType: string,
  index: number,
): Buffer {
  if (mimeType === "image/png") {
    return createPngBuffer(index)
  }

  if (mimeType === "image/jpeg") {
    return createJpegBuffer()
  }

  throw new Error(
    `Unsupported fixture image MIME type: ${mimeType}`,
  )
}

/**
 * Minimal valid 1x1 PNG.
 *
 * The index is intentionally accepted so the fixture API can keep
 * producing distinct assets without relying on an external service.
 */
function createPngBuffer(index: number): Buffer {
  void index

  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "base64",
  )
}

/**
 * Minimal JPEG fixture.
 */
function createJpegBuffer(): Buffer {
  return Buffer.from(
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAEFAqf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/AYf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/AYf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAY/Aqf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/IV//2gAMAwEAAgADAAAAEP/EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QH//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QH//EABQQAQAAAAAAAAAAAAAAAAAAABD/2gAIAQEAAT8QH//Z",
    "base64",
  )
}

function replaceImageAssetIds(
  content: JSONContent,
  assetIds: Map<string, string>,
): JSONContent {
  const attrs = { ...content.attrs }

  if (
    content.type === "image" &&
    typeof attrs.assetId === "string"
  ) {
    const assetId = assetIds.get(attrs.assetId)

    if (!assetId) {
      throw new Error(
        `Missing fixture asset mapping for ${attrs.assetId}`,
      )
    }

    attrs.assetId = assetId
  }

  return {
    ...content,
    ...(content.attrs ? { attrs } : {}),
    ...(content.content
      ? {
          content: content.content.map((child) =>
            replaceImageAssetIds(child, assetIds),
          ),
        }
      : {}),
  }
}

/**
 * Collects the persisted asset IDs used by image nodes in TipTap content.
 * The returned IDs are deduplicated because a chapter may reuse an image.
 */
function collectImageAssetIds(content: JSONContent): string[] {
  const assetIds = new Set<string>()

  function visit(node: JSONContent): void {
    if (
      node.type === "image" &&
      typeof node.attrs?.assetId === "string"
    ) {
      assetIds.add(node.attrs.assetId)
    }

    for (const child of node.content ?? []) {
      visit(child)
    }
  }

  visit(content)

  return [...assetIds]
}

