import { describe, expect, it } from "vitest"
import { EpubError } from "../../../errors"
import { validateAsset } from "../../../utils/validate-asset"

describe("validateAsset", () => {
  it("returns a normalized EPUB resource when the asset is valid", () => {
    const asset = {
      id: "  image-1  ",
      fileName: "cover-final.png",
      mimeType: "image/png",
      data: new Uint8Array([1, 2, 3]),
    }

    expect(validateAsset(asset)).toEqual({
      path: "OEBPS/images/cover-final.png",
      data: asset.data,
      mimeType: "image/png",
    })
  })

  it("throws when the asset id is missing or blank", () => {
    expect(() =>
      validateAsset({
        id: "   ",
        fileName: "cover.png",
        mimeType: "image/png",
        data: new Uint8Array([1]),
      }),
    ).toThrow(EpubError)

    expect(() =>
      validateAsset({
        id: " ",
        fileName: "cover.png",
        mimeType: "image/png",
        data: new Uint8Array([1]),
      }),
    ).toThrow("Invalid EPUB asset ID")
  })

  it("throws when the asset filename is invalid", () => {
    expect(() =>
      validateAsset({
        id: "img-1",
        fileName: "",
        mimeType: "image/png",
        data: new Uint8Array([1]),
      }),
    ).toThrow(EpubError)

    expect(() =>
      validateAsset({
        id: "img-1",
        fileName: ".",
        mimeType: "image/png",
        data: new Uint8Array([1]),
      }),
    ).toThrow("Invalid EPUB asset filename: .")

    expect(() =>
      validateAsset({
        id: "img-1",
        fileName: "../secret.png",
        mimeType: "image/png",
        data: new Uint8Array([1]),
      }),
    ).toThrow(EpubError)
  })

  it("throws when the mime type is not a supported image type", () => {
    expect(() =>
      validateAsset({
        id: "img-1",
        fileName: "cover.png",
        mimeType: "application/pdf",
        data: new Uint8Array([1]),
      }),
    ).toThrow(EpubError)

    expect(() =>
      validateAsset({
        id: "img-1",
        fileName: "cover.png",
        mimeType: "application/pdf",
        data: new Uint8Array([1]),
      }),
    ).toThrow("Unsupported EPUB image media type: application/pdf")
  })

  it("throws when the asset data is not a Uint8Array", () => {
    expect(() =>
      validateAsset({
        id: "img-1",
        fileName: "cover.png",
        mimeType: "image/png",
        data: "not-bytes" as any,
      }),
    ).toThrow(EpubError)

    expect(() =>
      validateAsset({
        id: "img-1",
        fileName: "cover.png",
        mimeType: "image/png",
        data: "not-bytes" as any,
      }),
    ).toThrow("Invalid EPUB asset data: cover.png")
  })
})
