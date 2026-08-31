import { cn } from "@/lib/utils"
import {Title as TypographyTitle} from "@/components/ui/Typography/title"
import {getTranslations} from "next-intl/server"

export async function Title({className}: {className?: string}) {

  const t = await getTranslations("Auth.Login.Title")

  return (
    <TypographyTitle className={cn(
      "text-4xl",
      "lg:text-5xl",
      "xl:text-6xl",
      "2xl:text-7xl",
      "font-extrabold",
      "font-brand",
      className
    )}>
      {t("BeforeAccent")}<br />
      <span className="text-accent mr-4">{t("Accent")}</span>
    </TypographyTitle>
  )
}