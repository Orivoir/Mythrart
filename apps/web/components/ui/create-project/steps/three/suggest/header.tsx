import { Info } from "lucide-react"

import { Text, Title } from "@/components/ui/Typography"
import { Tooltip } from "@/components/ui/tooltip"
import {useTranslations} from "next-intl"

export function SuggestHeader() {

  const t = useTranslations("CreateProject.StepThree.Suggest")

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Title className="text-base">
          {t("Title")}
        </Title>

        <Tooltip
          content={
            <div className="max-w-xs">
              {t("Tooltip")}
            </div>
          }
        >
          <Info
            className="size-4 text-muted-foreground"
            aria-label={t("InfoAriaLabel")}
          />
        </Tooltip>
      </div>

      <Text variant="muted">
        {t("HelperText")}
      </Text>
    </div>
  )
}