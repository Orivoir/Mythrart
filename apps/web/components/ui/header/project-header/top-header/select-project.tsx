"use client"

import { ChevronDown } from "lucide-react"
import { ButtonWithIcon } from "@/components/ui/button-with-icon"

export default function SelectProject({title}: {title: string}) {

  const onSelectProjectMenuClick = () => {
    // fired custom event here:
    // see @/lib/constant/custom-events.ts
  }

  return (
    <div className="flex min-w-0 shrink-0 items-center pl-5">
      <ButtonWithIcon
        type="button"
        onClick={onSelectProjectMenuClick}
        icon={ChevronDown}
        iconClassName="size-4 shrink-0"
        iconPosition="right"
        iconSize="sm"
        variant="ghost"
      >
        <span className="max-w-64 truncate">
          {title}
        </span>
      </ButtonWithIcon>
    </div>
  )
}