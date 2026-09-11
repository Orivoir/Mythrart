import { describe, expect, it } from "vitest"

import { normalizeSynopsisText } from "./../../src/utils/normalize-text.js"

describe("normalizeSynopsisText", () => {
  it("normalizes Windows and old Mac line endings", () => {
    const input = "Jean revient.\r\nIl retrouve Claire.\rHenri est mort."

    const result = normalizeSynopsisText(input)

    expect(result).toBe(
      "Jean revient.\nIl retrouve Claire.\nHenri est mort.",
    )
  })

  it("removes control characters", () => {
    const input = "Jean\u0000 revient.\u0007 Claire\u001F arrive."

    const result = normalizeSynopsisText(input)

    expect(result).toBe(
      "Jean revient. Claire arrive.",
    )
  })

  it("normalizes non-breaking spaces", () => {
    const input = "Jean\u00A0revient\u00A0à\u00A0Paris."

    const result = normalizeSynopsisText(input)

    expect(result).toBe(
      "Jean revient à Paris.",
    )
  })

  it("replaces tabs with spaces", () => {
    const input = "Jean\trevient\tà Paris."

    const result = normalizeSynopsisText(input)

    expect(result).toBe(
      "Jean revient à Paris.",
    )
  })

  it("collapses consecutive spaces", () => {
    const input = "Jean    revient     à     Paris."

    const result = normalizeSynopsisText(input)

    expect(result).toBe(
      "Jean revient à Paris.",
    )
  })

  it("removes spaces around line breaks", () => {
    const input = "Jean revient.   \n   Il retrouve Claire."

    const result = normalizeSynopsisText(input)

    expect(result).toBe(
      "Jean revient.\nIl retrouve Claire.",
    )
  })

  it("collapses excessive blank lines", () => {
    const input =
      "Jean revient.\n\n\n\n\nIl retrouve Claire."

    const result = normalizeSynopsisText(input)

    expect(result).toBe(
      "Jean revient.\n\nIl retrouve Claire.",
    )
  })

  it("trims leading and trailing whitespace", () => {
    const input =
      "   \n\nJean revient à Paris.\n\n   "

    const result = normalizeSynopsisText(input)

    expect(result).toBe(
      "Jean revient à Paris.",
    )
  })

  it("normalizes a realistic extracted document", () => {
    const input =
      "  Jean\u00A0Morel revient    à Paris.  \r\n" +
      "\r\n" +
      "\r\n" +
      "\tIl retrouve Claire dans l'ancien appartement familial.   \r\n" +
      "\r\n" +
      "Henri\u0000 est mort.  "

    const result = normalizeSynopsisText(input)

    expect(result).toBe(
      "Jean Morel revient à Paris.\n\n" +
      "Il retrouve Claire dans l'ancien appartement familial.\n\n" +
      "Henri est mort.",
    )
  })

  it("returns an empty string for whitespace-only input", () => {
    const input = "   \r\n\t  \n\n  "

    const result = normalizeSynopsisText(input)

    expect(result).toBe("")
  })

  it("does not alter meaningful content", () => {
    const input =
      "Jean Morel revient à Paris après quinze années passées au Canada.\n\n" +
      "Il retrouve Claire dans leur ancien appartement familial."

    const result = normalizeSynopsisText(input)

    expect(result).toBe(input)
  })
})