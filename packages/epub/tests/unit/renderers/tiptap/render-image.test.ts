import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { EpubError } from "../../../../errors"
import { renderImage } from "../../../../renderers/tiptap/render-image"
import type { EpubAsset } from "../../../../types"

const fixtureDir = fileURLToPath(
  new URL("../../../fixtures/images", import.meta.url),
)

const fixtureAssets: EpubAsset[] = [
  "fixture-1.png",
  "fixture-2.png",
  "fixture-3.png",
].map((fileName) => ({
  id: fileName.replace(/\.png$/i, ""),
  fileName,
  mimeType: "image/png",
  data: readFileSync(path.join(fixtureDir, fileName)),
}))

describe("renderImage", () => {
  it("renders an image tag with a relative source, alt and escaped title", () => {
    const node = {
      type: "image",
      attrs: {
        assetId: "fixture-1",
        alt: 'A "quoted" image',
        title: "Title < & >",
      },
    } as any

    expect(renderImage(node, fixtureAssets)).toBe(
      '<img src="../images/fixture-1.png" alt="A &quot;quoted&quot; image" title="Title &lt; &amp; &gt;" />',
    )
  })

  it("uses an empty alt when none is provided", () => {
    const node = {
      type: "image",
      attrs: { assetId: "fixture-2" },
    } as any

    expect(renderImage(node, fixtureAssets)).toBe(
      '<img src="../images/fixture-2.png" alt="" />',
    )
  })

  it("preserves an explicitly empty alt", () => {
    const node = {
      type: "image",
      attrs: { assetId: "fixture-2", alt: "" },
    } as any

    expect(renderImage(node, fixtureAssets)).toBe(
      '<img src="../images/fixture-2.png" alt="" />',
    )
  })

  it("accepts assetId values with surrounding whitespace", () => {
    const node = {
      type: "image",
      attrs: { assetId: "  fixture-3  " },
    } as any

    expect(renderImage(node, fixtureAssets)).toBe(
      '<img src="../images/fixture-3.png" alt="" />',
    )
  })

  it("throws when the node is not an image or has no attrs", () => {
    expect(() =>
      renderImage({ type: "paragraph" } as any, fixtureAssets),
    ).toThrow(EpubError)

    expect(() =>
      renderImage({ type: "paragraph" } as any, fixtureAssets),
    ).toThrow("Invalid TipTap image node")

    expect(() => renderImage({ type: "image" } as any, fixtureAssets)).toThrow(
      EpubError,
    )
  })

  it("throws when assetId is missing or is not a string", () => {
    for (const assetId of [undefined, null, 123, {}, "   "]) {
      const node = {
        type: "image",
        attrs: { assetId },
      } as any

      expect(() => renderImage(node, fixtureAssets)).toThrow(EpubError)
      expect(() => renderImage(node, fixtureAssets)).toThrow(
        "Missing assetId on TipTap image node",
      )
    }
  })

  it("throws when the asset cannot be found", () => {
    const node = {
      type: "image",
      attrs: { assetId: "missing-id" },
    } as any

    expect(() => renderImage(node, fixtureAssets)).toThrow(EpubError)
    expect(() => renderImage(node, fixtureAssets)).toThrow(
      "EPUB asset not found: missing-id",
    )
  })

  it("throws when the asset filename is empty after normalization", () => {
    const node = {
      type: "image",
      attrs: { assetId: "fixture-1" },
    } as any

    const assets = [{ ...fixtureAssets[0], fileName: "   " }]

    expect(() => renderImage(node, assets)).toThrow(EpubError)
    expect(() => renderImage(node, assets)).toThrow(
      "Invalid filename for EPUB asset: fixture-1",
    )
  })

  it("throws when the asset MIME type is not a supported core image type", () => {
    const node = {
      type: "image",
      attrs: { assetId: "fixture-1" },
    } as any

    const assets = [{ ...fixtureAssets[0], mimeType: "image/bmp" }]

    expect(() => renderImage(node, assets)).toThrow(EpubError)
    expect(() => renderImage(node, assets)).toThrow(
      "Unsupported image media type: image/bmp",
    )
  })

  it.each([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "image/webp",
  ])("accepts the core image MIME type %s", (mimeType) => {
    const node = {
      type: "image",
      attrs: { assetId: "fixture-1" },
    } as any

    const assets = [{ ...fixtureAssets[0], mimeType }]

    expect(renderImage(node, assets)).toBe(
      '<img src="../images/fixture-1.png" alt="" />',
    )
  })

  it("escapes special characters in alt and title attributes", () => {
    const node = {
      type: "image",
      attrs: {
        assetId: "fixture-1",
        alt: 'A & B < "C"',
        title: "Title > & <",
      },
    } as any

    expect(renderImage(node, fixtureAssets)).toBe(
      '<img src="../images/fixture-1.png" alt="A &amp; B &lt; &quot;C&quot;" title="Title &gt; &amp; &lt;" />',
    )
  })
})
