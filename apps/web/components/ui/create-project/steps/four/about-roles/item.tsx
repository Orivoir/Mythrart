import type { LucideIcon } from "lucide-react"

import type { CollaboratorRole } from "../types"

interface AboutRoleItemProps {
  role: CollaboratorRole
  icon: LucideIcon
}

export function AboutRoleItem({
  role,
  icon: Icon,
}: AboutRoleItemProps) {
  return (
    <div className="rounded border border-border bg-background p-4">
      <div className="mb-3 flex items-center gap-3">
        <div
          className="
            flex size-10 items-center justify-center
            rounded bg-soft-blue text-accent
          "
        >
          <Icon className="size-5" />
        </div>

        <h4 className="font-medium text-foreground">
          {role.label}
        </h4>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        {role.description}
      </p>
    </div>
  )
}