import { z } from "zod"

export const EXPORT_JOB_NAME = "export.process"

export const exportFormats = ["txt", "pdf", "epub", "docx", "markdown", "webview"] as const

export const exportJobDataSchema = z.object({
  ebookId: z.string().min(1, "ebookId is required"),
  format: z.enum(exportFormats, {
    message: "format must be one of: txt, pdf, epub, docx, markdown, webview",
  }),
})

export type ExportJobData = z.infer<typeof exportJobDataSchema>

export interface ExportJobResult {
  export: {
    id: string
    ebookId: string
    format: ExportJobData["format"]
    status: string
    createdAt: number
    file?: {
      id: string
      key: string
      bucket: string
      sizeBytes: number
      mimeType: string
      createdAt: number
    }
  }
}
