import { Title } from "../ui/Typography/title"
import {getTranslations} from "next-intl/server"
import { FormBox } from "./form-box"
import { AuthSeparator } from "./separator"
import { LegalsPolicies } from "./legals-policies"

export async function AuthForm() {

  const t = await getTranslations("Auth.Login.Form")

  return (
    <div className="
      flex
      flex-col
      w-xl
      bg-surface
      rounded-md
      shadow-md
      py-4
      px-12
    ">
      <div className="flex justify-center items-center w-full">
        <Title isBrand className="text-2xl font-extrabold">
          {t("Title")}
        </Title>
      </div>

      <FormBox type="email" />

      <AuthSeparator />

      <FormBox type="phone" />

      <LegalsPolicies />

    </div>
  )
} 