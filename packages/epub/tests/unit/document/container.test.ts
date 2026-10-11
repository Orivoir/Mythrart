
import { describe, expect, it } from "vitest"
import { DOMParser } from "@xmldom/xmldom"
import { createContainerXml } from "../../../document/container"

describe("createContainerXml", () => {
  it("generates a valid EPUB container document", () => {
    const xml = createContainerXml()
    const errors: string[] = []

    const document = new DOMParser({
      onError: (level, message) => {
        errors.push(`${level}: ${message}`)
      },
    }).parseFromString(xml, "application/xml")

    expect(errors).toEqual([])
    expect(document.documentElement).not.toBeNull()

    const root = document.documentElement!

    expect(root.localName).toBe("container")
    expect(root.getAttribute("version")).toBe("1.0")
    expect(root.namespaceURI).toBe(
      "urn:oasis:names:tc:opendocument:xmlns:container",
    )

    const rootfiles = document.getElementsByTagNameNS(
      "urn:oasis:names:tc:opendocument:xmlns:container",
      "rootfiles",
    )

    expect(rootfiles.length).toBe(1)
    expect(rootfiles[0].children.length).toBe(1)

    const rootfile = rootfiles[0].children[0]

    expect(rootfile.localName).toBe("rootfile")
    expect(rootfile.getAttribute("full-path")).toBe(
      "OEBPS/package.opf",
    )
    expect(rootfile.getAttribute("media-type")).toBe(
      "application/oebps-package+xml",
    )
    expect(rootfile.children.length).toBe(0)
  })
})