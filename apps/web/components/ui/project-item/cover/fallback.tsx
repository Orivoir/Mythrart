import {useTranslations} from "next-intl"

export default function ProjectItemCoverFallback() {

  const t = useTranslations("Dashboard.Item.Cover")

  return (
    <div className="flex h-full w-full items-center justify-center bg-soft-blue">
      <span className="text-xs text-muted-foreground">
        {t("Fallback")}
      </span>
    </div>
  )
}