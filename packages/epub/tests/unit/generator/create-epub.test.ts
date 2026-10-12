import type { EpubTheme } from "./../../../types"
import { epubThemeFixture } from "../../fixtures/epub-theme"
import { describe, expect, it } from "vitest"
import JSZip from "jszip"
import { DOMParser, type Document, type Element } from "@xmldom/xmldom"
import path from "node:path"
import { PACKAGE_DOCUMENT_PATH } from "../../../constants"

import { createEpub } from "../../../generator/create-epub"
import type { CreateEpubOptions } from "../../../types"

const OCF_NAMESPACE = "urn:oasis:names:tc:opendocument:xmlns:container"

const OPF_NAMESPACE = "http://www.idpf.org/2007/opf"

const XHTML_NAMESPACE = "http://www.w3.org/1999/xhtml"

const EPUB_NAMESPACE = "http://www.idpf.org/2007/ops"

const EPUB_MIME_TYPE = "application/epub+zip"

const CHAPTER_ONE_HREF = "chapters/chapter-ete.xhtml"

const CHAPTER_TWO_HREF = "chapters/chapter-deux.xhtml"

const PNG_DATA = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p1sAAAAASUVORK5CYII=",
    "base64",
  ),
)

function createBook(): CreateEpubOptions {
  return {
    book: {
      id: "urn:uuid:12345678-1234-1234-1234-123456789abc",
      title: "Mon livre de test",
      subtitle: "Une intégration complète",
      description: "Un livre utilisé pour tester le générateur EPUB.",
      language: "fr",
      createdAt: new Date("2026-01-15T10:30:00.000Z"),
      creator: "Auteur de test",

      coverImage: {
        id: "cover-asset",
        fileName: "cover.png",
        mimeType: "image/png",
        data: PNG_DATA,
      },

      assets: [
        {
          id: "illustration",
          fileName: "illustration.png",
          mimeType: "image/png",
          data: PNG_DATA,
        },
      ],

      contributors: [],

      // L'ordre d'entrée est volontairement différent de l'ordre attendu.
      chapters: [
        {
          id: "chapter-deux",
          title: "Deuxième chapitre",
          position: 2,
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Le second chapitre.",
                  },
                ],
              },
            ],
          },
        },
        {
          id: "chapter-ete",
          title: "Premier chapitre",
          position: 1,
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Le premier chapitre.",
                  },
                ],
              },
              {
                type: "image",
                attrs: {
                  assetId: "illustration",
                  alt: "Illustration du premier chapitre",
                },
              },
            ],
          },
        },
      ],
    },
    theme: epubThemeFixture,
  }
}

function parseXml(source: string, label: string) {
  const errors: string[] = []

  const document = new DOMParser({
    onError: (_level, message) => {
      errors.push(message)
    },
  }).parseFromString(source, "application/xml")

  expect(errors, `${label}: erreurs XML`).toEqual([])
  expect(document?.documentElement, `${label}: élément racine`).not.toBeNull()
  expect(document?.documentElement?.localName).not.toBe("parsererror")

  return document
}

function elementsByLocalName(
  node: Document | Element,
  localName: string,
): Element[] {
  return Array.from(node.getElementsByTagNameNS("*", localName))
}

function textContent(element: Element | null | undefined): string {
  return element?.textContent?.trim() ?? ""
}

/**
 * Résout un href relatif à un fichier de l'archive.
 * Les chemins restent encodés comme ils le sont dans le ZIP.
 */
function resolveArchiveHref(
  sourceFile: string,
  href: string,
): string | undefined {
  const cleanHref = href.split(/[?#]/, 1)[0]

  if (
    !cleanHref ||
    cleanHref.startsWith("/") ||
    /^[a-z][a-z0-9+.-]*:/i.test(cleanHref) ||
    cleanHref.startsWith("//")
  ) {
    return undefined
  }

  return path.posix.normalize(
    path.posix.join(path.posix.dirname(sourceFile), cleanHref),
  )
}

function getLocalZipEntries(data: Uint8Array) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)

  const decoder = new TextDecoder()
  const entries: Array<{
    name: string
    compressionMethod: number
  }> = []

  let offset = 0

  while (offset + 30 <= data.byteLength) {
    // Signature d'un en-tête local ZIP : PK\x03\x04
    if (view.getUint32(offset, true) !== 0x04034b50) {
      break
    }

    const compressionMethod = view.getUint16(offset + 8, true)
    const compressedSize = view.getUint32(offset + 18, true)
    const fileNameLength = view.getUint16(offset + 26, true)
    const extraLength = view.getUint16(offset + 28, true)

    const nameStart = offset + 30
    const nameEnd = nameStart + fileNameLength

    const name = decoder.decode(data.subarray(nameStart, nameEnd))

    entries.push({ name, compressionMethod })

    offset = nameEnd + extraLength + compressedSize
  }

  return entries
}

