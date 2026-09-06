"use client"

import type { LucideIcon } from "lucide-react"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"

export type MenuActionItemProps = {
  icon: LucideIcon
  label: string
  description?: string
  onClick?: () => void
}

export function MenuActionItem({
  icon,
  label,
  description,
  onClick,
}: MenuActionItemProps) {
  return (
    <ButtonWithIcon
      type="button"
      icon={icon}
      iconPosition="left"
      iconSize="md"
      variant="ghost"
      className="
        h-auto
        min-h-11
        w-full
        justify-start
        rounded-lg
        px-2
        py-2
        text-left
      "
      onClick={onClick}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">
          {label}
        </span>

        {description && (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </ButtonWithIcon>
  )
}
