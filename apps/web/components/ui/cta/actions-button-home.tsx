import { Button } from "@/components/ui/button"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { CirclePlay } from "lucide-react"
import { getTranslations } from "next-intl/server"

export async function ActionButtonHome() {

  const t = await getTranslations("CTA.ActionButton")

  return (
    <div className="
      flex
      flex-col
      md:flex-col
      gap-4
    ">
      <Button variant="primary" size="lg">
        {t("StartWriting")}
      </Button>

      <ButtonWithIcon
        variant="outline"
        icon={CirclePlay}
        iconPosition="right"
        size="lg"
      >
        {t("ViewDemo")}
      </ButtonWithIcon>
    </div>
  )
}