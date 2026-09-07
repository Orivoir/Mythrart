import { cn } from "@/lib/utils"

import type { StepperProps } from "./types"
import { Step } from "./step"

export function Stepper({
  steps,
  currentStep,
  className,
}: StepperProps) {
  return (
    <nav
      aria-label="Progression"
      className={cn(
        "grid w-full grid-cols-[repeat(var(--step-count),minmax(0,1fr))]",
        className,
      )}
      style={{
        "--step-count": steps.length,
      } as React.CSSProperties}
    >
      {steps.map((step, stepIndex) => {
        const isCurrent = step.index === currentStep
        const hasNextStep = stepIndex < steps.length - 1

        return (
          <div
            key={step.id}
            className="min-w-0"
          >
            {/* Ligne indicateur + titre + connecteur */}
            <div className="flex items-center">
              <Step.Header
                index={step.index}
                status={step.status}
                title={step.title}
                isCurrent={isCurrent}
              />

              {hasNextStep && (
                <div
                  className={cn(
                    "mx-[12%] h-0.5 min-w-0 flex-1",
                    step.status === "completed"
                      ? "bg-primary"
                      : "bg-border",
                  )}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Ligne description complètement indépendante */}
            <Step.Description
              description={step.description}
            />
          </div>
        )
      })}
    </nav>
  )
}