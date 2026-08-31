import { Title } from "@/components/ui/Typography/title"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"


export const TitleHome = async ({
  className
}: {
  className?: string
}) => {

  const t = await getTranslations("CTA.TitleHome")

  return (
  <Title className={cn(
    "text-4xl",
    "lg:text-5xl",
    "xl:text-6xl",
    "2xl:text-7xl",
    "font-extrabold",
    "font-brand",
    className
  )}>
    {t("BeforeAccent")} <br />
    <span className="text-accent mr-4">{t("Accent")}</span><br />
    {t("AfterAccent")}
  </Title>
  )
}