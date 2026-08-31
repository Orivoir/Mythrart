import { cn } from "@/lib/utils"
import { Title } from "@/components/ui/Typography/title"
import { getTranslations } from "next-intl/server"

export async function FooterText() {

  const t = await getTranslations("CTA.FooterText")
  return (
    <section
      className={cn(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "gap-4",
        "my-12"
      )}
    >
      <Title className={cn(
        "text-lg",
        "md: text-sm",
        "lg:text-3xl",
        "font-extrabold",
        "font-brand"
      )}>
        {t("Title")}
      </Title>

      <Title className={cn(
        "text-accent",
        "text-xs",
        "md:text-xs",
        "lg:text-md",
        "font-brand"
      )}>
        {t("Subtitle")}
      </Title>
    </section>
  )
}