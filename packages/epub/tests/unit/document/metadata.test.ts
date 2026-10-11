import { describe, expect, it } from "vitest"
import { DOMParser } from "@xmldom/xmldom"
import { createMetadataXml } from "../../../document/metadata"
import { EpubError } from "../../../errors"
import type { EpubBook } from "../../../types"

const OPF_NAMESPACE = "http://www.idpf.org/2007/opf"
const DC_NAMESPACE = "http://purl.org/dc/elements/1.1/"

function parseXml(xml: string) {
  const errors: string[] = []

  const document = new DOMParser({
    onError: (level, message) => {
      errors.push(`${level}: ${message}`)
    },
  }).parseFromString(xml, "application/xml")

  expect(errors).toEqual([])

  return document
}

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
    coverImage: null,
    assets: [],
    contributors: [{ name: "Editor Name", role: "edt" }],
    chapters: [],
  }

  return {
    ...baseBook,
    ...overrides,
  } as EpubBook
}

describe("createMetadataXml", () => {
  it("creates the required EPUB metadata plus optional ISBN and subtitle fields", () => {
    const xml = createMetadataXml(
      makeBook(),
      new Date("2024-02-01T12:00:00.000Z"),
    )
    const doc = parseXml(xml)
    const metadata = doc.getElementsByTagName("metadata")[0]

    expect(metadata).not.toBeUndefined()
    expect(metadata.namespaceURI).toBe(OPF_NAMESPACE)

    const identifier = doc.getElementsByTagNameNS(DC_NAMESPACE, "identifier")[0]
    const title = doc.getElementsByTagNameNS(DC_NAMESPACE, "title")[0]
    const creator = doc.getElementsByTagNameNS(DC_NAMESPACE, "creator")[0]
    const language = doc.getElementsByTagNameNS(DC_NAMESPACE, "language")[0]
    const subtitle = doc.getElementsByTagNameNS(DC_NAMESPACE, "title")[1]
    const description = doc.getElementsByTagNameNS(DC_NAMESPACE, "description")[0]

    expect(identifier.textContent).toBe("book-123")
    expect(identifier.getAttribute("id")).toBe("pub-id")

    expect(title.textContent).toBe("Example Title")
    expect(title.getAttribute("id")).toBe("title")
    expect(creator.textContent).toBe("Jane Author")
    expect(language.textContent).toBe("en")

    expect(subtitle.textContent).toBe("Example Subtitle")
    expect(subtitle.getAttribute("id")).toBe("subtitle")

    expect(description.textContent).toBe("Example description")

    const isbnId = doc.getElementById("isbn-id")
    expect(isbnId?.textContent).toBe("urn:isbn:9780306406157")

    const identifierType = Array.from(doc.getElementsByTagName("meta")).find(
      (element) => element.getAttribute("property") === "identifier-type",
    )

    expect(identifierType).toBeTruthy()
    expect(identifierType?.getAttribute("scheme")).toBe("onix:codelist5")
    expect(identifierType?.textContent).toBe("15")

    const modifiedMeta = Array.from(doc.getElementsByTagName("meta")).find(
      (element) => element.getAttribute("property") === "dcterms:modified",
    )

    expect(modifiedMeta?.textContent).toBe("2024-02-01T12:00:00Z")
  })

  it("escapes XML-sensitive characters in user-supplied text", () => {
    const xml = createMetadataXml(
      makeBook({
        title: "A & B < C",
        subtitle: "D & E > F",
        description: "Use <tag> & " + '"quotes"',
        creator: "Jane & John",
      }),
    )

    const doc = parseXml(xml)

    expect(doc.getElementsByTagNameNS(DC_NAMESPACE, "title")[0].textContent).toBe(
      "A & B < C",
    )
    expect(doc.getElementsByTagNameNS(DC_NAMESPACE, "title")[1].textContent).toBe(
      "D & E > F",
    )
    expect(doc.getElementsByTagNameNS(DC_NAMESPACE, "description")[0].textContent).toBe(
      'Use <tag> & "quotes"',
    )
    expect(doc.getElementsByTagNameNS(DC_NAMESPACE, "creator")[0].textContent).toBe(
      "Jane & John",
    )
  })

  it("omits optional fields when they are empty or null", () => {
    const xml = createMetadataXml(
      makeBook({
        isbn: "   ",
        subtitle: "",
        description: null,
        contributors: [],
      }),
    )
    const doc = parseXml(xml)

    expect(doc.getElementById("isbn-id")).toBeNull()
    expect(doc.getElementById("subtitle")).toBeNull()
    expect(doc.getElementsByTagNameNS(DC_NAMESPACE, "description").length).toBe(0)
    expect(doc.getElementsByTagNameNS(DC_NAMESPACE, "contributor").length).toBe(0)
  })

  it("throws for missing required metadata values", () => {
    expect(() => createMetadataXml(makeBook({ title: "   " }))).toThrow(EpubError)
    expect(() => createMetadataXml(makeBook({ creator: "" }))).toThrow(
      "Missing required EPUB metadata: creator",
    )
    expect(() => createMetadataXml(makeBook({ language: "" }))).toThrow(
      "Missing required EPUB metadata: language",
    )
  })

  it("throws for invalid dates", () => {
    expect(() =>
      createMetadataXml(makeBook({ createdAt: new Date("invalid") })),
    ).toThrow(EpubError)
    expect(() =>
      createMetadataXml(makeBook(), new Date("invalid")),
    ).toThrow(EpubError)
  })

  it("throws when a contributor is missing a name or role", () => {
    expect(() =>
      createMetadataXml(makeBook({ contributors: [{ name: "Valid Name", role: "" as any }] })),
    ).toThrow(EpubError)
    expect(() =>
      createMetadataXml(makeBook({ contributors: [{ name: "", role: "aut" }] })),
    ).toThrow(EpubError)
  })
})
