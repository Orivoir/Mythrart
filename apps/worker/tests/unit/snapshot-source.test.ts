import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  send: vi.fn(),
}))

vi.mock("@mythrart/database", () => ({
  prisma: { snapshot: { findUnique: mocks.findUnique } },
}))

vi.mock("@mythrart/s3", () => ({
  s3: { send: mocks.send },
  GetObjectCommand: class {
    constructor(public input: unknown) {}
  },
}))

import { loadSnapshotSource } from "../../src/services/export/snapshot-source.js"

const EBOOK_ID = "ebook-1"
const SNAPSHOT_ID = "snap-1"

const asset = (id: string) => ({
  assetId: id,
  key: `key-${id}`,
  bucket: "bucket",
  fileName: `${id}.png`,
  mimeType: "image/png",
  sizeBytes: 10,
})

// Matches the JSON written by services/snapshot/snapshot.ts (dates serialized by JSON.stringify).
function makePayload(overrides: Record<string, unknown> = {}) {
  return {
    formatVersion: 1,
    metadata: { generatedAt: 1700000000000, version: 1 },
    ebook: {
      id: EBOOK_ID,
      title: "Ebook",
      subtitle: "Sub",
      shortDescription: "Short",
      createdAt: "2024-01-01T00:00:00.000Z",
      coverImage: asset("cover"),
    },
    chapters: [
      {
        id: "ch-1",
        title: "Base 1",
        position: 1,
        locales: [
          { locale: "en", title: "EN 1", content: { type: "doc", content: [] }, wordsCount: 1, charactersCount: 5 },
          { locale: "fr", title: null, content: null, wordsCount: 0, charactersCount: 0 },
        ],
        assets: [asset("a1"), asset("a2")],
        createdAt: "2024-01-02T00:00:00.000Z",
      },
    ],
    ...overrides,
  }
}

function makeSnapshot(overrides: Record<string, unknown> = {}) {
  return {
    id: SNAPSHOT_ID,
    ebookId: EBOOK_ID,
    status: "READY",
    file: { bucket: "bucket", key: "users/u/snapshots/snapshot-v1.json" },
    ...overrides,
  }
}

function mockBody(body: string | undefined) {
  mocks.send.mockResolvedValue({
    Body: { transformToString: async () => body },
  })
}

function setup(payload: unknown = makePayload(), snapshot: unknown = makeSnapshot()) {
  mocks.findUnique.mockResolvedValue(snapshot)
  mockBody(JSON.stringify(payload))
}

