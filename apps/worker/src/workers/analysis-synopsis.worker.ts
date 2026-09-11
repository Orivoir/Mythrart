import { prisma } from "@mythrart/database"
import { GetObjectCommand, s3 } from "@mythrart/s3"

import { extractSynopsisText } from "./../utils/extract-text.js"
import { normalizeSynopsisText } from "./../utils/normalize-text.js"
import { analyzeSynopsisWithAI } from "./../utils/analyze-synopsis-ai.js"
import { validateSynopsisAnalysis } from "./../utils/validate-synopsis-analysis.js"

import type {
  AnalysisSynopsisJobData,
  AnalysisSynopsisJobResult,
} from "./../validations/analysis-synopsis.job.js"

export async function analyzeSynopsis({
  assetId,
}: AnalysisSynopsisJobData): Promise<AnalysisSynopsisJobResult> {
  /**
   * Analyze a synopsis asset uploaded to S3.
   *
   * 1 - Database (read): Get the Asset from the database
   * 2 - S3 (read): Download the synopsis file
   * 3 - local: Extract text from the file
   * 4 - local: Normalize / clean the extracted text
   * 5 - AI: Analyze the normalized synopsis with the LLM
   * 6 - local: Validate the AI result
   * 7 - return the analysis result
   *
   * No Ebook or EbookEntity is created here.
   * Entity IDs and event IDs returned by the LLM are temporary
   * and only valid for this analysis result.
   */

  // 1 - Database (read): Get the Asset
  const asset = await prisma.asset.findUnique({
    where: {
      id: assetId,
    },
  })

  if (!asset) {
    throw new Error(`Asset not found: ${assetId}`)
  }

  // 2 - S3 (read): Download the synopsis file
  const command = new GetObjectCommand({
    Bucket: asset.bucket,
    Key: asset.key,
  })

  const response = await s3.send(command)

  if (!response.Body) {
    throw new Error(`Unable to download asset from S3: ${assetId}`)
  }

  const fileBuffer = Buffer.from(
    await response.Body.transformToByteArray(),
  )

  // 3 - local: Extract text from the file
  const extractedText = await extractSynopsisText({
    buffer: fileBuffer,
    mimeType: asset.mimeType,
  })

  // 4 - local: Normalize / clean the extracted text
  const normalizedText = normalizeSynopsisText(extractedText)

  if (!normalizedText.trim()) {
    throw new Error(`Synopsis asset contains no readable text: ${assetId}`)
  }

  // 5 - AI: Analyze the normalized synopsis
  const analysis = await analyzeSynopsisWithAI(normalizedText)

  // 6 - local: Validate the AI result
  const validatedAnalysis = validateSynopsisAnalysis(analysis)

  // 7 - Return the analysis result
  return {
    analysis: {
      assetId,
      entities: validatedAnalysis.entities,
      relations: validatedAnalysis.relations,
      events: validatedAnalysis.events,
    },
  }
}