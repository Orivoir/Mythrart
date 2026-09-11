import { z } from "zod"

import {
  EbookEntityRelationType,
  EbookEntityType,
} from "@mythrart/database"

export const ANALYSIS_SYNOPSIS_JOB_NAME = "analysis.synopsis"

export const analysisSynopsisJobDataSchema = z.object({
  assetId: z.string().min(1, "assetId is required"),
})

export type AnalysisSynopsisJobData = z.infer<
  typeof analysisSynopsisJobDataSchema
>

const entityTypes = Object.values(EbookEntityType) as [
  EbookEntityType,
  ...EbookEntityType[],
]

const relationTypes = Object.values(EbookEntityRelationType) as [
  EbookEntityRelationType,
  ...EbookEntityRelationType[],
]

export const synopsisAnalysisSchema = z.object({
  entities: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(entityTypes),
      description: z.string().nullable(),
    }),
  ),

  relations: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      type: z.enum(relationTypes),
    }),
  ),

  events: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      participants: z.array(z.string()),
      temporalExpression: z.string().nullable(),
    }),
  ),
})

export type SynopsisAnalysis = z.infer<
  typeof synopsisAnalysisSchema
>

export interface AnalysisSynopsisJobResult {
  analysis: SynopsisAnalysis & {
    assetId: string
  }
}