import { ArrowRight, Play } from "lucide-react"

import { AppLink } from "@/components/ui/app-link"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { URI_BILLING } from "@/lib/constants/client-routes"
import {useTranslations} from "next-intl"
import ButtonSeeDemo from "@/components/ui/button-see-demo"

interface SynopsisActionsProps {
  onClickDemo: () => void
}

export function SynopsisActions({
  onClickDemo,
}: SynopsisActionsProps) {
  const t = useTranslations("CreateProject.StepTwo.FreeActions")

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonSeeDemo onClick={onClickDemo} />

      <ButtonWithIcon
        asChild
        variant="primary"
        size="default"
        icon={ArrowRight}
        iconPosition="right"
      >
        <AppLink href={URI_BILLING}>
          {t("CompareOffers")}
        </AppLink>
      </ButtonWithIcon>
    </div>
  )
}