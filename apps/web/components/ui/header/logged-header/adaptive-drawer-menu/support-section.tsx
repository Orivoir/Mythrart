"use client"

import { useState } from "react"
import {
  Check,
  Copy,
  Headphones,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { MenuActionItem } from "./menu-action-item"

export type SupportSectionProps = {
  clientId?: string
  onHelpClick?: () => void
}

export function SupportSection({
  clientId,
  onHelpClick,
}: SupportSectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!clientId) {
      return
    }

    await navigator.clipboard.writeText(clientId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-2">
      {clientId && (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 p-3">
          <div className="min-w-0">
            <p className="text-sm font-medium">
              ID Client
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {clientId}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Copier l'ID client"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      )}

      <MenuActionItem
        icon={Headphones}
        label="Besoin d'aide ?"
        description="Contactez le support"
        onClick={onHelpClick}
      />
    </div>
  )
}
