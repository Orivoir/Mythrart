import { randomUUID } from "node:crypto"
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { prisma, type CollaborationRole } from "@mythrart/database"
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  s3,
} from "@mythrart/s3"

import { generateEpubBridge } from "../../src/services/export/utils/bridge-epub-generator.js"
import type { NormalizedEbook } from "../../src/services/export/utils/normalize.js"

import createUser from "../helpers/create-user.js"
import createEbookType from "../helpers/create-ebook-type.js"
import createEbookTheme from "../helpers/create-ebook-theme.js"
import createAsset from "../helpers/create-asset.js"
import createEbook from "../helpers/create-ebook.js"
import createCollaborators from "../helpers/create-collaborators.js"
import generateNormalizedEbook from "../helpers/generate-normalize-ebook.js"

const fixturesDir = fileURLToPath(
  new URL("../fixtures/images", import.meta.url),
)

const createdEbookIds = new Set<string>()
const createdUserIds = new Set<string>()
const createdThemeIds = new Set<string>()
const createdTypeIds = new Set<string>()
const createdAssetIds = new Set<string>()
const createdS3Keys = new Set<string>()

function getBucketName(): string {
  const bucket = process.env.S3_BUCKET

  if (!bucket) {
    throw new Error("S3_BUCKET must be configured for integration tests")
  }

  return bucket
}

async function ensureBucket(bucket: string): Promise<void> {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }))
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: bucket }))
  }
}

function loadFixtureImage(fileName: string): { data: Buffer; mimeType: string } {
  const filePath = path.join(fixturesDir, fileName)
  const data = readFileSync(filePath)
  const mimeType = fileName.endsWith(".png") ? "image/png" : "image/jpeg"
  return { data, mimeType }
}

async function uploadFixtureToS3(
  bucket: string,
  key: string,
  fileName: string,
): Promise<{ data: Buffer; mimeType: string; key: string }> {
  const { data, mimeType } = loadFixtureImage(fileName)

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: mimeType,
    }),
  )

  createdS3Keys.add(key)
  return { data, mimeType, key }
}

async function cleanupFixtures(): Promise<void> {
  const bucket = getBucketName()

  // 1. Delete S3 objects
  for (const key of createdS3Keys) {
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      )
    } catch {
      // Ignore if already deleted
    }
  }
  createdS3Keys.clear()

  // 2. Delete DB records in dependency order
  const ebookIds = Array.from(createdEbookIds)
  if (ebookIds.length > 0) {
    await prisma.ebookCollaborator.deleteMany({
      where: { ebookId: { in: ebookIds } },
    })
    await prisma.chapterAssetReference.deleteMany({
      where: { chapter: { ebookId: { in: ebookIds } } },
    })
    await prisma.chapterLocale.deleteMany({
      where: { chapter: { ebookId: { in: ebookIds } } },
    })
    await prisma.chapter.deleteMany({
      where: { ebookId: { in: ebookIds } },
    })
    await prisma.ebook.deleteMany({
      where: { id: { in: ebookIds } },
    })
    createdEbookIds.clear()
  }

  const assetIds = Array.from(createdAssetIds)
  if (assetIds.length > 0) {
    await prisma.asset.deleteMany({
      where: { id: { in: assetIds } },
    })
    createdAssetIds.clear()
  }

  const themeIds = Array.from(createdThemeIds)
  if (themeIds.length > 0) {
    await prisma.ebookTheme.deleteMany({
      where: { id: { in: themeIds } },
    })
    createdThemeIds.clear()
  }

  const typeIds = Array.from(createdTypeIds)
  if (typeIds.length > 0) {
    await prisma.ebookType.deleteMany({
      where: { id: { in: typeIds } },
    })
    createdTypeIds.clear()
  }

  const userIds = Array.from(createdUserIds)
  if (userIds.length > 0) {
    await prisma.user.deleteMany({
      where: { id: { in: userIds } },
    })
    createdUserIds.clear()
  }
}

