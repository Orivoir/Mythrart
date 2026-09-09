import { StepThreeHeader } from "../header"
import { Suggest } from "../suggest"

import { FeatureItem } from "./item"

import {useTranslations} from "next-intl"

import type {
  ProjectFeature,
  ProjectFeatureId,
  SuggestionLevel,
  SuggestionOption,
} from "../types"

interface FeaturesProps {
  features: ProjectFeature[]
  values: Record<ProjectFeatureId, boolean>

  suggestions: SuggestionOption[]
  suggestionLevel: SuggestionLevel

  onFeatureChange: (
    feature: ProjectFeatureId,
    enabled: boolean,
  ) => void

  onSuggestionChange: (
    level: SuggestionLevel,
  ) => void

  onSuggestionDemo?: () => void
}

export function Features({
  features,
  values,
  suggestions,
  suggestionLevel,
  onFeatureChange,
  onSuggestionChange,
  onSuggestionDemo,
}: FeaturesProps) {

  const t = useTranslations("CreateProject.StepThree.Features")

  return (
    <section
      className="
        space-y-4
        rounded-lg border border-border
        bg-background p-4
      "
    >
      <StepThreeHeader
        title={t("Title")}
        subtitle={t("Subtitle")}
        withEnable={false}
        infos={{
          title: t("Infos.Title"),
          describe: t("Infos.Describe"),
        }}
      />

      <div className="space-y-1">
        {features.map((feature) => (
          <FeatureItem
            key={feature.id}
            title={feature.title}
            describe={feature.describe}
            icon={feature.icon}
            isLocked={feature.isLocked}
            enabled={values[feature.id]}
            onChange={(enabled) =>
              onFeatureChange(feature.id, enabled)
            }
          />
        ))}
      </div>

      <Suggest
        options={suggestions}
        value={suggestionLevel}
        onChange={onSuggestionChange}
        onDemo={onSuggestionDemo}
      />
    </section>
  )
}