describe("createEpub — intégration complète", () => {
  it("Generates a EPUB, with valid paths and references", async () => {
    const epub = createBook()
    const { book } = epub
    const result = await createEpub(epub)

    // ---------------------------------------------------------
    // 1. Résultat public
    // ---------------------------------------------------------
    expect(result.data).toBeInstanceOf(Uint8Array)
    expect(result.data.byteLength).toBeGreaterThan(0)
    expect(result.mimeType).toBe(EPUB_MIME_TYPE)
    expect(result.fileName).toMatch(/\.epub$/)

    // ---------------------------------------------------------
    // 2. Archive ZIP et fichier mimetype
    // ---------------------------------------------------------
    const localEntries = getLocalZipEntries(result.data)

    expect(localEntries.length).toBeGreaterThan(0)
    expect(localEntries[0].name).toBe("mimetype")

    // Méthode ZIP 0 = STORE, sans compression.
    expect(localEntries[0].compressionMethod).toBe(0)

    const zip = await JSZip.loadAsync(result.data)
    const archivePaths = Object.keys(zip.files).filter(
      (name) => !zip.files[name].dir,
    )
    const archivePathSet = new Set(archivePaths)

    expect(archivePathSet.size).toBe(archivePaths.length)

    const mimetype = zip.file("mimetype")
    expect(mimetype).not.toBeNull()
    expect(await mimetype!.async("string")).toBe(EPUB_MIME_TYPE)

    // ---------------------------------------------------------
    // 3. Fichiers obligatoires et chemins attendus
    // ---------------------------------------------------------
    const requiredPaths = [
      "mimetype",
      "META-INF/container.xml",
      "OEBPS/content.opf",
      "OEBPS/nav.xhtml",
      "OEBPS/styles.css",
      "OEBPS/cover.xhtml",
      "OEBPS/images/cover.png",
      "OEBPS/images/illustration.png",
      `OEBPS/${CHAPTER_ONE_HREF}`,
      `OEBPS/${CHAPTER_TWO_HREF}`,
    ]

    for (const archivePath of requiredPaths) {
      expect(
        archivePathSet.has(archivePath),
        `Fichier manquant : ${archivePath}`,
      ).toBe(true)
    }

    // ---------------------------------------------------------
    // 4. container.xml
    // ---------------------------------------------------------
    const containerXml = await zip
      .file("META-INF/container.xml")!
      .async("string")

    const container = parseXml(containerXml, "container.xml")

    expect(container?.documentElement?.localName).toBe("container")
    expect(container?.documentElement?.namespaceURI).toBe(OCF_NAMESPACE)
    expect(container?.documentElement?.getAttribute("version")).toBe("1.0")

    const rootfiles = elementsByLocalName(container, "rootfile")

    expect(rootfiles).toHaveLength(1)
    expect(rootfiles[0].getAttribute("full-path")).toBe(PACKAGE_DOCUMENT_PATH)
    expect(rootfiles[0].getAttribute("media-type")).toBe(
      "application/oebps-package+xml",
    )

    // ---------------------------------------------------------
    // 5. Document OPF : métadonnées, manifeste et spine
    // ---------------------------------------------------------

    const opfXml = await zip.file("OEBPS/content.opf")!.async("string")

    const opf = parseXml(opfXml, "content.opf")

    expect(opf?.documentElement?.localName).toBe("package")
    expect(opf?.documentElement?.namespaceURI).toBe(OPF_NAMESPACE)

    const metadata = elementsByLocalName(opf, "metadata")
    expect(metadata).toHaveLength(1)

    const titles = elementsByLocalName(opf, "title")
    const creators = elementsByLocalName(opf, "creator")
    const languages = elementsByLocalName(opf, "language")
    const identifiers = elementsByLocalName(opf, "identifier")

    expect(titles.some((element) => textContent(element) === book.title)).toBe(
      true,
    )

    expect(
      creators.some((element) => textContent(element) === book.creator),
    ).toBe(true)

    expect(
      languages.some((element) => textContent(element) === book.language),
    ).toBe(true)

    expect(
      identifiers.some((element) => textContent(element) === book.id),
    ).toBe(true)

    const manifests = elementsByLocalName(opf, "manifest")
    const spines = elementsByLocalName(opf, "spine")

    expect(manifests).toHaveLength(1)
    expect(spines).toHaveLength(1)

    const manifestItems = elementsByLocalName(manifests[0], "item")
    const spineRefs = elementsByLocalName(spines[0], "itemref")

    const manifestById = new Map<string, Element>()

    for (const item of manifestItems) {
      const id = item.getAttribute("id")
      const href = item.getAttribute("href")
      const mediaType = item.getAttribute("media-type")

      expect(id, "Un item du manifeste doit avoir un ID").toBeTruthy()
      expect(href, `href absent pour ${id}`).toBeTruthy()
      expect(mediaType, `media-type absent pour ${id}`).toBeTruthy()

      expect(manifestById.has(id!), `ID de manifeste dupliqué : ${id}`).toBe(
        false,
      )

      manifestById.set(id!, item)

      const resolved = resolveArchiveHref("OEBPS/content.opf", href!)

      expect(
        resolved,
        `Référence externe inattendue dans le manifeste : ${href}`,
      ).toBeDefined()

      expect(
        archivePathSet.has(resolved!),
        `Le manifeste référence un fichier absent : ${href}`,
      ).toBe(true)
    }

    // Le manifeste doit déclarer la navigation EPUB 3.
    const navItems = manifestItems.filter((item) =>
      item.getAttribute("properties")?.split(/\s+/).includes("nav"),
    )

    expect(navItems).toHaveLength(1)
    expect(navItems[0].getAttribute("href")).toBe("nav.xhtml")

    // La couverture doit être identifiée comme image de couverture.
    const coverImageItems = manifestItems.filter((item) =>
      item.getAttribute("properties")?.split(/\s+/).includes("cover-image"),
    )

    expect(coverImageItems).toHaveLength(1)
    expect(coverImageItems[0].getAttribute("href")).toBe("images/cover.png")
    expect(coverImageItems[0].getAttribute("media-type")).toBe("image/png")

    // Chaque itemref du spine doit pointer vers un item déclaré.
    const spineIds = spineRefs.map((item) => item.getAttribute("idref"))

    for (const idref of spineIds) {
      expect(
        manifestById.has(idref!),
        `Le spine référence un ID absent du manifeste : ${idref}`,
      ).toBe(true)
    }

    // La couverture est le premier élément du spine dans ce générateur.
    expect(spineIds[0]).toBe("cover")

    // Les chapitres doivent suivre leur ordre éditorial.
    const chapterManifestItems = manifestItems.filter((item) =>
      item.getAttribute("href")?.startsWith("chapters/"),
    )

    expect(
      chapterManifestItems.map((item) => item.getAttribute("href")),
    ).toEqual([CHAPTER_ONE_HREF, CHAPTER_TWO_HREF])

    const chapterSpineIds = spineIds.filter((id) => id!.startsWith("chapter-"))

    expect(chapterSpineIds).toEqual([
      "chapter-chapter-ete",
      "chapter-chapter-deux",
    ])

    // ---------------------------------------------------------
    // 6. Navigation : TOC et landmarks
    // ---------------------------------------------------------

    const navXml = await zip.file("OEBPS/nav.xhtml")!.async("string")

    const nav = parseXml(navXml, "nav.xhtml")

    expect(nav?.documentElement?.localName).toBe("html")
    expect(nav?.documentElement?.namespaceURI).toBe(XHTML_NAMESPACE)

    const navElements = elementsByLocalName(nav, "nav")

    const tocNav = navElements.find((element) =>
      element
        .getAttributeNS(EPUB_NAMESPACE, "type")
        ?.split(/\s+/)
        .includes("toc"),
    )

    expect(tocNav).toBeDefined()

    const tocLinks = elementsByLocalName(tocNav!, "a")

    expect(tocLinks.map((link) => link.getAttribute("href"))).toEqual([
      CHAPTER_ONE_HREF,
      CHAPTER_TWO_HREF,
    ])

    expect(tocLinks.map(textContent)).toEqual([
      "Premier chapitre",
      "Deuxième chapitre",
    ])

    const landmarksNav = navElements.find((element) =>
      element
        .getAttributeNS(EPUB_NAMESPACE, "type")
        ?.split(/\s+/)
        .includes("landmarks"),
    )

    expect(landmarksNav).toBeDefined()

    const landmarkLinks = elementsByLocalName(landmarksNav!, "a")

    expect(
      landmarkLinks.some(
        (link) =>
          link.getAttributeNS(EPUB_NAMESPACE, "type") === "cover" &&
          link.getAttribute("href") === "cover.xhtml",
      ),
    ).toBe(true)

    expect(
      landmarkLinks.some(
        (link) =>
          link.getAttributeNS(EPUB_NAMESPACE, "type") === "bodymatter" &&
          link.getAttribute("href") === CHAPTER_ONE_HREF,
      ),
    ).toBe(true)

    // ---------------------------------------------------------
    // 7. Couverture XHTML et chemin de son image
    // ---------------------------------------------------------

    const coverXml = await zip.file("OEBPS/cover.xhtml")!.async("string")

    const cover = parseXml(coverXml, "cover.xhtml")

    expect(cover?.documentElement?.namespaceURI).toBe(XHTML_NAMESPACE)

    const coverImages = elementsByLocalName(cover, "img")

    expect(coverImages).toHaveLength(1)
    expect(coverImages[0].getAttribute("src")).toBe("images/cover.png")

    expect(archivePathSet.has("OEBPS/images/cover.png")).toBe(true)

    // ---------------------------------------------------------
    // 8. Chapitres XHTML : contenu, ordre et ressources
    // ---------------------------------------------------------

    const firstChapterXml = await zip
      .file(`OEBPS/${CHAPTER_ONE_HREF}`)!
      .async("string")

    const firstChapter = parseXml(firstChapterXml, "premier chapitre")

    expect(firstChapter?.documentElement?.namespaceURI).toBe(XHTML_NAMESPACE)

    const firstChapterText = firstChapter?.documentElement?.textContent ?? ""

    expect(firstChapterText).toContain("Premier chapitre")
    expect(firstChapterText).toContain("Le premier chapitre.")

    const chapterImages = elementsByLocalName(firstChapter, "img")

    expect(chapterImages).toHaveLength(1)
    expect(chapterImages[0].getAttribute("src")).toBe(
      "../images/illustration.png",
    )

    const chapterStylesheets = elementsByLocalName(firstChapter, "link").filter(
      (element) => element.getAttribute("rel") === "stylesheet",
    )

    expect(
      chapterStylesheets.some(
        (element) => element.getAttribute("href") === "../styles.css",
      ),
    ).toBe(true)

    const secondChapterXml = await zip
      .file(`OEBPS/${CHAPTER_TWO_HREF}`)!
      .async("string")

    const secondChapter = parseXml(secondChapterXml, "deuxième chapitre")

    expect(secondChapter?.documentElement?.namespaceURI).toBe(XHTML_NAMESPACE)
    expect(secondChapter?.documentElement?.textContent).toContain(
      "Le second chapitre.",
    )

    // ---------------------------------------------------------
    // 9. Images : ressources présentes et cohérentes
    // ---------------------------------------------------------

    const coverBytes = await zip
      .file("OEBPS/images/cover.png")!
      .async("uint8array")

    const illustrationBytes = await zip
      .file("OEBPS/images/illustration.png")!
      .async("uint8array")

    expect(coverBytes).toEqual(PNG_DATA)
    expect(illustrationBytes).toEqual(PNG_DATA)

    // Les images sont déclarées dans le manifeste avec leur MIME type.
    const imageItems = manifestItems.filter(
      (item) => item.getAttribute("media-type") === "image/png",
    )

    expect(imageItems.map((item) => item.getAttribute("href"))).toContain(
      "images/cover.png",
    )

    expect(imageItems.map((item) => item.getAttribute("href"))).toContain(
      "images/illustration.png",
    )

    // ---------------------------------------------------------
    // 10. Feuille de style
    // ---------------------------------------------------------

    const stylesFile = zip.file("OEBPS/styles.css")

    expect(stylesFile).not.toBeNull()

    const styles = await stylesFile!.async("string")

    expect(typeof styles).toBe("string")

    expect(
      manifestItems.some(
        (item) =>
          item.getAttribute("href") === "styles.css" &&
          item.getAttribute("media-type") === "text/css",
      ),
    ).toBe(true)

    // ---------------------------------------------------------
    // 11. Toutes les références internes de la navigation
    //     et des chapitres doivent résoudre vers un fichier.
    // ---------------------------------------------------------

    const internalReferenceDocuments = [
      {
        path: "OEBPS/nav.xhtml",
        document: nav,
      },
      {
        path: "OEBPS/cover.xhtml",
        document: cover,
      },
      {
        path: `OEBPS/${CHAPTER_ONE_HREF}`,
        document: firstChapter,
      },
      {
        path: `OEBPS/${CHAPTER_TWO_HREF}`,
        document: secondChapter,
      },
    ]

    for (const entry of internalReferenceDocuments) {
      const elements = [
        ...elementsByLocalName(entry.document, "a"),
        ...elementsByLocalName(entry.document, "img"),
        ...elementsByLocalName(entry.document, "link"),
      ]

      for (const element of elements) {
        const href = element.getAttribute("href") ?? element.getAttribute("src")

        if (!href || href.startsWith("#")) {
          continue
        }

        // Les liens externes, s'il y en avait, ne sont pas des fichiers ZIP.
        if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//")) {
          continue
        }

        const resolved = resolveArchiveHref(entry.path, href)

        expect(
          resolved,
          `Chemin invalide dans ${entry.path} : ${href}`,
        ).toBeDefined()

        expect(
          archivePathSet.has(resolved!),
          `Ressource introuvable depuis ${entry.path} : ${href} -> ${resolved}`,
        ).toBe(true)
      }
    }
  })
})
