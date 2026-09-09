"use client"

import { useState } from "react"

import { Features } from "./features"
import { WritingGoal as ComponentWritingGoal } from "./goal-writing"

import type {
  ProjectFeatureId,
  StepThreeProps,
  StepThreeValues,
  WritingGoal,
} from "./types"

const DEFAULT_VALUES: StepThreeValues = {
  features: {
    versioning: true,
    translation: true,
    "writing-reports": false,
  },

  suggestionLevel: "basic",

  writingGoal: {
    enabled: false,
    type: "words",
    target: 50000,
    durationMonths: 6,
  },
}

function createInitialValues(
  initialValues?: Partial<StepThreeValues>,
): StepThreeValues {
  return {
    features: {
      ...DEFAULT_VALUES.features,
      ...initialValues?.features,
    },

    suggestionLevel:
      initialValues?.suggestionLevel ??
      DEFAULT_VALUES.suggestionLevel,

    writingGoal: {
      ...DEFAULT_VALUES.writingGoal,
      ...initialValues?.writingGoal,
    },
  }
}

export function CreateProjectStepThree({
  features,
  suggestions,
  initialValues,
  onChange,
  onSuggestionDemo,
}: StepThreeProps) {
  const [values, setValues] = useState<StepThreeValues>(() =>
    createInitialValues(initialValues),
  )

  function updateValues(
    updater: (current: StepThreeValues) => StepThreeValues,
  ) {
    setValues((current) => {
      const next = updater(current)

      onChange?.(next)

      return next
    })
  }

  function handleFeatureChange(
    feature: ProjectFeatureId,
    enabled: boolean,
  ) {
    updateValues((current) => ({
      ...current,

      features: {
        ...current.features,
        [feature]: enabled,
      },
    }))
  }

  function handleSuggestionChange(
    suggestionLevel: StepThreeValues["suggestionLevel"],
  ) {
    updateValues((current) => ({
      ...current,
      suggestionLevel,
    }))
  }

  function handleWritingGoalChange(
    writingGoal: Partial<WritingGoal>,
  ) {
    updateValues((current) => ({
      ...current,

      writingGoal: {
        ...current.writingGoal,
        ...writingGoal,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <Features
        features={features}
        values={values.features}
        suggestions={suggestions}
        suggestionLevel={values.suggestionLevel}
        onFeatureChange={handleFeatureChange}
        onSuggestionChange={handleSuggestionChange}
        onSuggestionDemo={onSuggestionDemo}
      />

      <ComponentWritingGoal
        value={values.writingGoal}
        onChange={handleWritingGoalChange}
      />
    </div>
  )
}