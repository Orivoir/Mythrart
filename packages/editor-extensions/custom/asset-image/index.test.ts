import { describe, expect, it } from "vitest"
import { Editor } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
import { AssetImage } from "./"

describe("AssetImage", () => {
  const createEditor = () =>
    new Editor({
      extensions: [
        StarterKit,
        AssetImage,
      ],
    })

  it("adds assetId to the image attributes", () => {
    const editor = createEditor()

    editor.commands.setContent({
      type: "doc",
      content: [
        {
          type: "image",
          attrs: {
            src: "https://example.com/image.jpg",
            assetId: "asset_123",
          },
        },
      ],
    })

    const image = editor.getJSON().content?.[0]

    expect(image).toEqual({
      type: "image",
      attrs: expect.objectContaining({
        src: "https://example.com/image.jpg",
        assetId: "asset_123",
      }),
    })

    editor.destroy()
  })

  it("keeps assetId when serializing the document", () => {
    const editor = createEditor()

    editor.commands.insertContent({
      type: "image",
      attrs: {
        src: "https://example.com/image.jpg",
        alt: "Une image",
        assetId: "asset_456",
      },
    })

    const image = editor.getJSON().content?.find(
      (node) => node.type === "image",
    )

    expect(image).toEqual(
      expect.objectContaining({
        type: "image",
        attrs: expect.objectContaining({
          assetId: "asset_456",
        }),
      }),
    )

    editor.destroy()
  })

  it("uses null as the default assetId", () => {
    const editor = createEditor()

    editor.commands.insertContent({
      type: "image",
      attrs: {
        src: "https://example.com/image.jpg",
      },
    })

    const image = editor.getJSON().content?.[0]

    expect(image?.attrs).toEqual(
      expect.objectContaining({
        assetId: null,
      }),
    )

    editor.destroy()
  })
})
