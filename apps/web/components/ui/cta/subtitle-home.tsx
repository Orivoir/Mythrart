import { useTranslations } from "next-intl"
import { Text } from "@/components/ui/Typography/text"

export function SubtitleHome() {

  const t = useTranslations("CTA")

  return (
    <Text variant="default" className="
      text-md
      md:text-lg
      lg:text-xl
      ">
        {t("SubtitleHome")}
    </Text>
  )
}