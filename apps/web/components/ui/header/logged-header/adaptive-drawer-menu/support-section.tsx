"use client"

import { useState } from "react"
import {
  Check,
  Copy,
  Headphones,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"

import { MenuActionItem } from "./menu-action-item"
import { Text } from "@/components/ui/Typography"

export type SupportSectionProps = {
  clientId?: string
  onHelpClick?: () => void
}

export function SupportSection({
  clientId,
  onHelpClick,
}: SupportSectionProps) {
  const [copied, setCopied] = useState(false)
  const t = useTranslations("Header.Logged.DrawerMenu.Support")

  const handleCopy = async () => {
    if (!clientId) {
      return
    }

    await navigator.clipboard.writeText(clientId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-4">
      {clientId && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 rounded-lg bg-soft-blue p-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {t("ClientId")}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {clientId}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("CopyAria")}
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>
          <Text variant="muted" className="text-xs">
            {t("ClientIdDescription")}
          </Text>
        </div>
      )}

      <MenuActionItem
        icon={Headphones}
        label={t("Help")}
        description={t("HelpDescription")}
        onClick={onHelpClick}
      />
    </div>
  )
}
