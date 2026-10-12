import { describe, expect, it } from "vitest"
import { EpubError } from "../../../../errors"
import { renderMarks } from "../../../../renderers/tiptap/render-marks"

describe("renderMarks", () => {
  it("returns the original content when no marks are provided", () => {
    expect(renderMarks("plain text")).toBe("plain text")
    expect(renderMarks("plain text", [])).toBe("plain text")
  })

  it("wraps text with each supported inline mark", () => {
    expect(renderMarks("bold", [{ type: "bold" } as any])).toBe(
      "<strong>bold</strong>",
    )
    expect(renderMarks("italic", [{ type: "italic" } as any])).toBe(
      "<em>italic</em>",
    )
    expect(renderMarks("underlined", [{ type: "underline" } as any])).toBe(
      "<u>underlined</u>",
    )
    expect(renderMarks("struck", [{ type: "strike" } as any])).toBe(
      "<s>struck</s>",
    )
    expect(renderMarks("code", [{ type: "code" } as any])).toBe(
      "<code>code</code>",
    )
  })

  it("applies nested marks in a consistent order", () => {
    const marks = [
      { type: "bold" },
      { type: "italic" },
      { type: "link", attrs: { href: "https://example.com" } },
    ] as any

    expect(renderMarks("hello", marks)).toBe(
      '<strong><em><a href="https://example.com">hello</a></em></strong>',
    )
  })

  it("validates and escapes the href value for link marks", () => {
    const href = 'https://example.com/?q="x"&b=<y>'

    expect(
      renderMarks("Link", [{ type: "link", attrs: { href } } as any]),
    ).toBe(
      '<a href="https://example.com/?q=&quot;x&quot;&amp;b=&lt;y&gt;">Link</a>',
    )
  })

  it("throws for invalid link href values", () => {
    expect(() =>
      renderMarks("Broken", [{ type: "link", attrs: { href: "   " } } as any]),
    ).toThrow(EpubError)

    expect(() =>
      renderMarks("Broken", [
        { type: "link", attrs: { href: "ftp://example.com" } } as any,
      ]),
    ).toThrow(EpubError)
  })

  it("throws for unsupported mark types", () => {
    expect(() => renderMarks("x", [{ type: "highlight" } as any])).toThrow(
      EpubError,
    )

    expect(() => renderMarks("x", [{ type: "highlight" } as any])).toThrow(
      "Unsupported TipTap mark: highlight",
    )
  })
})
