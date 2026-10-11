import { describe, expect, it } from "vitest"
import { EpubError } from "../../../../errors"
import { renderMention } from "../../../../renderers/tiptap/render-mention"

describe("renderMention", () => {
  it("returns the escaped label when a non-empty label is present", () => {
    const node = {
      type: "mention",
      attrs: {
        label: "Alice & Bob",
        id: "user-42",
      },
    } as any

    expect(renderMention(node)).toBe("Alice &amp; Bob")
  })

  it("prefers the label over the id when both are available", () => {
    const node = {
      type: "mention",
      attrs: {
        label: "@alice",
        id: "user-42",
      },
    } as any

    expect(renderMention(node)).toBe("@alice")
  })

  it("falls back to the id when the label is empty or blank", () => {
    expect(
      renderMention({
        type: "mention",
        attrs: { label: "   ", id: "user-42" },
      } as any),
    ).toBe("user-42")

    expect(
      renderMention({
        type: "mention",
        attrs: { id: "user-42" },
      } as any),
    ).toBe("user-42")
  })

  it("escapes XML-sensitive characters in label and id values", () => {
    expect(
      renderMention({
        type: "mention",
        attrs: { label: "<Alice> & Bob" },
      } as any),
    ).toBe("&lt;Alice&gt; &amp; Bob")

    expect(
      renderMention({
        type: "mention",
        attrs: { id: "<user-42>" },
      } as any),
    ).toBe("&lt;user-42&gt;")
  })

  it("throws when neither a usable label nor a usable id exists", () => {
    expect(() =>
      renderMention({
        type: "mention",
        attrs: {},
      } as any),
    ).toThrow(EpubError)

    expect(() =>
      renderMention({
        type: "mention",
        attrs: { label: "   ", id: "   " },
      } as any),
    ).toThrow("Mention node has no usable label or id")
  })

  it("throws when the node type is not 'mention'", () => {
    expect(() =>
      renderMention({
        type: "happy mention",
        attrs: { label: "Alice" },
      } as any),
    ).toThrow("Invalid TipTap mention node")
  })
})
