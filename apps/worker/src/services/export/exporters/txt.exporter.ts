import { renderEbookAsHTML } from "../render-ebook-as-html.js"
import type { EbookExporter, ExportedFile } from "../exporters/types.js"
import type { NormalizedEbook } from "../normalize.js"
import slugify from "slugify"
import { htmlToText } from "html-to-text"
import type { Extensions } from "@tiptap/core"

export class TxtExporter implements EbookExporter {
  constructor(private readonly htmlExtensions?: Extensions) {}

  async export(ebook: NormalizedEbook): Promise<ExportedFile> {

    const html = renderEbookAsHTML(ebook, this.htmlExtensions)

    const text = htmlToText(html)

    return {
      fileName: `${slugify(ebook.title)}.txt`,
      mimeType: "text/plain; charset=utf-8",
      data: Buffer.from(text, "utf8"),
    }
  }
}