import {
  LockKeyhole,
  Sparkles
} from "lucide-react"

import { AnalysisFeature } from "./synopsis-premium-feature"

import { Title, Text } from "@/components/ui/Typography"

import {useTranslations} from "next-intl"

export function SynopsisPremiumCTA() {

  const t = useTranslations("CreateProject.StepTwo.FreeCTA")

  return (
    <div
      className="
        overflow-hidden rounded-lg
        border border-accent/10
        bg-soft-blue
      "
    >
      <div
        className="
          grid
          md:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.2fr)]
        "
      >
        {/* Locked upload zone */}
        <div
          className="
            relative flex min-h-64
            items-center justify-center
            border-b border-accent/10
            px-5 py-6
            md:border-b-0 md:border-r
          "
          aria-disabled="true"
        >
          <div
            className="
              absolute inset-4
              rounded-lg
              border-2 border-dashed
              border-accent/20
              bg-background/60
            "
            aria-hidden="true"
          />

          <div
            className="
              relative z-10
              flex max-w-xs flex-col
              items-center gap-3
              text-center
            "
          >
            <div
              className="
                flex size-11 items-center justify-center
                rounded-full border border-accent/15
                bg-background
                text-accent
                shadow-sm
              "
            >
              <LockKeyhole
                className="size-5"
                aria-hidden="true"
              />
            </div>

            <div className="space-y-1.5">
              <Title className="text-base">
                {t("Title")}
              </Title>

              <Text variant="muted">
                {t("Describe")}
              </Text>
            </div>

            <span
              className="
                inline-flex items-center gap-1.5
                rounded-full
                bg-accent/10
                px-2.5 py-1
                text-xs font-medium
                text-accent
              "
            >
              <Sparkles
                className="size-3.5"
                aria-hidden="true"
              />
              Premium
            </span>
          </div>
        </div>

        {/* Analysis preview */}
        <div className="flex flex-col justify-center px-6 py-6 md:px-7">
          <div className="space-y-1.5">
            <Title className="text-base">
              {t("PreviewLabel")}
            </Title>

            <Text variant="muted">
              {t("PreviewDescribe")}
            </Text>
          </div>

          <ul className="mt-5 space-y-2.5">
            <AnalysisFeature>
              {t("Features.0")}
            </AnalysisFeature>

            <AnalysisFeature>
              {t("Features.1")}
            </AnalysisFeature>

            <AnalysisFeature>
              {t("Features.2")}
            </AnalysisFeature>

            <AnalysisFeature>
              {t("Features.3")}
            </AnalysisFeature>

            <AnalysisFeature>
              {t("Features.4")}
            </AnalysisFeature>
          </ul>
        </div>
      </div>
    </div>
  )
}