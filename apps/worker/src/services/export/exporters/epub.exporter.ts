import type { EbookExporter, ExportedFile } from "./types.js"
import type { Extensions } from "@tiptap/core"
import type { NormalizedEbook } from "../utils/normalize.js"
import { generateEpubBridge } from "../utils/bridge-epub-generator.js"
import createEpub from "@mythrart/epub"

export class EpubExporter implements EbookExporter {
  constructor(private readonly htmlExtensions?: Extensions) {}

  async export(ebook: NormalizedEbook): Promise<ExportedFile> {
   
    const epuboptions = await generateEpubBridge(ebook)

    const epubResult = await createEpub(epuboptions)

    return {
			fileName: epubResult.fileName,
			mimeType: epubResult.mimeType,
			data: Buffer.from(epubResult.data)
		}
  }

}
