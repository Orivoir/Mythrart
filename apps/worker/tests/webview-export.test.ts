import { prisma, type Prisma } from "@mythrart/database"
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  s3,
} from "@mythrart/s3"
import type { JSONContent } from "@mythrart/editor-extensions"
import escapeHTML from "escape-html"
import { afterAll, beforeEach, describe, expect, it } from "vitest"
import { WebviewExporter } from "../src/services/export/exporters/webview.exporter.js"
import normalizeExportData from "../src/services/export/normalize.js"
import { loadRequirements } from "../src/services/utils.js"
import {
  testExtensions,
  tipTapAssetFixtures,
  tipTapChapterFixtures,
  tipTapEbookFixture,
} from "./fixtures/index.js"

import {
  createEbookTypeFixture,
  createEbookThemeFixture
} from "./helpers/persisted-export-fixture.js"

const TEST_EMAIL_PREFIX = "webview-export-itg-"
const createdObjectKeys = new Set<string>()
const imageUrlExpirySeconds = 60 * 60 * 24 * 7

type PersistedEbookFixture = {
  ebookId: string
  coverFileName: string
}

type ImageFixture = {
  fileName: string
  mimeType: "image/jpeg" | "image/png"
}

function getBucketName(): string {
  const bucket = process.env.S3_BUCKET

  if (!bucket) {
    throw new Error("S3_BUCKET must be configured for integration tests")
  }

  return bucket
}

async function ensureBucketExists(bucket: string): Promise<void> {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }))
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: bucket }))
  }
}

