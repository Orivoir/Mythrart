import { describe, expect, it } from "vitest"

import { EpubError } from "../../../errors"
import { renderChapter } from "../../../renderers/chapter"
import type { EpubChapter } from "../../../types"

const chapter: EpubChapter = {
  id: "chapter-1",
  title: "My chapter",
  position: 1,
  content: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Hello world" }],
      },
    ],
  },
}

describe("renderChapter", () => {
  it("renders a complete XHTML document", () => {
    const result = renderChapter(chapter, "en", [])

    expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(result).toContain("<!DOCTYPE html>")
    expect(result).toContain('xmlns="http://www.w3.org/1999/xhtml"')
    expect(result).toContain('lang="en" xml:lang="en"')
    expect(result).toContain("<title>My chapter</title>")
    expect(result).toContain("<h1>My chapter</h1>")
    expect(result).toContain("<p>Hello world</p>")
    expect(result).toContain(
      '<link rel="stylesheet" type="text/css" href="../styles.css" />',
    )
    expect(result).toContain("</html>")
  })

  it("escapes the chapter title", () => {
    const result = renderChapter({ ...chapter, title: "A & B <C>" }, "en", [])

    expect(result).toContain("<title>A &amp; B &lt;C&gt;</title>")
    expect(result).toContain("<h1>A &amp; B &lt;C&gt;</h1>")
  })

  it("escapes the language attribute", () => {
    const result = renderChapter(chapter, "en&test", [])

    expect(result).toContain('lang="en&amp;test"')
    expect(result).toContain('xml:lang="en&amp;test"')
  })

  it("throws when the chapter title is empty", () => {
    expect(() => renderChapter({ ...chapter, title: "   " }, "en", [])).toThrow(
      EpubError,
    )

    expect(() => renderChapter({ ...chapter, title: "   " }, "en", [])).toThrow(
      `Invalid title for EPUB chapter: ${chapter.id}`,
    )
  })

  it("throws when the language is empty", () => {
    expect(() => renderChapter(chapter, "   ", [])).toThrow(EpubError)

    expect(() => renderChapter(chapter, "   ", [])).toThrow(
      `Invalid language for EPUB chapter: ${chapter.id}`,
    )
  })

  it("propagates rendering errors from unsupported content", () => {
    const invalidChapter = {
      ...chapter,
      content: { type: "unsupported" },
    } as EpubChapter

    expect(() => renderChapter(invalidChapter, "en", [])).toThrow(EpubError)

    expect(() => renderChapter(invalidChapter, "en", [])).toThrow(
      "Unsupported TipTap node: unsupported",
    )
  })
})
