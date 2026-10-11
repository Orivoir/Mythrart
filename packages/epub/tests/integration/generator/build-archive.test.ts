
import JSZip from "jszip"
import { describe, expect, it } from "vitest"

import { buildEpubArchive } from "../../../generator/build-archive"
import { EPUB_MIMETYPE, MIMETYPE_FILE } from "../../../constants"
import { createArchiveFixture } from "../../fixtures/epub-archive"

/**
 * Reads local ZIP headers in physical order.
 *
 * ZIP local file header:
 * - signature: offset 0
 * - compression method: offset 8
 * - compressed size: offset 18
 * - filename length: offset 26
 * - extra field length: offset 28
 */
function readLocalFileHeaders(data: Uint8Array): Array<{
  name: string
  compressionMethod: number
}> {
  const view = new DataView(
    data.buffer,
    data.byteOffset,
    data.byteLength,
  )
  const decoder = new TextDecoder()
  const entries: Array<{
    name: string
    compressionMethod: number
  }> = []

  let offset = 0

  while (offset + 30 <= data.byteLength) {
    const signature = view.getUint32(offset, true)

    // The next structure is no longer a local file header.
    if (signature !== 0x04034b50) {
      break
    }

    const compressionMethod = view.getUint16(offset + 8, true)
    const compressedSize = view.getUint32(offset + 18, true)
    const fileNameLength = view.getUint16(offset + 26, true)
    const extraLength = view.getUint16(offset + 28, true)

    const fileNameStart = offset + 30
    const fileNameEnd = fileNameStart + fileNameLength

    if (fileNameEnd + extraLength > data.byteLength) {
      throw new Error("Invalid ZIP local file header")
    }

    const name = decoder.decode(data.subarray(fileNameStart, fileNameEnd))

    entries.push({ name, compressionMethod })

    offset = fileNameEnd + extraLength + compressedSize
  }

  return entries
}

describe("buildEpubArchive integration", () => {
  it("generates a ZIP archive that JSZip can reopen", async () => {
    const archive = await buildEpubArchive(createArchiveFixture())

    expect(archive).toBeInstanceOf(Uint8Array)

    const zip = await JSZip.loadAsync(archive)

    expect(zip.file(MIMETYPE_FILE)).not.toBeNull()
    expect(zip.file("META-INF/container.xml")).not.toBeNull()
    expect(zip.file("OEBPS/content.opf")).not.toBeNull()
    expect(zip.file("OEBPS/nav.xhtml")).not.toBeNull()
    expect(zip.file("OEBPS/chapters/chapter-1.xhtml")).not.toBeNull()
    expect(zip.file("OEBPS/styles.css")).not.toBeNull()
    expect(zip.file("OEBPS/images/cover.png")).not.toBeNull()
  })

  it("writes mimetype first in physical ZIP order", async () => {
    const archive = await buildEpubArchive(createArchiveFixture())
    const entries = readLocalFileHeaders(archive)

    expect(entries.length).toBeGreaterThan(1)
    expect(entries[0].name).toBe(MIMETYPE_FILE)
  })

  it("stores mimetype without compression", async () => {
    const archive = await buildEpubArchive(createArchiveFixture())
    const entries = readLocalFileHeaders(archive)

    expect(entries[0]).toEqual({
      name: MIMETYPE_FILE,
      compressionMethod: 0, // ZIP STORE
    })
  })

  it("compresses the remaining files using DEFLATE", async () => {
    const archive = await buildEpubArchive(createArchiveFixture())
    const entries = readLocalFileHeaders(archive)

    expect(entries.slice(1).length).toBeGreaterThan(0)

    for (const entry of entries.slice(1)) {
      expect(entry.compressionMethod).toBe(8) // ZIP DEFLATE
    }
  })

  it("writes the exact mimetype content", async () => {
    const archive = await buildEpubArchive(createArchiveFixture())
    const zip = await JSZip.loadAsync(archive)

    expect(await zip.file(MIMETYPE_FILE)?.async("text")).toBe(
      EPUB_MIMETYPE,
    )
  })

  it("preserves all text file contents", async () => {
    const files = createArchiveFixture()
    const archive = await buildEpubArchive(files)
    const zip = await JSZip.loadAsync(archive)

    for (const file of files) {
      if (typeof file.data !== "string") continue

      const extracted = await zip.file(file.path)?.async("text")

      expect(extracted).toBe(file.data)
    }
  })

  it("preserves binary file contents byte-for-byte", async () => {
    const files = createArchiveFixture()
    const archive = await buildEpubArchive(files)
    const zip = await JSZip.loadAsync(archive)

    for (const file of files) {
      if (!(file.data instanceof Uint8Array)) continue

      const extracted = await zip.file(file.path)?.async("uint8array")

      expect(extracted).toEqual(file.data)
    }
  })

  it("supports an archive containing only mimetype", async () => {
    const archive = await buildEpubArchive([])
    const zip = await JSZip.loadAsync(archive)

    expect(Object.keys(zip.files)).toEqual([MIMETYPE_FILE])
    expect(await zip.file(MIMETYPE_FILE)?.async("text")).toBe(
      EPUB_MIMETYPE,
    )
  })

  it("preserves Unicode filenames and content", async () => {
    const archive = await buildEpubArchive([
      {
        path: "OEBPS/chapters/été-日本.xhtml",
        data: "<p>Été, 日本, café</p>",
      },
    ])

    const zip = await JSZip.loadAsync(archive)
    const content = await zip
      .file("OEBPS/chapters/été-日本.xhtml")
      ?.async("text")

    expect(content).toBe("<p>Été, 日本, café</p>")
  })
})
