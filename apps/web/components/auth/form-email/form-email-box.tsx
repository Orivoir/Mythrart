"use client"

import type { SyntheticEvent } from "react"
import { useTranslations } from "next-intl"
import { Text } from "@/components/ui/Typography/text"
import {ShieldCheck} from "lucide-react"
import { FormEmailInput } from "./form-email-input"
import { FormEmailSubmit } from "@/components/auth/form-email/form-email-submit"
import { signIn } from "next-auth/react"

export function FormEmailBox() {
  const t = useTranslations("Auth.Login.Form")

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")

    await signIn("email", {
      email,
      callbackUrl: "/dashboard",
    })
  }

  return (
    <form
      className="mt-6"
      onSubmit={handleSubmit}
    >
      <FormEmailInput />
      <FormEmailSubmit />

      <div className="
        flex
        flex-row
        items-center
        justify-center
        mt-4
      ">
        <div className="
          flex
          flex-row
          items-center
          gap-1
        ">
          <div>
            <ShieldCheck className="text-muted" size={14} />
          </div>
          <Text variant="muted">
            {t("EmailHelperText")}
          </Text>
        </div>
      </div>

    </form>
  )
}