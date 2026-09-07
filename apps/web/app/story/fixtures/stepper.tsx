"use client"

import { useState } from "react"

import {
  Stepper,
  type StepperStep,
} from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"

const basicSteps: StepperStep[] = [
  {
    id: "information",
    index: 1,
    status: "completed",
    title: "Informations",
    isCurrent: false,
  },
  {
    id: "settings",
    index: 2,
    status: "active",
    title: "Paramètres",
    isCurrent: true,
  },
  {
    id: "confirmation",
    index: 3,
    status: "upcoming",
    title: "Confirmation",
    isCurrent: false,
  },
]

const descriptiveSteps: StepperStep[] = [
  {
    id: "information",
    index: 1,
    status: "completed",
    title: "Informations",
    description: "Présentez votre projet",
    isCurrent: false,
  },
  {
    id: "settings",
    index: 2,
    status: "active",
    title: "Paramètres",
    description: "Personnalisez votre espace",
    isCurrent: true,
  },
  {
    id: "confirmation",
    index: 3,
    status: "upcoming",
    title: "Confirmation",
    description: "Vérifiez votre projet",
    isCurrent: false,
  },
]

const interactiveStepDefinitions = [
  {
    id: "information",
    title: "Informations",
    description: "Présentez votre projet",
  },
  {
    id: "settings",
    title: "Paramètres",
    description: "Personnalisez votre espace",
  },
  {
    id: "confirmation",
    title: "Confirmation",
    description: "Vérifiez votre projet",
  },
]

export default function StepperFixtures() {
  const [currentStep, setCurrentStep] = useState(1)

  const interactiveSteps: StepperStep[] =
    interactiveStepDefinitions.map((step, index) => ({
      ...step,
      index: index + 1,
      status:
        index + 1 === currentStep
          ? "active"
          : index + 1 < currentStep
            ? "completed"
            : "upcoming",
      isCurrent: index + 1 === currentStep,
    }))

  const isFirstStep = currentStep === 1
  const isLastStep =
    currentStep === interactiveStepDefinitions.length

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">
          Stepper
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Progression entre les différentes étapes d'un workflow.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">
          Sans description
        </h3>

        <div className="rounded-xl border bg-background p-6">
          <Stepper
            steps={basicSteps}
            currentStep={2}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">
          Avec descriptions
        </h3>

        <div className="rounded-xl border bg-background p-6">
          <Stepper
            steps={descriptiveSteps}
            currentStep={2}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">
          Interactif
        </h3>

        <div className="space-y-6 rounded-xl border bg-background p-6">
          <Stepper
            steps={interactiveSteps}
            currentStep={currentStep}
          />

          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isFirstStep}
              onClick={() =>
                setCurrentStep((step) => step - 1)
              }
            >
              Précédent
            </Button>

            <Button
              type="button"
              variant="primary"
              disabled={isLastStep}
              onClick={() =>
                setCurrentStep((step) => step + 1)
              }
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}