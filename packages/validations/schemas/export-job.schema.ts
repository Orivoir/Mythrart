import { z } from "zod"

export const exportFormats = ["txt", "pdf", "epub", "docx", "markdown", "webview"] as const

export const createExportJobRequestSchema = z.object({
  ebookId: z.string().trim().min(1, "ebookId is required"),
  format: z.enum(exportFormats, {
    message: "format must be one of: txt, pdf, epub, docx, markdown, webview",
  }),
})

export type ExportJobData = z.infer<typeof createExportJobRequestSchema>
