"use client"

import { Plus } from "lucide-react"

import { ButtonWithIcon } from "@/components/ui/button-with-icon"

export function CreateProjectButton() {
  return (
    <ButtonWithIcon
      type="button"
      icon={Plus}
      iconPosition="left"
      iconSize="sm"
      variant="primary"
      size="default"
    >
      Nouveau projet
    </ButtonWithIcon>
  )
}