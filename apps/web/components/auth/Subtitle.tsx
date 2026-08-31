import { Text } from "../ui/Typography/text"
import { getTranslations } from "next-intl/server"

export async function Subtitle() {

  const t = await getTranslations("Auth.Login")

  return (
    <Text variant="muted" className="text-lg mt-6">
      {t("Subtitle")}
    </Text>
  )
}