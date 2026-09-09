import { Play } from "lucide-react"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { useTranslations } from "next-intl"

export default function ButtonSeeDemo({ onClick }: { onClick: () => void }) {

  const t = useTranslations("Buttons")

  return (
    <ButtonWithIcon
      type="button"
      variant="outline"
      size="default"
      icon={Play}
      iconPosition="right"
      onClick={onClick}
    >
      {t("SeeDemoLabel")}
    </ButtonWithIcon>
  )
}