async function downloadPlaceholderImage(index: number, mimeType: ImageFixture["mimeType"]): Promise<Buffer> {
  const format = mimeType === "image/png" ? "png" : "jpeg"
  const response = await fetch(`https://placehold.co/640x480.${format}?text=WebView+${index}`)

  if (!response.ok) {
    throw new Error(`Unable to download placeholder image: ${response.status}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

function replaceImageAssetIds(content: JSONContent, assetIds: Map<string, string>): JSONContent {
  const attrs = { ...content.attrs }

  if (content.type === "image" && typeof attrs.assetId === "string") {
    const assetId = assetIds.get(attrs.assetId)

    if (!assetId) {
      throw new Error(`Missing fixture asset mapping for ${attrs.assetId}`)
    }

    attrs.assetId = assetId
  }

  return {
    ...content,
    attrs,
    content: content.content?.map((child) => replaceImageAssetIds(child, assetIds)),
  }
}

async function createAsset(
  ownerId: string,
  fixture: ImageFixture,
  imageIndex: number,
): Promise<{ id: string; key: string }> {
  const bucket = getBucketName()
  const body = await downloadPlaceholderImage(imageIndex, fixture.mimeType)
  const key = `integration/webview/${ownerId}/${fixture.fileName}`

  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: fixture.mimeType,
  }))
  createdObjectKeys.add(key)

  return await prisma.asset.create({
    data: {
      ownerId,
      key,
      bucket,
      fileName: fixture.fileName,
      mimeType: fixture.mimeType,
      sizeBytes: body.byteLength,
    },
    select: { id: true, key: true },
  })
}

async function createEbookFixture(
  coverAssetMatchesChapterImage: boolean,
): Promise<PersistedEbookFixture> {
  const owner = await prisma.user.create({
    data: {
      email: `${TEST_EMAIL_PREFIX}owner@example.test`,
      name: "WebView Export Owner",
    },
  })
  const assetIds = new Map<string, string>()
  const assets = new Map<string, { id: string; key: string }>()

  for (const [index, fixtureAsset] of tipTapAssetFixtures.entries()) {
    const asset = await createAsset(owner.id, fixtureAsset, index + 1)

    assetIds.set(fixtureAsset.id, asset.id)
    assets.set(fixtureAsset.id, asset)
  }

  const coverAsset = coverAssetMatchesChapterImage
    ? assets.get(tipTapAssetFixtures[0].id)
    : await createAsset(owner.id, { fileName: "standalone-cover.png", mimeType: "image/png" }, 4)

  if (!coverAsset) {
    throw new Error("Cover asset was not created")
  }

  const ebookType = await createEbookTypeFixture()
  const ebookTheme = await createEbookThemeFixture()

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
    const content = replaceImageAssetIds(fixtureChapter.content, assetIds)
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
          },
        },
      },
    })
    const fixtureAsset = tipTapAssetFixtures[fixtureChapter.position]
    const assetId = assetIds.get(fixtureAsset.id)

    if (!assetId) {
      throw new Error(`Missing persisted asset for ${fixtureAsset.id}`)
    }

    await prisma.chapterAssetReference.create({
      data: {
        chapterId: chapter.id,
        assetId,
        type: "CONTENT_IMAGE",
      },
    })
  }

  return { ebookId: ebook.id, coverFileName: coverAsset.key.split("/").at(-1)! }
}

async function exportPersistedEbook(ebookId: string): Promise<string> {
  const requirements = await loadRequirements(ebookId, "with-content-assets")
  const normalizedEbook = normalizeExportData(requirements)
  const exportedFile = await new WebviewExporter(testExtensions).export(normalizedEbook)

  expect(exportedFile.fileName).toMatch(/\.html$/)
  expect(exportedFile.mimeType).toBe("text/html; charset=utf-8")
  expect(Buffer.isBuffer(exportedFile.data)).toBe(true)

  return exportedFile.data.toString("utf8")
}

async function deleteFixtureData(bucket: string): Promise<void> {
  const owners = await prisma.user.findMany({
    where: { email: { startsWith: TEST_EMAIL_PREFIX } },
    select: { id: true },
  })
  const ownerIds = owners.map((owner) => owner.id)

  if (ownerIds.length > 0) {
    const ebooks = await prisma.ebook.findMany({
      where: { ownerId: { in: ownerIds } },
      select: { id: true },
    })
    const ebookIds = ebooks.map((ebook) => ebook.id)

    if (ebookIds.length > 0) {
      await prisma.chapter.deleteMany({ where: { ebookId: { in: ebookIds } } })
      await prisma.ebook.deleteMany({ where: { id: { in: ebookIds } } })
    }

    await prisma.asset.deleteMany({ where: { ownerId: { in: ownerIds } } })
    await prisma.user.deleteMany({ where: { id: { in: ownerIds } } })
  }

  for (const key of createdObjectKeys) {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
  }

  createdObjectKeys.clear()
}

function imageSources(html: string): string[] {
  return [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1])
}

function headingIds(html: string): string[] {
  const headings = [...html.matchAll(/<h([1-6])\b([^>]*)>/g)]

  expect(headings).not.toHaveLength(0)

  return headings.map((heading) => {
    const id = heading[2].match(/\bid="([^"]+)"/)

    expect(id).not.toBeNull()
    return id![1]
  })
}

function expectPresignedImageUrls(sources: string[]): void {
  expect(sources).not.toHaveLength(0)

  for (const source of sources) {
    const url = new URL(source.replaceAll("&amp;", "&"))

    expect(["http:", "https:"]).toContain(url.protocol)
    expect(url.searchParams.get("X-Amz-Signature")).toBeTruthy()
    // The seven-day URL lifetime is the Signature V4 maximum.
    expect(url.searchParams.get("X-Amz-Expires")).toBe(String(imageUrlExpirySeconds))
  }
}

describe("WebviewExporter integration", () => {
  beforeEach(async () => {
    const bucket = getBucketName()

    await ensureBucketExists(bucket)
    await deleteFixtureData(bucket)
  })

  afterAll(async () => {
    await deleteFixtureData(getBucketName())
    await prisma.$disconnect()
  })

  it("exports persisted rich TipTap content with shared cover and image URLs", async () => {
    const fixture = await createEbookFixture(true)
    const html = await exportPersistedEbook(fixture.ebookId)
    const sources = imageSources(html)
    const ids = headingIds(html)

    expect(html).toContain("<!DOCTYPE html>")
    expect(html).toContain('<html lang="en">')
    expect(html).toContain(escapeHTML(tipTapEbookFixture.title))
    expect(html).toContain(tipTapEbookFixture.subtitle)
    expect(html).not.toMatch(/<script\b/i)
    expect(html).not.toMatch(/\bon[a-z]+\s*=/i)
    expect(html).not.toMatch(/\bassetid\s*=/i)

    for (const chapter of tipTapChapterFixtures) {
      expect(html).toContain(chapter.title)
    }

    expect(ids).toHaveLength(new Set(ids).size)
    expect(html).toContain("A note from the road")
    expect(html).toContain("Archive annotations")
    expect(html).toContain("<ul>")
    expect(html).toContain("<ol")
    expect(html).toContain("<blockquote>")
    expect(html).toContain("<pre><code")
    expect(html).toContain("<br>")
    expect(html).toContain("the archive")
    expect(html).toContain("Ada Rowan")
    expect(sources).toHaveLength(4)
    expect(sources.filter((source) => source === sources[0])).toHaveLength(2)
    expectPresignedImageUrls(sources)
  })

  it("renders a cover before the header when no chapter references it", async () => {
    const fixture = await createEbookFixture(false)
    const html = await exportPersistedEbook(fixture.ebookId)
    const sources = imageSources(html)
    const coverSource = sources[0]

    expect(coverSource).toBeDefined()
    expect(decodeURIComponent(new URL(coverSource).pathname)).toContain(fixture.coverFileName)
    expect(html.indexOf(`<img src="${coverSource}"`)).toBeLessThan(html.indexOf("<header>"))
    expect(sources.slice(1)).not.toContain(coverSource)
    expectPresignedImageUrls(sources)
  })
})