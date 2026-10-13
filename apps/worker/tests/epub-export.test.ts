import JSZip from "jszip"
import { afterAll, beforeEach, describe, expect, it } from "vitest"
import { EpubExporter } from "../src/services/export/exporters/epub.exporter.js"
import { testExtensions, tipTapChapterFixtures, tipTapEbookFixture } from "./fixtures/index.js"
import {
  createPersistedExportFixture,
  deletePersistedExportFixtures,
  ensureIntegrationBucket,
  getIntegrationBucketName,
  loadNormalizedPersistedEbook,
} from "./helpers/persisted-export-fixture.js"

const TEST_EMAIL_PREFIX = "epub-export-itg-"

async function exportEpub(withCover: boolean) {
  const fixture = await createPersistedExportFixture(TEST_EMAIL_PREFIX, false, withCover)
  const ebook = await loadNormalizedPersistedEbook(fixture.ebookId)
  const exportedFile = await new EpubExporter(testExtensions).export(ebook)
  const archive = await JSZip.loadAsync(exportedFile.data)

  return { exportedFile, archive }
}

async function readText(archive: JSZip, path: string) {
  return archive.file(path)?.async("string")
}

describe("EpubExporter integration", () => {
  beforeEach(async () => {
    await ensureIntegrationBucket(getIntegrationBucketName())
    await deletePersistedExportFixtures(TEST_EMAIL_PREFIX)
  })

  afterAll(async () => {
    await deletePersistedExportFixtures(TEST_EMAIL_PREFIX)
  })

  it("exports a full ebook with the persisted cover and chapter images", async () => {
    const { exportedFile, archive } = await exportEpub(true)

    expect(exportedFile.fileName).toMatch(/\.epub$/)
    expect(exportedFile.mimeType).toBe("application/epub+zip")
    expect(Buffer.isBuffer(exportedFile.data)).toBe(true)
    expect(exportedFile.data.subarray(0, 2).toString()).toBe("PK")

    expect(await readText(archive, "mimetype")).toBe("application/epub+zip")
    expect(archive.file("META-INF/container.xml")).not.toBeNull()

    const opf = await readText(archive, "OEBPS/content.opf")
    const cover = await readText(archive, "OEBPS/cover.xhtml")
    const nav = await readText(archive, "OEBPS/nav.xhtml")

    expect(opf).toContain("The Cartographer")
    expect(opf).toContain(tipTapEbookFixture.subtitle)
    expect(opf).toContain("Export Test Owner")
    expect(cover).toContain("standalone-cover.png")
    expect(archive.file("OEBPS/images/standalone-cover.png")).not.toBeNull()
    expect(Object.keys(archive.files).join()).not.toContain("default_cover_image")

    const imageFiles = Object.keys(archive.files).filter((path) => path.startsWith("OEBPS/images/") && !path.endsWith("/"))
    expect(imageFiles.length).toBeGreaterThanOrEqual(2)

    let chapterXhtml = ""
    for (const chapter of tipTapChapterFixtures) {
      expect(nav).toContain(chapter.title)
    }
    for (const path of Object.keys(archive.files).filter((p) => /^OEBPS\/.+\.xhtml$/.test(p))) {
      chapterXhtml += await readText(archive, path)
    }

    expect(chapterXhtml).toContain("At first light")
    expect(chapterXhtml).toContain("A pencil, a ruler, and room to revise.")
    expect(chapterXhtml).toContain("Travel is an education in attention, not accumulation.")
    expect(chapterXhtml).toContain("Ada Rowan")
  })

  it("falls back to the default cover image when the ebook has no cover", async () => {
    const { exportedFile, archive } = await exportEpub(false)

    expect(exportedFile.fileName).toMatch(/\.epub$/)
    expect(exportedFile.data.subarray(0, 2).toString()).toBe("PK")

    const cover = await readText(archive, "OEBPS/cover.xhtml")
    const opf = await readText(archive, "OEBPS/content.opf")
    const defaultCover = archive.file("OEBPS/images/default_cover_image.png")

    expect(cover).toContain("default_cover_image.png")
    expect(opf).toContain("cover-image")
    expect(defaultCover).not.toBeNull()
    expect((await defaultCover!.async("uint8array")).byteLength).toBeGreaterThan(0)
    expect(archive.file("OEBPS/images/standalone-cover.png")).toBeNull()
  })
})
