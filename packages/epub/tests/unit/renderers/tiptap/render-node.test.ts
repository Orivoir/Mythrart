import { describe, expect, it } from "vitest"
import { EpubError } from "../../../../errors"
import { renderNode } from "../../../../renderers/tiptap/render-node"
import type { EpubAsset } from "../../../../types"

const assets: EpubAsset[] = [
  {
    id: "img-1",
    fileName: "fixture-1.png",
    mimeType: "image/png",
    data: new Uint8Array([1, 2, 3]),
  },
]

describe("renderNode", () => {
  it("renders a document node by delegating to renderChildren", () => {
    const node = {
      type: "doc",
      content: [
        { type: "text", text: "Hello" },
        { type: "text", text: " world" },
      ],
    } as any

    expect(renderNode(node, assets)).toBe("Hello world")
  })

  it("renders paragraph, heading, blockquote, list and break nodes", () => {
    expect(
      renderNode(
        { type: "paragraph", content: [{ type: "text", text: "Hello" }] },
        assets,
      ),
    ).toBe("<p>Hello</p>")

    expect(
      renderNode(
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Title" }],
        },
        assets,
      ),
    ).toBe("<h2>Title</h2>")

    expect(
      renderNode(
        { type: "blockquote", content: [{ type: "text", text: "Quote" }] },
        assets,
      ),
    ).toBe("<blockquote>Quote</blockquote>")

    expect(
      renderNode(
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "One" }],
                },
              ],
            },
          ],
        } as any,
        assets,
      ),
    ).toBe("<ul><li><p>One</p></li></ul>")

    expect(
      renderNode(
        {
          type: "orderedList",
          attrs: { start: 3 },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "One" }],
                },
              ],
            },
          ],
        } as any,
        assets,
      ),
    ).toBe('<ol start="3"><li><p>One</p></li></ol>')

    expect(renderNode({ type: "hardBreak" } as any, assets)).toBe("<br />")
    expect(renderNode({ type: "horizontalRule" } as any, assets)).toBe("<hr />")
  })

  it("renders text nodes with escaping and mark support", () => {
    const node = {
      type: "text",
      text: "A < B & C",
      marks: [{ type: "bold" }],
    } as any

    expect(renderNode(node, assets)).toBe("<strong>A &lt; B &amp; C</strong>")
  })

  it("renders image and mention nodes using their specific renderers", () => {
    expect(
      renderNode(
        { type: "image", attrs: { assetId: "img-1", alt: "My image" } },
        assets,
      ),
    ).toBe('<img src="../images/fixture-1.png" alt="My image" />')

    expect(
      renderNode({ type: "mention", attrs: { label: "@alice" } }, assets),
    ).toBe("@alice")
  })

  it("throws for invalid node shapes and unsupported nodes", () => {
    expect(() => renderNode({} as any, assets)).toThrow(EpubError)
    expect(() => renderNode({} as any, assets)).toThrow(
      "Invalid TipTap node: missing node type",
    )

    expect(() =>
      renderNode({ type: "heading", attrs: { level: 9 } } as any, assets),
    ).toThrow(EpubError)

    expect(() =>
      renderNode({ type: "orderedList", attrs: { start: 0 } } as any, assets),
    ).toThrow(EpubError)

    expect(() => renderNode({ type: "text" } as any, assets)).toThrow(EpubError)

    expect(() => renderNode({ type: "unsupported" } as any, assets)).toThrow(
      EpubError,
    )
  })

  it.each([0, 1.5, 7, "2", null])(
    "throws when the heading level is invalid: %s",
    (level) => {
      expect(() =>
        renderNode(
          {
            type: "heading",
            attrs: { level },
          } as any,
          assets,
        ),
      ).toThrow(EpubError)
    },
  )

  it.each([1.5, "3", 0, -1])(
    "throws when the ordered list start is invalid: %s",
    (start) => {
      expect(() =>
        renderNode(
          {
            type: "orderedList",
            attrs: { start },
          } as any,
          assets,
        ),
      ).toThrow(EpubError)
    },
  )

  it("uses the default start when the ordered list start is null", () => {
    expect(
      renderNode(
        {
          type: "orderedList",
          attrs: { start: null },
          content: [],
        } as any,
        assets,
      ),
    ).toBe("<ol></ol>")
  })

  it("uses the default start when the ordered list start is undefined", () => {
    expect(
      renderNode(
        {
          type: "orderedList",
          attrs: { start: undefined },
          content: [],
        } as any,
        assets,
      ),
    ).toBe("<ol></ol>")
  })

  it("omits the start attribute when the ordered list starts at 1", () => {
    expect(
      renderNode(
        {
          type: "orderedList",
          attrs: { start: 1 },
          content: [],
        } as any,
        assets,
      ),
    ).toBe("<ol></ol>")
  })

  it("propagates errors from invalid mention nodes", () => {
    expect(() =>
      renderNode(
        {
          type: "mention",
          attrs: { label: " ", id: " " },
        } as any,
        assets,
      ),
    ).toThrow(EpubError)

    expect(() =>
      renderNode(
        {
          type: "mention",
          attrs: { label: " ", id: " " },
        } as any,
        assets,
      ),
    ).toThrow("Mention node has no usable label or id")
  })

  it("throws when a text node contains an unsupported mark", () => {
    expect(() =>
      renderNode(
        {
          type: "text",
          text: "Highlighted text",
          marks: [{ type: "highlight" }],
        } as any,
        assets,
      ),
    ).toThrow(EpubError)

    expect(() =>
      renderNode(
        {
          type: "text",
          text: "Highlighted text",
          marks: [{ type: "highlight" }],
        } as any,
        assets,
      ),
    ).toThrow("Unsupported TipTap mark: highlight")
  })
})
