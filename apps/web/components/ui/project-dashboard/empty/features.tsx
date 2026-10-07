import { useTranslations } from "next-intl"
import { useMemo } from "react"
import {
  BookOpen,
  Brain,
  ChartNoAxesCombined,
  Network,
  SearchCheck,
  Users
} from "lucide-react"
import { HelperText, Title } from "@/components/ui/Typography"

export default function ProjectDashboardFeatures() {

  const t = useTranslations("Dashboard.Empty.Features")

  const features = useMemo(() => [
    {
        icon: Network,
        title: t("Network.Title"),
        description: t("Network.Description"),
      },
      {
        icon: ChartNoAxesCombined,
        title: t("ChartNoAxesCombined.Title"),
        description: t("ChartNoAxesCombined.Description"),
      },
      {
        icon: Brain,
        title: t("Brain.Title"),
        description: t("Brain.Description"),
      },
      {
        icon: BookOpen,
        title: t("BookOpen.Title"),
        description: t("BookOpen.Description"),
      },
      {
        icon: SearchCheck,
        title: t("SearchCheck.Title"),
        description: t("SearchCheck.Description"),
      },
      {
        icon: Users,
        title: t("Users.Title"),
        description: t("Users.Description"),
      },
  ], [t])

  return (
    <div className="mt-24 grid w-full grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => {
        const Icon = feature.icon

        return (
          <div
            key={feature.title}
            className="flex flex-col"
          >
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-soft-blue">
              <Icon
                className="size-5 text-accent"
                strokeWidth={1.8}
              />
            </div>

            <Title className="text-sm">
              {feature.title}
            </Title>

            <HelperText className="mt-1 text-xs">
              {feature.description}
            </HelperText>
          </div>
        )
      })}
    </div>
  )
}