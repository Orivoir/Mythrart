import { describe, expect, it } from "vitest"

import normalizeExportData, { type ExportSource } from "./../../src/services/export/normalize.js"

type SourceChapter = ExportSource["chapters"][number]

const asset = (id: string) => ({ id, key: `key-${id}`, bucket: "bucket" })

function makeChapter(overrides: Partial<SourceChapter> = {}): SourceChapter {
  return {
    id: "ch-1",
    title: "Base title",
    position: 1,
    createdAt: new Date("2024-01-02T00:00:00Z"),
    locales: [
      { locale: "en", title: "English title", content: { type: "doc", content: [] } },
      { locale: "fr", title: "Titre français", content: { type: "doc", content: ["fr"] } },
    ],
    assetReferences: [],
    ...overrides,
  }
}

function makeSource(overrides: Partial<ExportSource> = {}): ExportSource {
  return {
    id: "ebook-1",
    title: "Ebook",
    subtitle: "Sub",
    shortDescription: "Short",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    coverAsset: null,
    chapters: [makeChapter()],
    ...overrides,
  }
}

describe("normalizeExportData", () => {
  it("maps ebook metadata", () => {
    const source = makeSource()

    const result = normalizeExportData(source, "en")

    expect(result).toMatchObject({
      id: "ebook-1",
      title: "Ebook",
      subtitle: "Sub",
      shortDescription: "Short",
      createdAt: source.createdAt,
    })
  })

  it("keeps null subtitle and shortDescription", () => {
    const result = normalizeExportData(makeSource({ subtitle: null, shortDescription: null }), "en")

    expect(result.subtitle).toBeNull()
    expect(result.shortDescription).toBeNull()
  })

  it("returns a null cover image when there is no cover asset", () => {
    expect(normalizeExportData(makeSource(), "en").coverImage).toBeNull()
  })

  it("maps the cover asset to coverImage", () => {
    const result = normalizeExportData(makeSource({ coverAsset: asset("cover") }), "en")

    expect(result.coverImage).toEqual({ assetId: "cover", key: "key-cover", bucket: "bucket" })
  })

  it("selects the translation matching the requested locale", () => {
    const en = normalizeExportData(makeSource(), "en").chapters[0]
    const fr = normalizeExportData(makeSource(), "fr").chapters[0]

    expect(en.title).toBe("English title")
    expect(en.content).toEqual({ type: "doc", content: [] })
    expect(fr.title).toBe("Titre français")
    expect(fr.content).toEqual({ type: "doc", content: ["fr"] })
  })

  it("does not use the first locale when another one is requested", () => {
    const chapter = makeChapter({
      locales: [
        { locale: "en", title: "EN", content: "en" },
        { locale: "es", title: "ES", content: "es" },
      ],
    })

    const result = normalizeExportData(makeSource({ chapters: [chapter] }), "es")

    expect(result.chapters[0].title).toBe("ES")
    expect(result.chapters[0].content).toBe("es")
  })

  it("throws when the requested translation is missing", () => {
    expect(() => normalizeExportData(makeSource(), "de")).toThrow(
      'Chapter ch-1 has no translation for locale "de"',
    )
  })

  it("throws when a chapter has no locales at all", () => {
    const source = makeSource({ chapters: [makeChapter({ locales: [] })] })

    expect(() => normalizeExportData(source, "en")).toThrow(/no translation/)
  })

  it("throws if any chapter lacks the translation, naming that chapter", () => {
    const source = makeSource({
      chapters: [
        makeChapter(),
        makeChapter({ id: "ch-2", position: 2, locales: [{ locale: "fr", title: "F", content: null }] }),
      ],
    })

    expect(() => normalizeExportData(source, "en")).toThrow(/Chapter ch-2/)
  })

  it("is case-sensitive on locale", () => {
    expect(() => normalizeExportData(makeSource(), "EN")).toThrow(/no translation/)
  })

  it("falls back to the chapter title when the translation title is null", () => {
    const chapter = makeChapter({ locales: [{ locale: "en", title: null, content: "x" }] })

    const result = normalizeExportData(makeSource({ chapters: [chapter] }), "en")

    expect(result.chapters[0].title).toBe("Base title")
  })

  it("keeps null content", () => {
    const chapter = makeChapter({ locales: [{ locale: "en", title: "T", content: null }] })

    const result = normalizeExportData(makeSource({ chapters: [chapter] }), "en")

    expect(result.chapters[0].content).toBeNull()
  })

  it("preserves chapter id, position, createdAt and source ordering", () => {
    const c1 = makeChapter({ id: "a", position: 1 })
    const c2 = makeChapter({ id: "b", position: 2, createdAt: new Date("2025-05-05T00:00:00Z") })

    const result = normalizeExportData(makeSource({ chapters: [c1, c2] }), "en")

    expect(result.chapters.map((chapter) => [chapter.id, chapter.position])).toEqual([
      ["a", 1],
      ["b", 2],
    ])
    expect(result.chapters[1].createdAt).toEqual(c2.createdAt)
  })

  it("returns no chapters and no assets for an ebook without chapters", () => {
    const result = normalizeExportData(makeSource({ chapters: [] }), "en")

    expect(result.chapters).toEqual([])
    expect(result.assets).toEqual([])
  })

  it("returns no assets when chapters have no asset references", () => {
    expect(normalizeExportData(makeSource(), "en").assets).toEqual([])
  })

  it("flattens content assets across chapters in order", () => {
    const source = makeSource({
      chapters: [
        makeChapter({ id: "a", assetReferences: [{ asset: asset("1") }, { asset: asset("2") }] }),
        makeChapter({ id: "b", position: 2, assetReferences: [{ asset: asset("3") }] }),
      ],
    })

    const result = normalizeExportData(source, "en")

    expect(result.assets).toEqual([
      { id: "1", key: "key-1", bucket: "bucket" },
      { id: "2", key: "key-2", bucket: "bucket" },
      { id: "3", key: "key-3", bucket: "bucket" },
    ])
  })

  it("only exposes id, key and bucket for assets", () => {
    const extended = { asset: { ...asset("1"), fileName: "a.png", sizeBytes: 3 } }
    const source = makeSource({ chapters: [makeChapter({ assetReferences: [extended] })] })

    expect(normalizeExportData(source, "en").assets[0]).toEqual(asset("1"))
  })

  it("does not mutate the source", () => {
    const source = makeSource({ coverAsset: asset("cover") })
    const snapshot = structuredClone(source)

    normalizeExportData(source, "fr")

    expect(source).toEqual(snapshot)
  })

  it("deduplicates assets referenced by multiple chapters", () => {
    const sharedAsset = asset("shared")

    const source = makeSource({
      chapters: [
        makeChapter({
          id: "ch-1",
          assetReferences: [{ asset: sharedAsset }],
        }),
        makeChapter({
          id: "ch-2",
          assetReferences: [{ asset: sharedAsset }],
        }),
      ],
    })

    const result = normalizeExportData(source, "en")

    expect(result.assets).toEqual([sharedAsset])
  })

  it("selects the requested locale independently for each chapter", () => {
    const source = makeSource({
      chapters: [
        makeChapter({
          id: "ch-1",
          locales: [
            { locale: "fr", title: "Titre 1", content: "fr-1" },
            { locale: "en", title: "Title 1", content: "en-1" },
          ],
        }),
        makeChapter({
          id: "ch-2",
          locales: [
            { locale: "en", title: "Title 2", content: "en-2" },
            { locale: "fr", title: "Titre 2", content: "fr-2" },
          ],
        }),
      ],
    })

    const result = normalizeExportData(source, "fr")

    expect(result.chapters.map(({ title, content }) => ({ title, content }))).toEqual([
      { title: "Titre 1", content: "fr-1" },
      { title: "Titre 2", content: "fr-2" },
    ])

    const otherResult = normalizeExportData(source, "en")
    
    expect(otherResult.chapters.map(({ title, content }) => ({ title, content }))).toEqual([
      { title: "Title 1", content: "en-1" },
      { title: "Title 2", content: "en-2" },
    ])
  })

  it("exposes only the normalized chapter fields", () => {
    const result = normalizeExportData(makeSource(), "en")

    expect(Object.keys(result.chapters[0]).sort()).toEqual([
      "content",
      "createdAt",
      "id",
      "position",
      "title"
    ])
  })
})