describe("loadSnapshotSource", () => {
  beforeEach(() => {
    setup()
  })

  it("maps a valid snapshot to ExportSource", async () => {
    const source = await loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)

    expect(source).toMatchObject({
      id: EBOOK_ID,
      title: "Ebook",
      subtitle: "Sub",
      shortDescription: "Short",
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      coverAsset: { id: "cover", key: "key-cover", bucket: "bucket" },
    })
    expect(source.chapters).toEqual([
      {
        id: "ch-1",
        title: "Base 1",
        position: 1,
        createdAt: new Date("2024-01-02T00:00:00.000Z"),
        locales: [
          { locale: "en", title: "EN 1", content: { type: "doc", content: [] } },
          { locale: "fr", title: null, content: null },
        ],
        assetReferences: [
          { asset: { id: "a1", key: "key-a1", bucket: "bucket" } },
          { asset: { id: "a2", key: "key-a2", bucket: "bucket" } },
        ],
      },
    ])
  })

  it("reads the file referenced by the snapshot from S3", async () => {
    await loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)

    expect(mocks.findUnique).toHaveBeenCalledWith({
      where: { id: SNAPSHOT_ID },
      include: { file: true },
    })
    expect(mocks.send.mock.calls[0][0].input).toEqual({
      Bucket: "bucket",
      Key: "users/u/snapshots/snapshot-v1.json",
    })
  })

  it("returns a null cover asset when the snapshot has no cover", async () => {
    const payload = makePayload()
    payload.ebook.coverImage = null as never
    setup(payload)

    expect((await loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).coverAsset).toBeNull()
  })

  it("keeps null subtitle and shortDescription", async () => {
    const payload = makePayload()
    payload.ebook.subtitle = null as never
    payload.ebook.shortDescription = null as never
    setup(payload)

    const source = await loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)

    expect(source.subtitle).toBeNull()
    expect(source.shortDescription).toBeNull()
  })

  it("orders chapters by position", async () => {
    const base = makePayload().chapters[0]
    setup(makePayload({
      chapters: [
        { ...base, id: "c3", position: 3 },
        { ...base, id: "c1", position: 1 },
        { ...base, id: "c2", position: 2 },
      ],
    }))

    const source = await loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)

    expect(source.chapters.map((chapter) => chapter.id)).toEqual(["c1", "c2", "c3"])
  })

  it("preserves null chapter content", async () => {
    const source = await loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)

    expect(source.chapters[0].locales[1].content).toBeNull()
  })

  it("preserves chapters without assets or locales", async () => {
    const base = makePayload().chapters[0]
    setup(makePayload({ chapters: [{ ...base, locales: [], assets: [] }] }))

    const [chapter] = (await loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).chapters

    expect(chapter.locales).toEqual([])
    expect(chapter.assetReferences).toEqual([])
  })

  describe("snapshot record validation", () => {
    it("rejects when the snapshot does not exist", async () => {
      mocks.findUnique.mockResolvedValue(null)

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow(
        `Snapshot ${SNAPSHOT_ID} not found`,
      )
      expect(mocks.send).not.toHaveBeenCalled()
    })

    it("rejects when the snapshot belongs to another ebook", async () => {
      setup(makePayload(), makeSnapshot({ ebookId: "other" }))

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow(
        `Snapshot ${SNAPSHOT_ID} does not belong to ebook ${EBOOK_ID}`,
      )
      expect(mocks.send).not.toHaveBeenCalled()
    })

    it.each(["PENDING", "FAILED"])("rejects when status is %s", async (status) => {
      setup(makePayload(), makeSnapshot({ status }))

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow(
        `Snapshot ${SNAPSHOT_ID} is not ready (status: ${status})`,
      )
      expect(mocks.send).not.toHaveBeenCalled()
    })

    it("rejects when the snapshot has no file", async () => {
      setup(makePayload(), makeSnapshot({ file: null }))

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow(
        `Snapshot ${SNAPSHOT_ID} has no file`,
      )
      expect(mocks.send).not.toHaveBeenCalled()
    })
  })

  describe("payload validation", () => {
    it("rejects an empty S3 body", async () => {
      mockBody("")

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow(
        `Snapshot ${SNAPSHOT_ID} file is empty`,
      )
    })

    it("rejects a missing S3 body", async () => {
      mocks.send.mockResolvedValue({})

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow(/file is empty/)
    })

    it("rejects invalid JSON", async () => {
      mockBody("{not json")

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow(SyntaxError)
    })

    it("rejects a payload that does not match the schema", async () => {
      setup({ formatVersion: 1, ebook: { id: EBOOK_ID }, chapters: "nope" })

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow()
    })

    it("rejects a chapter with an invalid shape", async () => {
      const base = makePayload().chapters[0]
      setup(makePayload({ chapters: [{ ...base, position: "first" }] }))

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow()
    })

    it("rejects an unsupported formatVersion", async () => {
      setup(makePayload({ formatVersion: 2 }))

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow()
    })

    it("rejects when the ebook id inside the payload differs", async () => {
      const payload = makePayload()
      payload.ebook.id = "other"
      setup(payload)

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow(
        `Snapshot ${SNAPSHOT_ID} content does not belong to ebook ${EBOOK_ID}`,
      )
    })

    it("propagates S3 errors", async () => {
      const error = new Error("S3 unavailable")
      mocks.send.mockRejectedValue(error)

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow(
        "S3 unavailable",
      )
    })

    it("rejects an asset with an empty storage key", async () => {
      const payload = makePayload()
      payload.ebook.coverImage = {
        ...asset("cover"),
        key: "",
      } as never

      setup(payload)

      await expect(loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)).rejects.toThrow()
    })

    it("accepts a snapshot with no chapters", async () => {
      setup(makePayload({ chapters: [] }))

      const source = await loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)

      expect(source.chapters).toEqual([])
    })

    it("maps snapshot data to the exact ExportSource shape", async () => {
        const source = await loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)

        expect(Object.keys(source).sort()).toEqual([
          "chapters",
          "coverAsset",
          "createdAt",
          "id",
          "shortDescription",
          "subtitle",
          "title",
        ])

        expect(Object.keys(source.chapters[0]).sort()).toEqual([
          "assetReferences",
          "createdAt",
          "id",
          "locales",
          "position",
          "title",
        ])
    })

    it("preserves locale metadata when chapter content is null", async () => {
      const source = await loadSnapshotSource(EBOOK_ID, SNAPSHOT_ID)

      expect(source.chapters[0].locales).toContainEqual({
        locale: "fr",
        title: null,
        content: null,
      })
    })
  })
})
