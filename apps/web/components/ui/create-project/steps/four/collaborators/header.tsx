import { Settings2 } from "lucide-react"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"

import { useTranslations } from "next-intl"

interface CollaboratorsHeaderProps {
  count: number
  onManageAccess?: () => void
}

export function CollaboratorsHeader({
  count,
  onManageAccess,
}: CollaboratorsHeaderProps) {

  const t = useTranslations("CreateProject.StepFour.Collaborators.Header")

  return (
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-lg font-semibold text-foreground">
        {t('Title')} ({count})
      </h3>

      <ButtonWithIcon
        type="button"
        variant="ghost"
        size="sm"
        icon={Settings2}
        onClick={onManageAccess}
      >
        {t('ButtonHandleAccessLabel')}
      </ButtonWithIcon>
    </div>
  )
}