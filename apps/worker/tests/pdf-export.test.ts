import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs"
import { afterAll, beforeEach, describe, expect, it } from "vitest"
import { PdfExporter } from "../src/services/export/exporters/pdf.exporter.js"
import { testExtensions, tipTapChapterFixtures, tipTapEbookFixture } from "./fixtures/index.js"

type PdfTextItem = {
  str: string
  dir: string
  transform: number[]
  width: number
  height: number
  fontName: string
  hasEOL: boolean
}

function isPdfTextItem(value: unknown): value is PdfTextItem {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return typeof candidate.str === "string"
    && typeof candidate.dir === "string"
    && Array.isArray(candidate.transform)
    && candidate.transform.every((entry) => typeof entry === "number")
    && typeof candidate.width === "number"
    && typeof candidate.height === "number"
    && typeof candidate.fontName === "string"
    && typeof candidate.hasEOL === "boolean"
}
import {
  createPersistedExportFixture,
  deletePersistedExportFixtures,
  ensureIntegrationBucket,
  getIntegrationBucketName,
  loadNormalizedPersistedEbook,
} from "./helpers/persisted-export-fixture.js"

const TEST_EMAIL_PREFIX = "pdf-export-itg-"

type PdfMetrics = {
  pageCount: number
  pageSizes: Array<{ width: number; height: number }>
  text: string
  imageOps: number
  minX: number
  maxX: number
  minY: number
  maxY: number
}

async function inspectPdfDocument(pdfBuffer: Buffer): Promise<PdfMetrics> {
  const pdfDocument = await getDocument({ data: new Uint8Array(pdfBuffer) }).promise

  const pageSizes: Array<{ width: number; height: number }> = []
  let totalImageOps = 0
  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY
  const textChunks: string[] = []

  for (let pageIndex = 1; pageIndex <= pdfDocument.numPages; pageIndex += 1) {
    const page = await pdfDocument.getPage(pageIndex)
    const viewport = page.getViewport({ scale: 1 })

    pageSizes.push({ width: viewport.width, height: viewport.height })

    const operatorList = await page.getOperatorList()
    const imageOperatorIds = new Set<number>([
      OPS.paintImageXObject,
      OPS.paintImageMaskXObject,
      OPS.paintImageXObjectRepeat,
      OPS.paintImageMaskXObjectRepeat,
      OPS.paintInlineImageXObject,
      OPS.paintInlineImageXObjectGroup,
    ])
    totalImageOps += operatorList.fnArray.filter((fn) => typeof fn === "number" && imageOperatorIds.has(fn)).length

    const textContent = await page.getTextContent()

    for (const item of textContent.items) {
      if (!isPdfTextItem(item)) {
        continue
      }

      if (item.str.trim() === "") {
        continue
      }

      textChunks.push(item.str)

      const x = item.transform[4] ?? 0
      const y = item.transform[5] ?? 0
      const width = item.width ?? 0
      const height = item.height ?? 0

      minX = Math.min(minX, x, x + width)
      maxX = Math.max(maxX, x + width)
      minY = Math.min(minY, y, y + height)
      maxY = Math.max(maxY, y + height)
    }
  }

  return {
    pageCount: pdfDocument.numPages,
    pageSizes,
    text: textChunks.join(" "),
    imageOps: totalImageOps,
    minX,
    maxX,
    minY,
    maxY,
  }
}

function expectStandardReadableMargins(metrics: PdfMetrics): void {
  const pageSize = metrics.pageSizes[0]

  expect(pageSize.width).toBeGreaterThan(0)
  expect(pageSize.height).toBeGreaterThan(0)
  expect(Math.abs(pageSize.width - 612)).toBeLessThan(15)
  expect(Math.abs(pageSize.height - 792)).toBeLessThan(15)
  expect(metrics.minX).toBeGreaterThan(20)
  expect(metrics.minY).toBeGreaterThan(20)
  expect(metrics.maxX).toBeLessThan(pageSize.width - 20)
  expect(metrics.maxY).toBeLessThan(pageSize.height - 20)
}

function expectA4PrintLayout(metrics: PdfMetrics): void {
  const pageSize = metrics.pageSizes[0]

  expect(pageSize.width).toBeCloseTo(595.28, 0)
  expect(pageSize.height).toBeCloseTo(841.89, 0)
  expect(metrics.minX).toBeGreaterThan(35)
  expect(metrics.minY).toBeGreaterThan(35)
  expect(metrics.maxX).toBeLessThan(pageSize.width - 35)
  expect(metrics.maxY).toBeLessThan(pageSize.height - 35)
}

describe("PdfExporter integration", () => {
  beforeEach(async () => {
    const bucket = getIntegrationBucketName()
    await ensureIntegrationBucket(bucket)
    await deletePersistedExportFixtures(TEST_EMAIL_PREFIX)
  })

  afterAll(async () => {
    await deletePersistedExportFixtures(TEST_EMAIL_PREFIX)
  })

  it("exports readable PDFs with embedded images and standard readable layout", async () => {
    const fixture = await createPersistedExportFixture(TEST_EMAIL_PREFIX)
    const ebook = await loadNormalizedPersistedEbook(fixture.ebookId)
    const exportedFile = await new PdfExporter("readable", testExtensions).export(ebook)

    expect(exportedFile.fileName).toMatch(/\.pdf$/)
    expect(exportedFile.mimeType).toBe("application/pdf")
    expect(Buffer.isBuffer(exportedFile.data)).toBe(true)
    expect(exportedFile.data.subarray(0, 5).toString()).toBe("%PDF-")

    const metrics = await inspectPdfDocument(exportedFile.data)

    expect(metrics.pageCount).toBeGreaterThan(0)
    expect(metrics.imageOps).toBeGreaterThan(0)
    expect(metrics.text).toContain(tipTapEbookFixture.title)
    expect(metrics.text).toContain(tipTapEbookFixture.subtitle)

    for (const chapter of tipTapChapterFixtures) {
      expect(metrics.text).toContain(chapter.title)
    }

    expect(metrics.text).toContain("At first light")
    expect(metrics.text).toContain("A pencil, a ruler, and room to revise.")
    expect(metrics.text).toContain("Travel is an education in attention, not accumulation.")
    expect(metrics.text).toContain("observe")
    expect(metrics.text).toContain("the archive")
    expect(metrics.text).toContain("Ada Rowan")

    expectStandardReadableMargins(metrics)
  }, 30_000)

  it("exports ready-to-print PDFs in A4 with print-style margins and embedded images", async () => {
    const fixture = await createPersistedExportFixture(TEST_EMAIL_PREFIX)
    const ebook = await loadNormalizedPersistedEbook(fixture.ebookId)
    const exportedFile = await new PdfExporter("ready-to-print", testExtensions).export(ebook)

    expect(exportedFile.fileName).toMatch(/\.pdf$/)
    expect(exportedFile.mimeType).toBe("application/pdf")
    expect(Buffer.isBuffer(exportedFile.data)).toBe(true)
    expect(exportedFile.data.subarray(0, 5).toString()).toBe("%PDF-")

    const metrics = await inspectPdfDocument(exportedFile.data)

    expect(metrics.pageCount).toBeGreaterThan(0)
    expect(metrics.imageOps).toBeGreaterThan(0)
    expect(metrics.text).toContain(tipTapEbookFixture.title)
    expect(metrics.text).toContain("A pencil, a ruler, and room to revise.")
    expect(metrics.text).toContain("By evening, the itinerary had become a story.")

    expectA4PrintLayout(metrics)
  }, 30_000)
})
