import { describe, expect, it } from "vitest"
import { createSpine } from "../../../document/spine"
import type { EpubBook } from "../../../types"

function makeBook(overrides: Partial<EpubBook> = {}): EpubBook {
  const baseBook: EpubBook = {
    id: "book-123",
    isbn: "9780306406157",
    title: "Example Title",
    subtitle: "Example Subtitle",
    description: "Example description",
    language: "en",
    createdAt: new Date("2024-01-15T00:00:00.000Z"),
    creator: "Jane Author",
    coverImage: {
      id: "cover",
      fileName: "cover.svg",
      mimeType: "image/svg+xml",
      data: new Uint8Array([1, 2, 3]),
    },
    assets: [],
    contributors: [{ name: "Editor Name", role: "edt" }],
    chapters: [
      {
        id: "chapter-1",
        title: "Chapter One",
        position: 1,
        content: { type: "doc", content: [] },
      },
    ],
  }

  return {
    ...baseBook,
    ...overrides,
  } as EpubBook
}

describe("createSpine", () => {
  it("adds the cover itemref first and orders chapter itemrefs by position", () => {
    const book = makeBook({
      chapters: [
        {
          id: "chapter-b",
          title: "Second",
          position: 2,
          content: { type: "doc", content: [] },
        },
        {
          id: "chapter-a",
          title: "First",
          position: 1,
          content: { type: "doc", content: [] },
        },
      ],
    })

    const spine = createSpine(book).split("\n")

    expect(spine).toEqual([
      '<itemref idref="cover"/>',
      '<itemref idref="chapter-chapter-a"/>',
      '<itemref idref="chapter-chapter-b"/>',
    ])
  })

  it("omits the cover itemref when there is no cover and escapes chapter ids", () => {
    const book = makeBook({
      coverImage: null,
      chapters: [
        {
          id: " a & b ",
          title: "Escaped chapter",
          position: 1,
          content: { type: "doc", content: [] },
        },
      ],
    })

    expect(createSpine(book)).toBe('<itemref idref="chapter-a &amp; b"/>')
  })
})
