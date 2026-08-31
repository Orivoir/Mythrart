import type { ExportJobData, ExportJobResult } from "../../validations/export.job.js"

export async function exportEbook({ ebookId, format }: ExportJobData): Promise<ExportJobResult> {
  /**
   * TODO: implement actual export logic.
   *
   * Expected work:
   * 1. Validate that the ebook exists and is readable.
   * 2. Load the ebook content/chapters/locales needed for the requested format.
   * 3. Convert the content to the selected export format: txt, pdf, epub, docx, markdown, or webview.
   * 4. Generate or persist the exported file in storage.
   * 5. Save export metadata to the database if needed.
   * 6. Return the export result payload matching ExportJobResult.
   *
   * This placeholder intentionally does not perform the real workflow.
   */

  void ebookId
  void format

  throw new Error("Export service is not implemented yet")
}