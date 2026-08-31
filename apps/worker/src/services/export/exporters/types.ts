// types.ts
import type { NormalizedEbook } from "../normalize.js"

export interface ExportedFile {
  fileName: string
  mimeType: string
  data: Buffer
}

export interface EbookExporter {
  export(ebook: NormalizedEbook): Promise<ExportedFile>
}