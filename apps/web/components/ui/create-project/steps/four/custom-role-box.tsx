import { UserShield, Plus } from "lucide-react"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"

interface CustomRoleBoxProps {
  onCreateCustomRole: () => void
}

export function CustomRoleBox({
  onCreateCustomRole,
}: CustomRoleBoxProps) {
  return (
    <div
      className="
        flex flex-col gap-4 rounded-lg
        bg-surface p-4
        sm:flex-row sm:items-center
        sm:justify-between
      "
    >
      <div className="flex items-start gap-3">
        <div
          className="
            flex size-10 shrink-0 items-center
            justify-center rounded bg-background
            text-accent
          "
        >
          <UserShield className="size-5" />
        </div>

        <div className="space-y-1">
          <h4 className="font-medium text-foreground">
            Créer un rôle personnalisé
          </h4>

          <p className="text-sm text-muted-foreground">
            Définissez des permissions précises selon les
            besoins de votre équipe.
          </p>
        </div>
      </div>

      <ButtonWithIcon
        variant="accent"
        type="button"
        size="sm"
        icon={Plus}
        onClick={onCreateCustomRole}
      >
        Créer un rôle
      </ButtonWithIcon>
    </div>
  )
}