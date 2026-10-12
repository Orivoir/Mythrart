import { describe, expect, it } from "vitest"
import { EpubError } from "../../../errors"
import { createEpubResources } from "../../../resources/assets"
import type { EpubAsset, EpubBook } from "../../../types"

const makeAsset = (overrides: Partial<EpubAsset> = {}): EpubAsset => ({
  id: "img-1",
  fileName: "cover.png",
  mimeType: "image/png",
  data: new Uint8Array([1, 2, 3]),
  ...overrides,
})

describe("createEpubResources", () => {
  it("returns validated resources for a book cover and assets", () => {
    const book: Pick<EpubBook, "coverImage" | "assets"> = {
      coverImage: makeAsset({ id: "cover", fileName: "cover.png" }),
      assets: [
        makeAsset({ id: "img-1", fileName: "illustration-1.png" }),
        makeAsset({ id: "img-2", fileName: "illustration-2.png" }),
      ],
    }

    expect(createEpubResources(book)).toEqual([
      {
        path: "OEBPS/images/cover.png",
        data: book.coverImage!.data,
        mimeType: "image/png",
      },
      {
        path: "OEBPS/images/illustration-1.png",
        data: book.assets[0].data,
        mimeType: "image/png",
      },
      {
        path: "OEBPS/images/illustration-2.png",
        data: book.assets[1].data,
        mimeType: "image/png",
      },
    ])
  })

  it("does not add the cover asset twice when it matches an asset filename", () => {
    const book: Pick<EpubBook, "coverImage" | "assets"> = {
      coverImage: makeAsset({ id: "cover", fileName: "cover.png" }),
      assets: [
        makeAsset({ id: "img-1", fileName: "cover.png" }),
        makeAsset({ id: "img-2", fileName: "detail.png" }),
      ],
    }

    expect(createEpubResources(book)).toEqual([
      {
        path: "OEBPS/images/cover.png",
        data: book.coverImage!.data,
        mimeType: "image/png",
      },
      {
        path: "OEBPS/images/detail.png",
        data: book.assets[1].data,
        mimeType: "image/png",
      },
    ])
  })

  it("throws when an asset id is duplicated", () => {
    const book: Pick<EpubBook, "coverImage" | "assets"> = {
      coverImage: null,
      assets: [
        makeAsset({ id: "dup", fileName: "one.png" }),
        makeAsset({ id: "dup", fileName: "two.png" }),
      ],
    }

    expect(() => createEpubResources(book)).toThrow(EpubError)
    expect(() => createEpubResources(book)).toThrow(
      "Duplicate EPUB asset ID: dup",
    )
  })

  it("throws when two distinct assets resolve to the same EPUB path", () => {
    const book: Pick<EpubBook, "coverImage" | "assets"> = {
      coverImage: null,
      assets: [
        makeAsset({ id: "img-1", fileName: "same.png" }),
        makeAsset({ id: "img-2", fileName: "same.png" }),
      ],
    }

    expect(() => createEpubResources(book)).toThrow(EpubError)
    expect(() => createEpubResources(book)).toThrow(
      "Duplicate EPUB resource path: OEBPS/images/same.png",
    )
  })

  it("throws when a contained asset is invalid", () => {
    const book: Pick<EpubBook, "coverImage" | "assets"> = {
      coverImage: null,
      assets: [makeAsset({ id: "img-1", fileName: "../bad.png" })],
    }

    expect(() => createEpubResources(book)).toThrow(EpubError)
    expect(() => createEpubResources(book)).toThrow(
      "Invalid EPUB asset filename: ../bad.png",
    )
  })
})
