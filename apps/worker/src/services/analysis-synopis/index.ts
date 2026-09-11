import type {
  AnalysisSynopsisJobData,
  AnalysisSynopsisJobResult,
} from "./../../validations/analysis-synopsis.job.js"

export async function analyzeSynopsis(
  data: AnalysisSynopsisJobData,
): Promise<AnalysisSynopsisJobResult> {
  const { assetId } = data

  // 1. Retrieve asset from database
  // 2. Download asset from S3
  // 3. Extract document content
  // 4. Normalize / clean content
  // 5. Send content to LLM
  // 6. Validate LLM result
  // 7. Return analysis result

  throw new Error("Not implemented")
}