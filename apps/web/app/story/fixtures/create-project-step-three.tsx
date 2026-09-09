"use client"

import { BarChart3, Globe2, History, Sparkles } from "lucide-react"

import { CreateProjectStepThree } from "@/components/ui/create-project/steps/three"
import type {
  ProjectFeature,
  StepThreeValues,
  SuggestionOption,
} from "@/components/ui/create-project/steps/three/types"

const features: ProjectFeature[] = [
  {
    id: "versioning",
    title: "Versionnage",
    describe: "Conservez l'historique des versions de votre projet.",
    icon: History,
    isLocked: false,
  },
  {
    id: "translation",
    title: "Aide à la traduction",
    describe: "Générez des modèles de traduction pour chaque chapitre.",
    icon: Globe2,
    isLocked: false,
  },
  {
    id: "writing-reports",
    title: "Rapports d’écriture",
    describe: "Suivez votre progression avec des statistiques détaillées.",
    icon: BarChart3,
    isLocked: true,
  },
]

const premiumFeatures: ProjectFeature[] = [
  {
    id: "versioning",
    title: "Versionnage",
    describe: "Conservez l'historique des versions de votre projet.",
    icon: History,
    isLocked: true,
  },
  {
    id: "translation",
    title: "Aide à la traduction",
    describe: "Générez des modèles de traduction pour chaque chapitre.",
    icon: Globe2,
    isLocked: true,
  },
  {
    id: "writing-reports",
    title: "Rapports d’écriture",
    describe: "Suivez votre progression avec des statistiques détaillées.",
    icon: BarChart3,
    isLocked: true,
  },
]

const suggestions: SuggestionOption[] = [
  {
    id: "basic",
    title: "Basique",
    describe:
      "Repérage des erreurs (fautes de frappe, grammaire), détection des répétitions, suggestions de style simples.",
    isLocked: false,
  },
  {
    id: "advanced",
    title: "Avancée",
    describe:
      "Détection d'incohérences entre les entités et la narration, suggestions sur la timeline, nouvelles entités, relations, etc.",
    isLocked: true,
  },
]

const freeSuggestions: SuggestionOption[] = [
  {
    id: "basic",
    title: "Basique",
    describe:
      "Repérage des erreurs (fautes de frappe, grammaire), détection des répétitions, suggestions de style simples.",
    isLocked: false,
  },
  {
    id: "advanced",
    title: "Avancée",
    describe:
      "Détection d'incohérences entre les entités et la narration, suggestions sur la timeline, nouvelles entités, relations, etc.",
    isLocked: true,
  },
]

const defaultValues: StepThreeValues = {
  features: {
    versioning: true,
    translation: true,
    "writing-reports": true,
  },
  suggestionLevel: "advanced",
  writingGoal: {
    enabled: true,
    type: "words",
    target: 50_000,
    durationMonths: 6,
  },
}

const disabledGoalValues: StepThreeValues = {
  ...defaultValues,
  writingGoal: {
    ...defaultValues.writingGoal,
    enabled: false,
  },
}

const pagesGoalValues: StepThreeValues = {
  ...defaultValues,
  writingGoal: {
    enabled: true,
    type: "pages",
    target: 250,
    durationMonths: 6,
  },
}

const chaptersGoalValues: StepThreeValues = {
  ...defaultValues,
  writingGoal: {
    enabled: true,
    type: "chapters",
    target: 20,
    durationMonths: 6,
  },
}

const basicSuggestionValues: StepThreeValues = {
  ...defaultValues,
  suggestionLevel: "basic",
}

const noFeaturesValues: StepThreeValues = {
  ...defaultValues,
  features: {
    versioning: false,
    translation: false,
    "writing-reports": false,
  },
}

export const stepThreeFixtures = {
  default: {
    features,
    suggestions,
    initialValues: defaultValues,
  },

  free: {
    features: premiumFeatures,
    suggestions: freeSuggestions,
    initialValues: {
      ...defaultValues,
      suggestionLevel: "basic",
    },
  },

  basicSuggestions: {
    features,
    suggestions,
    initialValues: basicSuggestionValues,
  },

  advancedSuggestions: {
    features,
    suggestions,
    initialValues: defaultValues,
  },

  disabledGoal: {
    features,
    suggestions,
    initialValues: disabledGoalValues,
  },

  pagesGoal: {
    features,
    suggestions,
    initialValues: pagesGoalValues,
  },

  chaptersGoal: {
    features,
    suggestions,
    initialValues: chaptersGoalValues,
  },

  noFeatures: {
    features,
    suggestions,
    initialValues: noFeaturesValues,
  },
} satisfies Record<
  string,
  {
    features: ProjectFeature[]
    suggestions: SuggestionOption[]
    initialValues: Partial<StepThreeValues>
  }
>

interface StepThreeFixtureProps {
  state?: keyof typeof stepThreeFixtures
  onChange?: (values: StepThreeValues) => void
}

export default function CreateProjectStepThreeFixture({
  state = "default",
  onChange,
}: StepThreeFixtureProps) {
  const fixture = stepThreeFixtures[state]

  return (
    <CreateProjectStepThree
      features={fixture.features}
      suggestions={fixture.suggestions}
      initialValues={fixture.initialValues}
      onChange={onChange}
    />
  )
}