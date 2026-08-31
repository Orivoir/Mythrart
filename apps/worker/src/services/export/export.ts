import type { ExportJobData, ExportJobResult } from "../../validations/export.job.js"
import { loadRequirements } from "../utils.js"
import normalizeExportData from "./normalize.js"

export async function exportEbook({ ebookId, format }: ExportJobData): Promise<ExportJobResult> {
  /**
   * TODO: implement actual export logic.
   *
   * Expected work:
   * 1. Validate that the ebook exists and is readable.
   *    - Database (read): fetch the ebook by ebookId (Prisma `ebook.findUnique`).
   *    - Throw if no ebook is found for that id (same guard as `loadRequirements` in
   *      services/utils.ts), so the job fails fast instead of exporting partial/undefined data.
   * 2. Load the ebook content/chapters/locales needed for the requested format.
   *    - Database (read): fetch chapters ordered by position, including each chapter's
   *      `ChapterLocale` row for the target locale (mirrors the `chapters.locales`
   *      include used in `loadRequirements`).
   *    - Database (read): fetch ebook metadata needed for the export (title, subtitle,
   *      shortDescription, coverAsset) so it can be embedded in the generated file.
   * 3. Convert the content to the selected export format: txt, pdf, epub, docx, markdown, or webview.
   * 4. Generate or persist the exported file in storage.
   * 5. Save export metadata to the database if needed.
   * 6. Return the export result payload matching ExportJobResult.
   *
   * This placeholder intentionally does not perform the real workflow.
   */

  const ebook = await loadRequirements(ebookId)

  const normalized = normalizeExportData(ebook)

  void normalized
  void format

  throw new Error("Export service is not implemented yet")
}