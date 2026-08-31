import { Title } from "../../ui/Typography/title"
import { Chip } from "../../ui/chip"
import {getTranslations} from "next-intl/server"

export async function FormHeaderTitle({type}: {type: "email" | "phone"}) {

  const t = await getTranslations("Auth.Login.Form")

  return (
    <div className="
      flex
      flex-col
      gap-2
    ">
      <div className="
        flex
        flex-row
        items-center
        gap-4
      ">
        <Title>
          {type === "phone" ?
            t("PhoneLabelTitle"):
            t("EmailLabelTitle")
          }
        </Title>
        {type === "email" && (
          <Chip className="text-xs">
            {t("EmailLabelChip")}
          </Chip>
        )}
      </div>
    </div>
  )
}