"use client"

import { X } from "lucide-react"
import { Chip } from "@/components/ui/chip"
import { cn } from "@/lib/utils"
import {ButtonWithIcon} from "@/components/ui/button-with-icon"

interface PromoBannerHeaderProps {
  label: string
  labelClassName?: string
  canDismiss?: boolean
  onDismiss?: () => void
}

export default function PromoBannerHeader({
  label,
  labelClassName,
  canDismiss = false,
  onDismiss,
}: PromoBannerHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <Chip
        className={cn(
          "px-4 py-2 text-[12px] font-medium leading-none",
          labelClassName,
        )}
      >
        {label}
      </Chip>

      {canDismiss && (
        <ButtonWithIcon
          type="button"
          onClick={onDismiss}
          aria-label="close banner"
          icon={X}
          iconSize="lg"
          size="sm"
          className="p-0 rounded-full"
          variant="ghost"
        />
      )}
    </div>
  )
}