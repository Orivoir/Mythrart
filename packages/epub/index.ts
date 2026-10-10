import type {CreateEpubOptions, EpubGenerationResult} from "./types"

export default async function createEpub(
  options: CreateEpubOptions
): Promise<EpubGenerationResult> {

  void options

  return {
    data: new Uint8Array(),
    fileName: "book.epub",
    mimeType: "application/epub+zip"
  }
} 