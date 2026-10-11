import { describe, expect, it } from "vitest"
import { EpubError } from "../../../errors"
import { validateHref } from "../../../utils/validate-href"

describe("validateHref", () => {
  it("returns the trimmed href for supported protocols", () => {
    expect(validateHref(" https://example.com/path ")).toBe(
      "https://example.com/path",
    )
    expect(validateHref("HTTP://example.com")).toBe("HTTP://example.com")
    expect(validateHref("mailto:test@example.com")).toBe(
      "mailto:test@example.com",
    )
    expect(validateHref("tel:+123456789")).toBe("tel:+123456789")
  })

  it("throws when the href is missing or empty", () => {
    expect(() => validateHref(undefined)).toThrow(EpubError)
    expect(() => validateHref("   ")).toThrow(EpubError)
    expect(() => validateHref("")).toThrow(EpubError)
    expect(() => validateHref(null)).toThrow(EpubError)
  })

  it("throws when the href contains invalid whitespace or control characters", () => {
    expect(() => validateHref("has space@example.com")).toThrow(EpubError)
    expect(() => validateHref("bad\thref")).toThrow(EpubError)
    expect(() => validateHref("bad\\href")).toThrow(EpubError)
    expect(() => validateHref("bad\u0000href")).toThrow(EpubError)
  })

  it("throws for unsupported URL schemes", () => {
    expect(() => validateHref("ftp://example.com")).toThrow(EpubError)
    expect(() => validateHref("ftp://example.com")).toThrow(
      "Unsupported EPUB link protocol: ftp",
    )

    expect(() => validateHref("javascript:alert(1)")).toThrow(EpubError)
    expect(() => validateHref("javascript:alert(1)")).toThrow(
      "Unsupported EPUB link protocol: javascript",
    )
  })
})
