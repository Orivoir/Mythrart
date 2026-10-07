import PromoBanner from "@/components/ui/promo-banner";
import {useTranslations} from "next-intl"

export default function ProjectDashboardEmptyBanner() {

  const t = useTranslations("Dashboard.Empty.Banner")

  return (
    <PromoBanner
      title={t("Title")}
      describe={t("Describe")}
      canDismiss
      label={t("Label")}
      widthFull
      variant="guide"
      classNameRoot="h-full"
      actions={{
        main: {
          label: t("Actions.Main.Label"),
        },
        second: {
          label: t("Actions.Second.Label"),
        },
      }}
    />
  )
}