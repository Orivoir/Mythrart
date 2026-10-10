import { describe, expect, it } from "vitest"
import { EpubError } from "../../errors"
import { normalizeIsbn13 } from "../../utils/normalize-isbn13"

describe("normalizeIsbn13", () => {
  it("removes spaces and hyphens and returns a normalized ISBN-13", () => {
    expect(normalizeIsbn13("978-0-306-40615-7")).toBe("9780306406157")
    expect(normalizeIsbn13("978 0 306 40615 7")).toBe("9780306406157")
  })

  it("throws when the ISBN does not contain exactly 13 digits", () => {
    expect(() => normalizeIsbn13("123")).toThrow(EpubError)
    expect(() => normalizeIsbn13("978-0-306-40615")).toThrow(
      "ISBN must contain exactly 13 digits",
    )
  })

  it("throws when the ISBN check digit is invalid", () => {
    expect(() => normalizeIsbn13("9780306406158")).toThrow(EpubError)
    expect(() => normalizeIsbn13("9780306406158")).toThrow(
      "Invalid ISBN-13 check digit",
    )
  })
})
