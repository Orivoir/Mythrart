import { describe, expect, it } from "vitest"
import { DOMParser, type Document, type Element } from "@xmldom/xmldom"

import { renderChapter } from "../../../renderers/chapter"
import type { EpubAsset, EpubChapter } from "../../../types"
import { createRandomChapterEpub } from "../../fixtures/epub-chapter"

const XHTML_NS = "http://www.w3.org/1999/xhtml"
const EPUB_NS = "http://www.idpf.org/2007/ops"
const XML_NS = "http://www.w3.org/XML/1998/namespace"

const assets: EpubAsset[] = [
  {
    id: "img-1",
    fileName: "fixture-1.png",
    mimeType: "image/png",
    data: new Uint8Array([1, 2, 3]),
  },
]

const chapter: EpubChapter = {
  id: "chapter-1",
  title: "Integration test chapter",
  position: 1,
  content: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Hello ",
          },
          {
            type: "text",
            text: "world",
            marks: [{ type: "bold" }],
          },
          {
            type: "mention",
            attrs: {
              label: "alice",
              id: "alice",
            },
          },
        ],
      },
      {
        type: "image",
        attrs: {
          assetId: "img-1",
          alt: "Test illustration",
        },
      },
    ],
  },
}

/**
 * Returns the direct element children of an element.
 */
function getElementChildren(parent: Element): Element[] {
  const elements: Element[] = []

  for (let i = 0; i < parent.childNodes.length; i++) {
    const child = parent.childNodes.item(i)

    if (child?.nodeType === 1) {
      elements.push(child as Element)
    }
  }

  return elements
}

/**
 * Parses XHTML and fails if the XML parser reports any issue.
 */
function parseXhtml(xhtml: string): Document {
  const parseErrors: string[] = []

  const parser = new DOMParser({
    onError: (level, message) => {
      parseErrors.push(`${level}: ${message}`)
    },
  })

  const document = parser.parseFromString(xhtml, "application/xhtml+xml")

  expect(parseErrors).toEqual([])
  expect(document?.documentElement?.localName).toBe("html")

  return document
}

describe("renderChapter integration", () => {
  it("generates well-formed XHTML with the expected document structure", () => {
    const xhtml = renderChapter(chapter, "en", assets)
    const document = parseXhtml(xhtml)

    const html = document.documentElement

    expect(html?.namespaceURI).toBe(XHTML_NS)
    expect(html?.getAttribute("lang")).toBe("en")
    expect(html?.getAttributeNS(XML_NS, "lang")).toBe("en")
    expect(html?.getAttribute("xmlns:epub")).toBe(EPUB_NS)

    const htmlChildren = getElementChildren(html!)

    expect(htmlChildren.map((element) => element.localName)).toEqual([
      "head",
      "body",
    ])

    const [head, body] = htmlChildren

    expect(head.namespaceURI).toBe(XHTML_NS)
    expect(body.namespaceURI).toBe(XHTML_NS)

    const headChildren = getElementChildren(head)

    expect(headChildren.map((element) => element.localName)).toEqual([
      "meta",
      "title",
      "link",
    ])

    const title = head.getElementsByTagNameNS(XHTML_NS, "title").item(0)
    const meta = head.getElementsByTagNameNS(XHTML_NS, "meta").item(0)
    const stylesheet = head.getElementsByTagNameNS(XHTML_NS, "link").item(0)

    expect(title?.textContent).toBe("Integration test chapter")
    expect(meta?.getAttribute("charset")).toBe("utf-8")
    expect(stylesheet?.getAttribute("rel")).toBe("stylesheet")
    expect(stylesheet?.getAttribute("type")).toBe("text/css")
    expect(stylesheet?.getAttribute("href")).toBe("../styles.css")

    const bodyChildren = getElementChildren(body)

    expect(bodyChildren).toHaveLength(1)
    expect(bodyChildren[0].localName).toBe("section")
    expect(bodyChildren[0].namespaceURI).toBe(XHTML_NS)

    const sectionChildren = getElementChildren(bodyChildren[0])

    expect(sectionChildren.map((element) => element.localName)).toEqual([
      "h1",
      "p",
      "img",
    ])

    expect(sectionChildren[0].textContent).toBe("Integration test chapter")
  })

  it("preserves nested formatting and mention text in the parsed DOM", () => {
    const document = parseXhtml(renderChapter(chapter, "en", assets))

    const paragraphs = document.getElementsByTagNameNS(XHTML_NS, "p")

    expect(paragraphs.length).toBe(1)

    const paragraph = paragraphs.item(0)!

    expect(paragraph.textContent).toBe("Hello worldalice")

    const strong = paragraph.getElementsByTagNameNS(XHTML_NS, "strong")

    expect(strong.length).toBe(1)
    expect(strong.item(0)?.textContent).toBe("world")
  })

  it("resolves image references to the expected relative path", () => {
    const document = parseXhtml(renderChapter(chapter, "en", assets))

    const images = document.getElementsByTagNameNS(XHTML_NS, "img")

    expect(images.length).toBe(1)

    const image = images.item(0)!

    expect(image.getAttribute("src")).toBe("../images/fixture-1.png")
    expect(image.getAttribute("alt")).toBe("Test illustration")
  })

  it("escapes XML-sensitive characters in the chapter title", () => {
    const specialChapter = {
      ...chapter,
      title: 'A & B < "C"',
    }

    const document = parseXhtml(renderChapter(specialChapter, "en", assets))

    const title = document.getElementsByTagNameNS(XHTML_NS, "title").item(0)

    const heading = document.getElementsByTagNameNS(XHTML_NS, "h1").item(0)

    expect(title?.textContent).toBe('A & B < "C"')
    expect(heading?.textContent).toBe('A & B < "C"')
  })
})

