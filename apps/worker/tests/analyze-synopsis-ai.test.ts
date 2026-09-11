import { describe, expect, it } from "vitest"

import { analyzeSynopsisWithAI } from "./../src/utils/analyze-synopsis-ai.js"
import { synopsisAnalysisSchema } from "./../src/validations/analysis-synopsis.job.js"
import { llmConfig } from "./../src/config/llm.js"

const synopsisFixtures = [
  {
    name: "short synopsis",
    text: `
      Emma, une jeune écrivaine vivant à Paris, découvre dans les affaires
      de sa grand-mère une lettre datant de 1944. La lettre révèle l'existence
      d'un secret de famille qui va pousser Emma à enquêter sur le passé de
      sa grand-mère pendant l'Occupation.
    `,
  },

  {
    name: "long synopsis",
    text: `
      Dans une petite ville côtière, Thomas revient après quinze années
      d'absence pour assister aux funérailles de son père.

      Il pensait ne rester que quelques jours, mais découvre rapidement que
      son père enquêtait depuis plusieurs années sur la disparition d'une
      femme survenue dans la région dans les années 1990.

      En fouillant la maison familiale, Thomas découvre des carnets, des
      photographies et des lettres qui semblent relier cette disparition
      à plusieurs habitants de la ville.

      Son enquête le conduit progressivement à remettre en question les
      souvenirs qu'il avait de son enfance et les raisons véritables pour
      lesquelles sa mère avait quitté la ville.

      Alors que Thomas se rapproche de la vérité, plusieurs personnes
      commencent à lui demander de cesser ses recherches.
    `,
  },
]

describe.skip("Synopsis analysis integration", () => {
  it.each(synopsisFixtures)(
    "analyses $name with the configured LLM",
    async ({ text }) => {
      const result = await analyzeSynopsisWithAI(text)

      // Vérifie que le résultat respecte réellement le contrat Zod.
      const parsed = synopsisAnalysisSchema.parse(result)

      expect(parsed).toEqual(result)

      console.log("\n--- Synopsis analysis ---")
      console.log("Model:", llmConfig.analysisSynopsis.model)
      console.log(
        "Reasoning effort:",
        llmConfig.analysisSynopsis.reasoningEffort,
      )

      expect(parsed).toBeDefined()
    },
    60_000,
  )
})