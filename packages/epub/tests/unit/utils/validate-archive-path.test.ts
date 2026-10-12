import { describe, expect, it } from "vitest"
import { EpubError } from "../../../errors"
import { MIMETYPE_FILE } from "../../../constants"
import { validateArchivePath } from "../../../utils/validate-archive-path"

describe("validateArchivePath", () => {
  it("accepts valid relative archive paths using forward slashes", () => {
    expect(() => validateArchivePath("OEBPS/package.opf")).not.toThrow()
    expect(() => validateArchivePath("OEBPS/images/cover.png")).not.toThrow()
    expect(() => validateArchivePath("chapter-1.xhtml")).not.toThrow()
  })

  it("throws for empty or absolute paths", () => {
    expect(() => validateArchivePath("")).toThrow(EpubError)
    expect(() => validateArchivePath("/")).toThrow(EpubError)
    expect(() => validateArchivePath("/OEBPS/package.opf")).toThrow(
      "Invalid EPUB archive path: /OEBPS/package.opf",
    )
  })

  it("throws when the path uses backslashes or control characters", () => {
    expect(() => validateArchivePath("OEBPS\\package.opf")).toThrow(EpubError)
    expect(() => validateArchivePath("OEBPS\npackage.opf")).toThrow(EpubError)
    expect(() => validateArchivePath("OEBPS\u0000package.opf")).toThrow(
      EpubError,
    )
  })

  it("throws when a segment is empty, dot or parent directory", () => {
    expect(() => validateArchivePath("OEBPS//package.opf")).toThrow(EpubError)
    expect(() => validateArchivePath("OEBPS/./package.opf")).toThrow(EpubError)
    expect(() => validateArchivePath("OEBPS/../package.opf")).toThrow(EpubError)
    expect(() => validateArchivePath("./package.opf")).toThrow(EpubError)
    expect(() => validateArchivePath("../package.opf")).toThrow(EpubError)
  })

  it("throws when the path is the reserved mimetype file", () => {
    expect(() => validateArchivePath(MIMETYPE_FILE)).toThrow(EpubError)
    expect(() => validateArchivePath(MIMETYPE_FILE)).toThrow(
      'The "mimetype" file is managed by the EPUB archive builder',
    )
  })
})
