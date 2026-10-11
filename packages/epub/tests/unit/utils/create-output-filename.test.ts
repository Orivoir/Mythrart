import { describe, expect, it } from "vitest"
import { createOutputFileName } from "../../../utils/create-output-filename"

describe("createOutputFileName", () => {
  it("creates a valid EPUB filename from a normalized title", () => {
    expect(createOutputFileName("My Book")).toBe("my-book.epub")
    expect(createOutputFileName("   My   Book   ")).toBe("my-book.epub")
  })

  it("removes accents and diacritics from non-ASCII characters", () => {
    expect(createOutputFileName("Café au lait")).toBe("cafe-au-lait.epub")
    expect(createOutputFileName("Crème brûlée")).toBe("creme-brulee.epub")
  })

  it("replaces sequences of non-alphanumeric characters with a single dash", () => {
    expect(createOutputFileName("Hello___World")).toBe("hello-world.epub")
    expect(createOutputFileName("title: with? punctuation!")).toBe(
      "title-with-punctuation.epub",
    )
  })

  it("falls back to book.epub when the title becomes empty after normalization", () => {
    expect(createOutputFileName("!!!")).toBe("book.epub")
    expect(createOutputFileName("   ")).toBe("book.epub")
  })
})
