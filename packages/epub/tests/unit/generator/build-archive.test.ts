import { describe, expect, it } from "vitest"

import { EpubError } from "../../../errors"
import { buildEpubArchive } from "../../../generator/build-archive"
import { EPUB_MIMETYPE, MIMETYPE_FILE } from "../../../constants"
import type { EpubArchiveFile } from "../../../types"

describe("buildEpubArchive", () => {
  describe("input validation", () => {
    it("rejects a non-array argument", async () => {
      await expect(
        buildEpubArchive(null as unknown as EpubArchiveFile[]),
      ).rejects.toThrow(EpubError)
    })

    it("rejects an invalid file entry", async () => {
      await expect(
        buildEpubArchive([null as unknown as EpubArchiveFile]),
      ).rejects.toThrow(EpubError)
    })

    it("rejects a file without a string path", async () => {
      await expect(
        buildEpubArchive([
          { path: 123, data: "content" } as unknown as EpubArchiveFile,
        ]),
      ).rejects.toThrow(EpubError)
    })

    it("rejects unsupported data types", async () => {
      await expect(
        buildEpubArchive([
          {
            path: "OEBPS/file.txt",
            data: { content: "invalid" },
          } as unknown as EpubArchiveFile,
        ]),
      ).rejects.toThrow(EpubError)
    })

    it("accepts empty strings and empty binary files", async () => {
      await expect(
        buildEpubArchive([
          { path: "OEBPS/empty.txt", data: "" },
          { path: "OEBPS/empty.bin", data: new Uint8Array() },
        ]),
      ).resolves.toBeInstanceOf(Uint8Array)
    })
  })

  describe("archive paths", () => {
    it("rejects the reserved mimetype path", async () => {
      await expect(
        buildEpubArchive([{ path: MIMETYPE_FILE, data: EPUB_MIMETYPE }]),
      ).rejects.toThrow(EpubError)
    })

    it.each([
      "",
      "/absolute.txt",
      "../outside.txt",
      "OEBPS/../outside.txt",
      "./file.txt",
      "OEBPS/./file.txt",
      "OEBPS//file.txt",
      "OEBPS/",
      "OEBPS\\file.txt",
      "C:\\temp\\file.txt",
      "OEBPS/\u0000file.txt",
    ])("rejects unsafe path %j", async (path) => {
      await expect(
        buildEpubArchive([{ path, data: "content" }]),
      ).rejects.toThrow(EpubError)
    })

    it("rejects duplicate paths", async () => {
      await expect(
        buildEpubArchive([
          { path: "OEBPS/file.txt", data: "first" },
          { path: "OEBPS/file.txt", data: "second" },
        ]),
      ).rejects.toThrow("Duplicate EPUB archive path: OEBPS/file.txt")
    })

    it("preserves case-sensitive distinct paths", async () => {
      await expect(
        buildEpubArchive([
          { path: "OEBPS/File.txt", data: "upper" },
          { path: "OEBPS/file.txt", data: "lower" },
        ]),
      ).resolves.toBeInstanceOf(Uint8Array)
    })
  })
})
