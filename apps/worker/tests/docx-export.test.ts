import JSZip from "jszip"
import { afterAll, beforeEach, describe, expect, it } from "vitest"
import { DocxExporter } from "../src/services/export/exporters/docx.exporter.js"
import { testExtensions, tipTapChapterFixtures, tipTapEbookFixture } from "./fixtures/index.js"
import {
  createPersistedExportFixture,
  deletePersistedExportFixtures,
  ensureIntegrationBucket,
  getIntegrationBucketName,
  loadNormalizedPersistedEbook,
} from "./helpers/persisted-export-fixture.js"

const TEST_EMAIL_PREFIX = "docx-export-itg-"

describe("DocxExporter integration", () => {
  beforeEach(async () => {
    const bucket = getIntegrationBucketName()
    await ensureIntegrationBucket(bucket)
    await deletePersistedExportFixtures(TEST_EMAIL_PREFIX)
  })

  afterAll(async () => {
    await deletePersistedExportFixtures(TEST_EMAIL_PREFIX)
  })

  it("embeds persisted cover and chapter images while preserving rich TipTap content", async () => {
    const fixture = await createPersistedExportFixture(TEST_EMAIL_PREFIX)
    const ebook = await loadNormalizedPersistedEbook(fixture.ebookId)
    const exportedFile = await new DocxExporter(testExtensions).export(ebook)
    const archive = await JSZip.loadAsync(exportedFile.data)
    const documentXml = await archive.file("word/document.xml")?.async("string")
    const mediaFiles = Object.keys(archive.files).filter((path) => path.startsWith("word/media/"))

    expect(exportedFile.fileName).toMatch(/\.docx$/)
    expect(exportedFile.mimeType).toBe("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    expect(Buffer.isBuffer(exportedFile.data)).toBe(true)
    expect(exportedFile.data.subarray(0, 2).toString()).toBe("PK")
    expect(documentXml).toBeDefined()
    expect(documentXml).toContain(tipTapEbookFixture.title)
    expect(documentXml).toContain(tipTapEbookFixture.subtitle)

    for (const chapter of tipTapChapterFixtures) {
      expect(documentXml).toContain(chapter.title)
    }

    expect(documentXml).toContain("At first light")
    expect(documentXml).toContain("A pencil, a ruler, and room to revise.")
    expect(documentXml).toContain("Travel is an education in attention, not accumulation.")
    expect(documentXml).toContain("observe")
    expect(documentXml).toContain("the archive")
    expect(documentXml).toContain("Ada Rowan")
    expect(mediaFiles.length).toBeGreaterThanOrEqual(3)
    expect(documentXml).toContain('r:embed="')
    expect(documentXml).not.toContain('r:link="')
  })
})
