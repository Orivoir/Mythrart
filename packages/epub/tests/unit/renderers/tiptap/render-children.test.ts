import { describe, expect, it } from "vitest"
import { EpubError } from "../../../../errors"
import { renderChildren } from "../../../../renderers/tiptap/render-children"
import type { EpubAsset } from "../../../../types"

const assets: EpubAsset[] = [
  {
    id: "img-1",
    fileName: "fixture-1.png",
    mimeType: "image/png",
    data: new Uint8Array([1, 2, 3]),
  },
]

describe("renderChildren", () => {
  it("returns an empty string when the node has no content", () => {
    expect(renderChildren({ type: "paragraph" } as any, assets)).toBe("")
  })

  it("renders child nodes in their original order and concatenates the XHTML", () => {
    const node = {
      type: "paragraph",
      content: [
        { type: "text", text: "Hello " },
        {
          type: "mention",
          attrs: { label: "Alice" },
        },
        {
          type: "image",
          attrs: { assetId: "img-1" },
        },
      ],
    } as any

    expect(renderChildren(node, assets)).toBe(
      "Hello Alice<img src=\"../images/fixture-1.png\" alt=\"\" />",
    )
  })

  it("throws when content exists but is not an array", () => {
    const node = {
      type: "paragraph",
      content: { type: "text", text: "invalid" },
    } as any

    expect(() => renderChildren(node, assets)).toThrow(EpubError)
    expect(() => renderChildren(node, assets)).toThrow(
      "Invalid content array on TipTap node: paragraph",
    )
  })

  it("returns an empty string when content is an empty array", () => {
    expect(
      renderChildren({ type: "paragraph", content: [] } as any, assets),
    ).toBe("")
  })

  it("propagates errors raised by renderNode", () => {
    const node = {
      type: "paragraph",
      content: [{ type: "unknownNode" }],
    } as any

    expect(() => renderChildren(node, assets)).toThrow(EpubError)
    expect(() => renderChildren(node, assets)).toThrow(
      "Unsupported TipTap node: unknownNode",
    )
  })

  it("renders nested children recursively", () => {
    const node = {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Nested " },
            { type: "text", text: "content" },
          ],
        },
      ],
    } as any

    expect(renderChildren(node, assets)).toBe(
      "<p>Nested content</p>",
    )
  })

})
