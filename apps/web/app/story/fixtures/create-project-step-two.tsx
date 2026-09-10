"use client"

import { useState } from "react"

import { CreateProjectStepTwo } from "@/components/ui/create-project/steps/two"

import type {
  CreateProjectStepTwoValues,
  SynopsisAnalysisState,
  SynopsisShortAnalysisData,
} from "@/components/ui/create-project/steps/two/types"

type FixtureState =
  | "free"
  | "empty"
  | "file"
  | "analyzing"
  | "completed"

const fixtureFile = new File(
  ["Synopsis fictif pour la story de Mythrart."],
  "mon-synopsis.pdf",
  {
    type: "application/pdf",
  },
)

const fixtureAnalysisData: SynopsisShortAnalysisData = {
  entityCount: 12,
  locationCount: 7,
  narrativeArcCount: 4,
  timelineCount: 9,
}

const fixtureStates: {
  id: FixtureState
  label: string
}[] = [
  {
    id: "free",
    label: "Free",
  },
  {
    id: "empty",
    label: "Aucun fichier",
  },
  {
    id: "file",
    label: "Fichier sélectionné",
  },
  {
    id: "analyzing",
    label: "Analyse en cours",
  },
  {
    id: "completed",
    label: "Analyse terminée",
  },
]

export default function CreateProjectStepTwoFixture() {
  const [state, setState] = useState<FixtureState>("free")

  const getValues = (): CreateProjectStepTwoValues => {
    if (
      state === "file" ||
      state === "analyzing" ||
      state === "completed"
    ) {
      return {
        synopsisFile: fixtureFile,
      }
    }

    return {
      synopsisFile: null,
    }
  }

  const getAnalysis = (): SynopsisAnalysisState => {
    switch (state) {
      case "analyzing":
        return {
          percent: 63,
        }

      case "completed":
        return {
          percent: 100,
          data: fixtureAnalysisData,
        }

      default:
        return {
          percent: 0,
        }
    }
  }

  const handleFileChange = (file: File) => {
    console.log("Fixture: fichier sélectionné", file)

    setState("file")
  }

  const handleCancelAnalysis = () => {
    console.log("Fixture: analyse annulée")

    setState("file")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {fixtureStates.map((fixture) => (
          <button
            key={fixture.id}
            type="button"
            onClick={() => setState(fixture.id)}
            className="
              rounded border border-border bg-surface
              px-3 py-2 text-sm text-foreground
              transition-colors hover:bg-surface-hover
            "
          >
            {fixture.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-background p-6">
        <CreateProjectStepTwo
          hasAnalysisAccess={state !== "free"}
          value={getValues()}
          analysis={getAnalysis()}
          onFileChange={handleFileChange}
          onCancelAnalysis={handleCancelAnalysis}
        />
      </div>
    </div>
  )
}