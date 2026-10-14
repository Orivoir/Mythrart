import { Readable } from "node:stream";
import type { NormalizedEbook } from "../utils/normalize.js";

export interface ExportedFile {
  fileName: string;
  mimeType: string;
  data: Buffer | Readable;
}

export interface EbookExporter {
  export(ebook: NormalizedEbook): Promise<ExportedFile>;
}
