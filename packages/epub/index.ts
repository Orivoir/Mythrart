import { createEpub as generateEpub } from "./generator/create-epub"

import type { CreateEpubOptions, EpubGenerationResult } from "./types"

/**
 * Generates an EPUB 3 archive from a book and its theme.
 */
export default async function createEpub(
  options: CreateEpubOptions,
): Promise<EpubGenerationResult> {
  return generateEpub(options)
}

export type {
  CreateEpubOptions,
  EpubGenerationResult,
  EpubBook,
  EpubChapter,
  EpubAsset,
  EpubTheme,
  EpubContributorRole,
  EpubContributor
} from "./types"
