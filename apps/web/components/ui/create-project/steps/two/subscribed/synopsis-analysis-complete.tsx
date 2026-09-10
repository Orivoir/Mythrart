import {
  ArrowRight,
  Check,
  Clock3,
  MapPin,
  Sparkles,
  Users,
  Waypoints,
} from "lucide-react"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { Text, Title } from "@/components/ui/Typography"

import { AnalysisItem } from "./synopsis-analysis-complete-item"

import type { SynopsisShortAnalysisData } from "../types"

import { useTranslations } from "next-intl"
import fireEvent from "@/lib/constants/custom-events"

interface SynopsisAnalysisCompleteProps {
  data: SynopsisShortAnalysisData
}

export function SynopsisAnalysisComplete({
  data
}: SynopsisAnalysisCompleteProps) {

  const t = useTranslations("CreateProject.StepTwo.CompletedAnalysis")

  const onShowDetail = () => {
    fireEvent.showAnalysisDetails(data)
  }

  return (
    <div className="space-y-3">
      {/* Analysis result */}
      <div
        className="
          rounded-md
          bg-success-soft
          p-4
        "
      >
        <div className="flex items-start gap-3">
          {/* Success indicator */}
          <div
            className="
              flex size-8 shrink-0 items-center justify-center
              rounded-full
              bg-success
              text-primary-foreground
            "
          >
            <Check
              className="size-4"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <Title className="text-base">
              {t("Title")}
            </Title>

            <Text variant="muted" className="mt-0.5">
              {t("Describe")}
            </Text>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AnalysisItem
                icon={Users}
                label="personnages"
                value={data.entityCount}
              />

              <AnalysisItem
                icon={MapPin}
                label="lieux principaux"
                value={data.locationCount}
              />

              <AnalysisItem
                icon={Waypoints}
                label="arcs narratifs"
                value={data.narrativeArcCount}
              />

              <AnalysisItem
                icon={Clock3}
                label="timeline préliminaire"
                value={data.timelineCount}
              />
            </div>
          </div>

          {/* Details action */}
          <ButtonWithIcon
            type="button"
            variant="outline"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={onShowDetail}
            className="hidden shrink-0 sm:inline-flex"
          >
            {t("ButtonDetailsLabel")}
          </ButtonWithIcon>
        </div>

        {/* Mobile action */}
        <ButtonWithIcon
          type="button"
          variant="outline"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={onShowDetail}
          className="mt-4 w-full sm:hidden"
        >
          {t("ButtonDetailsLabel")}
        </ButtonWithIcon>
      </div>

      {/* Information */}
      <div
        className="
          flex items-start gap-3
          rounded-md
          bg-soft-blue
          px-4 py-3
        "
      >
        <Sparkles
          className="mt-0.5 size-4 shrink-0 text-accent"
          aria-hidden="true"
        />

        <Text className="text-foreground">
          {t("HelperText")}
        </Text>
      </div>
    </div>
  )
}