describe("generateEpubBridge integration", { timeout: 30000 }, () => {
  const bucket = getBucketName()

  beforeAll(async () => {
    await ensureBucket(bucket)
  })

  afterAll(async () => {
    await cleanupFixtures()
  })

  it("should successfully bridge a medium realistic ebook with cover, content assets, multiple chapters, owner and collaborators", async () => {
    const runId = randomUUID().slice(0, 8)

    // 1. Push fixture images to S3 (MinIO) in parallel
    const coverS3Key = `test/bridge/${runId}/cover-fixture-1.png`
    const chartS3Key = `test/bridge/${runId}/chapter-fixture-2.png`
    const eyeS3Key = `test/bridge/${runId}/chapter-aiw-1.jpg`

    const [coverFixture, chartFixture, eyeFixture] = await Promise.all([
      uploadFixtureToS3(bucket, coverS3Key, "fixture-1.png"),
      uploadFixtureToS3(bucket, chartS3Key, "fixture-2.png"),
      uploadFixtureToS3(bucket, eyeS3Key, "aiw-1.jpg"),
    ])

    // 2. Create Owner in DB
    const owner = await createUser(runId)
    createdUserIds.add(owner.id)

    // 3. Create EbookType and EbookTheme in DB
    const ebookType = await createEbookType(runId)
    createdTypeIds.add(ebookType.id)

    const ebookTheme = await createEbookTheme(runId)
    createdThemeIds.add(ebookTheme.id)

    // 4. Create Asset records in DB
    const coverAsset = await createAsset({
      ownerId: owner.id,
      key: coverFixture.key,
      bucket,
      fileName: "cover-fixture-1.png",
      mimeType: coverFixture.mimeType,
      sizeBytes: coverFixture.data.byteLength,
    })
    createdAssetIds.add(coverAsset.id)

    const chartAsset = await createAsset({
      ownerId: owner.id,
      key: chartFixture.key,
      bucket,
      fileName: "chapter-fixture-2.png",
      mimeType: chartFixture.mimeType,
      sizeBytes: chartFixture.data.byteLength,
    })
    createdAssetIds.add(chartAsset.id)

    const eyeAsset = await createAsset({
      ownerId: owner.id,
      key: eyeFixture.key,
      bucket,
      fileName: "chapter-aiw-1.jpg",
      mimeType: eyeFixture.mimeType,
      sizeBytes: eyeFixture.data.byteLength,
    })
    createdAssetIds.add(eyeAsset.id)

    // 5. Create Ebook in DB
    const ebook = await createEbook({
      ownerId: owner.id,
      coverAssetId: coverAsset.id,
      ebookTypeId: ebookType.id,
      ebookThemeId: ebookTheme.id,
    })
    createdEbookIds.add(ebook.id)

    // 6. Create Collaborators with diverse roles in DB
    await createCollaborators({
      id: runId,
      ebookId: ebook.id,
      beforeCreate: (user) => {
        createdUserIds.add(user.id)
      }
    })

    // 7. Create Chapters in DB
    const chapter1 = await prisma.chapter.create({
      data: {
        ebookId: ebook.id,
        title: "Chapter I: The Celestial Observatory",
        position: 0,
      },
    })

    const chapter2 = await prisma.chapter.create({
      data: {
        ebookId: ebook.id,
        title: "Chapter II: Into the Astral Currents",
        position: 1,
      },
    })

    // 8. Build a medium realistic NormalizedEbook
    const normalizedEbook = generateNormalizedEbook({
      ebook,
      coverAsset,
      chartAsset,
      eyeAsset,
      chapters: [chapter1, chapter2],
    })

    // 9. Execute generateEpubBridge
    const result = await generateEpubBridge(normalizedEbook)

    // 10. Assertions on the bridge output
    expect(result).toBeDefined()
    expect(result.book).toBeDefined()
    expect(result.theme).toBeDefined()

    // Book metadata
    expect(result.book.id).toBe(ebook.id)
    expect(result.book.title).toBe("The Chronicles of the Astral Sea")
    expect(result.book.subtitle).toBe("Voyage Beyond the Boundary Stars")
    expect(result.book.description).toBe(
      "A record of voyages through uncharted astral oceans and celestial anomalies.",
    )
    expect(result.book.language).toBe("en")
    expect(result.book.createdAt).toEqual(ebook.createdAt)

    // Creator derived from owner name
    expect(result.book.creator).toBe("Arthur Conan Doyle")

    // Cover image loaded from S3
    expect(result.book.coverImage).not.toBeNull()
    expect(result.book.coverImage?.id).toBe(coverAsset.id)
    expect(result.book.coverImage?.fileName).toBe("cover-fixture-1.png")
    expect(result.book.coverImage?.mimeType).toBe("image/png")
    expect(Buffer.from(result.book.coverImage!.data)).toEqual(coverFixture.data)

    // Chapter assets loaded from S3 and deduplicated (cover excluded)
    expect(result.book.assets).toHaveLength(2)
    const loadedAssetIds = result.book.assets.map((a) => a.id)
    expect(loadedAssetIds).not.toContain(coverAsset.id)
    expect(loadedAssetIds).toContain(chartAsset.id)
    expect(loadedAssetIds).toContain(eyeAsset.id)

    const loadedChart = result.book.assets.find((a) => a.id === chartAsset.id)
    expect(loadedChart).toBeDefined()
    expect(loadedChart?.fileName).toBe("chapter-fixture-2.png")
    expect(loadedChart?.mimeType).toBe("image/png")
    expect(Buffer.from(loadedChart!.data)).toEqual(chartFixture.data)

    const loadedEye = result.book.assets.find((a) => a.id === eyeAsset.id)
    expect(loadedEye).toBeDefined()
    expect(loadedEye?.fileName).toBe("chapter-aiw-1.jpg")
    expect(loadedEye?.mimeType).toBe("image/jpeg")
    expect(Buffer.from(loadedEye!.data)).toEqual(eyeFixture.data)

    // Contributors mapped correctly
    expect(result.book.contributors).toHaveLength(4)
    expect(result.book.contributors).toEqual(
      expect.arrayContaining([
        { name: "Jane Austen", role: "edt" },
        { name: "Jorge Borges", role: "trl" },
        { name: "Mary Shelley", role: "rev" },
        { name: "Edgar Poe", role: "aut" },
      ]),
    )

    // Chapters mapped correctly
    expect(result.book.chapters).toHaveLength(2)
    expect(result.book.chapters[0]).toEqual({
      id: chapter1.id,
      title: chapter1.title,
      position: 0,
      content: normalizedEbook.chapters[0]?.content,
    })
    expect(result.book.chapters[1]).toEqual({
      id: chapter2.id,
      title: chapter2.title,
      position: 1,
      content: normalizedEbook.chapters[1]?.content,
    })

    // Theme mapped correctly from database EbookTheme
    expect(result.theme).toEqual({
      backgroundColor: "#FAF6EE",
      textColor: "#2B2A27",
      textFont: "Merriweather",
      titleFont: "Cinzel",
      subtitleFont: "Cinzel Decorative",
      headingColor: "#7C2D12",
      fontSize: "17px",
      lineHeight: "1.75",
      paragraphSpacing: "1.2rem",
      headingSpacing: "2.2rem",
    })
  }, 80_000)

  it("should handle an ebook without a cover image (coverImage is null)", async () => {
    const runId = randomUUID().slice(0, 8)

    // Push only a content fixture image
    const contentKey = `test/bridge/${runId}/fixture-3.png`
    const contentFixture = await uploadFixtureToS3(bucket, contentKey, "fixture-3.png")

    const owner = await prisma.user.create({
      data: {
        email: `nocover-${runId}@example.test`,
        firstName: "Jules",
        lastName: "Verne",
        username: `verne_${runId}`,
      },
    })
    createdUserIds.add(owner.id)

    const type = await prisma.ebookType.create({
      data: {
        name: `Adventure ${runId}`,
        slug: `adventure-${runId}`,
      },
    })
    createdTypeIds.add(type.id)

    const theme = await prisma.ebookTheme.create({
      data: {
        name: `Adventure Theme ${runId}`,
        slug: `adventure-theme-${runId}`,
        backgroundColor: "#ffffff",
        textColor: "#000000",
        textFont: "Serif",
        titleFont: "Serif",
      },
    })
    createdThemeIds.add(theme.id)

    const contentAsset = await prisma.asset.create({
      data: {
        ownerId: owner.id,
        key: contentFixture.key,
        bucket,
        fileName: "fixture-3.png",
        mimeType: contentFixture.mimeType,
        sizeBytes: contentFixture.data.byteLength,
      },
    })
    createdAssetIds.add(contentAsset.id)

    const ebook = await prisma.ebook.create({
      data: {
        ownerId: owner.id,
        title: "Journey Across Continents",
        coverAssetId: null,
        ebookTypeId: type.id,
        ebookThemeId: theme.id,
      },
    })
    createdEbookIds.add(ebook.id)

    const normalizedEbook: NormalizedEbook = {
      id: ebook.id,
      title: ebook.title,
      subtitle: null,
      shortDescription: null,
      createdAt: ebook.createdAt,
      locale: "fr",
      coverImage: null,
      assets: [{ id: contentAsset.id, key: contentAsset.key, bucket: contentAsset.bucket }],
      chapters: [
        {
          id: `ch-${runId}`,
          title: "Chapitre Premier",
          position: 0,
          createdAt: new Date(),
          content: { type: "doc", content: [] },
        },
      ],
    }

    const result = await generateEpubBridge(normalizedEbook)

    expect(result.book.coverImage).toMatchObject({
      id: "mythrart-default-cover",
      fileName: "default_cover_image.png",
      mimeType: "image/png",
    })
    expect(result.book.assets).toHaveLength(1)
    expect(result.book.assets[0]?.id).toBe(contentAsset.id)
    expect(Buffer.from(result.book.assets[0]!.data)).toEqual(contentFixture.data)
  })

  it("should handle an ebook with empty assets array", async () => {
    const runId = randomUUID().slice(0, 8)

    const coverKey = `test/bridge/${runId}/cover.png`
    const coverFixture = await uploadFixtureToS3(bucket, coverKey, "fixture-1.png")

    const owner = await prisma.user.create({
      data: {
        email: `noassets-${runId}@example.test`,
        firstName: "Virginia",
        lastName: "Woolf",
        username: `woolf_${runId}`,
      },
    })
    createdUserIds.add(owner.id)

    const type = await prisma.ebookType.create({
      data: { name: `Modernist ${runId}`, slug: `modernist-${runId}` },
    })
    createdTypeIds.add(type.id)

    const theme = await prisma.ebookTheme.create({
      data: {
        name: `Minimal ${runId}`,
        slug: `minimal-${runId}`,
        backgroundColor: "#FFFFFF",
        textColor: "#1A1A1A",
        textFont: "Georgia",
        titleFont: "Georgia",
      },
    })
    createdThemeIds.add(theme.id)

    const coverAsset = await prisma.asset.create({
      data: {
        ownerId: owner.id,
        key: coverFixture.key,
        bucket,
        fileName: "cover.png",
        mimeType: coverFixture.mimeType,
        sizeBytes: coverFixture.data.byteLength,
      },
    })
    createdAssetIds.add(coverAsset.id)

    const ebook = await prisma.ebook.create({
      data: {
        ownerId: owner.id,
        title: "To the Lighthouse",
        coverAssetId: coverAsset.id,
        ebookTypeId: type.id,
        ebookThemeId: theme.id,
      },
    })
    createdEbookIds.add(ebook.id)

    const normalizedEbook: NormalizedEbook = {
      id: ebook.id,
      title: ebook.title,
      subtitle: null,
      shortDescription: "A landmark modernist novel.",
      createdAt: ebook.createdAt,
      locale: "en",
      coverImage: {
        assetId: coverAsset.id,
        key: coverAsset.key,
        bucket: coverAsset.bucket,
      },
      assets: [],
      chapters: [
        {
          id: `ch-1-${runId}`,
          title: "The Window",
          position: 0,
          createdAt: new Date(),
          content: { type: "doc", content: [] },
        },
      ],
    }

    const result = await generateEpubBridge(normalizedEbook)

    expect(result.book.coverImage).not.toBeNull()
    expect(result.book.coverImage?.id).toBe(coverAsset.id)
    expect(result.book.assets).toEqual([])
  })

  it("should format creator and collaborator display names and roles correctly in edge cases", async () => {
    const runId = randomUUID().slice(0, 8)

    // Owner with only username (no first/last name)
    const owner = await prisma.user.create({
      data: {
        email: `user-only-${runId}@example.test`,
        firstName: null,
        lastName: null,
        username: `pseudonym_${runId}`,
      },
    })
    createdUserIds.add(owner.id)

    const type = await prisma.ebookType.create({
      data: { name: `Essay ${runId}`, slug: `essay-${runId}` },
    })
    createdTypeIds.add(type.id)

    const theme = await prisma.ebookTheme.create({
      data: {
        name: `Essay Theme ${runId}`,
        slug: `essay-theme-${runId}`,
        backgroundColor: "#ffffff",
        textColor: "#000000",
        textFont: "Sans",
        titleFont: "Sans",
      },
    })
    createdThemeIds.add(theme.id)

    const ebook = await prisma.ebook.create({
      data: {
        ownerId: owner.id,
        title: "Essays of an Anonymous Thinker",
        ebookTypeId: type.id,
        ebookThemeId: theme.id,
      },
    })
    createdEbookIds.add(ebook.id)

    // Collaborator 1: only firstName
    const userFirstNameOnly = await prisma.user.create({
      data: {
        email: `first-only-${runId}@example.test`,
        firstName: "Voltaire",
        lastName: null,
        username: `voltaire_${runId}`,
      },
    })
    createdUserIds.add(userFirstNameOnly.id)

    // Collaborator 2: role is null (should map to 'oth')
    const userRoleNull = await prisma.user.create({
      data: {
        email: `role-null-${runId}@example.test`,
        firstName: "Homer",
        lastName: "Simpson",
        username: `homer_${runId}`,
      },
    })
    createdUserIds.add(userRoleNull.id)

    // Collaborator 3: OWNER collaboration role (should map to 'aut')
    const userRoleOwner = await prisma.user.create({
      data: {
        email: `role-owner-${runId}@example.test`,
        firstName: "Leo",
        lastName: "Tolstoy",
        username: `tolstoy_${runId}`,
      },
    })
    createdUserIds.add(userRoleOwner.id)

    // Collaborator 4: user with only username and no first/last name
    const userUsernameOnly = await prisma.user.create({
      data: {
        email: `username-only-${runId}@example.test`,
        firstName: null,
        lastName: "   ",
        username: `ghostwriter_${runId}`,
      },
    })
    createdUserIds.add(userUsernameOnly.id)

    await prisma.ebookCollaborator.createMany({
      data: [
        { ebookId: ebook.id, userId: userFirstNameOnly.id, role: "TRANSLATOR" },
        { ebookId: ebook.id, userId: userRoleNull.id, role: null },
        { ebookId: ebook.id, userId: userRoleOwner.id, role: "OWNER" },
        { ebookId: ebook.id, userId: userUsernameOnly.id, role: "EDITOR" },
      ],
    })

    const normalizedEbook: NormalizedEbook = {
      id: ebook.id,
      title: ebook.title,
      subtitle: null,
      shortDescription: null,
      createdAt: ebook.createdAt,
      locale: "en",
      coverImage: null,
      assets: [],
      chapters: [],
    }

    const result = await generateEpubBridge(normalizedEbook)

    // Creator should use username fallback
    expect(result.book.creator).toBe(`pseudonym_${runId}`)

    // Verify contributor mappings
    expect(result.book.contributors).toEqual(
      expect.arrayContaining([
        { name: "Voltaire", role: "trl" },
        { name: "Homer Simpson", role: "oth" },
        { name: "Leo Tolstoy", role: "aut" },
        { name: `ghostwriter_${runId}`, role: "edt" },
      ]),
    )
  })

  it("should apply fallback default values for nullable theme properties", async () => {
    const runId = randomUUID().slice(0, 8)

    const owner = await prisma.user.create({
      data: {
        email: `nulltheme-${runId}@example.test`,
        username: `user_${runId}`,
      },
    })
    createdUserIds.add(owner.id)

    const type = await prisma.ebookType.create({
      data: { name: `Type ${runId}`, slug: `type-${runId}` },
    })
    createdTypeIds.add(type.id)

    // Theme with null values for optional/nullable columns
    const minimalTheme = await prisma.ebookTheme.create({
      data: {
        name: `Bare Theme ${runId}`,
        slug: `bare-theme-${runId}`,
        backgroundColor: "#111111",
        textColor: "#EEEEEE",
        textFont: "CustomSerif",
        titleFont: "CustomDisplay",
        subtitleFont: null,
        headingColor: null,
        fontSize: null,
        lineHeight: null,
        paragraphSpacing: null,
        headingSpacing: null,
      },
    })
    createdThemeIds.add(minimalTheme.id)

    const ebook = await prisma.ebook.create({
      data: {
        ownerId: owner.id,
        title: "Minimalist Typography Book",
        ebookTypeId: type.id,
        ebookThemeId: minimalTheme.id,
      },
    })
    createdEbookIds.add(ebook.id)

    const normalizedEbook: NormalizedEbook = {
      id: ebook.id,
      title: ebook.title,
      subtitle: null,
      shortDescription: null,
      createdAt: ebook.createdAt,
      locale: "en",
      coverImage: null,
      assets: [],
      chapters: [],
    }

    const result = await generateEpubBridge(normalizedEbook)

    expect(result.theme).toEqual({
      backgroundColor: "#111111",
      textColor: "#EEEEEE",
      textFont: "CustomSerif",
      titleFont: "CustomDisplay",
      subtitleFont: "inherit",
      headingColor: "inherit",
      fontSize: "1em",
      lineHeight: "inherit",
      paragraphSpacing: "0",
      headingSpacing: "0",
    })
  })

  it("should throw an error when the ebook does not exist in the database", async () => {
    const nonExistentId = `missing-${randomUUID()}`

    const normalizedEbook: NormalizedEbook = {
      id: nonExistentId,
      title: "Non Existent Book",
      subtitle: null,
      shortDescription: null,
      createdAt: new Date(),
      locale: "en",
      coverImage: null,
      assets: [],
      chapters: [],
    }

    await expect(generateEpubBridge(normalizedEbook)).rejects.toThrow(
      `Ebook ${nonExistentId} not found`,
    )
  })

  it("should throw an error when an asset referenced in S3 does not exist", async () => {
    const runId = randomUUID().slice(0, 8)

    const owner = await prisma.user.create({
      data: {
        email: `missing-s3-${runId}@example.test`,
        username: `s3user_${runId}`,
      },
    })
    createdUserIds.add(owner.id)

    const type = await prisma.ebookType.create({
      data: { name: `Type ${runId}`, slug: `s3type-${runId}` },
    })
    createdTypeIds.add(type.id)

    const theme = await prisma.ebookTheme.create({
      data: {
        name: `S3 Theme ${runId}`,
        slug: `s3theme-${runId}`,
        backgroundColor: "#ffffff",
        textColor: "#000000",
        textFont: "Serif",
        titleFont: "Serif",
      },
    })
    createdThemeIds.add(theme.id)

    const ebook = await prisma.ebook.create({
      data: {
        ownerId: owner.id,
        title: "Book With Missing S3 Object",
        ebookTypeId: type.id,
        ebookThemeId: theme.id,
      },
    })
    createdEbookIds.add(ebook.id)

    const nonExistentS3Key = `test/bridge/${runId}/does-not-exist.png`

    const normalizedEbook: NormalizedEbook = {
      id: ebook.id,
      title: ebook.title,
      subtitle: null,
      shortDescription: null,
      createdAt: ebook.createdAt,
      locale: "en",
      coverImage: null,
      assets: [
        {
          id: `missing-asset-${runId}`,
          key: nonExistentS3Key,
          bucket,
        },
      ],
      chapters: [],
    }

    await expect(generateEpubBridge(normalizedEbook)).rejects.toThrow()
  })
})
