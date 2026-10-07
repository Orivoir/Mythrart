import {
  BookOpen,
  Plus
} from "lucide-react"
import ProjectDashboardFeatures from "./features"
import { useTranslations } from "next-intl"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import {
  Title,
  HelperText,
} from "@/components/ui/Typography"

export default function ProjectDashboardEmpty() {
  const t = useTranslations("Dashboard.Empty")

  return (
    <div className="flex w-full justify-center px-6 py-12">
      <div className="flex w-full max-w-3xl flex-col items-center mt-12">

        {/* Empty state */}
        <div className="flex w-full flex-col items-center">

          <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-soft-blue">
            <BookOpen
              className="size-12 text-accent"
              strokeWidth={1.8}
            />
          </div>

          <div className="mt-4 w-full max-w-100">
            <Title className="w-full text-center">
              {t("Title")}
            </Title>

            <HelperText className="mt-2 w-full text-center">
              {t("Description")}
            </HelperText>
          </div>

          <ButtonWithIcon
            type="button"
            icon={Plus}
            iconPosition="left"
            className="mt-6"
          >
            {t("CreateProject")}
          </ButtonWithIcon>
        </div>

        <ProjectDashboardFeatures />

      </div>
    </div>
  )
}