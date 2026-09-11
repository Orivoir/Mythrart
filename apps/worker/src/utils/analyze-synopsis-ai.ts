import { openai } from "../config/ai.js"
import { llmConfig } from "../config/llm.js"
import promptAnalysisSynopsis from "../config/ai/prompt-analysis-synopsis.js"

import {
  synopsisAnalysisSchema,
  type SynopsisAnalysis,
} from "../validations/analysis-synopsis.job.js"

import schema from "../config/ai/schema-analysis-synopsis.js"

export async function analyzeSynopsisWithAI(
  text: string,
): Promise<SynopsisAnalysis> {
  const config = llmConfig.analysisSynopsis

  const response = await openai.responses.create({
    model: config.model,

    reasoning: {
      effort: config.reasoningEffort,
    },

    text: {
      verbosity: config.verbosity,

      format: {
        type: "json_schema",
        name: "synopsis_analysis",
        strict: true,

        schema: schema,
      },
    },

    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: promptAnalysisSynopsis
          },
        ],
      },

      {
        role: "user",
        content: [
          {
            type: "input_text",
            text,
          },
        ],
      },
    ],
  })

  if (!response.output_text) {
    throw new Error("Synopsis analysis returned no output")
  }

  const parsed = JSON.parse(response.output_text)

  return synopsisAnalysisSchema.parse(parsed)
}