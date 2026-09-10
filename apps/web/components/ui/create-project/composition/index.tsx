"use client"

import { useState } from "react"

import { CreateProjectStepOne } from "../steps/one"
import { CreateProjectStepTwo } from "../steps/two"

import type {
  CreateProjectCoverPreset,
  CreateProjectStepOneValues,
  CreateProjectTheme,
} from "../steps/one/types"

import type {
  AnalysisJob,
  CreateProjectStepTwoValues,
  SynopsisAnalysisState,
} from "../steps/two/types"

import type { SelectOption } from "@/components/ui/select"

const steps = [
  {
    id: "informations",
    index: 1,
    title: "Informations",
    description: "Détails de base",
  },
  {
    id: "synopsis",
    index: 2,
    title: "Synopsis",
    description: "Votre histoire et son analyse",
  },
] as const

export type CreateProjectStep = (typeof steps)[number]

export type CreateProjectStepperStep = CreateProjectStep & {
  status: "completed" | "active" | "upcoming"
  isCurrent: boolean
}

export type CreateProjectCompositionRenderState = {
  currentStep: number
  currentStepData: CreateProjectStep
  steps: readonly CreateProjectStep[]
  stepperSteps: CreateProjectStepperStep[]

  isValid: boolean
  canGoPrevious: boolean
  canGoNext: boolean

  next: () => Promise<void>
  previous: () => void

  content: React.ReactNode
}

export type CreateProjectCompositionProps = {
  projectTypes: SelectOption[]
  themes: CreateProjectTheme[]
  coverPresets: CreateProjectCoverPreset[]
  hasAnalysisAccess: boolean

  onStepOneFinish: (
    value: CreateProjectStepOneValues,
  ) => void | Promise<void>

  onAnalysisStart: (
    file: File,
  ) => void | Promise<void>

  onAnalysisCancel: () => void | Promise<void>

  getAnalysisJob: () => Promise<AnalysisJob>

  children: (
    state: CreateProjectCompositionRenderState,
  ) => React.ReactNode
}

export function CreateProjectComposition({
  projectTypes,
  themes,
  coverPresets,
  hasAnalysisAccess,
  onStepOneFinish,
  onAnalysisStart,
  onAnalysisCancel,
  getAnalysisJob,
  children,
}: CreateProjectCompositionProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const [stepOneValue, setStepOneValue] =
    useState<CreateProjectStepOneValues>({
      title: "",
      subtitle: "",
      type: "novel",
      description: "",
      theme: "modern-fiction",
      cover: null,
      coverPreset: null,
    })

  const [stepTwoValue, setStepTwoValue] =
    useState<CreateProjectStepTwoValues>({
      synopsisFile: null,
    })

  const [analysis, setAnalysis] =
    useState<SynopsisAnalysisState>({
      percent: 0,
    })

  const handleStepOneChange = (
    field: keyof Omit<
      CreateProjectStepOneValues,
      "cover" | "coverPreset"
    >,
    value: string,
  ) => {
    setStepOneValue((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleCoverChange = (files: File[]) => {
    const file = files[0] ?? null

    setStepOneValue((current) => ({
      ...current,
      cover: file,
      coverPreset: file
        ? null
        : current.coverPreset,
    }))
  }

  const handleCoverPresetChange = (
    preset: string | null,
  ) => {
    setStepOneValue((current) => ({
      ...current,
      coverPreset: preset,
      cover: null,
    }))
  }

  const handleSynopsisFileChange = async (
    file: File,
  ) => {
    setStepTwoValue({
      synopsisFile: file,
    })

    setAnalysis({
      percent: 0,
    })

    await onAnalysisStart(file)
  }

  const handleAnalysisCancel = async () => {
    setAnalysis({
      percent: 0,
    })

    await onAnalysisCancel()
  }

  const handleNext = async () => {
    if (!isValid) {
      return
    }

    if (currentStep === 1) {
      await onStepOneFinish(stepOneValue)
      setCurrentStep(2)
      return
    }

    // Création finale à brancher lorsque le contrat sera défini.
  }

  const handlePrevious = () => {
    if (currentStep === 1) {
      return
    }

    setCurrentStep((current) => current - 1)
  }

  const isStepOneValid =
    stepOneValue.title.trim().length > 0 &&
    stepOneValue.type.length > 0 &&
    stepOneValue.theme.length > 0

  const isValid =
    currentStep === 1
      ? isStepOneValid
      : true

  const currentStepData =
    steps[currentStep - 1]

  const stepperSteps = steps.map((step) => ({
    ...step,
    status:
      step.index < currentStep
        ? "completed"
        : step.index === currentStep
          ? "active"
          : "upcoming",
    isCurrent:
      step.index === currentStep,
  } as const))

  const content = (
    <>
      {currentStep === 1 && (
        <CreateProjectStepOne
          value={stepOneValue}
          projectTypes={projectTypes}
          themes={themes}
          coverPresets={coverPresets}
          onChange={handleStepOneChange}
          onCoverChange={handleCoverChange}
          onCoverPresetChange={
            handleCoverPresetChange
          }
        />
      )}

      {currentStep === 2 && (
        <CreateProjectStepTwo
          hasAnalysisAccess={hasAnalysisAccess}
          value={stepTwoValue}
          analysis={analysis}
          onFileChange={handleSynopsisFileChange}
          onCancelAnalysis={
            handleAnalysisCancel
          }
        />
      )}
    </>
  )

  return children({
    currentStep,
    currentStepData,
    steps,
    stepperSteps,
    isValid,
    canGoPrevious: currentStep > 1,
    canGoNext: isValid,
    next: handleNext,
    previous: handlePrevious,
    content,
  })
}