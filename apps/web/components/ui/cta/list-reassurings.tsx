import { getTranslations } from "next-intl/server"
import { HeartHandshake, FolderDown, CalendarCheck } from "lucide-react"
import {Separator} from "@/components/ui/Separator"
import { Title } from "../Typography/title"
import { Text } from "../Typography/text"
import { IconSurface } from "../icon-surface"

export async function ListReassurings() {

  const t = await getTranslations("CTA.ReassuringsList")

  const items = [
    {
      title: t("OwnDataTitle"),
      description: t("OwnDataDescribe"),
      icon: <HeartHandshake className="text-accent" />
    },
    {
      title: t("EasyExportTitle"),
      description: t("EasyExportDescribe"),
      icon: <FolderDown className="text-accent" />
    },
    {
      title: t("LongTimeStabilityTitle"),
      description: t("LongTimeStabilityDescribe"),
      icon: <CalendarCheck className="text-accent" />
    }
  ]

  return (
    items.map((item, index) => (
      <div key={index} className="
      flex
      flex-row
      flex-1
      xl:items-start
      xl:gap-12
    ">
      <Separator
        className="SeparatorRoot text-muted color-muted bg-muted"
        decorative
        orientation="vertical"
      />

      <div className="
        flex
        xl:flex-row-reverse
        flex-col-reverse
        md:flex-row-reverse
        gap-4
      ">
        <div>
          <Title className="xl:text-lg md:text-lg text-sm">
            {item.title}
          </Title>

          <Text
            variant="muted"
            className="
              line-clamp-3
              xl:text-sm
              md:text-sm
              text-xs
          ">
            {item.description}
          </Text>
        </div>

        <div>
          <IconSurface>
            {item.icon}
          </IconSurface>
        </div>
      </div>
    </div>
    ))
  )
}