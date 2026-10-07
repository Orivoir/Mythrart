import type { LucideIcon } from "lucide-react"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

export interface PromoBannerAction {
  label: string

  icon?: {
    component: LucideIcon
    position: "start" | "end"
  }

  onClick?: () => void
}

interface PromoBannerActionsProps {
  main: PromoBannerAction
  second?: PromoBannerAction
  mainClassName?: string
  secondClassName?: string
}

function ActionButton({
  action,
  className,
}: {
  action: PromoBannerAction
  className?: string
}) {
  const cls = cn(
    className,
  )

  if (!action.icon?.component) {
    return (
      <Button
        type="button"
        variant="default"
        size="full"
        className={cls}
        onClick={action.onClick}
      >
        {action.label}
      </Button>
    )
  }

  const iconPosition =
    action.icon.position === "start"
      ? "left"
      : "right"

  return (
    <ButtonWithIcon
      type="button"
      size="full"
      icon={action.icon.component}
      iconPosition={iconPosition}
      onClick={action.onClick}
      className={cls}
    >
      {action.label}
    </ButtonWithIcon>
  )
}

export default function PromoBannerActions({
  main,
  second,
  mainClassName,
  secondClassName,
}: PromoBannerActionsProps) {
  return (
    <div className="flex flex-row items-center gap-4">
      <ActionButton
        action={main}
        className={mainClassName}
      />

      {second && (
        <ActionButton
          action={second}
          className={secondClassName}
        />
      )}
    </div>
  )
}