describe("renderChapter with random chapters", () => {
  it("generates well-formed XHTML for a randomly generated chapter", () => {
    const randomChapter = createRandomChapterEpub()
    const xhtml = renderChapter(randomChapter, "en", assets)
    const document = parseXhtml(xhtml)

    const html = document.documentElement

    expect(html?.namespaceURI).toBe(XHTML_NS)
    expect(html?.getAttribute("lang")).toBe("en")
    expect(html?.getAttributeNS(XML_NS, "lang")).toBe("en")

    const htmlChildren = getElementChildren(html!)

    expect(htmlChildren.map((element) => element.localName)).toEqual([
      "head",
      "body",
    ])
  })

  it("includes chapter metadata and a stylesheet for random content", () => {
    const randomChapter = createRandomChapterEpub()
    const document = parseXhtml(renderChapter(randomChapter, "en", assets))

    const titles = document.getElementsByTagNameNS(XHTML_NS, "title")
    const headings = document.getElementsByTagNameNS(XHTML_NS, "h1")
    const meta = document.getElementsByTagNameNS(XHTML_NS, "meta").item(0)
    const stylesheets = document.getElementsByTagNameNS(XHTML_NS, "link")

    expect(titles.length).toBe(1)
    expect(titles.item(0)?.textContent?.trim().length).toBeGreaterThan(0)

    expect(headings.length).toBe(1)
    expect(headings.item(0)?.textContent?.trim().length).toBeGreaterThan(0)

    expect(meta?.getAttribute("charset")).toBe("utf-8")

    expect(stylesheets.length).toBe(1)
    expect(stylesheets.item(0)?.getAttribute("rel")).toBe("stylesheet")
    expect(stylesheets.item(0)?.getAttribute("href")).toBe("../styles.css")
  })

  it("wraps random chapter content in a section", () => {
    const randomChapter = createRandomChapterEpub()
    const document = parseXhtml(renderChapter(randomChapter, "en", assets))

    const body = document.getElementsByTagNameNS(XHTML_NS, "body").item(0)!

    const bodyChildren = getElementChildren(body)

    expect(bodyChildren).toHaveLength(1)
    expect(bodyChildren[0].localName).toBe("section")
    expect(bodyChildren[0].namespaceURI).toBe(XHTML_NS)

    const sectionChildren = getElementChildren(bodyChildren[0])

    // The chapter heading must be present, but the remaining content
    // depends on which random chapter was selected.
    expect(sectionChildren.length).toBeGreaterThanOrEqual(1)
    expect(sectionChildren[0].localName).toBe("h1")
  })
})
