import { describe, expect, it } from "vitest"
import { TxtExporter } from "../src/services/export/exporters/txt.exporter.js"
import type { NormalizedEbook } from "../src/services/export/normalize.js"
import { testExtensions, tipTapEbookFixture } from "./fixtures/index.js"

const fixtureDate = new Date("2026-08-31T00:00:00.000Z")

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function countHeadingOccurrences(text: string, heading: string): number {
  const escapedHeading = escapeRegExp(heading.toUpperCase())
  const matches = text.match(new RegExp(`^${escapedHeading}$`, "gm"))

  return matches?.length ?? 0
}

function createNormalizedEbookFixture(): NormalizedEbook {
  return {
    id: tipTapEbookFixture.id,
    title: tipTapEbookFixture.title,
    subtitle: tipTapEbookFixture.subtitle,
    shortDescription: null,
    createdAt: fixtureDate,
    coverImage: null,
    assets: [],
    chapters: tipTapEbookFixture.chapters.map((chapter) => ({
      ...chapter,
      content: chapter.content as NormalizedEbook["chapters"][number]["content"],
      createdAt: fixtureDate,
    })),
  }
}

describe("TxtExporter", () => {
  it("exports rich TipTap content through HTML as readable plain text", async () => {
    const ebook = createNormalizedEbookFixture()
    const exportedFile = await new TxtExporter(testExtensions).export(ebook)
    const exportedText = exportedFile.data.toString("utf8")
    const normalizedText = exportedText.toLowerCase()

    expect(exportedFile.fileName).toMatch(/\.txt$/)
    expect(exportedFile.mimeType).toBe("text/plain; charset=utf-8")
    expect(Buffer.isBuffer(exportedFile.data)).toBe(true)
    expect(normalizedText).toContain(ebook.title.toLowerCase())
    expect(exportedText).toContain(ebook.subtitle)

    for (const chapter of ebook.chapters) {
      expect(countHeadingOccurrences(exportedText, chapter.title)).toBe(1)
    }

    expect(exportedText).toContain("At first light")
    expect(exportedText).toContain("A pencil, a ruler, and room to revise.")
    expect(exportedText).toContain("Travel is an education in attention, not accumulation.")
    expect(exportedText).toContain("observe\nrevise\nrepeat")
    expect(exportedText).toContain("By evening, the itinerary had become a story.")
    expect(exportedText).toContain("Ada Rowan")
    expect(exportedText).toContain("Sunrise over the opening chapter landscape")
    expect(exportedText).toContain("the archive")
    expect(exportedText).toContain("[https://example.test/archive/field-notes]")
    expect(exportedText).not.toMatch(/<[^>]+>/)
  })
})