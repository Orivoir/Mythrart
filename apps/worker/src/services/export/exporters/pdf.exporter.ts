// Converts the normalized ebook content into a PDF file,
// rendering chapters and supported document structure into a printable layout.
import slugify from "slugify"
import { createImageDataUrlResolver } from "../image-url-resolver.js"
import { renderEbookAsHTML } from "../render-ebook-as-html.js"
import type { NormalizedEbook } from "../normalize.js"
import type { EbookExporter, ExportedFile } from "./types.js"
import type { Extensions } from "@tiptap/core"

export type PdfQuality = "readable" | "ready-to-print"

const gotenbergConvertPath = "/forms/chromium/convert/html"

export class PdfExporter implements EbookExporter {
  constructor(
    private readonly quality: PdfQuality = "readable",
    private readonly htmlExtensions?: Extensions,
  ) {}

  async export(ebook: NormalizedEbook): Promise<ExportedFile> {
    const resolveImageUrl = createImageDataUrlResolver(ebook)
    const coverImageUrl = ebook.coverImage
      ? await resolveImageUrl(ebook.coverImage.assetId)
      : undefined

    if (ebook.coverImage && !coverImageUrl) {
      throw new Error(`Unable to resolve cover image asset ${ebook.coverImage.assetId}`)
    }

    const html = await renderEbookAsHTML(ebook, {
      extensions: this.htmlExtensions,
      resolveImageUrl,
      coverImageUrl,
    })

    const data = await convertHtmlToPdf(html, this.quality)

    return {
      fileName: `${slugify(ebook.title)}.pdf`,
      mimeType: "application/pdf",
      data,
    }
  }
}

async function convertHtmlToPdf(html: string, quality: PdfQuality): Promise<Buffer> {
  const gotenbergUrl = process.env.GOTENBERG_URL

  if (!gotenbergUrl) {
    throw new Error("GOTENBERG_URL is not configured")
  }

  const printableHtml = quality === "ready-to-print"
    ? injectReadyToPrintPageCss(html)
    : html

  const form = new FormData()

  form.append(
    "files",
    new Blob([printableHtml], { type: "text/html" }),
    "index.html",
  )

  for (const [key, value] of Object.entries(getPageLayoutOptions(quality))) {
    form.append(key, value)
  }

  const response = await fetch(new URL(gotenbergConvertPath, gotenbergUrl), {
    method: "POST",
    body: form,
  })

  if (!response.ok) {
    const body = await response.text()

    throw new Error(`Gotenberg PDF conversion failed with status ${response.status}: ${body}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

// MVP mapping: "ready-to-print" uses A4 page sizing and print-oriented CSS margins,
// while "readable" uses a standard US Letter layout with Gotenberg-defined margins.
function injectReadyToPrintPageCss(html: string): string {
  const pageCss = `
    <style>
      @page {
        size: A4;
        margin: 20mm 18mm;
      }
    </style>
  `

  if (/<head\b[^>]*>/i.test(html)) {
    return html.replace(
      /<head\b[^>]*>/i,
      (headTag) => `${headTag}${pageCss}`,
    )
  }

  if (/<body\b[^>]*>/i.test(html)) {
    return html.replace(
      /<body\b[^>]*>/i,
      (bodyTag) => `${bodyTag}${pageCss}`,
    )
  }

  return `${pageCss}${html}`
}

function getPageLayoutOptions(quality: PdfQuality): Record<string, string> {
  if (quality === "ready-to-print") {
    return {
      preferCssPageSize: "true",
      printBackground: "true",
      marginTop: "0",
      marginBottom: "0",
      marginLeft: "0",
      marginRight: "0",
    }
  }

  return {
    preferCssPageSize: "false",
    printBackground: "true",
    paperWidth: "8.5",
    paperHeight: "11",
    marginTop: "1",
    marginBottom: "1",
    marginLeft: "1",
    marginRight: "1",
  }
}
