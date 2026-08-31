import { z } from "zod"

export const createSnapshotJobRequestSchema = z.object({
    ebookId: z.string().trim().min(1, "ebookId is required"),
})

export type SnapshotJobData = z.infer<typeof createSnapshotJobRequestSchema>