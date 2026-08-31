// Converts the normalized ebook content into HTML content,
// preserving document structure and supported formatting for web-based viewing.
import type { Extensions } from "@tiptap/core"
import { GetObjectCommand, getSignedUrl, s3 } from "@mythrart/s3"
import escapeHTML from "escape-html"
import slugify from "slugify"
import { renderEbookAsHTML } from "../render-ebook-as-html.js"
import type { EbookExporter, ExportedFile } from "./types.js"
import type { NormalizedEbook } from "../normalize.js"
import { createImageUrlResolver } from "../image-url-resolver.js"

export class WebviewExporter implements EbookExporter {
	constructor(private readonly htmlExtensions?: Extensions) {}

	async export(ebook: NormalizedEbook): Promise<ExportedFile> {
		const resolveImageUrl = createImageUrlResolver(ebook)
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

		return {
			fileName: `${slugify(ebook.title)}.html`,
			mimeType: "text/html; charset=utf-8",
			data: Buffer.from(createHtmlDocument(ebook.title, html), "utf8"),
		}
	}
}


function createHtmlDocument(title: string, content: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>${escapeHTML(title)}</title>
	<style>
		body { margin: 0 auto; max-width: 48rem; padding: 2rem; color: #222; background: #fff; font-family: sans-serif; line-height: 1.5; }
		img { max-width: 100%; height: auto; }
		pre { overflow-x: auto; }
	</style>
</head>
<body>
${content}
</body>
</html>`
}


