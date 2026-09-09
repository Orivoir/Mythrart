import { LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/Typography"

import {useTranslations} from "next-intl"

interface SynopsisAnalysisProps {
  percent: number
  onCancel: () => void
}

export function SynopsisAnalysis({
  percent,
  onCancel,
}: SynopsisAnalysisProps) {
  const progress = Math.min(100, Math.max(0, percent))

  const t = useTranslations("CreateProject.StepTwo.LoadingAnalysis")

  return (
    <div
      className="
        space-y-4 rounded-lg border border-soft-blue-hover border-border
        bg-soft-blue p-4
      "
    >
      <div className="flex items-start gap-3">
        <LoaderCircle
          className="mt-0.5 size-5 shrink-0 animate-spin text-accent"
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium text-foreground">
            {t("Title")}
          </p>

          <Text variant="muted">
            {t("Describe")}
          </Text>
        </div>

        <span className="shrink-0 text-sm font-medium text-foreground">
          {progress}%
        </span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-soft-blue"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Progression de l'analyse du synopsis"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          {t("CancelButtonLabel")}
        </Button>
      </div>
    </div>
  )
}