import { getTranslations } from "next-intl/server"
import { Title } from "@/components/ui/Typography/title"
import { Text } from "@/components/ui/Typography/text"
import { CircleCheck } from "lucide-react"

export async function ListMarketing() {

  const t = await getTranslations("CTA.MarketingList")

  const items = [
    {
      title: t("FreePlanTitle"),
      description: t("FreePlanDescription"),
    },
    {
      title: t("NoInstallTitle"),
      description: t("NoInstallDescription"),
    },
    {
      title: t("TrialPeriodTitle"),
      description: t("TrialPeriodDescription"),
    }
  ]

  return (
    <div className="">
      <ul className="
        flex
        flex-col
        md:flex-row
        gap-4
      ">
        {items.map(item => (
          <li key={item.title} className="
            flex
            flex-row
            gap-4
            flex-1
          ">
            <div>
              <CircleCheck className="text-accent" />
            </div>
            <div className="
              flex
              flex-col
              gap-2
            ">
              <Title variant="accent" className="line-clamp-1 text-md">
                {item.title}
              </Title>
              <Text variant="muted" className="line-clamp-2 text-sm">
                {item.description}
              </Text>
            </div>
          </li>
        ))}

      </ul>
    </div>
  )
}