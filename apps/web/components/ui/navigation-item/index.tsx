"use client"

import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppLink } from "@/components/ui/app-link"
import { cn } from "@/lib/utils"

export type NavigationItemProps = {
  icon: LucideIcon
  label: string
  href: string
  active?: boolean
  withTitle?: boolean
}

export function NavigationItem({
  icon: Icon,
  label,
  href,
  active = false,
  withTitle = true,
}: NavigationItemProps) {
  const content = (
    <>
      <Icon
        className="size-5 shrink-0"
        strokeWidth={active ? 2.2 : 1.8}
        aria-hidden="true"
      />

      {withTitle && (
        <span className="whitespace-nowrap">
          {label}
        </span>
      )}

      {active && (
        <span
          aria-hidden="true"
          className="
            absolute
            -bottom-3
            left-0
            h-0.5
            w-full
            rounded-full
            bg-primary
          "
        />
      )}
    </>
  )

  if (active) {
    return (
      <Button
        variant="ghost"
        size={withTitle ? "default" : "icon"}
        className="
          relative
          gap-2
          text-primary
        "
        aria-current="page"
      >
        {content}
      </Button>
    )
  }

  return (
    <Button
      asChild
      variant="ghost"
      size={withTitle ? "default" : "icon"}
      className="relative gap-2"
    >
      <AppLink
        href={href}
        aria-label={label}
        title={label}
      >
        {content}
      </AppLink>
    </Button>
  )
}