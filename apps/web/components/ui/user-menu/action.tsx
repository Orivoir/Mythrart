import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { ChevronRight } from "lucide-react"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"

export interface UserMenuActionProps {
  icon: LucideIcon
  label: string
  description?: string
  variant?: "default" | "danger"
  chevron?: boolean
  trailing?: ReactNode
  loading?: boolean
  onClick?: () => void

  renderMenu?: (
    trigger: ReactNode,
  ) => ReactNode
}

export function UserMenuAction({
  icon,
  label,
  description,
  variant = "default",
  chevron = false,
  trailing,
  loading = false,
  onClick,
  renderMenu,
}: UserMenuActionProps) {
  const trigger = (
    <ButtonWithIcon
      type="button"
      icon={icon}
      iconPosition="left"
      iconSize="md"
      variant="ghost"
      aria-busy={loading}
      className={`
        h-auto
        min-h-14
        w-full
        justify-start
        rounded-lg
        px-2
        py-2
        text-left
        ${loading ? "pointer-events-none" : ""}
        ${
          variant === "danger"
            ? "text-destructive hover:bg-destructive/5"
            : ""
        }
      `}
      onClick={onClick}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">
          {label}
        </span>

        {loading ? (
          <span
            className="
              mt-1
              block
              h-3
              w-28
              animate-pulse
              rounded-sm
              bg-muted
            "
            aria-hidden="true"
          />
        ) : (
          description && (
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
              {description}
            </span>
          )
        )}
      </span>

      {trailing}

      {chevron && (
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      )}
    </ButtonWithIcon>
  )

  if (renderMenu) {
    return renderMenu(trigger)
  }

  return trigger
}