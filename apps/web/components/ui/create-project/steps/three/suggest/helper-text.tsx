import { Sparkles } from "lucide-react"

import { HelperText } from "@/components/ui/Typography"
import {useTranslations} from "next-intl"

export function SuggestHelperText() {

  const t = useTranslations("CreateProject.StepThree.Suggest")

  return (
    <div
      className="
        flex items-start gap-3
        rounded-lg
        bg-soft-blue
        px-3 py-2.5
      "
    >
      <Sparkles
        className="mt-0.5 size-4 shrink-0 text-accent"
        aria-hidden="true"
      />

      <HelperText>
        {t("InfoHelperText")}
      </HelperText>
    </div>
  )
}