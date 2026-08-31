import { Separator } from "../ui/Separator"
import { Text } from "../ui/Typography/text"
import {getTranslations} from "next-intl/server"

export async function AuthSeparator() {

  const t = await getTranslations("Auth.Login.Form")

  return (
    <div className="flex flex-row items-center justify-center gap-4 mt-4">
      <Separator />
      <Text variant="muted" className="text-lg">{t("SeparatorText")}</Text>
      <Separator />
    </div>
  )
}