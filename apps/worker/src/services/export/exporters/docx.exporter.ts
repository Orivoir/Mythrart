// Converts the normalized ebook content into a Word document,
// preserving chapters, formatting, and supported document structure.
import type { Extensions } from "@tiptap/core"
import htmlToDocx from "html-to-docx"
import slugify from "slugify"
import { createImageDataUrlResolver } from "../image-url-resolver.js"
import { renderEbookAsHTML } from "../render-ebook-as-html.js"
import type { NormalizedEbook } from "../normalize.js"
import type { EbookExporter, ExportedFile } from "./types.js"

export class DocxExporter implements EbookExporter {
	constructor(private readonly htmlExtensions?: Extensions) {}

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
		const document = await htmlToDocx(html, undefined, { title: ebook.title })
		const data = Buffer.isBuffer(document)
			? document
			: document instanceof ArrayBuffer
				? Buffer.from(document)
				: Buffer.from(await document.arrayBuffer())

		return {
			fileName: `${slugify(ebook.title)}.docx`,
			mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			data,
		}
	}
}
