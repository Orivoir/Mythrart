import { z } from "zod"

export const createAnalysisSynopsisJobRequestSchema = z.object({
  assetId: z.string().trim().min(1, "assetId is required"),
})

export type AnalysisSynopsisJobData = z.infer<
  typeof createAnalysisSynopsisJobRequestSchema
>