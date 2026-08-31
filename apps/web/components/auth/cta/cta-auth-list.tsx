import {
  CreditCard,
  CloudDownload,
  Crown,
  Rabbit
} from "lucide-react"

import {getTranslations} from "next-intl/server"
import { Title } from "@/components/ui/Typography/title"
import { Text } from "@/components/ui/Typography/text"
import { IconSurface } from "@/components/ui/icon-surface"

export async function CTAAuthList() {

  const t = await getTranslations("Auth.Login.LeftSideCTA")

  const items = [
    {
      icon: <CreditCard className="text-accent" />,
      title: t("CreditCardTitle"),
      description: t("CreditCardDescription"),
    },
    {
      icon: <CloudDownload className="text-accent" />,
      title: t("AccessAnywhereTitle"),
      description: t("AccessAnywhereDescription"),
    },
    {
      icon: <Crown className="text-accent" />,
      title: t("CrownTitle"),
      description: t("CrownDescription"),
    },
    {
      icon: <Rabbit className="text-accent" />,
      title: t("CreateInSecondsTitle"),
      description: t("CreateInSecondsDescription"),
    }
  ]

  return (
    <ul className="
      flex
      flex-col
      gap-6
      mt-6
    ">
      {items.map((item, index) => (
        <li key={index} className="
          flex
          flex-row
          gap-4
        ">
          
          <IconSurface>
            {item.icon}
          </IconSurface>

          <div className="
            flex
            flex-col
          ">
            <Title>{item.title}</Title>
            <Text variant="muted" className="text-sm">{item.description}</Text>
          </div>
        </li>
      ))}
    </ul>
  )

}