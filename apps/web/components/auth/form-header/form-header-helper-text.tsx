import { Text } from "../../ui/Typography/text"
import {getTranslations} from "next-intl/server"

export async function FormHeaderHelperText({
  type = "email"
}: {
  type: "email" | "phone"
}) {

  const t = await getTranslations("Auth.Login.Form")

  return (
    <div>
      <Text variant="muted">
        {type === "phone" ?
          t("PhoneSubLabel"):
          t("EmailSubLabel")
        }
      </Text>
    </div>
  )
}